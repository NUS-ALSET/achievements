# Tutorial to get a quick-start with Achievements development

## Demo Overview: 
- Go to https://achievements-dev.firebaseapp.com/#/cruddemo (url paramter is `cruddemo` for CRUDdemo).
- **Create part:** Click on the Button "Create value at /analytics/cruddemo in firebase".
- **Update part:** This will open a form for you to key in whatever value you want to `Create` or `Update` to `/analytics/CRUDdemo/<your-uid>` on our dev-site's Firebase database.
- After you have submitted the value, the database will create or update the value accordingly.
- **Read part:** The values under the `/analytics/CRUDdemo/` are displayed in the `=== user ID: stored data ===` list on the same page.
- You will notice your data being updated to the UI of the page in real-time (after some connection delay).
- **Delete part:** Your own data under your own user id can be deleted if you click on the `Delete my data` button.

### Step 1: Play with the CRUDdemo page
Log in to the app (only logged in user can write to the `/analytics/CRUDdemo/` node in our database. And try to create, read, update and delete your values following the overview above.

### Step 2: Create a new (hidden) route for this tutorial
Go to `/src/containers/IdeaLab` folder, and create your own folder to host your route component. 

Then go to `/src/containers/AppFrame/AppFrame.js` and add your route under the React-Router-dom's many `route`s:
```javascript
              <Switch>
                <Route component={HomeV2} exact path="(/|/home)" />
                <Route component={Admin} exact path="/admin" />
                <Route component={Courses} exact path="/courses" />
                  ...
                <Route component={CRUDdemo} exact path="/CRUDdemo" />
                <Route component={YOUR_COMPONENT} exact path="/YOUR_ROUTE" />
```

### Step 3: Set up some UI in your route component
Bare minimum should contain a form to create/update the data in Firebase, and some buttons to trigger various actions you want to have dispatched.

In CRUDdemo page, we re-used a very simple dialog modal from `/src/components/dialogs`, the `AddTextSolutionDialog.js`. This dialog will store the value and when clicked COMMIT will trigger the action in redux.


### Step 3: Design the actions in redux to Create/Update data
This is the action-creator that will dispatch the action `CREATE_TO_CRUD_DEMO` in the CRUDdemo page:
```javascript
// /src/containers/IdeaLab/actions.js
export const CREATE_TO_CRUD_DEMO = "CREATE_TO_CRUD_DEMO"

export const createToCRUDdemo = (solution) => ({
  type: CREATE_TO_CRUD_DEMO,
  solution
})
```

### Step 4: Saga watcher to watch for action "CREATE_TO_CRUD_DEMO"
Sagas will take care of the asynchronous actions like creating/updatig data on Firebase. In CRUDdemo example, the sagas are divided into **worker saga** and **watcher saga**. The file that sets up the sagas is `/src/containers/IdeaLab/sagas.js`.

To connect the route component to the Saga, you need to inject the Saga from your route to the main Saga helper:
```javascript
// /src/containers/IdeaLab/CRUDdemo.js
// inject saga to the main saga
sagaInjector.inject(sagas);
```

The watcher saga is setup to look out for any specified action, and bring in the worker saga to follow up with the actions:
```javascript
  // /src/containers/IdeaLab/actions.js
  // watcher saga
  function* watchCreateToCRUDdemo() {
    yield takeLatest(actions.CREATE_TO_CRUD_DEMO, handleCreateRequest);
  }
  
  // and this is the worker saga
  export function* handleCreateRequest(action) {
    // doing the actual work...
  }
}
```
### Step 5: Saga worker to `put` and `call`
`put` is Saga asking redux's `dispatch`. `call` is invoking a function, usually in our app, a utility-api-like function that connects to the Firebase.
```javascript
export function* handleCreateRequest(action) {
  try {
    yield put(notificationShow("Received the command to Create @ CRUDdemo node"))
    yield delay(APP_SETTING.defaultTimeout);
    // eslint-disable-next-line
    yield put(notificationShow(`will now write [${action.solution}] to \analytics\CRUDdemo node`))
    yield call(_CRUDdemoService.WriteToCRUDdemo, action.solution)
    yield put(actions.createValueSuccess())
    yield delay(APP_SETTING.defaultTimeout);
    yield put(notificationShow("Created successfully!!"))
  } catch (err) {
    yield put(notificationShow("Failed to create for CRUDdemo"));
    console.error("CRUDdemo error: ", err)
  }
}
```
This worker saga can also catch failed async actions and dispatch the notification action notifying us the error.

### Step 6: Build a Service to handle CRUD to Firebase
Sagas is where asynchronous actions are handled, and Sagas will `call` useful functions from `service` folder to actually do things with Firebase database.

For the `CRUDdemo` example, the service functions are defined in the `/src/services/CRUDdemo.js` file. The function that write to the `/analytics/CRUD` node of our Firebase backend is:
```javascript
  WriteToCRUDdemo(value) {
    if (!firebase.auth()) {
      throw new Error("Not logged in");
    }
    firebase
    .set(
      `/analytics/CRUDdemo/${firebase.auth().currentUser.uid}/`,
      value
    )
```

### Step 7: Database rules for Firebase real-time database
At this point, Firebase wil not allow you to just write any data to the database. That is because of the rules specified in the `database.rules.json`.

Usually any node in the database will ge guarded by:
```
".write": false,
".read": false
```

In order for us to write to the `/analytics/CRUDdemo/${firebase.auth().currentUser.uid}/`, we will update the firebase rules as followed:
```
    "analytics": {
      ".read": true,
      "CRUDdemo": {
        "$uidKey": {
          ".write": "auth.uid == $uidKey"
        }
      }
    },
```

The changes in the database.rules.json have to be merged to the dev repo for the Firebase cloud to take effect.

### Step 8: Connect Firebase data to Redux store

The libary that allows us to easily connect to the Firebase database and carry out the CRUD actions is:
```javascript
import { firebaseConnect } from "react-redux-firebase";
```

The connection to the Firebase database is via a web-socket, so users do not have to refresh or reload the page to see any update from the Firebase data.

We can tell the React component which slice of the Firebase database we want to connect to and listen for the real-time updates. For example, if we want to read the data under the Firebase node `/analytics/CRUDdemo`, the code in CRUDdemo is written as:
```javascript
  // /src/containers/IdeaLab/CRUDdemo.js
  firebaseConnect((ownProps, store) => {
    const firebaseAuth = store.getState().firebase.auth;
    return [
      {
        path: "/analytics/CRUDdemo",
        storeAs: "CRUDdemoData"
      }
    ]
```

The data retrieved from Firebase database is stored as `CRUDdemoData`, which is then passed to the Redux store:
```javascript
// /src/containers/IdeaLab/CRUDdemo.js
const mapStateToProps = state => ({
  ...
  CRUDdemoData: state.firebase.data.CRUDdemoData,
  ...
});
```

### Step 9: Read the data from Redux store






