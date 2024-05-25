# Container image that runs your code
FROM node:18-alpine

WORKDIR /github/workspace

RUN apk add --no-cache git
RUN apk add --no-cache curl

COPY entrypoint.sh /entrypoint.sh

# Code file to execute when the docker container starts up (`entrypoint.sh`)
ENTRYPOINT ["/entrypoint.sh"]
