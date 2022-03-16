const path              = require('path');
const fs                = require('fs');
const BASE_DIR          = path.dirname(require.main.filename);
const config            = require(BASE_DIR + '/Config');
const utils             = require(BASE_DIR + '/Utils');
const http              = require(BASE_DIR + '/libraries/HttpHandler');
const apiTele           = require(BASE_DIR + '/middlewares/ApiTelegram.js');
const mime              = require('mime');
const logger            = require(BASE_DIR + '/Logger');
const WEBHOOK_CONFIG    = utils.duplicateObject(config.WEBHOOK_CLIENT);


class WebhookMiddleware {
    static async push(id, data) {
        this.content(0, config.CONTENT_LIST, data, function(resContent) {
            let params = JSON.stringify(resContent);

            http.apiRequest(id, '', WEBHOOK_CONFIG, params, {}, function(resAPI) {});
        });
    }


    static async content (index, contentList, data, cb) {
        let self = this;
        if (index < contentList.length) {
            if (contentList[index] === "photo" && contentList[index] in data.data) {
                self.getPhoto(data, function(resPhoto) {
                    data["data"]["photo"] = resPhoto;

                    self.content(index + 1, contentList, data, function(res) {cb(res)});
                });
            } else if (contentList[index] === "document" && contentList[index] in data.data) {
                self.getDocument(data, function(resDocument) {
                    data["data"]["document"] = resDocument;

                    self.content(index + 1, contentList, data, function(res) {cb(res)});
                });
            } else {
                self.content(index + 1, contentList, data, function(res) {cb(res)});
            }
        } else {
            cb(data);
        }
    }

    static async getPhoto(data, cb){
        global.myBot.getFile(data.data.photo[data.data.photo.length-1].file_id).then((resInfo) => {
            apiTele.getPhoto(resInfo, function(resPhoto) {
                if (resPhoto) {  
                    let mediaFIle = config.APP_MEDIA + '/' + resPhoto;                           
                    fs.readFile(mediaFIle, {encoding: 'base64'}, function(err, base64) {
                        if (err) {
                            logger.error(__filename, err);
                            cb({});
                        } else {
                            let mimeType  = mime.lookup(mediaFIle);
                            
                            cb({
                                "mimetype": mimeType,
                                "filename": resPhoto,
                                "base64": base64
                            });
                        }
                    });
                } else {
                    cb({});
                }
            });
        });
    }

    static async getDocument(data, cb){
        global.myBot.getFile(data.data.document.file_id).then((resInfo) => {
            apiTele.getDocument(data.data.document, resInfo, function(resDocument) {
                if (resDocument) {  
                    let mediaFIle = config.APP_MEDIA + '/' + resDocument;                           
                    fs.readFile(mediaFIle, {encoding: 'base64'}, function(err, base64) {
                        if (err) {
                            logger.error(__filename, err);
                            cb({});
                        } else {
                            let mimeType  = mime.lookup(mediaFIle);
                            
                            cb({
                                "mimetype": mimeType,
                                "filename": resDocument,
                                "base64": base64
                            });
                        }
                    });
                } else {
                    cb({});
                }
            });
        });
    }
}

module.exports = WebhookMiddleware;