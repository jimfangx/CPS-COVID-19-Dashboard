const schedule = require('node-schedule')
// 0 0 */1 * *   */10 * * * *
schedule.scheduleJob('0 0 */1 * *', async function () {
    const puppeteer = require('puppeteer');
    var config = require('./config.json');
    var writtenWeeks = require('./writtenWeeks.json');
    const fs = require('fs');
    const superagent = require('superagent');
    var alamedaTest = require('./alamedaTest.json');
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

            var stuPercentPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(4) > td:nth-child(2)").innerText.trim().replace('%', "").replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(stuPercentPos)

            var staffNumTest = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(2) > td:nth-child(3)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(staffNumTest)

            var staffNumPos = document.querySelector("#kix-appview > div.kix-appview-editor-container > div > div:nth-child(1) > div.kix-zoomdocumentplugin-outer > div > div > div > div:nth-child(2) > div:nth-child(1) > div.kix-page-content-wrapper > div:nth-child(1) > div > div > div:nth-child(1) > div > div > div:nth-child(6) > div > table > tbody > tr:nth-child(3) > td:nth-child(3)").innerText.trim().replace(/\u200c/g, "").replace(/ /g, "")
            returnArray.push(staffNumPos)
            if (staffNumPos.toLowerCase().includes('tbd')) {
                dataNotComplete = true;
            }

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
        // console.log(writeArray)
        // console.log(dataNotComplete)

        // check that req date is less than exec date... req date should be monday of the week displayed on google docs https://stackoverflow.com/questions/5210376/how-to-get-first-and-last-day-of-the-current-week-in-javascript
        var curr = new Date(writeArray[0] + " 2021"); // set to date listed on google docs dashboard
        var first = curr.getDate() - curr.getDay() + 1; // First day is the day of the month - the day of the week
        var last = first + 6; // last day is the first day + 6

        var firstday = new Date(curr.setDate(first)); // monday of that week, this is our req date

        var todayDate = new Date();

        if (firstday.valueOf() < Date.now()) { // req date < exec date

            if (todayDate.getDay() === 1) { // its a monday, exec the testing info scraper
                // if (0 === 0) { // its a monday, exec the testing info scraper

                await page.goto('https://app.powerbigov.us/view?r=eyJrIjoiNzA2MWZkNjYtM2EzNy00NWY2LWFlMzYtNDAyM2E3MDExODEyIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9') // alameda testing data
                await page.waitForTimeout(5000)
                var numTests = null
                numTests = await page.evaluate(() => {
                    var numTests = null
                    numTests = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(1) > transform > div > div:nth-child(3) > div > visual-modern > div > svg > g:nth-child(1) > text > tspan").innerHTML.trim()
                    return numTests
                })
                alamedaTest[monthNames[todayDate.getMonth()] + " " + todayDate.getUTCDate()] = numTests
                fs.writeFile('alamedaTest.json', JSON.stringify(alamedaTest), function (err) {
                    if (err) console.log(err)
                })

            }


            writeArray.push(alamedaTest[monthNames[firstday.getUTCMonth()] + " " + firstday.getUTCDate()])
            // writeArray.push(numTests) // dont do this - store it in a json file with the exec date's weeek's monday as the key. then push the value that correspondes with the writtearray date to writtearray
            // console.log(writeArray)
            await page.goto(`https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q={"county":"alameda","date":"${firstday.getFullYear()}-${("0" + (firstday.getUTCMonth() + 1)).slice(-2)}-${("0" + firstday.getUTCDate()).slice(-2)}"}`)
            await page.waitForTimeout(1000)
            var alamedaCases = await page.evaluate(() => {
                if (JSON.parse(document.querySelector("body > pre").innerText).result.records.length > 1) {
                    for (x = 0; x < JSON.parse(document.querySelector("body > pre").innerText).result.records.length; x++) {
                        if (JSON.parse(document.querySelector("body > pre").innerText).result.records[0].date.includes(`${firstday.getFullYear()}-${("0" + (firstday.getUTCMonth() + 1)).slice(-2)}-${("0" + firstday.getUTCDate()).slice(-2)}`)) {
                            var alamedaCases = null
                            alamedaCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[x].totalcountconfirmed
                            return alamedaCases
                        }
                    }
                } else {
                    var alamedaCases = null
                    alamedaCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[0].totalcountconfirmed
                    return alamedaCases
                }
            })
            writeArray.push(alamedaCases)
            // console.log(JSON.parse(res.text).result.records[0].totalcountconfirmed)

            // superagent get previous entry's data and find difference between the req data and the prev entry data
            if (config.lastAccessDataNotComplete) {
                var prevEntryDate = new Date(writtenWeeks[writtenWeeks.length - 2] + " 2021")
                var first = prevEntryDate.getDate() - prevEntryDate.getDay() + 1; // First day is the day of the month - the day of the week        
                var prevEntryFirstDate = new Date(curr.setDate(first)); // monday of that week, this is our req date
            } else {
                var prevEntryDate = new Date(writtenWeeks[writtenWeeks.length - 1] + " 2021")
                var first = prevEntryDate.getDate() - prevEntryDate.getDay() + 1; // First day is the day of the month - the day of the week        
                var prevEntryFirstDate = new Date(curr.setDate(first)); // monday of that week, this is our req date
            }
            await page.goto(`https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q={"county":"alameda","date":"${prevEntryFirstDate.getFullYear()}-${("0" + (prevEntryFirstDate.getUTCMonth() + 1)).slice(-2)}-${("0" + prevEntryFirstDate.getUTCDate()).slice(-2)}"}`)
            await page.waitForTimeout(1000)
            var lastEntryCases = await page.evaluate(() => {
                if (JSON.parse(document.querySelector("body > pre").innerText).result.records.length > 1) {
                    for (x = 0; x < JSON.parse(document.querySelector("body > pre").innerText).result.records.length; x++) {
                        if (JSON.parse(document.querySelector("body > pre").innerText).result.records[0].date.includes(`${prevEntryFirstDate.getFullYear()}-${("0" + (prevEntryFirstDate.getUTCMonth() + 1)).slice(-2)}-${("0" + prevEntryFirstDate.getUTCDate()).slice(-2)}`)) {
                            var lastEntryCases = null
                            lastEntryCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[x].totalcountconfirmed
                            return lastEntryCases
                        }
                    }
                } else {
                    var lastEntryCases = null
                    lastEntryCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[0].totalcountconfirmed
                    return lastEntryCases
                }
            })
            writeArray.push(writeArray[writeArray.length - 1] - lastEntryCases)
            // console.log(JSON.parse(res.text))

            console.log(writeArray)
        }

        for (i = 0; i < writeArray.length; i++) { // convert numbers from the request to strings
            writeArray[i] = "" + writeArray[i]
        }


        // checking for data not compelte and pre to start writing
        if (config.lastAccessDataNotComplete) {
            console.log(`last wrritne record ${writtenWeeks[writtenWeeks.length - 1]}`)
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


        // push daily alameda county data into array
        var dayBefore = new Date()
        dayBefore.setDate(dayBefore.getDate() - 2) // -2 is actually the day before, since the script runs after midnight
        console.log(dayBefore.getDate())
        await page.goto('https://app.powerbigov.us/view?r=eyJrIjoiNzA2MWZkNjYtM2EzNy00NWY2LWFlMzYtNDAyM2E3MDExODEyIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9') // alameda testing data
        await page.waitForTimeout(10000)
        var numTestsDaily = null
        numTestsDaily = await page.evaluate(() => {
            var numTests = null
            numTests = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(1) > transform > div > div:nth-child(3) > div > visual-modern > div > svg > g:nth-child(1) > text > tspan").innerHTML.trim()
            return numTests
        })

        await page.goto(`https://data.ca.gov/api/3/action/datastore_search?resource_id=926fd08f-cc91-4828-af38-bd45de97f8c3&q={"county":"alameda","date":"${dayBefore.getFullYear()}-${("0" + (dayBefore.getMonth() + 1)).slice(-2)}-${("0" + dayBefore.getDate()).slice(-2)}"}`)
        await page.waitForTimeout(1000)
        var alamedaCasesToday = await page.evaluate(() => {
            if (JSON.parse(document.querySelector("body > pre").innerText).result.records.length > 1) {
                for (x = 0; x < JSON.parse(document.querySelector("body > pre").innerText).result.records.length; x++) {
                    if (JSON.parse(document.querySelector("body > pre").innerText).result.records[0].date.includes(`${dayBefore.getFullYear()}-${("0" + (dayBefore.getMonth() + 1)).slice(-2)}-${("0" + dayBefore.getDate()).slice(-2)}`)) {
                        var alamedaCases = null
                        alamedaCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[x].totalcountconfirmed
                        return alamedaCases
                    }
                }
            } else {
                var alamedaCases = null
                alamedaCases = JSON.parse(document.querySelector("body > pre").innerText).result.records[0].totalcountconfirmed
                return alamedaCases
            }
        })

        if (writtenWeeks[writtenWeeks.length - 1] == writeArray[0]) {
            noWrite = true
            writeArray = ["" + numTestsDaily, "" + alamedaCasesToday]
        } else {
            writeArray.push("" + numTestsDaily)
            writeArray.push("" + alamedaCasesToday)
        }

        await page.goto(config.link);
        await page.waitForTimeout(5000)
        // await page.waitForTimeout(5000)
        var writtenWeeks1 = require('./writtenWeeks.json')
        console.log(writtenWeeks1)
        console.log(writtenWeeks[writtenWeeks.length - 1])
        console.log(writeArray[0])
        console.log(writtenWeeks[writtenWeeks.length - 1] != writeArray[0])
        if (writtenWeeks[writtenWeeks.length - 1] != writeArray[0]) {
            // config.lastAccessDataNotComplete = false
            for (i = 0; i < writtenWeeks.length + 2; i++) { // add 2 for the header & the blank row that needs to be entered
                if (i + 1 != writtenWeeks.length + 2) { // not the last one
                    await page.keyboard.press('ArrowDown');
                    await page.waitForTimeout(100)
                } else { // last one - exec write
                    writtenWeeks.push(writeArray[0])
                    fs.writeFile('writtenWeeks.json', JSON.stringify(writtenWeeks), function (err) {
                        if (err) console.log(err)
                    })
                    for (j = 0; j < 15; j++) {
                        await page.keyboard.type(writeArray[j])
                        await page.waitForTimeout(500)
                        await page.keyboard.press('Tab');
                        await page.waitForTimeout(500)
                    }
                    break;
                }
            }
        } else if (noWrite) {
            for (i = 0; i < writtenWeeks.length + 2; i++) { // add 2 for the header & the blank row that needs to be entered
                if (i + 1 != writtenWeeks.length + 2) { // not the last one
                    await page.keyboard.press('ArrowDown');
                    await page.waitForTimeout(100)
                } else { // last one - exec write
                    for (j = 0; j < 13; j++) {
                        await page.keyboard.press('Tab');
                        await page.waitForTimeout(500)
                    }
                    for (k = 0; k < 2; k++) {
                        await page.keyboard.type(writeArray[k])
                        await page.waitForTimeout(500)
                        await page.keyboard.press('Tab');
                        await page.waitForTimeout(500)
                    }
                    break;
                }
            }
        }

        if (dataNotComplete) { // data is not complete this week, set the data not complete variable to true for next time. next time: goes to func abov to id if still same wk 
            // var configObj = JSON.parse(config)
            config.lastAccessDataNotComplete = true
            fs.writeFile('config.json', JSON.stringify(config), function (err) {
                if (err) console.log(err)
            })
        }

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

        console.log(writeArray)
        await browser.close();
    })();

});
