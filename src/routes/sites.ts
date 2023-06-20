import express from "express"
import validateToken from "@helpers/auth/validateToken"
import {
  getSites,
  uploadSite,
  getSitesForCarousel,
  getSiteById,
  getSiteByCode,
  editSite,
  getAllSites,
} from "@controllers/sites.controller"

const router = express.Router()

router.get("/page=:page&category=:category", getSites)
router.get("/all", getAllSites)
router.get("/", getSitesForCarousel)
router.post("/", validateToken, uploadSite)
router.get("/id=:id", getSiteById)
router.get("/code=:code", getSiteByCode)
router.put("/", validateToken, editSite)

export default router
