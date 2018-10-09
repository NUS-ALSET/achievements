#!/bin/bash
database=""
functions=""
for file in $(git diff --name-only $TRAVIS_COMMIT_RANGE)
do
  if [[ $file =~ ^database\.database\.json$ ]]; then
    database=",database"
  fi
  if [[ $file =~ ^functions.* ]]; then
    functions=",functions"
  fi
done

if [[ $# -eq 0 ]]; then
  echo "hosting will be deployed"
  firebase deploy --token "$FIREBASE_SECRET" --project "achievements-dev" --only hosting
  if [ -n "${database}" ]; then
    echo "database will be deployed"
    firebase deploy --token "$FIREBASE_SECRET" --project "achievements-dev" --only $database
  fi
  if [ -n "${functions}" ]; then
    echo "functions will be deployed"
    firebase deploy --token "$FIREBASE_SECRET" --project "achievements-dev" --only $functions
  fi
  exit 0;
fi
  echo "hosting$database$functions will be updated";

