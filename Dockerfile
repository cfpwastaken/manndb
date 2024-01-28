FROM oven/bun

WORKDIR /app

COPY package.json /app/package.json

RUN bun install

COPY . /app

RUN bun run build -d

EXPOSE 3000

CMD ["node", "./build/index.js"]