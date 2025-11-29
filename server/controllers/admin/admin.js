import { readDB, writeDB } from "../../utils/helper.js";

async function ban(email)
{
    try {
        let DB = await readDB();
        let banUser = DB.find((x)=> x.email === email);
        banUser.isFrozen = true;
        await writeDB(DB);
        setTimeout(async ()=>{
            console.log("one minute has passed");
            banUser.isFrozen = false;
            banUser.cnt = 0;
            await writeDB(DB);
        }, 10000);
    } catch (error) {
        console.log(error);
    }
}

export default ban;