import express from "express"
import validateToken from "@helpers/auth/validateToken"
import { getSites, uploadSite } from "@controllers/sites.controller"

const router = express.Router()

router.get("/page=:page&category=:category", getSites)
router.post("/", validateToken, uploadSite)

export default router
