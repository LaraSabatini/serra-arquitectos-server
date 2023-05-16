import fs from "fs"
import path from "path"
import responses from "@config/responses"

const uploadFiles = async (req: any, res: any) => {
  const { file }: any = req.files

  const filepath = path.resolve(__dirname, "..", "files", file.name)

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
  const options = {
    root: "http://localhost:8000/api/files",
  }

  const fileName = req.params.file_name
  const fileExtension = req.params.file_extension

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

export { uploadFiles, getFile, deleteFile }
