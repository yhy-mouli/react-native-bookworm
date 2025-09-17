import jwt from "jsonwebtoken";
import User from "../models/User.js";



const protectRoute = async (req, res, next)=>{
    try {
        //get Token
        const token = req.header("Authorization").replace("Bearer ", "");
        //verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        //find user
        const user = await User.findById(decoded.userId).select("-password");

        if(!user) return res.status(401).json({message : "Token not valid"});
        req.user = user;
        next()
    } catch (error) {
        console.error("Authentication error:", error.message);
        res.status(401).json({message : "Token is not valid"});
    }
}

export default protectRoute;