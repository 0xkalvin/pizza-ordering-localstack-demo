FROM node:16-buster-slim

ARG NODE_ENV

RUN npm i npm@latest -g

RUN mkdir /app && chown node:node /app

WORKDIR /app

USER node

COPY --chown=node:node package.json package-lock.json* ./

RUN if [ "$NODE_ENV" != "production" ] ; \
    then \
        npm install; \
    else \
        npm ci --production; \
    fi

COPY --chown=node:node . .

CMD ["npm", "start"]
