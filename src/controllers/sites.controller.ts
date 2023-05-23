import { Request, Response } from "express"
import { ResultSetHeader } from "mysql2"
import ISite from "@interfaces/Site"
import pool from "@database/index"
import config from "@config/index"
import { getOffset } from "@helpers/pagination"
import responses from "@config/responses"

const getSites = async (req: Request, res: Response) => {
  try {
    const { page, category } = req.params
    const offset = getOffset(config.listPerPage, parseInt(page, 10))

    const [sites]: any = await pool.query(
      `SELECT * FROM sites WHERE type = '${category}' ORDER BY id DESC LIMIT ${offset},${config.listPerPage}`,
    )

    const [amountOfPages] = await pool.query(`SELECT COUNT(*) FROM sites`)

    if (sites) {
      const rowData: ResultSetHeader = amountOfPages as ResultSetHeader

      const meta = {
        page,
        totalPages: parseInt(Object.keys(rowData)[0], 10),
      }

      return res.status(responses.OK.status).json({
        data: sites,
        meta,
        status: responses.OK.status,
      })
    }
  } catch (error) {
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  }
}

const uploadSite = async (req: Request, res: Response) => {
  try {
    const {
      code,
      year,
      principal,
      type,
      location,
      tasks,
      description,
      size,
      images,
    }: ISite = req.body

    const [createSite] = await pool.query(
      "INSERT INTO sites (code,year,principal,type,location,tasks,description,size,images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [code, year, principal, type, location, tasks, description, size, images],
    )

    const rowData: ResultSetHeader = createSite as ResultSetHeader

    if (rowData.affectedRows === 0) {
      return res
        .status(responses.INTERNAL_SERVER_ERROR.status)
        .json(responses.INTERNAL_SERVER_ERROR)
    }
    return res.status(responses.CREATED.status).json(responses.CREATED)
  } catch (error) {
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  }
}

export { getSites, uploadSite }
