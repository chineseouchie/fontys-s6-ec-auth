FROM node:16-alpine
WORKDIR /app
COPY package.json .

ARG NODE_ENV
# RUN if [ "$NODE_ENV" = "development" ]; \
# 	then npm install; \
# 	else npm install --only=production; \
# 	fi
RUN npm install
COPY . ./
RUN npm run build
EXPOSE 3001
CMD ["node", "dist/index.js"]
