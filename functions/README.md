# Firebase Functions

Note: all scripts below should be invoked in `/functions` dir

## Local launch

 * `npm start` - launches `localTrigger` file. Make sure that you have `./config/serviceAccountKey.json`. It can be obtained at `https://console.firebase.google.com/project/<your-project>/settings/serviceaccounts/adminsdk`. More details at `https://firebase.google.com/docs/admin/setup`

## Local testing
 * `npm test` - launch tests with mocha.
 * `npm run coverage` - launch tests with nyc (istanbul) coverage report

### Testing notes
There is mock for `firebase-admin`. It has field `refStub` for juggling `ref` results:
```
admin.refStub // <- stub for admin.database().ref
admin.refStub.returns({
  once: () => console.log("we are here");
}
```
Move your code from `./index.js` to `/src/<module>` to testing only function body, not `firebase-functions` trigger invokers.
You could check testing approach [here](src/__tests__/updateProfile.test.js)


## Changing Firebase project
The only project-related file is `./config/serviceAccountKey.json`.

## Outgoing HTTP Requests
Example of execution outgoing http requests:
```
http
  .get("http://google.com")
  .then(data => console.log(data))
  .catch(err => console.error(err));
```
