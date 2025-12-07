import express from "express"
import type { Request, Response } from "express";

import {v4 as uuid} from "uuid"

import dotenv from "dotenv"
dotenv.config()
import {mail,generateOTP} from "../../utils/mail"
import encryptData from "../../middleware/auth"
import ban from "../admin/admin"

import {errorvalidation,login,register,verifyOTP} from "../../validator/validator"

import bcrypt from "bcrypt"
const router = express.Router()

import {readDB,writeDB,deleteDB} from "../../utils/helper"



router.post("/register",register,errorvalidation,async(req:Request,res:Response)=>{
    try {
        let DB = await readDB()
        let {name,age,phone,email,password} = req.body 
        let duplicate = DB.find((x:any) => x.email === email)

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
        name,
        age,
        email,
        phone ,
        password :bpas,
        OTP,
        isverified: false,
        task : [],
        accountCreatedAt: new Date().toISOString(),
        isFrozen: false,
        cnt: 0
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


router.post("/verifyOTP", verifyOTP, errorvalidation , async(req:Request,res:Response)=>{
  try {
        let DB = await readDB()
        let {email,OTP} = req.body
        let user = DB.find((x:any)=> x.email == email )
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

  
    let user = existingData.find((x:any) => x.email === email);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    if(user.isFrozen)
    {
      return res.status(404).json({msg: `Your account has been frozen. Please try logging in again in 5 minutes`});
    }
    let passMatch = await bcrypt.compare(password, user.password);
    if (!passMatch) {
       user.cnt += 1 ;
      await writeDB(existingData)
      if(user.cnt == 5)
        {
          await ban(user.email);
          return res.status(404).json({msg:"Too many invalid attempts! Please try again later."})
        }
        return res.status(401).json({ msg: "Invalid password" });
    }
    let token = await encryptData(
      { id: user.id, email: user.email, name: user.name },
      mySecretKey, "1D"
    );
    await writeDB(existingData)
     res
      .status(200)
      .json({ msg: "Login successful", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error", error });
  }
});





// forget password api 
router.post("/forget",async (req,res)=>{
  try {
    let DB = await readDB()
     let name = req.body.name
     let email = req.body.email
     let matchuser = DB.find((x:any) => x.email == req.body.email)
     let OTP = generateOTP()
     await mail(name,email,OTP)
     matchuser.OTP = OTP 
    await  writeDB(DB)


     
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})
  }
})



// forget user otp 
router.post("/forgetOTP",async (req,res)=>{
  try {
     let DB = await readDB()
     let OTP = req.body.OTP 
     let email = req.body.email 
     let matchuser = DB.find((x:any) => x.email === email)
     
     if(matchuser.OTP !== OTP){
       return res.status(200).json({msg : "Andhe sahi se OTP likh"})
       
      }
    
      let payload = {
        email : matchuser.email,
        id: matchuser.id
      }
    let token = await encryptData(payload,process.env.SECRETKEY,300)
     res.status(200).json({msg : `Please use this token to update your password in update user API. \n This token is only valid for next 5 minutes,`,token : token })

     delete matchuser.OTP 
     await writeDB(DB)


     
    
  } catch (error) {
    console.log(error);
    res.status(500).json({msg:error})
  }
})




export default router

