const puppeteer = require('puppeteer');
var config = require('./config.json');
const superagent = require('superagent');
const fs = require('fs');
//http://www.healthdata.org/covid/covid-19-vaccine-efficacy-summary

(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    var p1Variant = null

    await page.goto(`https://public.tableau.com/views/State_Proportions_table/StateProportionsDash?%3Aembed=y&%3AshowVizHome=no&%3Adisplay_count=y&%3Adisplay_static_image=y&%3AbootstrapWhenNotified=true&%3Alanguage=en&:embed=y&:showVizHome=n&:apiID=host0#navType=1&navSrc=Parse`)
    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: './' });
    await page.waitForTimeout(2500)
    await page.click(`#download-ToolbarButton > span.tabToolbarButtonImg.tab-icon-download`)
    await page.waitForTimeout(2000)
    await page.click(`#DownloadDialog-Dialog-Body-Id > div > fieldset > button:nth-child(4)`)
    await page.waitForTimeout(3000)
    await page.click(`#export-crosstab-options-dialog-Dialog-BodyWrapper-Dialog-Body-Id > div > div.foyjxgp > div:nth-child(2) > div > label:nth-child(2) > input`)
    await page.waitForTimeout(2000)
    await page.click(`#export-crosstab-options-dialog-Dialog-BodyWrapper-Dialog-Body-Id > div > div.fdr6v0d > button`)
    results = await page.waitForTimeout(5000)

    var variantData = fs.readFileSync('State Proportions.csv', 'utf8')

    var firstSeperation = variantData.split('\n')
    var dataNestedArr = []
    for (i = 0; i < firstSeperation.length; i++) {
        dataNestedArr.push(firstSeperation[i].split('   '))
    }
    for (i = 0; i < dataNestedArr.length; i++) {
        dataNestedArr[i] = dataNestedArr[i][0].replace(/\x00/g, "").replace(/\t/g, " ")
    }
    var californiaData = dataNestedArr[2].split(' ')

    var californiaTotalSequences = californiaData[californiaData.length - 1]
    var p1CaliforniaPositive = californiaData[4]

    variantData = [californiaTotalSequences, p1CaliforniaPositive]

    await page.waitForTimeout(1000)
    console.log(parseInt(variantData[1].replace('%', "")) / 100)
    console.log(variantData[0])
    console.log(parseInt(variantData[0]))
    p1Variant = {
        "p1Cases": `${variantData[1]} | ${Math.round((parseInt(variantData[1].replace('%', "")) / 100) * parseInt(variantData[0].replace(',', "")))}`,
        "caVariants": variantData[0].replace(',',"")
    }
})();