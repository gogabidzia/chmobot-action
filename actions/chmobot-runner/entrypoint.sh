#!/bin/sh -l

echo "Hello $GITHUB_REPOSITORY with token $GITHUB_TOKEN" >> $GITHUB_OUTPUT
echo "time=$time" >> $GITHUB_OUTPUT
