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
      `SELECT * FROM sites WHERE type LIKE '%${category}%' AND images NOT LIKE '[]' ORDER BY id DESC LIMIT ${offset},${config.listPerPage}`,
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

const getSiteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const [site]: any = await pool.query(
      `SELECT * FROM sites WHERE id = '${id}'`,
    )

    if (site) {
      return res.status(responses.OK.status).json({
        data: site,
        status: responses.OK.status,
      })
    }
  } catch (error) {
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  }
}

const getSitesForCarousel = async (_req: Request, res: Response) => {
  try {
    const [sites]: any = await pool.query(
      `SELECT id, title, type, images FROM sites ORDER BY id DESC LIMIT 0,5`,
    )

    if (sites) {
      return res.status(responses.OK.status).json({
        data: sites,
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
      title,
      code,
      year,
      principal,
      type,
      location,
      tasks,
      description,
      size,
      images,
      otherFields,
    }: ISite = req.body

    const [createSite] = await pool.query(
      "INSERT INTO sites (title, code, year, principal, type, location, tasks, description, size, images, otherFields) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        title,
        code,
        year,
        principal,
        type,
        location,
        tasks,
        description,
        size,
        images,
        otherFields,
      ],
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
      .json({ ...responses.INTERNAL_SERVER_ERROR, error })
  }
}

const getSiteByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params

    const [site]: any = await pool.query(
      `SELECT * FROM sites WHERE code LIKE '${code}'`,
    )

    if (site) {
      return res.status(responses.OK.status).json({
        data: site,
        status: responses.OK.status,
      })
    }
  } catch (error) {
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  }
}

const editSite = async (req: Request, res: Response) => {
  try {
    const {
      id,
      title,
      code,
      year,
      principal,
      type,
      location,
      tasks,
      description,
      size,
      images,
      otherFields,
    }: ISite = req.body

    const [updateSite]: any = await pool.query(
      "UPDATE sites SET title = ?, code = ?, year = ?, principal = ?, type = ?, location = ?, tasks = ?, description = ?, size = ?, images = ?, otherFields = ? WHERE id = ?",
      [
        title,
        code,
        year,
        principal,
        type,
        location,
        tasks,
        description,
        size,
        images,
        otherFields,
        id,
      ],
    )

    const rowData: ResultSetHeader = updateSite as ResultSetHeader

    if (rowData.affectedRows === 0) {
      return res
        .status(responses.INTERNAL_SERVER_ERROR.status)
        .json(responses.INTERNAL_SERVER_ERROR)
    }
    return res.status(responses.CREATED.status).json(responses.CREATED)
  } catch (error) {
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json({ ...responses.INTERNAL_SERVER_ERROR, error })
  }
}

export {
  getSites,
  uploadSite,
  getSitesForCarousel,
  getSiteById,
  getSiteByCode,
  editSite,
}
