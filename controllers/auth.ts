import type { Request, Response } from "express"

export const loginUser = async (req: Request, res: Response) => {
  if (
    req.body.username === process.env.USERNAME &&
    req.body.password === process.env.PASSWORD
  ) {
    req.session.username = req.body.username
    res.redirect("/upload")
  } else {
    res.render("login", { error: "invalid credentials" })
  }
}
