# CPS-COVID-19-Dashboard

An Unofficial COVID-19 Data Visualization Dashboard created for College Prep made using [Puppeteer](https://pptr.dev) and [Tableau](https://www.tableau.com/).

Please don't use this code as exemplars! This is absolute spaghetti. :( Check out my other repos for cleaner code.

# Build from source

## Environment Requirements
* Node.js - ^14.15.5 LTS
* NPM - ^7.5.2
* CLI

## Build Instructions

### Server
* Clone repo
* CD into repo dir, run `npm install` to install required dependencies
* If running on headless servers - modify line 15 in index.js to `const browser = await puppeteer.launch({ headless: true, defaultViewport: null });`
* To change the frequency of the script - Change `0 0 */1 * *` in line 1 of index.js to desired frequency. Syntax is CRON scheduler syntax.
* Run the code with `node .`

### Frontend Code
* Files in ./frontend

## Prebuilts
* Prebuilt versions of the server are not open to the public.
* You can find the implemented version of the service [here](https://sites.google.com/thecollegepreparatoryschool.org/unofficialcpscovid/home)

## Basic Usage
* Instructions on implemented site

## Features
* Graphical Visualization of College Prep's COVID-19 data, including testing and case datas for students & staff. 
* Side by side view of case data for CPS & Alameda County (Alameda Testing statistics visualization coming soon!)


## Contributors
* *AirFusion45* - Original Author

## License 
This Project is licensed under MIT License - see the LICENSE.md file for more details. The main points of the MIT License are:
  
  * This code can be used commercially
  * This code can be modified
  * This code can be distributed
  * This code can be used for private use
  * This code has no Liability
  * This code has no Warranty
  * When using this code, credit must be given to the author

## Privacy

* The server does not collect any data about the user
* Frontend website uses Google Analytics (Cookies, Beaconing, etc), for a detailed privacy policy, click [here](https://sites.google.com/thecollegepreparatoryschool.org/unofficialcpscovid/privacy)

## Open Source Libraries 
### Server
* [node-schedule](https://github.com/node-schedule/node-schedule)
* [Puppeteer](https://pptr.dev) - LICENSE in pupptrLicense.txt
* [superagent](https://github.com/visionmedia/superagent)
## Website
* [Materalize-CSS](https://github.com/Dogfalo/materialize)
* [Bootstrap](https://github.com/twbs/bootstrap)

## Contact Me
Feel free to contact me if you find bugs, license issues, missing credits, etc.

  * Please contact me here:
    * Email: jfang.cv.ca.us@gmail.com / yfang@college-prep.org
    * Discord: AirFusion#1706

## Note/Notes 
* The implemented website is accessible by College Prep students & staff only.
