import {} from "lowdb"
import { JSONFilePreset } from "lowdb/node"
import type { DbData } from "./types"

const db = await JSONFilePreset<DbData>("db.json", { files: [] })

export default db
