/**
 * Initializes a suite of tests to run in Selenium.
 * This script should be kicked off in the context of Mocha for the tests to run.
 */

"use strict";
// npm install selenium-webdriver
const SeleniumWebdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const edge = require('selenium-webdriver/edge');
const safari = require('selenium-webdriver/safari');
const chai = require('chai');
const chaiWebdriver = require('chai-webdriver');
const chromeDriver = require('chromedriver');
const Config = require('./Config');

// detect platform-specific stuff
const isWin = /^win/.test(process.platform);
const isMac = /^darwin/.test(process.platform);
const driverFileExt = isWin ? '.exe' : isMac ? '' : '';
const platformRareFoilEditionBrowser = isWin ? 'edge' : isMac ? 'safari' : null;

const drivers = {};
const args = [];

// set default browser to test with here
let browsersToTest = ['chrome'];

/*
if (process.argv.length > 2) {
	for (let i = 2; i < process.argv.length; i++) {
	  if (process.argv[i] === 'firefox') {
	    args.psuh('geckodriver');
    } else {
      args.push(process.argv[i]);
    }
	}
}
*/

args.forEach(a => {
	if (a === 'all') {
		browsersToTest = ['chrome', 'firefox'];
		if (platformRareFoilEditionBrowser) {
			browsersToTest.push(platformRareFoilEditionBrowser);
		}
	} else {
		browsersToTest.push(a);
	}
});

// TODO: check args whether to run the tests on production
// Config.server = 'localhost:3333';

browsersToTest.forEach(browser => {
  drivers[browser] = new SeleniumWebdriver.Builder()
    .forBrowser(browser)
    .build();
});

for (let d in drivers) {
	runTests(drivers[d]);
}

/**
 *
 * @param {SeleniumWebdriver} driver the interface to the browser
 */
function runTests(driver) {
  Config.driver = driver;
  chai.use(chaiWebdriver(driver));
  require('./test/HomePageTests');
  require('./test/ContactPageTests');
  require('./test/InstitutionsPageTests');
}

after(function() {
  Config.driver.quit();
});
