import fs from "fs"
import path from "path"
import responses from "@config/responses"

const createFolder = async (req: any, res: any) => {
  const { folderName } = req.body
  const directory = path.resolve(__dirname, "..", "files")
  console.log(directory)

  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory)
  }

  const newFolderPath = path.resolve(__dirname, "..", `files/${folderName}`)

  if (!fs.existsSync(newFolderPath)) {
    fs.mkdirSync(newFolderPath)
    res
      .status(200)
      .json({ message: `Folder '${folderName}' created successfully.` })
  } else {
    res.status(400).json({ message: `Folder '${folderName}' already exists.` })
  }
}

const uploadFiles = async (req: any, res: any) => {
  const { file }: any = req.files
  const { folderName } = req.params

  const filepath = path.resolve(
    __dirname,
    "..",
    `files/${folderName}`,
    file.name,
  )

  file.mv(filepath, (err: any) => {
    if (err) {
      res
        .status(responses.INTERNAL_SERVER_ERROR.status)
        .send(responses.INTERNAL_SERVER_ERROR)
    }
    res.status(responses.CREATED.status).send(responses.CREATED)
  })
}

const getFile = async (req: any, res: any, next: any) => {
  const { folderName, fileName, fileExtension } = req.params

  const options = {
    root: `http://localhost:8000/api/files/${folderName}`,
  }

  res.sendFile(`${fileName}.${fileExtension}`, options, (err: any) => {
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
        .send(responses.INTERNAL_SERVER_ERROR)
    } else {
      res.status(responses.CREATED.status).send(responses.CREATED)
    }
  })
}

export { uploadFiles, getFile, deleteFile, createFolder }
