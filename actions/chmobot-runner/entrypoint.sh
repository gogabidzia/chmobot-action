#!/bin/sh -l

token = $2;
ls -al
git checkout -b chmobot/issue-1
echo "Done" >> $GITHUB_OUTPUT