import express from "express"
import {v4 as uuid} from "uuid"

import dotenv from "dotenv"
dotenv.config()
import {mail,generateOTP} from "../../utils/mail.js"
import {encryptData} from "../../middleware/auth.js"

import {errorvalidation,login,register,verifyOTP} from "../../validator/validator.js"

import bcrypt from "bcrypt"
const router = express.Router()

import {readDB,writeDB,deleteDB} from "../../utils/helper.js"



router.post("/register",register,errorvalidation,async(req,res)=>{
    try {
        let DB = await readDB()
        let {name,age,phone,email,password} = req.body 
        let duplicate = DB.find(x => x.email === email)

        if(duplicate){ 
            return res.status(400).json({msg:"User already exist please login "})
                
        }
        if (age < 18){
           return  res.status(400).json({msg: "You are under age "})
        }
       let bpas= await bcrypt.hash(password,10)

       let OTP = generateOTP()
       let newUser = {
        id: uuid(),
        name:
        age,
        email,
        phone ,
        password :bpas,
        OTP,
        isverified: false,
        task : [],
        accountCreatedAt: new Date().toISOString()
       }
       DB.push(newUser)
       await writeDB(DB)
       await mail(name,email,OTP)
       res.status(200).json({msg:"User registered Successfully"})
    } catch (error) {
        console.log(error);
        res.status(401).json({msg:"Bad Request"})
    }
})



// read , user = email OTP not user not otp delete otp verified true


router.post("/verifyOTP", verifyOTP, errorvalidation , async(req,res)=>{
  try {
        let DB = await readDB()
        let {email,OTP} = req.body
        let user = DB.find(x=> x.email == email )
        if(!user){
            return res.status(400).json({msg:"User not found Please register"})
        }
        if(OTP != user.OTP ){
            return res.status(400).json({msg:"Please Enter Valid OTP"})
        }

        delete user.OTP 
        user.isverified = true 
        await writeDB(DB)
        res.status(200).json({msg: "User Successfully verified"})
  } catch (error) {
    console.log(error);
    res.status(400).json({msg:error})
  }  
})

// login
// read email pass call mysecretkey from env find user by email 



router.post("/login",async (req, res) => {
  try {
    let existingData = await readDB();
    let { email, password } = req.body;
    let mySecretKey = process.env.SECRETKEY;

  
    let user = existingData.find((x) => x.email === email);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    let passMatch = await bcrypt.compare(password, user.password);

    if (!passMatch) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    let token = await encryptData(
      { id: user.id, email: user.email, name: user.name },
      mySecretKey
    );

    return res
      .status(200)
      .json({ msg: "Login successful", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error", error });
  }
});



export default router

