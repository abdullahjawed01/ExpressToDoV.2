
import fs from "fs/promises"

let DB = "/home/abdullah/ExpressToDoV.2/server/db.json"


async function readDB() {
    let userData = await fs.readFile(DB,"utf-8")
    return JSON.parse(userData)
}

async function writeDB(content:any) {
    await fs.writeFile(DB,JSON.stringify(content,null,2))
}

async function deleteDB(file:any, content:any) {
    await fs.writeFile(file, JSON.stringify(content, null, 4))
    console.log("Content Deleted")
}



export {readDB,writeDB,deleteDB}


