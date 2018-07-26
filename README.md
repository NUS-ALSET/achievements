[![Build Status](https://travis-ci.org/NUS-ALSET/achievements.svg?branch=develop)](https://travis-ci.org/Brainenjii/achievements)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![Waffle.io - Columns and their card count](https://badge.waffle.io/NUS-ALSET/achievements.svg?columns=all)](https://waffle.io/NUS-ALSET/achievements)

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

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

### `firebase deploy`

Deploys the app and security rules to firebase. Specify your project id with `--project` flag

### `npm test`

Runs mocha tests for services and sagas

### `npm run coverage`

Runs mocha tests with coverage report

## Firebase functions
Go to [functions readme](./functions/README.md)

## Changing Firebase project
There are 3 project-related points:
 * `./src/achievementsApp/config.js` - replace `config` var with your project access config. It could be obtained at [firebase console](https://console.firebase.google.com/)
 * `.firebaserc` - just use your project name
 * `.travis.yml` - if you want add `travis` deployment just replace `project` field of `deploy` part

 If you're going to push back your changes to source repository, make sure that you restore default values before PR

## Code splitting notes

 Try to use *huge* react components with [`react-loadable`](https://github.com/jamiebuilds/react-loadable) package. E.g.:
  * [ReactAce](src/components/AceEditor) - detached component with all required imports
  * [Usage](src/components/problemViews/JupyterNotebook.js#L28) - using with `react-loadable`
