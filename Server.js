process.env["NTBA_FIX_350"] = 1;
const TelegramBot   = require('node-telegram-bot-api');
const Promise       = require('bluebird');
const express       = require('express');
const session       = require('express-session');
const path          = require('path');
const http          = require('http');
const https         = require('https');
const fs            = require('fs');
const parser        = require('body-parser');
const requestId     = require('express-request-id')();
const moment        = require('moment');
const randomstring  = require('randomstring');
const BASE_DIR      = path.dirname(require.main.filename);
const logger        = require(BASE_DIR + '/Logger');
const config        = require(BASE_DIR + '/Config');
const routesBot     = require(BASE_DIR + '/RoutesBot');
const routesServer  = require(BASE_DIR + '/RoutesServer');
const resMsg        = require(BASE_DIR + '/Messages');
const app           = express();

Promise.config({
    cancellation: true
});

app.set('views', BASE_DIR + '/views');
app.set('view engine', 'ejs');

app.use(session({
    secret: config.APP_ID,
    saveUninitialized: true,
    resave: false
}));

app.use(parser.json({
    extended: false,
    limit: '50mb'
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});

app.use(requestId);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(__dirname + "/public"));
app.use("/", routesServer);

global.myBot = null;

exports.startBot = function () {

    let token = config.TELEGRAM_TOKEN;
    global.myBot = new TelegramBot(token, {polling: true});

    global.myBot.on('error', function(error) {
        logger.error(__filename, error);
        setTimeout(function () {
            exports.startBot();
        }, 5000);
    });

    global.myBot.on('message', (msg) => {
        try { 
            let from = msg.from;
            let chat = msg.chat;
            let text = "text" in msg ? (msg.text).trim() : "";
            let date = moment(msg.date * 1000).add(7, 'hours').toDate();
            let username = ("username" in from ? from.username : "").toLowerCase();
            let chatId = chat.id;
            let conversationId = randomstring.generate();
            
            logger.debug(__filename, msg, "", "", "");
            logger.info(__filename, conversationId+"|REQUEST|"+username+"|"+chatId+"|"+text, "", "", "");
            
            routesBot.route(conversationId, chat, from, text, date, msg); 
        } catch (error) {
            logger.error(__filename, error);
            exports.sendMessage(randomstring.generate(), msg.chat.id, resMsg.ERR_BAD_GATEWAY, {});
        }
    });

    global.myBot.on('polling_error', function(err) {
        logger.error(__filename, err);
    });

    global.myBot.on('webhook_error', function(err) {
        logger.error(__filename, err);
    });
    
    logger.debug(__filename, "Bot " + path.basename(__filename) + " started.", "", "", "");
};

exports.startServer = function() {
    var server = null;
    if (config.APP_SSL) {
        server = https.createServer({
            key: fs.readFileSync(BASE_DIR + "/security/key.pem"),
            cert: fs.readFileSync(BASE_DIR + "/security/cert.pem"),
        }, app);
    } else {
        server = http.createServer(app);
    }

    server.listen(config.APP_PORT, function() {
        logger.debug(__filename, config.APP_NAME + " listening at port " + config.APP_PORT, "", "", "");
    });
}

exports.sendMessage = function (conversationId, chatId, message, option) {
    if(global.myBot){
        logger.info(__filename, conversationId+"|RESPONSE|"+chatId+"|"+message, "", "", "");

        global.myBot.sendMessage(chatId, message, option).catch(function (error) {
            logger.error(__filename, error);
        });
    }else{
        logger.error(__filename, "Bot Undefined");
    }
};

exports.sendPhoto = function (conversationId, chatId, photo, message) {
    if(global.myBot){
        logger.info(__filename, conversationId+"|RESPONSE|"+chatId+"|"+message);

        global.myBot.sendPhoto(chatId, photo, {"caption": message})
        .catch(function (error) {
                logger.error(__filename, error);
                exports.sendMessage(conversationId, chatId, message, {"parse_mode": "HTML"});
        });

    }else{
        logger.error(__filename, "Bot Undefined");
    }
};

exports.sendDocument = function (conversationId, chatId, document, message) {
    if(global.myBot){
        logger.info(__filename, conversationId+"|RESPONSE|"+chatId+"|"+message);

        global.myBot.sendDocument(chatId, document, {"caption": message})
        .catch(function (error) {
                logger.error(__filename, error);
                exports.sendMessage(conversationId, chatId, message, {"parse_mode": "HTML"});
        });

    }else{
        logger.error(__filename, "Bot Undefined");
    }
};