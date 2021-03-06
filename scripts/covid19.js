// Description:
//   新型コロナウイルスに関する情報を取得してくれるbotです
// Commands:
//   covid19            - covid19の使用方法を表示
//   covid19 全国        - 全国の感染者数を表示
//   covid19 (都道府県名) - 指定した都道府県の累計陽性者数を表示
// データ提供元:
//   COVID-19 Japan
'use strict'
const json = require('./index.js')

module.exports = robot => {
    robot.hear(/covid19$/g, msg => {
        const description = "" +
            "Description:\n" +
            "```新型コロナウイルスに関する情報を取得してくれるbotです```\n" +
            "コマンド一覧:\n" +
            "```covid19             - covid19の使用方法を表示\n" +
            "covid19 全国        - 全国の感染者数を表示\n" +
            "covid19 (都道府県名) - 指定した都道府県の累計陽性者数を表示```\n" +
            "データ提供元:\n" +
            "```COVID-19 Japan```"
        msg.send(description)
    })
    robot.respond(/(.+)/i, msg => {
        const str = msg.match[1].trim()
        if (str.match(/全国/)) {
            const nationalPositive = json.getNationalPositive()
            if (nationalPositive === "FailedToGet") {
                msg.send("情報の取得に失敗しました")
            } else {
                msg.send(`${json.getLastUpdate()} 時点の全国の累計陽性者数は${nationalPositive}人です`)
            }
        } else {
            const [prefectureName, prefecturePositive] = json.getPrefecturePositive(str)
            switch (prefecturePositive) {
                case "NotFindPrefecture":
                    msg.send("都道府県が見つかりませんでした")
                    break
                case "FailedToGet":
                    msg.send("情報の取得に失敗しました")
                    break
                default:
                    msg.send(`${json.getLastUpdate()} 時点の${prefectureName}の累計陽性者数は${prefecturePositive}人です`)
                    break
            }
        }
    })
}