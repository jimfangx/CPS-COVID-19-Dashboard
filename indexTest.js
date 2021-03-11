const puppeteer = require('puppeteer');
var config = require('./config.json');
const superagent = require('superagent');


(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();
    await page.goto(`https://app.powerbigov.us/view?r=eyJrIjoiMzZhZDA1NDMtYjU4OS00NWNiLTliYmUtZWNmYzhiNDJiY2FiIiwidCI6IjMyZmRmZjJjLWY4NmUtNGJhMy1hNDdkLTZhNDRhN2Y0NWE2NCJ9`)
    await page.waitForTimeout(3000)
    var statsPlot = await page.$('#pvExplorationHost > div > div > exploration > div > explore-canvas-modern > div > div.canvasFlexBox > div > div.displayArea.disableAnimations.actualSizeAlignCenter.actualSizeAlignTop.actualSizeOrigin > div.visualContainerHost > visual-container-repeat > visual-container-modern:nth-child(2) > transform > div > div:nth-child(3) > div')
    await statsPlot.click({
        button: 'right',
    })
    await page.waitForTimeout(2000)
    var showAsTtable = await page.$(`body > div.default-contextmenu.dropdownOverlay.overlay.verticalScrollbar.themeableElement.overlayActive > drop-down-list > ng-transclude > ng-repeat > drop-down-list-item > ng-transclude > ng-switch > div`)
    await showAsTtable.click()

    // await autoScroll(page)

    var alamedaResult = null
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
})();