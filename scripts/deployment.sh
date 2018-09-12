#!/bin/bash

firebase deploy --project "achievements-dev" --token $FIREBASE_SECRET --except functions;
