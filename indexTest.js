const puppeteer = require('puppeteer');
var config = require('./config.json');
const superagent = require('superagent');
const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');
// const parse = require('csv-parse');


(async () => {
    const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
    const page = await browser.newPage();

    await page.goto(`https://public.tableau.com/views/State_Proportions_table/StateProportionsDash?%3Aembed=y&%3AshowVizHome=no&%3Adisplay_count=y&%3Adisplay_static_image=y&%3AbootstrapWhenNotified=true&%3Alanguage=en&:embed=y&:showVizHome=n&:apiID=host0#navType=1&navSrc=Parse`)
    await page._client.send('Page.setDownloadBehavior', { behavior: 'allow', downloadPath: './' });
    await page.waitForTimeout(2500)
    await page.click(`#download-ToolbarButton > span.tabToolbarButtonImg.tab-icon-download`)
    await page.waitForTimeout(2000)
    await page.click(`#DownloadDialog-Dialog-Body-Id > div > fieldset > button:nth-child(4)`)
    await page.waitForTimeout(2000)
    await page.click(`#export-crosstab-options-dialog-Dialog-BodyWrapper-Dialog-Body-Id > div > div.foyjxgp > div:nth-child(2) > div > label:nth-child(2) > input`)
    await page.waitForTimeout(2000)
    await page.click(`#export-crosstab-options-dialog-Dialog-BodyWrapper-Dialog-Body-Id > div > div.fdr6v0d > button`)
    // console.log(numTests)
    // var results = []
    results = await page.waitForTimeout(5000)
    fs.createReadStream('State Proportions.csv')
        .pipe(csv.parse())
        .on('error', error => console.log("ERR: " + error))
        .on('data', row => {
            console.log(row)
            // fs.writeFile('./stateVariants', row, (err) => {
            //     if (err) console.log(err)
            // })
        })
        .on('end', rowCount => console.log(`Parsed ${rowCount} rows`));

    // console.log(results)
})();