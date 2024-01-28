FROM node

WORKDIR /app

COPY package.json /app/package.json

RUN npm install

COPY . /app

RUN npm run build

EXPOSE 3000

CMD ["node", "./build/index.js"]