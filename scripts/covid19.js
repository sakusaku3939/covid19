// Description:
//   新型コロナウイルスに関する情報を取得してくれるbotです
// Commands:
//   covid19            - コマンド一覧を表示
//   covid19 全国        - 全国の感染者数を表示
//   covid19 (都道府県名) - 指定した都道府県の累計陽性者数を表示
'use strict'
const json = require('./index.js')

module.exports = robot => {
    robot.hear(/covid19$/g, msg => {
        const description = "" +
            "Description:\n" +
            "```新型コロナウイルスに関する情報を取得してくれるbotです```\n" +
            "Commands:\n" +
            "```covid19             - コマンド一覧を表示\n" +
            "covid19 全国        - 全国の感染者数を表示\n" +
            "covid19 (都道府県名) - 指定した都道府県の累計陽性者数を表示```"
        msg.send(description)
    })
    robot.respond(/(.+)/i, msg => {
        const str = msg.match[1].trim()
        if (str.match(/全国/)) {
            msg.send('全国')
        } else {
            const [prefectureName, prefecturePositive] = json.getPrefecturePositive(str)
            switch (prefecturePositive) {
                case 'NotFindPrefecture':
                    msg.send("都道府県が見つかりませんでした")
                    break
                case 'FailedToGet':
                    msg.send("情報の取得に失敗しました")
                    break
                default:
                    msg.send(`${json.getLastUpdate()} 時点の${prefectureName}の累計陽性者数は${prefecturePositive}人です`)
                    break
            }
        }
    })
}