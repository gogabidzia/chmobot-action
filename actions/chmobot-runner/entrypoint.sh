#!/bin/sh -l

ISSUE_ID=$1
ISSUE_TITLE=$2
ISSUE_BODY=$3

echo $3

git config --global --add safe.directory /github/workspace
git config user.email "905059+chmobot[bot]@users.noreply.github.com"
git config user.name "chmobot[bot]"

git checkout -b chmobot/iss-$ISSUE_ID

ls -al

node /run.js $ISSUE_ID $ISSUE_TITLE $ISSUE_BODY

git_status_output=$(git status --porcelain)

# Check if the output is empty
if [ -z "$git_status_output" ]; then
    echo "No changes detected, exiting..."
    exit 0
fi

git add .
git commit -m "Bot x"
git push origin chmobot/iss-$ISSUE_ID

curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -d "{\"title\":\"Test\",\"body\":\"Test\",\"head\":\"chmobot/iss-$ISSUE_ID\",\"base\":\"main\"}" \
  "https://api.github.com/repos/$GITHUB_REPOSITORY/pulls"

echo "Done"