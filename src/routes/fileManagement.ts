import express from "express"
import validateToken from "@helpers/auth/validateToken"
import {
  uploadFiles,
  getFile,
  deleteFile,
  createFolder,
} from "@controllers/fileManagement.controller"

const router = express.Router()

router.post("/folderName=:folderName", validateToken, uploadFiles)

router.post("/new-folder", validateToken, createFolder)

router.get(
  "/folderName=:folderName&file_name=:file_name&file_extension=:file_extension",
  validateToken,
  getFile,
)

router.delete("/route=:route", validateToken, deleteFile)

export default router
