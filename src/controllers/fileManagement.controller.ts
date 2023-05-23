import fs from "fs"
import path from "path"
import responses from "@config/responses"

const createFolder = async (req: any, res: any) => {
  const { folderName } = req.body
  const directory = path.resolve(__dirname, "..", "files")

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  const newFolderPath = path.resolve(__dirname, "..", `files/${folderName}`)

  if (!fs.existsSync(newFolderPath)) {
    fs.mkdirSync(newFolderPath)
    res.status(responses.CREATED.status).json(responses.CREATED)
  } else {
    res.status(responses.CONFLICT.status).json(responses.CONFLICT)
  }
}

const deleteFolder = async (req: any, res: any) => {
  const { folderName } = req.params
  const folderPath = path.join(__dirname, "..", "files", folderName)

  if (fs.existsSync(folderPath)) {
    fs.rmdir(folderPath, { recursive: true }, err => {
      if (err) {
        res
          .status(responses.INTERNAL_SERVER_ERROR.status)
          .json(responses.INTERNAL_SERVER_ERROR)
      } else {
        res.status(responses.OK.status).json(responses.OK)
      }
    })
  } else {
    res.status(responses.NOT_FOUND.status).json(responses.NOT_FOUND)
  }
}

const uploadFiles = async (req: any, res: any) => {
  try {
    const files =
      req.files.files.length === undefined ? [req.files.files] : req.files.files
    const { folderName } = req.params

    let success = true
    for (const file of files) {
      const filepath = path.resolve(
        __dirname,
        "..",
        `files/${folderName}`,
        file.name,
      )

      file.mv(filepath, (err: any) => {
        if (err) {
          success = false
        }
        success = true
      })
    }
    if (!success)
      return res
        .status(responses.INTERNAL_SERVER_ERROR.status)
        .json(responses.INTERNAL_SERVER_ERROR)
    return res.status(responses.CREATED.status).json(responses.CREATED)
  } catch (error) {
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  }
}

const getFile = async (req: any, res: any, next: any) => {
  const { folderName, fileName, fileExtension } = req.params

  const options = {
    root: `http:localhost:8000/api/files/${folderName}`,
  }

  res.jsonFile(`${fileName}.${fileExtension}`, options, (err: any) => {
    if (err) {
      next(err)
    }
  })
}

const deleteFile = async (req: any, res: any) => {
  fs.unlink(req.params.route, error => {
    if (error) {
      res
        .status(responses.INTERNAL_SERVER_ERROR.status)
        .json(responses.INTERNAL_SERVER_ERROR)
    } else {
      res.status(responses.CREATED.status).json(responses.CREATED)
    }
  })
}

export { uploadFiles, getFile, deleteFile, createFolder, deleteFolder }
