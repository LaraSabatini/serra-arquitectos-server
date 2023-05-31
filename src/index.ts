import express, { Express } from "express"
import config from "@config/index"
import fileUpload from "express-fileupload"
import bodyParser from "body-parser"
import cors from "cors"
import auth from "@routes/auth"
import files from "@routes/fileManagement"
import sites from "@routes/sites"

const app: Express = express()
// settings
const port = 8000

// middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://serra-arquitectos-qa.vercel.app",
    ],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Auth-Token"],
    exposedHeaders: ["Content-Type", "Auth-Token"],
  }),
)

app.use(fileUpload())
app.use(express.static("files"))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

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
