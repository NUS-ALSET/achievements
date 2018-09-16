#!/bin/bash
rules=""
functions=""
for file in $(git diff --name-only $TRAVIS_COMMIT_RANGE)
do
  if [[ $file =~ ^database\.rules\.json$ ]]; then
    rules=",database"
  fi
  if [[ $file =~ ^functions.* ]]; then
    functions=",functions"
  fi
done

# FIREBASE_SECRET should be hidden by travis but renamed anyway. Should be
# renamed back if it'll become real deploy
echo firebase deploy --token "$FIREBASE_SECRET_1" --project "achievements-dev" --only hosting$rules$functions