const path      = require('path');
const BASE_DIR  = path.dirname(require.main.filename);
const logger    = require(BASE_DIR + '/Logger');
const msg       = require(BASE_DIR + '/Messages');

exports.setResponse = function(req, res, response) {
    let responseLog = JSON.stringify(response);
    responseLog = JSON.parse(responseLog);
    if(response.content && "base64" in response.content) delete responseLog.content.base64;

    logger.info(__filename, JSON.stringify(responseLog), req.id, req.body.clientIp, "Response to client");


    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
}

exports.checkParameter = function(req, res, requiredParams, cb) {
    logger.info(__filename, JSON.stringify(req.body), req.id, req.body.clientIp, "Received request from client");

    let obj = req.body;
    let result = [];

    requiredParams.forEach(function(val) {
        if (obj.hasOwnProperty(val)) result.push(0);
    });

    if (result.length === requiredParams.length) {
        cb();
    } else {
        let response = this.duplicateObject(msg.ERR_SERVER_BAD_REQUEST);
        logger.info(__filename, JSON.stringify(req.body), req.id, req.body.clientIp, response.message);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(response));
    }
}

exports.checkInputParameter = function(params) {    
    let check = params.slice(0);
    
    if (check.length === 6) {
        if (check[0].trim() && check[1].trim() && check[2].trim() && check[3].trim() && check[4].trim() && check[5].trim()) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.checkUpdateParameter = function(params) {  
    let check = params.slice(0);
    
    if (check.length === 6) {
        if (check[0].trim() && (check[1].trim() || check[2].trim() || check[3].trim() || check[4].trim() || check[5].trim())) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.checkDeleteParameter = function(params) {  
    let check = params.slice(0);
    
    if (check.length === 2) {
        if (check[0].trim() && !check[1].trim()) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.checkEvidenceParameter = function(params) {  
    let check = params.slice(0);
    
    if (check.length === 2) {
        if (check[0].toLowerCase().trim() === "/evidence") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.checkDocumentParameter = function(params) {  
    let check = params.slice(0);
    
    if (check.length === 2) {
        if (check[0].toLowerCase().trim() === "/document") {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

exports.duplicateObject = function(tmpObject) {
    var resultObj = {};
    for (var key in tmpObject) {
        resultObj[key] = tmpObject[key];
    }
    return resultObj;
}

exports.isJSON = function(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

exports.decodeBase64Image = function(dataString) {
    try {
        let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
        let result = {};
        
        if (matches.length !== 3) {
          return false;
        }
      
        result.type = matches[1];
        result.data = new Buffer.from(matches[2], 'base64');
      
        return result;
    } catch (error) {
        return false;
    }
}

exports.decodeBase64Document = function(dataString) {
    try {
        let matches = dataString.split(';');
        let info = matches[0].split(':');
        let base64 =  matches[1].split(',');
        let result = {};
        
        if (base64.length !== 2 && info.length !== 2) {
          return false;
        }
      
        result.type = info[1];
        result.data = new Buffer.from(base64[1], 'base64');
      
        return result;
    } catch (error) {
        return false;
    }
}

exports.secToTime = function(time) {
    let sec_num = parseInt(time, 10);
    let days    = Math.floor(sec_num / 86400);
    let hours   = Math.floor((sec_num - (days * 86400)) / 3600);
    let minutes = Math.floor((sec_num - (days * 86400) - (hours * 3600)) / 60);
    let seconds = sec_num - (days * 86400) - (hours * 3600) - (minutes * 60);

    let format = '';
    format += ((days > 0) ? days + ' days ' : '');
    format += ((hours > 0) ? hours + ' hours ' : '');
    format += ((minutes > 0) ? minutes + ' minutes ' : '');
    format += ((seconds > 0) ? seconds + ' seconds' : '');

    return format;
}