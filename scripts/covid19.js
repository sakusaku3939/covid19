// Description:
//   新型コロナウイルスに関する情報を取得してくれるbotです
// Commands:
//   covid19 全国        - 全国の感染者数を表示
//   covid19 (都道府県名) - 指定した都道府県の累計陽性者数を表示
//   covid19 commands    - コマンド一覧を表示
// 例)2020-7-9 時点の東京都の累計陽性者数は100人です
'use strict'
const json = require('./index.js')

module.exports = robot => {
    robot.respond(/commands/i, msg => {
        const commands = "" +
            "covid19 全国        - 全国の感染者数を表示\n" +
            "covid19 (都道府県名) - 指定した都道府県の累計陽性者数を表示\n" +
            "covid19 commands    - コマンド一覧を表示\n"
        msg.send(commands)
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