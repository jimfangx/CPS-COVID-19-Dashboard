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
<<<<<<< HEAD
    console.log(alamedaCases)
=======
    await page.waitForTimeout(3000)
    alamedaResult = await page.evaluate(() => {
        var returnResult = {
            "day": null,
            "firstDose": null,
            "secondDose": null
        }
        var tableHolderDivChildNumber = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.bodyCells > div").children.length // number of sections in the master table holder. rn its 2, could get larger. find the latest

        var numberOfEntries = document.querySelector(`#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.bodyCells > div > div:nth-child(${tableHolderDivChildNumber}) > div:nth-child(2)`).children.length
        returnResult.firstDose = document.querySelector(`#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.bodyCells > div > div:nth-child(${tableHolderDivChildNumber}) > div:nth-child(1) > div:nth-child(${numberOfEntries})`).textContent
        returnResult.secondDose = document.querySelector(`#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.bodyCells > div > div:nth-child(${tableHolderDivChildNumber}) > div:nth-child(2) > div:nth-child(${numberOfEntries})`).textContent

        var numberOfDates = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.rowHeaders > div").children.length
        returnResult.day = document.querySelector(`#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.rowHeaders > div > div:nth-child(${numberOfDates}) > div`).textContent
        return returnResult
    })
    console.log(alamedaResult)

    await page.goto(`https://covid.cdc.gov/covid-data-tracker/#vaccinations`)
    await page.waitForTimeout(5000)
    cdcCAStateVacTotals = await page.evaluate(() => {
        return document.querySelector("#vaccinations-table > tbody > tr:nth-child(7) > td:nth-child(2)").innerText
    })
    console.log(cdcCAStateVacTotals)

    await page.goto(`https://www.cdc.gov/coronavirus/2019-ncov/transmission/variant-cases.html`)
    await page.waitForTimeout(5000)
    b117Cases = await page.evaluate(() => {
        var returnB117 = {
            "usTotal": null,
            "caTotal": null
        }
        returnB117.usTotal = document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2) > p").innerText
        returnB117.caTotal = document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(2) > div > div.wcms-viz-container > div > section > section.data-table-container.md > table > tbody > tr:nth-child(6) > td:nth-child(2)").innerText
        return returnB117
    })
    console.log(b117Cases)
    await page.goto(config.dailyLink)

    var startDate = new Date('2020-12-20')
    startDate.setHours(0,0,0,0)
    startDate.setDate(startDate.getDate() + 1)
    var endDate = new Date(alamedaResult.day) // set as alameda county's vac info date
    var diffTime = Math.abs(endDate - startDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
>>>>>>> main

})();