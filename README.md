# Test Snyk patch

Testing patch to https-proxy-agent via mixpanel dependency

## Expected behaviour
Snyk CLI should apply https-proxy-agent patch [SNYK-JS-HTTPSPROXYAGENT-469131](https://snyk.io/vuln/SNYK-JS-HTTPSPROXYAGENT-469131) ([2.2.1](https://snyk-rules-pre-repository.s3.amazonaws.com/snapshots/master/patches/npm/https-proxy-agent/20190929/https-proxy-agent_0_0_20190929.patch)) modifying the original file to include fix rows and not include vulnerable rows

## Actual behaviour
https-proxy-agent/index.js is identical to source after running `snyk protect`

## Steps to reproduce
- Clone this repo
- Prepare `npm i`
- Protect `npm run snyk-protect`
- * Vulnerable module and patch file should be downloaded automagically
- Test `npm t`

Further details about the test prerequisite and expectations available within the test file

> Please disregard boilerplate files, they're made for my own (in)sanity
