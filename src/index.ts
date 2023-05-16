import express, { Express } from "express"
import config from "@config/index"
import auth from "@routes/auth"
import files from "@routes/fileManagement"
import sites from "@routes/sites"

const app: Express = express()
// settings
const port = 8000

// middlewares
app.use(express.json())

// routes
app.use("/api/auth", auth)
app.use("/api/files", files)
app.use("/api/sites", sites)

app.get("/api", (_req, res) => {
  res.json({ message: "OK" })
})

app.listen(port, () => {
  console.log(`listening on port ${config.PORT}`)
})
