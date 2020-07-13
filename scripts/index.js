'use strict'
let json_obj = {}
getJSON()

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

/**
 * データの最終更新日を取得
 * @returns {String}
 */
function getLastUpdate() {
    return String(json_obj['lastUpdate'])
}

/**
 * 全国の累計陽性者数を取得
 * @returns {string}
 */
function getNationalPositive() {
    return !isEmpty(json_obj) ? String(json_obj['npatients']) : "FailedToGet"
}

/**
 * 指定した都道府県の累計陽性者数を取得
 * @param prefectures
 * @returns {*[]}
 */
function getPrefecturePositive(prefectures) {
    if (!isEmpty(json_obj)) {
        const matchPrefecture = json_obj['area'].find(obj => {
            const name = obj['name_jp'].slice(0, -1)
            return prefectures.match(new RegExp(name))
        })
        if (typeof (matchPrefecture) !== "undefined") {
            return [matchPrefecture['name_jp'], matchPrefecture['npatients']]
        } else {
            return ["", "NotFindPrefecture"]
        }
    } else {
        return ["", "FailedToGet"]
    }
}

module.exports = {
    getLastUpdate, getNationalPositive, getPrefecturePositive
}