import * as dotenv from "dotenv"

dotenv.config()

const config = {
  NODE_ENV: process.env.NODE_ENV || "development",
  HOST: process.env.HOST || "localhost",
  PORT: process.env.PORT || 8000,
  DB: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
  },
  MAIL_HOST: process.env.MAIL_HOST,
  MAIL_PASS: process.env.MAIL_PASS,
  EMAIL: process.env.EMAIL,
  SECRET_TOKEN: process.env.SECRET_TOKEN,
  FRONT_URL: process.env.FRONT_URL,
  listPerPage: 25,
}

export default config
