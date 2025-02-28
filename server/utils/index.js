import mongoose from "mongoose";
import jwt from "jsonwebtoken";
 
const dbConnection = async () => {
    try{
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");

    }catch(error){
        console.log("DB error" + error);
       
    }
};


export default dbConnection;


export const createJWT = (res, userId) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, 
        {expiresIn: "1d",
        });
        res.cookie("token",token,{
            httpOnly: true,
            secure: process.env.NODE_ENV !== "development",
            sameSite: "strict",
            maxAge: 1000 * 60 * 60 * 24, // 1 day
        });
};