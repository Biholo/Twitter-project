FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

## Expose the port from the .env file
EXPOSE ${PORT}

CMD ["npm", "start"]