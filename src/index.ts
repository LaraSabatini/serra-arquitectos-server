import express, { Express } from "express"
import config from "@config/index"

const app: Express = express()
// settings
const port = 8000

// middlewares
app.use(express.json())

// routes
app.get("/", (_req, res) => {
  res.json({ message: "OK" })
})

app.listen(port, () => {
  console.log(`listening on port ${config.PORT}`)
})
