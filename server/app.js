import express from "express";
import dotenv from "dotenv";
dotenv.config();
// import nodemon  from "nodemon";

import userRouter from "./controllers/public/index.js"
import privateUser from "./controllers/private/user.js"
import middleware from "./middleware/auth.js";

const app = express();
const PORT = process.env.PORT ;

app.get("/", (req, res) => {
  try {
    res.status(200).json({ msg: "hello this is cfi block code" });
  } catch (error) {
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