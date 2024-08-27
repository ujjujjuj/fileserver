import "dotenv/config"
import express from "express"
import session from "express-session"
import crypto from "crypto"
import fileUpload from "express-fileupload"

import authRouter from "./routes/auth"
import uploadRouter from "./routes/upload"
import db from "./db"

const app = express()
const port = process.env.PORT || 8080

app.set("view engine", "pug")
app.set("env", process.env.NODE_ENV)
app.disable("x-powered-by")

const sess: session.SessionOptions = {
  secret: "test",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false, maxAge: 1000 * 60 * 5 },
}

if (app.get("env") === "production") {
  app.set("trust proxy", 1)
  sess.secret = crypto.randomBytes(16).toString("hex")
  sess.cookie!.secure = true
}

app.use(session(sess))
app.use(express.static("public"))
app.use(express.urlencoded({ extended: false }))
app.use(
  fileUpload({
    limits: { fileSize: 32 * 1024 * 1024 },
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
)

app.use("/", authRouter)
app.use("/", uploadRouter)

app.get("/", async (req, res) => {
  const files = db.data.files.map((file) => file.name)
  res.render("index", { files, isAdmin: !!req.session.username })
})

app.get("/:filename", (req, res, next) => {
  const file = db.data.files.find((file) => file.name === req.params.filename)
  if (file) {
    res.type(file.mime)
    res.sendFile(`./uploads/${file.hash}`, { root: __dirname })
    return
  }
  next()
})

app.all("*", (_, res) => {
  res.sendFile("/var/www/html/index.html")
})

app.listen(port, () => {
  console.log(`Listening on port ${port}...`)
})
