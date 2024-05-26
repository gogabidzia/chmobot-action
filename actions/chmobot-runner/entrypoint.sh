#!/bin/sh -l

$ISSUE_TITLE = $1
$ISSUE_BODY = $2
$ISSUE_ID = $3

echo $1 $2 $3 $ISSUE_ID $ISSUE_TITLE $ISSUE_BODY

git config --global --add safe.directory /github/workspace
git config user.email "905059+chmobot[bot]@users.noreply.github.com"
git config user.name "chmobot[bot]"

git checkout -b chmobot/iss-$ISSUE_ID

ls -al

node /run.js $ISSUE_ID $ISSUE_TITLE $ISSUE_BODY

git status
git add .
git commit -m "Bot x"
git push origin chmobot/iss-$ISSUE_ID

curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d "{\"title\":\"Test\",\"body\":\"Test\",\"head\":\"chmobot/iss-3\",\"base\":\"main\"}" \
  "https://api.github.com/repos/$GITHUB_REPOSITORY/pulls"

echo "Done"