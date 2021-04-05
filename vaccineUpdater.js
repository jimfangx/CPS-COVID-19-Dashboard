const schedule = require('node-schedule');
const puppeteer = require('puppeteer');
const config = require('./config.json');
const superagent = require('superagent');
const fs = require('fs');
var writeList = []

// schedule.scheduleJob('5 0 */1 * *', async function () {
    superagent
        .post(`https://wabi-us-gov-iowa-api.analysis.usgovcloudapi.net/public/reports/querydata/`)
        .set('X-PowerBI-ResourceKey', `36ad0543-b589-45cb-9bbe-ecfc8b42bcab`)
        .set('Connection', 'keep-alive')
        .set('Accept-Encoding', 'gzip, deflate, br')
        .set("Accept", "*/*")
        .set('User-Agent', "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36")
        .set('Content-Type', 'application/json')
        .set('Host', "wabi-us-gov-iowa-api.analysis.usgovcloudapi.net")
        .send(JSON.stringify({ "version": "1.0.0", "queries": [{ "Query": { "Commands": [{ "SemanticQueryDataShapeCommand": { "Query": { "Version": 2, "From": [{ "Name": "v", "Entity": "V_Vaccine_Data", "Type": 0 }], "Select": [{ "Column": { "Expression": { "SourceRef": { "Source": "v" } }, "Property": "ADMIN_DATE" }, "Name": "V_Vaccine_Data.ADMIN_DATE" }, { "Measure": { "Expression": { "SourceRef": { "Source": "v" } }, "Property": "FullyVaccinated" }, "Name": "V_Vaccine_Data.FullyVaccinated" }, { "Measure": { "Expression": { "SourceRef": { "Source": "v" } }, "Property": "At Least One Dose" }, "Name": "V_Vaccine_Data.At Least One Dose" }], "Where": [{ "Condition": { "And": { "Left": { "Comparison": { "ComparisonKind": 2, "Left": { "Column": { "Expression": { "SourceRef": { "Source": "v" } }, "Property": "ADMIN_DATE" } }, "Right": { "DateSpan": { "Expression": { "Literal": { "Value": "datetime'2020-12-14T00:00:00'" } }, "TimeUnit": 5 } } } }, "Right": { "Comparison": { "ComparisonKind": 4, "Left": { "Column": { "Expression": { "SourceRef": { "Source": "v" } }, "Property": "ADMIN_DATE" } }, "Right": { "DateSpan": { "Expression": { "Literal": { "Value": "datetime'2021-06-30T00:00:00'" } }, "TimeUnit": 5 } } } } } } }] }, "Binding": { "Primary": { "Groupings": [{ "Projections": [0, 1, 2] }] }, "DataReduction": { "DataVolume": 4, "Primary": { "Sample": {} } }, "Version": 1 } } }] }, "CacheKey": "{\"Commands\":[{\"SemanticQueryDataShapeCommand\":{\"Query\":{\"Version\":2,\"From\":[{\"Name\":\"v\",\"Entity\":\"V_Vaccine_Data\",\"Type\":0}],\"Select\":[{\"Column\":{\"Expression\":{\"SourceRef\":{\"Source\":\"v\"}},\"Property\":\"ADMIN_DATE\"},\"Name\":\"V_Vaccine_Data.ADMIN_DATE\"},{\"Measure\":{\"Expression\":{\"SourceRef\":{\"Source\":\"v\"}},\"Property\":\"FullyVaccinated\"},\"Name\":\"V_Vaccine_Data.FullyVaccinated\"},{\"Measure\":{\"Expression\":{\"SourceRef\":{\"Source\":\"v\"}},\"Property\":\"At Least One Dose\"},\"Name\":\"V_Vaccine_Data.At Least One Dose\"}],\"Where\":[{\"Condition\":{\"And\":{\"Left\":{\"Comparison\":{\"ComparisonKind\":2,\"Left\":{\"Column\":{\"Expression\":{\"SourceRef\":{\"Source\":\"v\"}},\"Property\":\"ADMIN_DATE\"}},\"Right\":{\"DateSpan\":{\"Expression\":{\"Literal\":{\"Value\":\"datetime'2020-12-14T00:00:00'\"}},\"TimeUnit\":5}}}},\"Right\":{\"Comparison\":{\"ComparisonKind\":4,\"Left\":{\"Column\":{\"Expression\":{\"SourceRef\":{\"Source\":\"v\"}},\"Property\":\"ADMIN_DATE\"}},\"Right\":{\"DateSpan\":{\"Expression\":{\"Literal\":{\"Value\":\"datetime'2021-06-30T00:00:00'\"}},\"TimeUnit\":5}}}}}}}]},\"Binding\":{\"Primary\":{\"Groupings\":[{\"Projections\":[0,1,2]}]},\"DataReduction\":{\"DataVolume\":4,\"Primary\":{\"Sample\":{}}},\"Version\":1}}}]}", "QueryId": "", "ApplicationContext": { "DatasetId": "aa215ad2-108a-4851-97fa-d8d6af046e5e", "Sources": [{ "ReportId": "174afba8-d59c-47ff-8b90-08d3b6a620db" }] } }], "cancelQueries": [], "modelId": 320004 }))
        // .redirects(0)
        .end((err, res) => {
            // console.log(res.body)
            res = JSON.parse(res.text)
            var dayVacObj = {
                "atLeastOneDose": null,
                "fullyVaccinated": null
            }

            for (i = 21; i < res.results[0].result.data.dsr.DS[0].PH[0].DM0.length; i++) {
                dayVacObj.atLeastOneDose = res.results[0].result.data.dsr.DS[0].PH[0].DM0[i].C[2]
                dayVacObj.fullyVaccinated = res.results[0].result.data.dsr.DS[0].PH[0].DM0[i].C[1]
                writeList.push(dayVacObj)
                dayVacObj = {
                    "fullyVaccinated": null,
                    "atLeastOneDose": null
                }
            }

            fs.writeFileSync('vaccineData.json', JSON.stringify(writeList), function (err) {
                if (err) console.log(err)
            })

        })


    puppeteer.launch({ headless: false, defaultViewport: null }).then(async function (browser) {
        const page = await browser.newPage();

        await page.goto(config.dailyLink)

        await page.waitForTimeout(5000)

        for (i = 0; i < 16; i++) { // press down 16 times to get to 1/4 - to start writing
            await page.waitForTimeout(150)
            page.keyboard.press('ArrowDown')
        }

        var writeData = fs.readFileSync('vaccineData.json', 'utf-8', (err, data) => {
            return data
        })
        writeData = JSON.parse(writeData)
        await page.waitForTimeout(500)
        for (i = 0; i < writeData.length; i++) {
            page.keyboard.press('ArrowRight')
            await page.waitForTimeout(100)
            page.keyboard.press('ArrowRight')
            await page.waitForTimeout(100)
            page.keyboard.type("" + (writeData[i].atLeastOneDose))
            await page.waitForTimeout(500)
            page.keyboard.press('ArrowRight')
            await page.waitForTimeout(100)
            page.keyboard.type("" + (writeData[i].fullyVaccinated))
            await page.waitForTimeout(500)
            page.keyboard.press('ArrowRight')
            await page.waitForTimeout(100)
            page.keyboard.press('ArrowDown')
            await page.waitForTimeout(100)
            page.keyboard.press('ArrowLeft')
            await page.waitForTimeout(100)
            page.keyboard.press('ArrowLeft')
            await page.waitForTimeout(100)
            page.keyboard.press('ArrowLeft')
            await page.waitForTimeout(100)
            page.keyboard.press('ArrowLeft')
            await page.waitForTimeout(100)
        }

        await browser.close();
    })
// });