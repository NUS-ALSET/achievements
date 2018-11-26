# Firebase Quickstarts for Node.js

A collection of quickstart samples demonstrating the Firebase APIs using the Node.js Admin SDK. For more information, see https://firebase.google.com.

# Realtime Database emulator quickstart

Let's try writing some simple tests for our security rules.

## Setup

### Install Node dependencies

Run `npm install` from this directory.

### Running the emulator

Make sure you've Opted-in to the emulator beta:
```
// firebase --open-sesame emulators
firebase setup:emulators:database
```
Start the database emulator **(and leave it running during the tests!!!)**
```
firebase serve --only database
```
## npm script commands

```
  "scripts": {
    "start": "firebase setup:emulators:database && firebase serve --only database",
    "test": "mocha ./emulatorTest.js",
    "coverage": "node ./run_coverage_report.js"
  },
```

## Running the tests

To run the tests, execute
```
npm test
```
which runs all the tests in the `tests/` directory. At
the beginning, you should see 3 tests pass and 1 tests fail.

```
  profile read rules
    ✓ should allow anyone to read profiles
    1) should only allow users to modify their own profiles

  room creation
    ✓ should require the user creating a room to be its owner

  room members
    ✓ must be added by the room owner


  3 passing
  1 failing
```

## Making the tests pass

The tests fail because they expect the rules to block unauthorized writes to a location. To fix
this, go to the database.rules.json and uncomment the rule on line 6:

```
".write": "auth.uid == $userId"
```

If we re-run the tests now, they should all pass.
```
npm test
```

should give you output like
```
  profile read rules
    ✓ should allow anyone to read profiles
    ✓ should only allow users to modify their own profiles

  room creation
    ✓ should require the user creating a room to be its owner

  room members
    ✓ must be added by the room owner


  4 passing
```

### Generate test reports

After running a suite of tests, you can access test coverage reports that show how each of your security rules was evaluated. To get the reports, query an exposed endpoint on the emulator while it's running. For a browser-friendly version, use the following URL:

```html
http://localhost:9000/.inspect/coverage?ns=<database_name>
```

### Visualize the html's uncovered nodes

**added this CSS change to highlight the untested portions of the rules:**
```css
span[title=""] {
  background-color: yellow;
}
```

**Searching for `"Values":[{` will show you how many rules do have results.**

### see the coverage_report in CLI

```
node ./run_coverage_report.js
```

```bash
Fetching data
747 'covered rules'
908 'uncovered rules'
45.14 percent coverage
```
