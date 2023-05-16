import { Router } from "express"
import {
  signUp,
  signIn,
  changePassword,
  sendRestorePasswordEmail,
} from "@controllers/auth.controller"

const router = Router()

router.post("/signup", signUp)
router.post("/signin", signIn)
router.put("/change-password&encrypted=:encrypted", changePassword)
router.post("/restore-password", sendRestorePasswordEmail)

export default router
