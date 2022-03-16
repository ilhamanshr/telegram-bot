/*
|--------------------------------------------------------------------------
| Application Configuration
|--------------------------------------------------------------------------
*/

exports.APP_SSL             = false;
exports.APP_NAME            = process.env.APP_NAME;
exports.APP_PORT            = process.env.APP_PORT;
exports.APP_DESCRIPTION     = "";
exports.APP_AUTHOR          = "";
exports.APP_LOGO            = "";
exports.APP_ICON            = "";
exports.APP_ID              = exports.APP_NAME.split(" ").join("_") + "_" + exports.APP_PORT;
exports.APP_MEDIA           = __dirname + '/media';

exports.TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
exports.TELEGRAM_DOWNLOAD_URL = process.env.TELEGRAM_DOWNLOAD_URL + process.env.TELEGRAM_TOKEN + '/';
exports.CONTENT_LIST = ["photo", "document"];

/*
|--------------------------------------------------------------------------
| Database Configuration
|--------------------------------------------------------------------------
*/

exports.DB = [{
    "DRIVER": process.env.DB_DRIVER,
    "CONNECTION": process.env.DB_CONNECTION,
    "NAME": process.env.DB_NAME,
}];

/*
|--------------------------------------------------------------------------
| API Configuration
|--------------------------------------------------------------------------
*/

exports.API_TELEGRAM = {
    API_SSL 		   : true,
    API_HOST           : process.env.TELEGRAM_HOST,
    API_METHOD		   : "GET",
    API_PATH           : process.env.TELEGRAM_PATH,
    API_TIMEOUT        : 600000
};

exports.WEBHOOK_CLIENT = {
    API_SSL      : false,
    API_HOST     : process.env.WEBHOOK_CLIENT_HOST,
    API_PORT     : process.env.WEBHOOK_CLIENT_PORT,
    API_PATH     : process.env.WEBHOOK_CLIENT_PATH,
    API_METHOD   : "POST",
    API_USERNAME : process.env.WEBHOOK_CLIENT_USERNAME,
    API_PASSWORD : process.env.WEBHOOK_CLIENT_PASSWORD,
    API_TIMEOUT  : 600000
}