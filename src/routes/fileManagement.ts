import express from "express"
import {
  uploadFiles,
  getFile,
  deleteFile,
} from "@controllers/fileManagement.controller"

const router = express.Router()

router.post("/", uploadFiles)

router.get("/file_name=:file_name&file_extension=:file_extension", getFile)

router.delete("/route=:route", deleteFile)

export default router
