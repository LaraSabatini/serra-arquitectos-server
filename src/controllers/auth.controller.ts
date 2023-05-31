import { Request, Response } from "express"
import { ResultSetHeader } from "mysql2"
import IUser from "@interfaces/User"
import pool from "@database/index"
import jwt from "jsonwebtoken"
import { encrypt, generatePassword, compare } from "@helpers/auth"
import sendEmail from "@helpers/sendEmail"
import config from "@config/index"
import responses from "@config/responses"

export const signUp = async (req: Request, res: Response) => {
  const { fullName, email }: IUser = req.body

  const password = generatePassword()
  const encryptedPassword = await encrypt(password)

  const newUser = { fullName, email }

  const token: string = jwt.sign(
    { user: newUser },
    config.SECRET_TOKEN || "token",
  )

  const [user]: any = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ])

  if (user.length)
    return res
      .status(responses.UNAUTHORIZED.status)
      .json(responses.UNAUTHORIZED)

  const [registerUser] = await pool.query(
    "INSERT INTO users (fullName, email, password, token) VALUES (?, ?, ?, ?)",
    [fullName, email, encryptedPassword, token],
  )

  const rowData: ResultSetHeader = registerUser as ResultSetHeader

  if (rowData.affectedRows === 0)
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  return sendEmail(
    [newUser.email],
    "Bienvenido a Serra Arquitectos",
    "signUp",
    {
      name: newUser.fullName,
      email: newUser.email,
      password: password,
      loginURL: "https://serra-arquitectos-qa.vercel.app/login",
    },
    res,
  )
}

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body

  const [user]: any = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ])

  const validatePassword =
    user.length > 0 ? await compare(password, user[0].password) : false

  if (!validatePassword)
    return res
      .status(responses.UNAUTHORIZED.status)
      .json(responses.UNAUTHORIZED)

  const token: string = jwt.sign(
    { user: { email, password } },
    config.SECRET_TOKEN || "token",
  )

  return res
    .header("auth-token", token)
    .status(responses.OK.status)
    .json(responses.OK)
}

export const changePassword = async (req: Request, res: Response) => {
  const { email, password, newPassword } = req.body
  const { encrypted } = req.params

  const [user]: any = await pool.query(
    "SELECT password, id FROM users WHERE email = ?",
    [email],
  )

  const validatePassword =
    encrypted === "false"
      ? await compare(password, user[0].password)
      : password === user[0].password

  if (!validatePassword)
    return res
      .status(responses.UNAUTHORIZED.status)
      .json(responses.UNAUTHORIZED)

  const encryptedNewPassword = await encrypt(newPassword)

  const [updateUser]: any = await pool.query(
    "UPDATE users SET password = ?  WHERE id = ?",
    [encryptedNewPassword, user[0].id],
  )

  const rowData: ResultSetHeader = updateUser as ResultSetHeader

  if (rowData.affectedRows === 0)
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  return res.status(responses.CREATED.status).json(responses.CREATED)
}

export const sendRestorePasswordEmail = async (req: any, res: any) => {
  try {
    const { recipients } = req.body

    const [user]: any = await pool.query(
      "SELECT password, id, fullName FROM users WHERE email = ?",
      [recipients[0]],
    )

    if (user.length > 0)
      return sendEmail(
        recipients,
        "Recuperación de contraseña",
        "restorePassword",
        {
          name: user[0].name,
          restoreURL: `https://serra-arquitectos-qa.vercel.app/login?restore_password=true&redirected=true&pass=${user[0].password}&id=${user[0].id}&email=${recipients[0]}`,
        },
        res,
      )
    return res.status(responses.NOT_FOUND.status).json(responses.NOT_FOUND)
  } catch (error) {
    return res
      .status(responses.INTERNAL_SERVER_ERROR.status)
      .json(responses.INTERNAL_SERVER_ERROR)
  }
}
