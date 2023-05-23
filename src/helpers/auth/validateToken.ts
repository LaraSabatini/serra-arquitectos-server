import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import responses from "@config/responses"
import config from "@config/index"

const validateToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.header("auth-token")
    if (!token) {
      return res
        .status(responses.UNAUTHORIZED.status)
        .json(responses.UNAUTHORIZED)
    }
    jwt.verify(token, config.SECRET_TOKEN || "token")
    next()
  } catch (e) {
    return res
      .status(responses.UNAUTHORIZED.status)
      .json(responses.UNAUTHORIZED)
  }
}

export default validateToken
