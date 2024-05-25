#!/bin/sh -l

echo "Hello $GITHUB_REPOSITORY with token $GITHUB_TOKEN"
echo "time=$time" >> $GITHUB_OUTPUT
