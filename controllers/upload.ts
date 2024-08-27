import type { Request, Response } from "express"
import db from "../db"
import fs from "fs/promises"
import { promisify } from "util"

export const uploadFile = async (req: Request, res: Response) => {
  if (!req.body.name) {
    return res.render("upload", { error: "no name provided" })
  }

  const file = req.files?.file
  if (!file || Array.isArray(file)) {
    return res.render("upload", { error: "no file" })
  }

  if (db.data.files.find((file) => file.name === req.body.name)) {
    return res.render("upload", { error: "file exists" })
  }

  const hasher = new Bun.CryptoHasher("sha256")
  hasher.update(file.data)
  const hash = hasher.digest("hex")

  await promisify(file.mv)(`./uploads/${hash}`)

  db.data.files.push({ name: req.body.name, hash, mime: file.mimetype })
  await db.write()

  return res.redirect(`/${req.body.name}`)
}

export const deleteFile = async (req: Request, res: Response) => {
  const dbFile = db.data.files.find((file) => file.name === req.params.file)
  if (!dbFile) {
    return res.render("delete", { error: "file not found" })
  }

  db.data.files = db.data.files.filter((file) => file.name != dbFile.name)
  await db.write()

  await fs.unlink(`./uploads/${dbFile.hash}`)

  return res.redirect("/")
}
