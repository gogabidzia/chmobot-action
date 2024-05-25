#!/bin/sh -l

echo "Hello $GITHUB_REPOSITORY with token $GITHUB_TOKEN"
ls -al
echo "time=$time" >> $GITHUB_OUTPUT