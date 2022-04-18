FROM node:16

WORKDIR /usr/src/app

COPY . .

ENV CI=true

# Change npm ci to npm install since we are going to be in development mode
RUN npm config set registry https://registry.npm.taobao.org \
    && npm ci

# npm start is the command to start the application in development mode
CMD ["npm", "start"]