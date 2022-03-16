const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const config 	    = require(BASE_DIR + '/Config');
const mongo 	    = require(BASE_DIR + '/libraries/MongoDriver');
const logger        = require(BASE_DIR + '/Logger');
const dbName        = process.env.DB_NAME;
const randomstring  = require('randomstring');
const moment        = require('moment');

class UsersModel {

    /*
    |--------------------------------------------------------------------------
    | Telegram Users
    |--------------------------------------------------------------------------
    */

    static async validateUserTelegram(username, cb){
        let filter = {
            "username": { $regex: new RegExp('^' + username.toLowerCase() + '$', 'i') },
            "status": 1
        }

        mongo.searchDataBy(dbName, process.env.COLL_USER_TELEGRAM, filter, function(resUsers){
            cb(resUsers);
        });
    }

    static updateUserTelegramDetail(user, userInfo){
        mongo.updateData(dbName, process.env.COLL_USER_TELEGRAM, user, userInfo, function(resUsers){});
    }

    /*
    |--------------------------------------------------------------------------
    | Application Users
    |--------------------------------------------------------------------------
    */

    static async getUserApp(userInfo, cb){
        let filter = {
            "telegramId": userInfo.id + "",
            "status": 1
        }

        mongo.searchDataBy(dbName, process.env.COLL_USER_APPLICATION, filter, function(resUsers){
            cb(resUsers);
        });
    }

    static async getUserTelegram(username, cb){
        let filter = {
            "username": username,
            "status": 1
        }

        mongo.searchDataBy(dbName, process.env.COLL_USER_APPLICATION, filter, function(resUsers){
            cb(resUsers);
        });
    }

    static insertUserApp(userInfo){
        let docs = {
            "_id": randomstring.generate(),
            "username": "username" in userInfo && userInfo.username ? userInfo.username.toLowerCase().trim() : "firstName" in userInfo && userInfo.firstName ? firstName.toLowerCase().trim() : "lastName" in userInfo && userInfo.lastName ? userInfo.lastName.toLowerCase().trim() : userInfo.id + "",
            "name": (userInfo.firstName + " " +userInfo.lastName).trim(),
            "password": "1234",
            "telegramId": userInfo.id + "",
            "status": 1,
            "dateCreate" : userInfo.dateCreate,
            "dateUpdate" : userInfo.dateCreate
        }

        mongo.insertData(dbName, process.env.COLL_USER_APPLICATION, docs, function(resUsers){});
    }
}

module.exports = UsersModel;