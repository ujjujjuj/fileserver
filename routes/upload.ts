import { Router } from "express"
import { uploadFile, deleteFile } from "../controllers/upload"
import isAdmin from "../middlware/isAdmin"
import fileUpload from "express-fileupload"

const router = Router()

router.get("/upload", (_, res) => {
  res.render("upload")
})

router.post(
  "/upload",
  isAdmin("upload"),
  fileUpload({
    limits: { fileSize: 32 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  }),
  uploadFile
)

router.get("/delete/*", (_, res) => {
  res.render("delete")
})

router.post("/delete/:file", isAdmin("delete"), deleteFile)

export default router
