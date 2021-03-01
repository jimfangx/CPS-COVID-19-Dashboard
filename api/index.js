const superagent = require('superagent');
const express = require('express');
var bodyParser = require('body-parser');
const config = require('./config.json');
const apiKey = require('./apiKeys.json')
const { attachCookies } = require('superagent');
const cheerio = require('cheerio');
const e = require('express');
const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post('/', (req, appRes) => {
    if (!apiKey.includes(req.body.auth)) {
        appRes.status(401)
        appRes.send('Invalid API Key or no authentication provided.')
        return;
    }

    superagent
        .get(config.link)
        .end((err, res) => {

            var returnArray = []
            const $ = cheerio.load(res.text)
            if (req.body.latest === "true") {
                var weekObj = {
                    "week": null,
                    "studentTests": null,
                    "studentPositive": null,
                    "studentPercPos": null,
                    "staffTests": null,
                    "staffPositive": null,
                    "staffPercPos": null,
                    "totalTests": null,
                    "totalPositive": null,
                    "totalPercPos": null,
                    "alamedaTests": null,
                    "alamedaCases": null,
                    "alamedaCaseChange": null,
                    "alamedaDailyTests": null,
                    "alamedaDailyCases": null
                }

                weekObj.week = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[0]).text();
                weekObj.studentTests = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[1]).text();
                weekObj.studentPositive = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[2]).text();
                weekObj.studentPercPos = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[3]).text();
                weekObj.staffTests = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[4]).text();
                weekObj.staffPositive = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[5]).text();
                weekObj.staffPercPos = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[6]).text();
                weekObj.totalTests = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[7]).text();
                weekObj.totalPositive = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[8]).text();
                weekObj.totalPercPos = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[9]).text();
                weekObj.alamedaTests = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[10]).text();
                weekObj.alamedaCases = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[11]).text();
                weekObj.alamedaCaseChange = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[12]).text();
                weekObj.alamedaDailyTests = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[13]).text();
                weekObj.alamedaDailyCases = $($($('tbody').children('tr')[$('tbody').children().length-1]).children('td')[14]).text();

                returnArray.push(weekObj)
            } else {
                for (i = 1; i < $('tbody').children().length; i++) { // start from 1 - avoid top row
                    var weekObj = {
                        "week": null,
                        "studentTests": null,
                        "studentPositive": null,
                        "studentPercPos": null,
                        "staffTests": null,
                        "staffPositive": null,
                        "staffPercPos": null,
                        "totalTests": null,
                        "totalPositive": null,
                        "totalPercPos": null,
                        "alamedaTests": null,
                        "alamedaCases": null,
                        "alamedaCaseChange": null,
                        "alamedaDailyTests": null,
                        "alamedaDailyCases": null
                    }

                    weekObj.week = $($($('tbody').children('tr')[i]).children('td')[0]).text();
                    weekObj.studentTests = $($($('tbody').children('tr')[i]).children('td')[1]).text();
                    weekObj.studentPositive = $($($('tbody').children('tr')[i]).children('td')[2]).text();
                    weekObj.studentPercPos = $($($('tbody').children('tr')[i]).children('td')[3]).text();
                    weekObj.staffTests = $($($('tbody').children('tr')[i]).children('td')[4]).text();
                    weekObj.staffPositive = $($($('tbody').children('tr')[i]).children('td')[5]).text();
                    weekObj.staffPercPos = $($($('tbody').children('tr')[i]).children('td')[6]).text();
                    weekObj.totalTests = $($($('tbody').children('tr')[i]).children('td')[7]).text();
                    weekObj.totalPositive = $($($('tbody').children('tr')[i]).children('td')[8]).text();
                    weekObj.totalPercPos = $($($('tbody').children('tr')[i]).children('td')[9]).text();
                    weekObj.alamedaTests = $($($('tbody').children('tr')[i]).children('td')[10]).text();
                    weekObj.alamedaCases = $($($('tbody').children('tr')[i]).children('td')[11]).text();
                    weekObj.alamedaCaseChange = $($($('tbody').children('tr')[i]).children('td')[12]).text();
                    weekObj.alamedaDailyTests = $($($('tbody').children('tr')[i]).children('td')[13]).text();
                    weekObj.alamedaDailyCases = $($($('tbody').children('tr')[i]).children('td')[14]).text();

                    returnArray.push(weekObj)
                }
            }
            appRes.send(returnArray)
        })
})

port = process.env.PORT;
if (port == null || port == "") {
    port = 8080;
}
app.listen(port)
console.log(`Listening at http://localhost:${port}`)