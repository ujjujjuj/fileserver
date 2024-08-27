import type { Request, Response, NextFunction } from "express"

export default (errView: string) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.username) {
      return res.render(errView, { error: "forbidden" })
    }
    next()
  }
