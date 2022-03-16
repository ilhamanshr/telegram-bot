const express       = require('express');
const router        = express.Router();
const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const logger        = require(BASE_DIR + '/Logger');
const utils         = require(BASE_DIR + '/Utils');
const msg           = require(BASE_DIR + '/Messages');
const server        = require(BASE_DIR + '/Server');
const config        = require(BASE_DIR + '/Config');
const modelUser     = require(BASE_DIR + '/models/Users');
const randomstring  = require('randomstring');
const fs            = require('fs');

router.post('/api', function(req, res) {
    req.body["clientIp"] = (req.body.hasOwnProperty("clientIp") && req.body.clientIp) ? req.body.clientIp : "";

    let response = utils.duplicateObject(msg.ERR_RESPONSE);
    let bodyReq  = req.body;
    
    let file = './controllers/'+ bodyReq.action +'.js';
    
    try {
        if (fs.existsSync(file)) {
            const ctrl = require(BASE_DIR + '/controllers/' + bodyReq.action);
            
            if (ctrl.hasOwnProperty(bodyReq.subAction) && typeof ctrl[bodyReq.subAction] === "function") {
                ctrl[bodyReq.subAction](req, res);
            } else {
                response = utils.duplicateObject(msg.ERR_INVALID_SUBACTION);
                logger.debug(__filename, "Function "+ bodyReq.subAction +" in controller "+ bodyReq.action +".js doesn't exist", req.id, bodyReq.clientIp, "");
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            }
        } else {
            response = utils.duplicateObject(msg.ERR_INVALID_ACTION);
            logger.debug(__filename, "Controller "+ bodyReq.action +".js doesn't exist", req.id, bodyReq.clientIp, "");
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(response));
        }
    } catch(err) {
        response['message'] = JSON.stringify(err.message);
        logger.error(__filename, JSON.stringify(err.message));
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    }
});

router.post('/sendText', function(req, res) {
    let response = utils.duplicateObject(msg.ERR_RESPONSE);
    let bodyReq  = req.body;
    let required = ["text", "telegramId"];

    utils.checkParameter(req, res, required, function() {
        response = utils.duplicateObject(msg.SUCCESS_SERVER_RESPONSE);
        response["message"] = "Send text success";

        server.sendMessage(randomstring.generate(), bodyReq.telegramId, bodyReq.text, {"parse_mode": "HTML"});
        utils.setResponse(req, res, response); 
    });
});

router.post('/sendPhoto', function(req, res) {
    let response = utils.duplicateObject(msg.ERR_RESPONSE);
    let bodyReq  = req.body;
    let required = ["caption", "photo", "telegramId"];

    utils.checkParameter(req, res, required, function() {
        let decode = utils.decodeBase64Image(bodyReq.photo);

        if (decode) {
            let fileId = randomstring.generate();
            let extension = decode.type.split("/");
            let filename = config.APP_MEDIA+ '/' + `${fileId}.${extension[1]}`;

            fs.writeFile(filename, decode.data, function(err) { 
                if (err) {
                    response["message"] = "failed create photo";
                    utils.setResponse(req, res, response); 
                } else {
                    response = utils.duplicateObject(msg.SUCCESS_SERVER_RESPONSE);
                    response["message"] = "Send text success";

                    server.sendPhoto(randomstring.generate(), bodyReq.telegramId, filename, bodyReq.caption);
                    utils.setResponse(req, res, response); 
                }
            });
        } else {
            response["message"] = "Base64 not valid";
            utils.setResponse(req, res, response); 
        }
    });
});

router.post('/sendDocument', function(req, res) {
    let response = utils.duplicateObject(msg.ERR_RESPONSE);
    let bodyReq  = req.body;
    let required = ["caption", "document", "fileExtension", "telegramId"];

    utils.checkParameter(req, res, required, function() {
        if (bodyReq.fileExtension.split('.').length === 2) {
            let decode = utils.decodeBase64Document(bodyReq.document);

            if (decode) {
                let fileId = randomstring.generate();
                let extension = decode.type.split("/");
                let filename = config.APP_MEDIA+ '/' + `${fileId}${bodyReq.fileExtension}`;

                fs.writeFile(filename, decode.data, function(err) { 
                    if (err) {
                        response["message"] = "failed create document";
                        utils.setResponse(req, res, response); 
                    } else {
                        response = utils.duplicateObject(msg.SUCCESS_SERVER_RESPONSE);
                        response["message"] = "Send document success";

                        server.sendDocument(randomstring.generate(), bodyReq.telegramId, filename, bodyReq.caption);
                        utils.setResponse(req, res, response); 
                    }
                });
            } else {
                response["message"] = "Base64 not valid";
                utils.setResponse(req, res, response); 
            }
        } else {
            response = utils.duplicateObject(msg.ERR_SERVER_BAD_REQUEST);
            response["message"] += ", fileExtension must be start with .(dot)"
            utils.setResponse(req, res, response); 
        }
    });
});


module.exports = router;