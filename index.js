const schedule = require('node-schedule')
// 0 0 */1 * *   */10 * * * *
schedule.scheduleJob('0 0 */1 * *', async function () {
    const puppeteer = require('puppeteer');
    const config = require('./config.json');
    var writtenWeeks = require('./writtenWeeks.json');
    const fs = require('fs');
    (async () => {
        const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
        const page = await browser.newPage();
        await page.goto(config.covidDocs);
        await page.waitForTimeout(2000)

        var writeArray = []
        var dataNotComplete = null

        writeArray = await page.evaluate(() => {
            var returnArray = []
            var dataNotComplete = false

            var week = document.querySelector("#h\\.q4ulfv7pjpw3 > div > div > span:nth-child(2) > span > span:nth-child(2)").innerText.replace(/\u200c/g, "")
            if (week.toLowerCase().includes(`results as of`)) {
                dataNotComplete = true;
            }
            week = week.substring(0, week.indexOf('-')).replace(/\u200c/g, "")
            week = week.split(' ')[2] + " " + week.split(' ')[3]
            returnArray.push(week)

            var stuNumTest = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(2)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(stuNumTest)

            var stuNumPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(3) > td:nth-child(2)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(stuNumPos)

            var stuPercentPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(4) > td:nth-child(2)").innerText.trim().replace('%', "").replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(stuPercentPos)

            var staffNumTest = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(staffNumTest)

            var staffNumPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(3) > td:nth-child(3)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(staffNumPos)

            var staffPercentPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(4) > td:nth-child(3)").innerText.trim().replace('%', "").replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(staffPercentPos)

            var totalNumTest = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(4)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(totalNumTest)

            var totalNumPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(3) > td:nth-child(4)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(totalNumPos)

            var totalPercentPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(4) > td:nth-child(4)").innerText.trim().replace('%', "").replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(totalPercentPos)

            return [returnArray, dataNotComplete]
        })
        console.log(writeArray)
        dataNotComplete = writeArray[writeArray.length - 1]
        writeArray = writeArray[0]
        console.log(writeArray)
        console.log(dataNotComplete)
        await page.goto(config.link);
        await page.waitForTimeout(5000)

        if (dataNotComplete) { // remove last entry in writtenweeks.json to allow for rewrite w/ updated data
            fs.writeFile('writtenWeeks.json', JSON.stringify(writtenWeeks.slice(0, writtenWeeks.length - 1)), function (err) {
                if (err) console.log(err)
            })
            writtenWeeks = require('./writtenWeeks.json')
        }

        if (writtenWeeks[writtenWeeks.length - 1] != writeArray[0]) { // || dataNotComplete
            for (i = 0; i < writtenWeeks.length + 2; i++) { // add 2 for the header & the blank row that needs to be entered
                if (i + 1 != writtenWeeks.length + 2) { // not the last one
                    await page.keyboard.press('ArrowDown');
                    await page.waitForTimeout(100)
                } else { // last one - exec write
                    writtenWeeks.push(writeArray[0])
                    fs.writeFile('writtenWeeks.json', JSON.stringify(writtenWeeks), function (err) {
                        if (err) console.log(err)
                    })
                    for (j = 0; j < 10; j++) {
                        await page.keyboard.type(writeArray[j])
                        await page.waitForTimeout(500)
                        await page.keyboard.press('Tab');
                        await page.waitForTimeout(500)
                    }
                    break;
                }
            }
        }

        await page.goto('https://public.tableau.com/profile/jim.fang#!/vizhome/CPSCOVID-19/Totals')
        await page.waitForTimeout(3000)

        await page.click('#block-menu-block-1 > div > ul > li.last.leaf.menu-mlid-387 > a')
        await page.type('#login-email', config.email)
        await page.type('#login-password', config.password)
        await page.click('#signin-submit')
        await page.waitForTimeout(3000)
        await page.click('body > div.l-page.has-no-sidebars > div.canvas-content > section > div > div.vizhub-view > section.viz-metadata.clearfix.can-edit > div > figcaption > div.viz-workbook__details > div > div.extended > dl > div:nth-child(1) > dd > button')
        await page.waitForTimeout(2000)

        console.log(writeArray)
        await browser.close();
    })();

});
