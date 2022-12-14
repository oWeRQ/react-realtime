FROM node:lts
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["docker/run.sh"]
