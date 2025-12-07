import express from "express";
import type { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
// import nodemon  from "nodemon";

import userRouter from "./controllers/public/index"
import privateUser from "./controllers/private/user.js"
import middleware from "./middleware/auth.js";

const app = express();
const PORT = Number(process.env.PORT);

app.get("/", (req:Request, res:Response):void => {
  try {
    res.status(200).json({ msg: "hello this is cfi block code" });
  } catch (error:any) {
    console.log(error);
    res.status(500).json({ msg: error.message });
  }
});
app.use(express.json())
app.use("/users",userRouter)
app.use(middleware)
app.use("/private", privateUser); // privateUser is now a router

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});