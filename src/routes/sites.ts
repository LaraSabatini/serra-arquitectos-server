import express from "express"
import validateToken from "@helpers/auth/validateToken"
import {
  getSites,
  uploadSite,
  getSitesForCarousel,
  getSiteById,
} from "@controllers/sites.controller"

const router = express.Router()

router.get("/page=:page&category=:category", getSites)
router.get("/", getSitesForCarousel)
router.post("/", validateToken, uploadSite)
router.get("/id=:id", getSiteById)

export default router
