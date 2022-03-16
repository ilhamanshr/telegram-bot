const express       = require('express');
const router        = express.Router();
const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const config        = require(BASE_DIR + '/Config');
const logger        = require(BASE_DIR + '/Logger');
const utils         = require(BASE_DIR + '/Utils');
const server        = require(BASE_DIR + '/Server');
const resMsg        = require(BASE_DIR + '/Messages');
const modelUser     = require(BASE_DIR + '/models/Users.js');
const modelData     = require(BASE_DIR + '/models/Data.js');
const apiTele       = require(BASE_DIR + '/middlewares/ApiTelegram.js');
const webhook       = require(BASE_DIR + '/middlewares/WebhookClient.js');
const needle        = require('needle');
const randomstring  = require('randomstring');


class Route {
    static route(conversationId, chat, from, text, date, msg) {
        let reply = "";
        let first_name = ("first_name" in from ? from.first_name : "");
        let last_name = ("last_name" in from ? from.last_name : "");
        let userInfo = {
            "id": chat.id,
            "isBot": from.is_bot,
            "firstName": first_name,
            "lastName": last_name,
            "username": "username" in chat ? chat.username : "",
            "type": chat.type,
            "dateCreate" : date
        }
 
        modelUser.validateUserTelegram(from.username, function (resUser) {
            if(resUser && resUser.length){
                if ("text" in msg) {
                    if(text.toLowerCase() == "/start") {
                        try {
                            reply = resMsg.START_CHAT.slice(0);
    
                            let user = {
                                "username": resUser[0].username
                            }
    
                            modelUser.updateUserTelegramDetail(user, userInfo);

                            modelUser.insertUserApp(userInfo);
    
                            reply.splice(1, 0, `${first_name.bold()} ${first_name.toLowerCase() !== last_name.toLowerCase() ? last_name.bold() : ""}.`.trim());
                            
                            server.sendMessage(conversationId, chat.id, reply.join(" "), {"parse_mode": "HTML"});
                        } catch (error) {
                            logger.error(__filename, error);
                            server.sendMessage(randomstring.generate(), chat.id, resMsg.ERR_BAD_GATEWAY, {});
                        }                    
                    }else if(text.toLowerCase() == "/help"){
                        server.sendMessage(conversationId, chat.id, resMsg.HELP_CHAT.slice(0).join("\n"), {"parse_mode": "HTML"});
                    }else if(text.toLowerCase() == "/input"){
                        server.sendMessage(conversationId, chat.id, resMsg.INPUT_CHAT.slice(0).join("\n"), {"parse_mode": "HTML"});
                    }else if(text.toLowerCase() == "/update"){
                        server.sendMessage(conversationId, chat.id, resMsg.UPDATE_CHAT.slice(0).join("\n"), {"parse_mode": "HTML"});
                    }else if(text.toLowerCase() == "/delete"){
                        server.sendMessage(conversationId, chat.id, resMsg.DELETE_CHAT.slice(0).join("\n"), {"parse_mode": "HTML"});
                    }else if(text.toLowerCase() == "/evidence"){
                        server.sendMessage(conversationId, chat.id, resMsg.EVIDENCE_CHAT.slice(0).join("\n"), {"parse_mode": "HTML"});
                    }else if(text.toLowerCase() == "/document"){
                        server.sendMessage(conversationId, chat.id, resMsg.DOCUMENT_CHAT.slice(0).join("\n"), {"parse_mode": "HTML"});
                    }else if(text.toLowerCase() == "/data"){
                        modelData.list(userInfo, function(resData) {
                            server.sendMessage(conversationId, chat.id, resData, {"parse_mode": "HTML"});
                        });
                    }else{
                        text = text.split("\n");
    
                        if(text && text[0].includes("|")){
                            reply = resMsg.FAILED_INPUT.slice(0).join(" ");
                            text = text[0].split("|");
    
                            if (utils.checkInputParameter(text)) {
                                modelData.input(text, userInfo, function(resInput) {
                                    server.sendMessage(conversationId, chat.id, resInput, {"parse_mode": "HTML"});
                                });
                            } else {
                                webhook.push(conversationId, {"data": msg, "reply": reply});

                                server.sendMessage(conversationId, chat.id, reply, {"parse_mode": "HTML"});
                            }
                        } else if (text && text[0].includes(":")) {
                            reply = resMsg.FAILED_UPDATE.slice(0).join(" ");
                            text = text[0].split(":");
                            
                            if (utils.checkUpdateParameter(text)) {
                                modelData.update(text, userInfo, function(resUpdate) {
                                    server.sendMessage(conversationId, chat.id, resUpdate, {"parse_mode": "HTML"});
                                });
                            } else {
                                webhook.push(conversationId, {"data": msg, "reply": reply});

                                server.sendMessage(conversationId, chat.id, reply, {"parse_mode": "HTML"});
                            }
                        } else if (text && text[0].includes("!")) {
                            reply = resMsg.FAILED_DELETE.slice(0).join(" ");
                            text = text[0].split("!");
                            
                            if (utils.checkDeleteParameter(text)) {
                                modelData.delete(text, userInfo, function(resUpdate) {
                                    server.sendMessage(conversationId, chat.id, resUpdate, {"parse_mode": "HTML"});
                                });
                            } else {
                                webhook.push(conversationId, {"data": msg, "reply": reply});
                                
                                server.sendMessage(conversationId, chat.id, reply, {"parse_mode": "HTML"});
                            }
                        } else {
                            webhook.push(conversationId, {"data": msg, "reply": resMsg.ERR_WRONG_COMMAND});

                            server.sendMessage(conversationId, chat.id, resMsg.ERR_WRONG_COMMAND, {"parse_mode": "HTML"});
                        }
                    }    
                } else if ("caption" in msg && "photo" in msg) {
                    let caption = msg.caption.split("\n");

                    if (caption && caption[0].includes("/evidence")) {
                        reply = resMsg.FAILED_EVIDENCE.slice(0).join(" ");
                        caption = caption[0].split(" ");

                        if (utils.checkEvidenceParameter(caption)) {
                            global.myBot.getFile(msg.photo[msg.photo.length-1].file_id).then((resInfo) => {
                                apiTele.getPhoto(resInfo, function(resPhoto) {
                                    if (resPhoto) {         
                                        userInfo["filename"] = resPhoto;
                                        modelData.evidence(caption, userInfo, function(resEvidence) {
                                            server.sendMessage(conversationId, chat.id, resEvidence, {"parse_mode": "HTML"});
                                        });
                                    } else {
                                        server.sendMessage(conversationId, chat.id, resMsg.ERR_FORBIDDEN, {"parse_mode": "HTML"});
                                    }
                                });
                            });
                        } else {
                            webhook.push(conversationId, {"data": msg, "reply": reply});

                            server.sendMessage(conversationId, chat.id, reply, {"parse_mode": "HTML"});
                        }
                    } else {
                        webhook.push(conversationId, {"data": msg, "reply": resMsg.ERR_WRONG_COMMAND});
                        
                        server.sendMessage(conversationId, chat.id, resMsg.ERR_WRONG_COMMAND, {"parse_mode": "HTML"});
                    }
                } else if ("caption" in msg && "document" in msg) {
                    let caption = msg.caption.split("\n");

                    if (caption && caption[0].includes("/document")) {
                        reply = resMsg.FAILED_DOCUMENT.slice(0).join(" ");
                        caption = caption[0].split(" ");

                        if (utils.checkDocumentParameter(caption)) {
                            global.myBot.getFile(msg.document.file_id).then((resInfo) => {
                                apiTele.getDocument(msg.document, resInfo, function(resDocument) {
                                    if (resDocument) {         
                                        userInfo["filename"] = resDocument;
                                        modelData.document(caption, userInfo, function(resEvidence) {
                                            server.sendMessage(conversationId, chat.id, resEvidence, {"parse_mode": "HTML"});
                                        });
                                    } else {
                                        server.sendMessage(conversationId, chat.id, resMsg.ERR_FORBIDDEN, {"parse_mode": "HTML"});
                                    }
                                });
                            });
                        } else {
                            webhook.push(conversationId, {"data": msg, "reply": resMsg.ERR_WRONG_COMMAND});

                            server.sendMessage(conversationId, chat.id, reply, {"parse_mode": "HTML"});
                        }
                    } else {
                        webhook.push(conversationId, {"data": msg, "reply": resMsg.ERR_WRONG_COMMAND});

                        server.sendMessage(conversationId, chat.id, resMsg.ERR_WRONG_COMMAND, {"parse_mode": "HTML"});
                    }
                } else {
                    webhook.push(conversationId, {"data": msg, "reply": resMsg.ERR_WRONG_COMMAND});

                    server.sendMessage(conversationId, chat.id, resMsg.ERR_WRONG_COMMAND, {"parse_mode": "HTML"});
                }
            } else {
                server.sendMessage(conversationId, chat.id, resMsg.ERR_FORBIDDEN, {"parse_mode": "HTML"});
            }
        });
    }
}

module.exports = Route;