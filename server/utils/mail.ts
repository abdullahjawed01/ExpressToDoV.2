
import mailer from "nodemailer"
import dotenv from "dotenv"
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), "../.env"),
});
// let dotenv = "/home/abdullah/ExpressTODoV.1/server/.env"







async function mail(name:string,email:any,OTP:any){
    try {
        let userEmail = process.env.EMAIL 
        let password = process.env.PASS
        
        let userDetails = await mailer.createTransport({
            service: "gmail",
            auth: {
                user: userEmail,
                pass: password,
            }
           
       

        })
        const sender = await userDetails.sendMail({
            from: userEmail,
            to: email,
            subject: `Hello  ${name} `,
            text: `Hello ${name} welcome aboard You have successfully logged In. Your OTP is ${OTP}`
        })

        console.log("Sent Mail",sender.messageId );




    } catch (error) {
        console.log(error);
    }
}



function generateOTP() {
  return (Math.floor(1000 + Math.random() * 9000));
}




export {mail,generateOTP}


