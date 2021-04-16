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


});

// })