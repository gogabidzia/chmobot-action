#!/bin/sh -l

$GITHUB_TOKEN=$2

echo $GITHUB_TOKEN;
git config --global --add safe.directory /github/workspace
git config user.email "905059+chmobot[bot]@users.noreply.github.com"
git config user.name "chmobot[bot]"

git checkout -b chmobot/iss-3

ls -al

node /run.js

git status
git push origin chmobot/iss-3

curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d "{\"title\":\"Test\",\"body\":\"Test\",\"head\":\"chmobot/iss-3\",\"base\":\"main\"}" \
  "https://api.github.com/repos/$GITHUB_REPOSITORY/pulls"

echo "Done"