FROM node
WORKDIR /app
COPY package.json .
RUN npm install -g npm@7.19.1
RUN npm install
COPY . .
EXPOSE 3000
EXPOSE 3001
CMD ["npm","start"]