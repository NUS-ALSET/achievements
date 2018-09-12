#!/bin/bash

cd functions;
firebase deploy --project "achievements-dev" --token $FIREBASE_SECRET --except functions;
