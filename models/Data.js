const path          = require('path');
const BASE_DIR      = path.dirname(require.main.filename);
const config 	    = require(BASE_DIR + '/Config');
const mongo 	    = require(BASE_DIR + '/libraries/MongoDriver');
const logger        = require(BASE_DIR + '/Logger');
const resMsg        = require(BASE_DIR + '/Messages');
const dbName        = process.env.DB_NAME;
const randomstring  = require('randomstring');
const moment        = require('moment');
const modelUser     = require(BASE_DIR + '/models/Users.js');

class DataModel {
    static async input(data, userInfo, cb){
        modelUser.getUserApp(userInfo, function(resUser) {
            if (resUser && resUser.length) {
                let docs = {
                    "_id": randomstring.generate(),
                    "nomor_tiket": data[0].trim(),
                    "nomor_inet": data[1].trim(),
                    "material": data[2].trim(),
                    "jumlah": data[3].trim(),
                    "odp": data[4].trim(),
                    "idTeknisi": data[5].trim(),
                    "userCreate": resUser[0].username,
                    "dateCreate": userInfo.dateCreate,
                    "status": 0,
                    "flag": 0
                }

                mongo.insertData(dbName, process.env.COLL_DATAS, docs, function(resInput){
                    if (resInput) {
                        if(resInput === 11000) {
                            cb(resMsg.FAILED_INPUT_DUPLICATE.slice(0).join(" "));
                        } else {
                            cb(resMsg.SUCCESS_INPUT.slice(0).join(" "));
                        }
                    } else {
                        cb(resMsg.ERR_BAD_GATEWAY);
                    }
                });
            } else {
                cb(resMsg.ERR_FORBIDDEN_APPLICATION);
            }
        });
    }

    static async update(data, userInfo, cb){
        modelUser.getUserApp(userInfo, function(resUser) {
            if (resUser && resUser.length) {
                let clause = {
                    "nomor_tiket": data[0].trim(),
                    "userCreate": resUser[0].username
                }
                let docs = {}

                if (data[1].trim()) docs["nomor_inet"] = data[1];
                if (data[2].trim()) docs["material"] = data[2];
                if (data[3].trim()) docs["jumlah"] = data[3];
                if (data[4].trim()) docs["odp"] = data[4];
                if (data[5].trim()) docs["idTeknisi"] = data[5];

                mongo.updateData(dbName, process.env.COLL_DATAS, clause, docs, function(resUpdate){
                    if (resUpdate) {
                        cb(resMsg.SUCCESS_UPDATE.slice(0).join(" "));
                    } else {
                        if (resUpdate === 0) cb(resMsg.FAILED_UPDATE_NOT_FOUND.slice(0).join(" "));
                        if (resUpdate === false) cb(resMsg.ERR_BAD_GATEWAY);
                    }
                });
            } else {
                cb(resMsg.ERR_FORBIDDEN_APPLICATION);
            }
        });
    }

    static async delete(data, userInfo, cb){
        modelUser.getUserApp(userInfo, function(resUser) {
            if (resUser && resUser.length) {
                let clause = {
                    "nomor_tiket": data[0].trim(),
                    "userCreate": resUser[0].username
                }

                mongo.removeData(dbName, process.env.COLL_DATAS, clause, function(resDelete){
                    if (resDelete) {
                        cb(resMsg.SUCCESS_DELETE.slice(0).join(" "));
                    } else {
                        if (resDelete === 0) cb(resMsg.FAILED_DELETE_NOT_FOUND.slice(0).join(" "));
                        if (resDelete === false) cb(resMsg.ERR_BAD_GATEWAY);
                    }
                });
            } else {
                cb(resMsg.ERR_FORBIDDEN_APPLICATION);
            }
        });
    }

    static async evidence(data, userInfo, cb){
        modelUser.getUserApp(userInfo, function(resUser) {
            if (resUser && resUser.length) {
                let clause = {
                    "nomor_tiket": data[1].trim(),
                    "userCreate": resUser[0].username,
                    "status": 0,
                    "flag": 1,
                }
                let docs = {
                    "evidence": userInfo.filename,
                    "status": 1,
                    "flag": 0,
                }

                mongo.updateData(dbName, process.env.COLL_DATAS, clause, docs, function(resUpdate){
                    if (resUpdate) {
                        cb(resMsg.SUCCESS_EVIDENCE.slice(0).join(" "));
                    } else {
                        if (resUpdate === 0) cb(resMsg.FAILED_EVIDENCE_NOT_FOUND.slice(0).join(" "));
                        if (resUpdate === false) cb(resMsg.ERR_BAD_GATEWAY);
                    }
                });
            } else {
                cb(resMsg.ERR_FORBIDDEN_APPLICATION);
            }
        });
    }

    static async document(data, userInfo, cb){
        modelUser.getUserApp(userInfo, function(resUser) {
            if (resUser && resUser.length) {
                let clause = {
                    "nomor_tiket": data[1].trim(),
                    "userCreate": resUser[0].username,
                }
                let docs = {
                    "document": userInfo.filename,
                }

                mongo.updateData(dbName, process.env.COLL_DATAS, clause, docs, function(resUpdate){
                    if (resUpdate) {
                        cb(resMsg.SUCCESS_DOCUMENT.slice(0).join(" "));
                    } else {
                        if (resUpdate === 0) cb(resMsg.FAILED_DOCUMENT_NOT_FOUND.slice(0).join(" "));
                        if (resUpdate === false) cb(resMsg.ERR_BAD_GATEWAY);
                    }
                });
            } else {
                cb(resMsg.ERR_FORBIDDEN_APPLICATION);
            }
        });
    }

    static async list(userInfo, cb){
        let self = this;
        modelUser.getUserApp(userInfo, function(resUser) {
            if (resUser && resUser.length) {
                let agg = [];

                let filter = {
                    "userCreate": resUser[0].username,
                    "status": {
                        "$gte": 0
                    }
                }

                agg.push({
                    "$match": filter
                });

                mongo.getAggregateData(dbName, process.env.COLL_DATAS, agg, function(result) {
                    let reply = resMsg.LIST_DATA.slice(0);

                    if (result && result.length) {
                        result.forEach(element => {
                            let row = "";
                            let status = self.statusFlagMessage(element.status, element.flag);

                            row += element.nomor_tiket + "|";
                            row += element.nomor_inet + "|";
                            row += element.material + "|";
                            row += element.jumlah + "|";
                            row += element.odp + "|";
                            row += element.idTeknisi + "|";
                            row += element.dateCreate + "|";
                            row += status[0] + "|";
                            row += status[1];
                            row += "\n";

                            reply.push(row);
                        });
                    }

                    cb(reply.join("\n"));
                });
            } else {
                cb(resMsg.ERR_FORBIDDEN_APPLICATION);
            }
        });
    }

    static statusFlagMessage(status, flag) {
        let result = new Array(2).fill("Unknown");
        if (status === 0) {
            if (flag === 0) result[0] = "<b>Waiting Action</b>", result[1] = "<b>Waiting Approval</b>";
            if (flag === 1) result[0] = "<b>OK</b>", result[1] = "<b>Plase Sent Evidence</b>";
            if (flag === -1) result[0] = "<b>NOK</b>", result[1] = "<b>Wrong Format, Plase Resent Data</b>";
        } else if (status === 1) {
            if (flag === 0) result[0] = "<b>Waiting Action</b>", result[1] = "<b>Evidence Available</b>";
            if (flag === 1) result[0] = "<b>OK</b>", result[1] = "<b>Approved</b>";
            if (flag === -1) result[0] = "<b>NOK</b>", result[1] = "<b>Rejected</b>";
        }

        return result;
    }
}

module.exports = DataModel;