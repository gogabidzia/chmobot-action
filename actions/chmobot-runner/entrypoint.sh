#!/bin/sh -l

git config --global --add safe.directory /github/workspace
git config user.email "905059+chmobot[bot]@users.noreply.github.com"
git config user.name "chmobot[bot]"

echo "Done" >> $GITHUB_OUTPUT