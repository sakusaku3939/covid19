'use strict'
let json_obj = {}
getJSON()
console.log(isEmpty(json_obj))

/**
 * COVID-19 Japan より 新型コロナウイルス感染症について - 厚生労働省 をJSON化したデータを、HTTPSのGETメソッドを使用して取得
 */
function getJSON() {
    let chunkString = ''

    const https = require('https');
    const req = https.request('https://www.stopcovid19.jp/data/covid19japan.json', (res) => {
        res.on('data', (chunk) => {
            chunkString += chunk.toString()
        });
        res.on('end', () => {
            json_obj = JSON.parse(chunkString)
            console.log('JSONデータ読み込み完了')
        });
    })

    req.on('error', (e) => {
        console.error(`エラー： ${e.message}`)
    });

    req.end()
}

/**
 * Object型の中身が空かどうかを判定
 * @param obj
 * @returns {boolean}
 */
function isEmpty(obj) {
    return !Object.keys(obj).length
}

function getPositive() {

}

/**
 * データの最終更新日を取得
 * @returns {Number}
 */
function getLastUpdate() {
    return isEmpty(json_obj) ? "情報の取得に失敗しました" : json_obj['lastUpdate']
}

/**
 * 指定した都道府県の累計陽性者数を取得
 * @param prefectures
 * @returns {Number}
 */
function getPrefecturePositive(prefectures) {
    return isEmpty(json_obj) ? "情報の取得に失敗しました" : json_obj['area'].find(obj => obj['name_jp'] === prefectures)['npatients']
}

module.exports = {getLastUpdate, getPrefecturePositive}