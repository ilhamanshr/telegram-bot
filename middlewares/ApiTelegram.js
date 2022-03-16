const fs        = require('fs');
const path      = require('path');
const BASE_DIR  = path.dirname(require.main.filename);
const config    = require(BASE_DIR + '/Config');
const utils     = require(BASE_DIR + '/Utils');
const logger    = require(BASE_DIR + '/Logger');
const https     = require('https');


class ApiTwitter {
    static async getPhoto(info, cb) {
        let url = config.TELEGRAM_DOWNLOAD_URL + info.file_path;
        let file = fs.createWriteStream(config.APP_MEDIA + `/${info.file_unique_id}.jpg`);

        https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb(`${info.file_unique_id}.jpg`));
            });
        }).on('error', function(err) {
            fs.unlink(dest);
            logger.error(__filename, err.message)
            cb(false);
        });
    }

    static async getDocument(doc, info, cb) {
        let url = config.TELEGRAM_DOWNLOAD_URL + info.file_path;
        let file = fs.createWriteStream(config.APP_MEDIA + `/${info.file_unique_id}${doc.file_name}`);

        https.get(url, function(response) {
            response.pipe(file);
            file.on('finish', function() {
                file.close(cb(`${info.file_unique_id}${doc.file_name}`));
            });
        }).on('error', function(err) {
            fs.unlink(dest);
            logger.error(__filename, err.message)
            cb(false);
        });
    }
}

module.exports = ApiTwitter;