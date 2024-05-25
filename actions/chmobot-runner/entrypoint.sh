#!/bin/sh -l

git config --global --add safe.directory /github/workspace
git config user.email "905059+chmobot[bot]@users.noreply.github.com"
git config user.name "chmobot[bot]"

git checkout -b chmobot/iss-1

echo "New update 1" >> README.md

gh

echo "Done"