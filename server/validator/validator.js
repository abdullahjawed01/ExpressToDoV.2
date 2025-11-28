import { body,validationResult } from "express-validator";






const register = [
    body("name").trim()
                .notEmpty().withMessage("Name is required")
                .isAlpha().withMessage("Name is required")
                .isLength({min:3,max:25}).withMessage("Minimun 3 and maximum is 25 character"),

    body("age").trim()
                .notEmpty().withMessage("Age is required")
                .isInt({min:18,max:99}).withMessage("Integers only value"),
    body("phone").trim()
                 .notEmpty().withMessage("Phone is required")
                 .isMobilePhone().withMessage("Type error in phone number"),
                 
    body("password").trim()
                    .isLength({min:6}).withMessage("Password must be atleast 6 character long")
                    .notEmpty().withMessage("Please enter your password"),

    body("email").trim()
                 .notEmpty().withMessage("Email is empty")
                 .isEmail().withMessage("Please Enter proper email"),
]


const login = [
       body("email").trim()
                 .notEmpty().withMessage("Email is empty")
                 .isEmail().withMessage("Please Enter proper email"),

       body("password").trim()
                    .isLength({min:6}).withMessage("Password must be atleast 6 character long")
                    .notEmpty().withMessage("Please enter your password"),
        

]


const verifyOTP = [
     body("email").trim()
                 .notEmpty().withMessage("Email is empty")
                 .isEmail().withMessage("Please Enter proper email"),

      body("OTP").trim()
                .notEmpty().withMessage("OTP is required")
                .isLength({ min: 4, max: 4 }).withMessage("OTP must be 4 digits")
                .isNumeric().withMessage("OTP must contain only numbers"),
]



function errorvalidation(req,res,next){
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return res.status(400).json({
            errors: errors. array()
        })
    }
    next()
}

export {errorvalidation,login,register,verifyOTP}

