[![Build Status](https://travis-ci.org/Brainenjii/achievements.svg?branch=develop)](https://travis-ci.org/Brainenjii/achievements)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

## Local launch

 * git clone https://github.com/NUS-ALSET/achievements.git achievements-dev
 * cd achievements-dev
 * npm install
 * npm start

## Local testing
 * npm test
 * npm run coverage

## Deployment notes
Use one of options to select approach for fetching users' achievements:
 * `firebase functions:config:set profiles.refresh-approach=trigger` - for processing requests by firebase database trigger function
 * `firebase functions:config:set profiles.refresh-approach=queue` - for processing requests by firebase queue
 * `firebase functions:config:set profiles.refresh-approach=none` - for disabling any processing requests

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.


### `firebase deploy`

Deploys the app and security rules to firebase. <br>

### `npm test`

Runs mocha tests for services and sagas

### `npm run coverage`

Runs mocha tests with coverage report
