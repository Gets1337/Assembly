FROM node:18

WORKDIR /app

COPY package.json ./

RUN rm -rf node_modules package-lock.json

RUN npm install

COPY prisma ./prisma/

ENV DATABASE_URL="postgresql://user:example@postgres-db:5432/dbname?schema=public"

RUN npx prisma generate
RUN npx prisma migrate dev

COPY . .

RUN npm rebuild bcrypt --build-from-source

EXPOSE 3000

CMD ["npm", "run", "start"]