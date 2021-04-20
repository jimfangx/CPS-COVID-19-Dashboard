const schedule = require('node-schedule')
// 0 0 */1 * *   */10 * * * *
// schedule.scheduleJob('0 0 */1 * *', async function () {
const puppeteer = require('puppeteer');
var config = require('./config.json');
var writtenWeeks = require('./writtenWeeks.json');
const fs = require('fs');
const superagent = require('superagent');
var alamedaTest = require('./alamedaTest.json');
var alamedaCasesWeekly = require('./alamedaCasesWeekly.json')
var alamedaCasesDaily = require('./alamedaCasesDaily.json')
const { parse } = require('path');
const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(config.covidDocs);
    await page.waitForTimeout(2000)

    var writeArray = []
    var dataNotComplete = null
    var noWrite = null

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
        if (stuNumPos.toLowerCase().includes('tbd')) {
            dataNotComplete = true;
        }

        // for use during summer or frequent 0 students tested periods
        // var stuPercentPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(4) > td:nth-child(2)").innerText.trim().replace('%', "").replace(/\u200c/g, "").replace(/ /g, "")
        var stuPercentPos = ""
        returnArray.push(stuPercentPos)

        var staffNumTest = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
        returnArray.push(staffNumTest)

        var staffNumPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(3) > td:nth-child(3)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
        returnArray.push(staffNumPos)
        if (staffNumPos.toLowerCase().includes('tbd')) {
            dataNotComplete = true;
        }

        // var staffPercentPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(4) > td:nth-child(3)").innerText.trim().replace('%', "").replace(/\u200c/g, "").replace(/ /g, "")
        var staffPercentPos = ""
        returnArray.push(staffPercentPos)

        // var totalNumTest = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(4)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
        var totalNumTest = ""
        returnArray.push(totalNumTest)

        // var totalNumPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(3) > td:nth-child(4)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
        var totalNumPos = ""
        returnArray.push(totalNumPos)

        // var totalPercentPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(4) > td:nth-child(4)").innerText.trim().replace('%', "").replace(/\u200c/g, "").replace(/ /g, "")
        var totalPercentPos = ""
        returnArray.push(totalPercentPos)

        return [returnArray, dataNotComplete]
    })

    console.log(writeArray)
    dataNotComplete = writeArray[writeArray.length - 1]
    writeArray = writeArray[0]

    if (writeArray[0] === writtenWeeks[writtenWeeks.length - 1]) {
        // the same as last week, no new data. just delete last week's entry in writtenweeks
        writtenWeeks.splice(-1, 1)
        console.log(writtenWeeks)
        fs.writeFile('writtenWeeks.json', JSON.stringify(writtenWeeks), function (err) {
            if (err) console.log(err)
        })

    } // if different from last weeks - new data was entered. do nothing. it will get taken care of in the writing segment

    if (config.lastAccessDataNotComplete) {
        console.log(`last written record ${writtenWeeks[writtenWeeks.length - 1]}`)
        console.log(`this time week ${writeArray[0]}`)
        if (writtenWeeks[writtenWeeks.length - 1] == writeArray[0]) { // it is the same week, results still not done. delete the most recent entry in writtenweeks to allow script to rerun & update data
            fs.writeFile('writtenWeeks.json', JSON.stringify(writtenWeeks.slice(0, writtenWeeks.length - 1)), function (err) { // remove last entry in writtenweeks.json to allow for rewrite w/ updated data
                if (err) console.log(err)
                console.log('written')
                writtenWeeks = writtenWeeks.slice(0, writtenWeeks.length - 1) // update in code value
            })

            config.lastAccessDataNotComplete = false
            fs.writeFile('config.json', JSON.stringify(config), function (err) { // reset last data access not complete
                if (err) console.log(err)
                config = require('./config.json')
            })
        }
        else { // not the same week, previous wk's results were certified and then moved down to archive (script didnt catch it) - new week is up and the results are incomplete -> leave writtenweeks, log it for human verification, change the config lastAccessDataNotComplete to false
            config.lastAccessDataNotComplete = false
            fs.writeFile('config.json', JSON.stringify(config), function (err) {
                console.log(`check ${writtenWeeks[writtenWeeks - 1]}`)
                if (err) console.log(err)
            })
        }
    }

    var curr = new Date(writeArray[0] + " 2021"); // set to date listed on google docs dashboard
    var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week // last day is the first day + 6

    var firstday = new Date(curr.setDate(first)); // monday of that week, this is our req date

    var todayDate = new Date();

    if (todayDate.getDay() === 1) {
        await page.goto('https://app.powerbigov.us/view?r=eyJrIjoiNzA2MWZkNjYtM2EzNy00NWY2LWFlMzYtNDAyM2E3MDExODEyIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9') // alameda testing data
        await page.waitForTimeout(5000)
        var numTests = null
        numTests = await page.evaluate(() => {
            var numTests = null
            numTests = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(1) > transform > div > div:nth-child(3) > div > visual-modern > div > svg > g:nth-child(1) > text > tspan").innerHTML.trim()
            return numTests
        })
        alamedaTest[monthNames[todayDate.getMonth()] + " " + todayDate.getDate()] = numTests
        fs.writeFile('alamedaTest.json', JSON.stringify(alamedaTest), function (err) {
            if (err) console.log(err)
        })


        await page.goto(`https://app.powerbigov.us/view?r=eyJrIjoiZTE0YmM1NzUtNDA2NC00ODY4LWFhMmYtNmQ0ZTI5MzlhM2YyIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9`) // alameda county cases board
        await page.waitForTimeout(5000)
        var alamedaCases = await page.evaluate(() => {
            var returnAlamedaCases = null
            returnAlamedaCases = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(1) > transform > div > div:nth-child(3) > div > visual-modern > div > svg > g:nth-child(1) > text > tspan").innerHTML.trim()
            return returnAlamedaCases
        })
        alamedaCasesWeekly[monthNames[todayDate.getMonth()] + " " + todayDate.getDate()] = alamedaCases
        fs.writeFile('alamedaCasesWeekly.json', JSON.stringify(alamedaCasesWeekly), function (err) {
            if (err) console.log(err)
        })

        // delete require.cache[require.resolve('./alamedaCasesWeekly.json')] // Deleting loaded module
        // alamedaCasesWeekly = require('./alamedaCasesWeekly.json')

        // delete require.cache[require.resolve('./alamedaTest.json')] // Deleting loaded module
        // alamedaTest = require('./alamedaTest.json');
    }
    writeArray.push(alamedaTest[monthNames[firstday.getUTCMonth()] + " " + firstday.getUTCDate()]) // push column K - Alameda Test (this is updated weekly)
    writeArray.push(alamedaCasesWeekly[monthNames[firstday.getUTCMonth()] + " " + firstday.getUTCDate()]) // push column L - Alameda Cases (this is updated weekly)

    writeArray.push("") // push blank for column M - Alameda Change in Cases (Updated weekly, calculation automatically done by Sheets)

    var dayBefore = new Date()
    dayBefore.setDate(dayBefore.getDate() - 3) // -2 is actually the day before, since the script runs after midnight 

    console.log(dayBefore.getDate())
    await page.goto('https://app.powerbigov.us/view?r=eyJrIjoiNzA2MWZkNjYtM2EzNy00NWY2LWFlMzYtNDAyM2E3MDExODEyIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9') // alameda testing board
    await page.waitForTimeout(10000)
    var numTestsDaily = null
    numTestsDaily = await page.evaluate(() => {
        var numTests = null
        numTests = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(1) > transform > div > div:nth-child(3) > div > visual-modern > div > svg > g:nth-child(1) > text > tspan").innerHTML.trim()
        return numTests
    })

    await page.waitForTimeout(3000)
    await page.goto(`https://app.powerbigov.us/view?r=eyJrIjoiZTE0YmM1NzUtNDA2NC00ODY4LWFhMmYtNmQ0ZTI5MzlhM2YyIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9`) // alameda cases board
    await page.waitForTimeout(5000)
    var alamedaCasesToday = await page.evaluate(() => {
        var returnAlamedaCasesToday = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(1) > transform > div > div:nth-child(3) > div > visual-modern > div > svg > g:nth-child(1) > text > tspan").innerHTML.trim()
        return returnAlamedaCasesToday
    })

    writeArray.push("" + numTestsDaily) // push column N - Alameda daily tests (update daily)
    writeArray.push("" + alamedaCasesToday) // push column column O - Alameda daily cases (updated daily)

    await page.goto(config.link);
    await page.waitForTimeout(5000)

    for (i = 0; i < writtenWeeks.length + 2; i++) {
        if (i + 1 != writtenWeeks.length + 2) { // advance rows until the last row
            await page.keyboard.press('ArrowDown');
            await page.waitForTimeout(100)
        } else { // last row - start writing
            writtenWeeks.push(writeArray[0])
            fs.writeFile('writtenWeeks.json', JSON.stringify(writtenWeeks), function (err) {
                if (err) console.log(err)
            })
            // delete require.cache[require.resolve('./writtenWeeks.json')] // Deleting loaded module
            // writtenWeeks = require('./writtenWeeks.json');
            for (j = 0; j < writeArray.length; j++) {
                if (writeArray[j] === "") { // field auto calced by sheets - skip
                    await page.keyboard.press('Tab');
                    await page.waitForTimeout(500)
                } else {
                    await page.keyboard.type("" + writeArray[j])
                    await page.waitForTimeout(500)
                    await page.keyboard.press('Tab');
                    await page.waitForTimeout(500)
                }
            }
            break;
        }
    }

    if (dataNotComplete) { // data is not complete this week, set the data not complete variable to true for next time. next time: goes to func abov to id if still same wk 
        config.lastAccessDataNotComplete = true
        fs.writeFile('config.json', JSON.stringify(config), function (err) {
            if (err) console.log(err)
        })
    }

    // ----------------- Varients & Vaccine Updater - Sheet #2 -----------------

    var cdcCAStateVacTotals = null
    var b117Cases = null

    await page.waitForTimeout(5000)

    await page.goto(`https://covid.cdc.gov/covid-data-tracker/#vaccinations`)
    await page.waitForTimeout(5000)
    cdcCAStateVacTotals = await page.evaluate(() => {
        return document.querySelector("#vaccinations-table > tbody > tr:nth-child(7) > td:nth-child(2)").innerText
    })

    await page.goto(`https://www.cdc.gov/coronavirus/2019-ncov/transmission/variant-cases.html`)
    await page.waitForTimeout(5000)
    b117Cases = await page.evaluate(() => {
        var returnB117 = {
            "usTotal": null,
            "caTotal": null
        }
        returnB117.usTotal = document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)").innerText
        returnB117.caTotal = document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(2) > div > div.wcms-viz-container > div > section > section.data-table-container.md > table > tbody > tr:nth-child(6) > td:nth-child(2)").innerText
        return returnB117
    })

    await page.goto(config.dailyLink)
    var startDate = new Date('2020-12-20')
    startDate.setDate(startDate.getDate() + 1)
    endDate = new Date()
    diffTime = Math.abs(endDate - startDate);
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    for (i = 0; i < diffDays - 1; i++) { // +1?
        await page.waitForTimeout(100)
        page.keyboard.press('ArrowDown')
    }
    for (i = 0; i < 5; i++) { //change to F column
        await page.waitForTimeout(500)
        page.keyboard.press("ArrowRight")
    }
    await page.waitForTimeout(500)
    page.keyboard.type(cdcCAStateVacTotals)
    await page.waitForTimeout(500)
    page.keyboard.press("ArrowRight")
    await page.waitForTimeout(500)
    page.keyboard.type(b117Cases.caTotal)
    await page.waitForTimeout(500)
    page.keyboard.press("ArrowRight")
    await page.waitForTimeout(500)
    page.keyboard.type(b117Cases.usTotal)
    await page.waitForTimeout(500)
    page.keyboard.press("ArrowRight")
    await page.waitForTimeout(500)


    // ----------------- UPDATE TABLEAU -----------------
    await page.waitForTimeout(3000)
    await page.goto('https://public.tableau.com/profile/jim.fang#!/vizhome/CPSCOVID-19/Totals')
    await page.waitForTimeout(3000)

    await page.click('#block-menu-block-1 > div > ul > li.last.leaf.menu-mlid-387 > a')
    await page.type('#login-email', config.email)
    await page.type('#login-password', config.password)
    await page.click('#signin-submit')
    await page.waitForTimeout(3000)
    await page.click('body > div.l-page.has-no-sidebars > div.canvas-content > section > div > div.vizhub-view > section.viz-metadata.clearfix.can-edit > div > figcaption > div.viz-workbook__details > div > div.extended > dl > div:nth-child(1) > dd > button')
    await page.waitForTimeout(2000)

    await browser.close();
})();

// })