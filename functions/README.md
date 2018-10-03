# Firebase Functions

Note: all scripts below should be invoked in `/functions` directory

## Local launch

 * Obtain the **serviceAccountKey.json from Firebase console**
 * `npm install`
 * `npm start` - **launches `localTrigger` file.**
 
 _`localTrigger` is simple node app launched on some machineis for dev version. Prod version doesn't uses localTriggers and queue, and instead it uses database trigger. Dev version uses firebase plan that doesn't allow outside http requests. So, dev site's firebase functions can't help with requests to CodeCombat/AWS etc_
 
 ### More details on setting up local firebase functions from [Firebase-admin Docs](https://firebase.google.com/docs/admin/setup):
 - Log in the Firebase console
 - Navigate to "Service accounts" in Settings
 - Click the **Generate New Private** Key button at the bottom of the Firebase Admin SDK section of the Service Accounts tab.
 - After you click the button, a JSON file containing your service account's credentials will be downloaded. You'll need this to initialize the SDK in the next step.
 - Put the obtained JSON file (achievements-dev-firebase-adminskd-*key*.json) in `/functions/.config`
  
**Important**: This achievements-dev-firebase-adminskd-*key*.json file contains sensitive information, including your service account's private encryption key. **Keep it confidential and NEVER store it in a public repository.**

Once you have created a Firebase console project and downloaded a JSON file with your service account credentials, you can initialize the SDK with this code snippet:

```
var admin = require('firebase-admin');

var serviceAccount = require('path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://<DATABASE_NAME>.firebaseio.com'
});
```
  

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
