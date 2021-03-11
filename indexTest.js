const puppeteer = require('puppeteer');
var config = require('./config.json');
const superagent = require('superagent');


(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(`https://app.powerbigov.us/view?r=eyJrIjoiMzZhZDA1NDMtYjU4OS00NWNiLTliYmUtZWNmYzhiNDJiY2FiIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9`)
    await page.waitForTimeout(3000)
    var alamedaResult = null
    var cdcCAStateVacTotals = null
    var b117Cases = null
    var statsPlot = await page.$('#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div')
    await statsPlot.click({
        button: 'right',
    })
    await page.waitForTimeout(2000)
    var showAsTtable = await page.$(`body > div.default-contextmenu.dropdownOverlay.overlay.verticalScrollbar.themeableElement.overlayActive > drop-down-list > ng-transclude > ng-repeat > drop-down-list-item > ng-transclude > ng-switch > div`)
    await showAsTtable.click()

    // await autoScroll(page)

    for (i = 0; i < 100; i++) {
        await page.click("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div:nth-child(4) > div:nth-child(2)")
    }
    await page.waitForTimeout(3000)
    alamedaResult = await page.evaluate(() => {
        var returnResult = {
            "day": null,
            "firstDose": null,
            "secondDose": null
        }
        var tableHolderDivChildNumber = document.querySelector("#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.bodyCells > div").children.length // number of sections in the master table holder. rn its 2, could get larger. find the latest
        // var leftColumnFirstDoseElement = document.querySelector(`#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.bodyCells > div > div:nth-child(${tableHolderDivChildNumber} > div:nth-child(1)`)
        // var rightColumnSecondDoseElement = document.querySelector(`#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.fitToScreen > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div > detail-visual-modern > div > visual-modern > div > div > div.pivotTable > div.innerContainer > div.bodyCells > div > div:nth-child(${tableHolderDivChildNumber} > div:nth-child(2)`)

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
        returnB117.usTotal = document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(1) > div > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(2)").innerText
        returnB117.caTotal = document.querySelector("body > div.container.d-flex.flex-wrap.body-wrapper.bg-white > main > div:nth-child(3) > div > div.syndicate > div:nth-child(2) > div > div.wcms-map-container > div > section > section.data-table > table > tbody > tr:nth-child(6) > td:nth-child(2)").innerText
        return returnB117
    })
    console.log(b117Cases)
    await page.goto(config.dailyLink)

    var startDate = new Date('2020-12-20')
    var endDate = new Date(alamedaResult.day) // set as alameda county's vac info date
    var diffTime = Math.abs(endDate - startDate);
    var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    for (i = 0; i < diffDays; i++) {
        await page.waitForTimeout(100)
        page.keyboard.press('ArrowDown'); //  (+1) because then it ends up 1 row (day) before the day its run on due to the header taking up 1 row
    }
    page.keyboard.press('ArrowRight')
    await page.waitForTimeout(500)
    page.keyboard.press('ArrowRight')
    await page.waitForTimeout(500)
    page.keyboard.type(alamedaResult.firstDose)
    await page.waitForTimeout(500)
    page.keyboard.press('ArrowRight')
    await page.waitForTimeout(500)
    page.keyboard.type(alamedaResult.secondDose)
    await page.waitForTimeout(500)
    page.keyboard.press('ArrowRight')

    await page.waitForTimeout(3000)
    //ca vaccine totals will be binded to b117 totals
    page.reload() // reset pos to A1
    await page.waitForTimeout(5000)

    endDate = new Date()
    diffTime = Math.abs(endDate - startDate);
    diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    for (i = 0; i < diffDays -1; i++) { // +1?
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
})();