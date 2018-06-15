# Firebase Functions

Note: all scripts below should be invoked in `/functions` dir

## Local launch

 * `npm start` - launches `localTrigger` file. Make sure that you have `./config/serviceAccountKey.json`. It can be obtained at `https://console.firebase.google.com/project/<your-project>/settings/serviceaccounts/adminsdk`. More details at `https://firebase.google.com/docs/admin/setup`

## Local testing
 * `npm test` - launch tests with mocha.
 * `npm run coverage` - launch tests with nyc (istanbul) coverage report

## Changing Firebase project
The only project-related file is `./config/serviceAccountKey.json`.
