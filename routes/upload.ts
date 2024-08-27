import { Router } from "express"
import { uploadFile, deleteFile } from "../controllers/upload"
import isAdmin from "../middlware/isAdmin"

const router = Router()

router.get("/upload", (_, res) => {
  res.render("upload")
})

router.post("/upload", isAdmin("upload"), uploadFile)

router.get("/delete/*", (_, res) => {
  res.render("delete")
})

router.post("/delete/:file", isAdmin("delete"), deleteFile)

export default router
