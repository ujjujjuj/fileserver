import { Router } from "express"
import { loginUser } from "../controllers/auth"

const router = Router()

router.get("/login", (_, res) => {
  res.render("login")
})

router.post("/login", loginUser)

export default router
