'use strict';
let json = {}
getJSON();
console.log(isEmpty(json))

/**
 * COVID-19 Japan より 新型コロナウイルス感染症について - 厚生労働省 をJSON化したデータを、HTTPSのGETメソッドを使用して取得
 */
function getJSON() {
    let chunkString = '';

    const https = require('https');
    const req = https.request('https://www.stopcovid19.jp/data/covid19japan.json', (res) => {
        res.on('data', (chunk) => {
            chunkString += chunk.toString();
        });
        res.on('end', () => {
            json = JSON.parse(chunkString);
            console.log('JSONデータの読み込みが完了しました');
        });
    })

    req.on('error', (e) => {
        console.error(`エラーが発生しました： ${e.message}`);
    });

    req.end();
}

/**
 * Object型の中身が空かどうかを判定
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    return !Object.keys(obj).length;
}


module.exports = {};