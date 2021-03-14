const puppeteer = require('puppeteer');
var config = require('./config.json');
const superagent = require('superagent');


(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    var firstday = new Date(`2021-03-08`)
    firstday.setDate(firstday.getDate() + 1)
    console.log(firstday.toDateString())

    var alamedaCases = null;
    for (i = 0; i <= 7; i++) {
        await page.goto(`https://data.chhs.ca.gov/api/3/action/datastore_search?resource_id=046cdd2b-31e5-4d34-9ed3-b48cdbc4be7a&q={"area":"alameda","date":"${firstday.getFullYear()}-${("0" + (firstday.getMonth() + 1)).slice(-2)}-${("0" + firstday.getDate()).slice(-2)}"}`)
        page.waitForTimeout(1000)
        var tempAlamedaCases = await page.evaluate((firstday) => {
            var firstdayInternal = new Date(firstday)
            if (JSON.parse(document.querySelector("body > pre").innerText).result.records.length > 1) { // multiple dates, check against firstday
                for (x = 0; x < JSON.parse(document.querySelector("body > pre").innerText).result.records.length; x++) {
                    if (JSON.parse(document.querySelector("body > pre").innerText).result.records[x].date.includes(`${firstdayInternal.getFullYear()}-${("0" + (firstdayInternal.getMonth() + 1)).slice(-2)}-${("0" + firstdayInternal.getDate()).slice(-2)}`)) {
                        var alamedaCases = null
                        alamedaCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[x].cases
                        return alamedaCases
                    }
                }
            } else {
                var alamedaCases = null
                alamedaCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[0].cases
                return alamedaCases
            }
        }, firstday)
        console.log(`${firstday.getFullYear()}-${("0" + (firstday.getMonth() + 1)).slice(-2)}-${("0" + firstday.getDate()).slice(-2)}`)
        console.log(tempAlamedaCases)
        alamedaCases += parseInt(tempAlamedaCases)
        firstday.setDate(firstday.getDate() - 1)
        console.log(firstday.toDateString())
    }
    console.log(alamedaCases)

})();