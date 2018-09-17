#!/bin/bash
rules=""
functions=""
for file in $(git diff --name-only $TRAVIS_COMMIT_RANGE)
do
  if [[ $file =~ ^database\.rules\.json$ ]]; then
    rules=",database"
    echo "database will be deployed"
  fi
  if [[ $file =~ ^functions.* ]]; then
    functions=",functions"
    echo "functions will be deployed"
  fi
done

firebase deploy --token "$FIREBASE_SECRET" --project "achievements-dev" --only hosting$rules$functions