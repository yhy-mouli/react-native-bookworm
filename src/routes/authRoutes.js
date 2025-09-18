import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const generateToken = (userId) => {
    return jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "15d"});
}

router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are requiredppp" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 Carachters long" });
        }

        if(username.length < 3){
            return res.status(400).json({ message: "Username should be at least 3 Carachters long"});
        }

        // Check if user alreadey exist
        const existingemail = await User.findOne({ email });
        if(existingemail){
            return res.status(400).json({message : "Email already exist!!!"});
        }
        // Check if the username exist
        const existingUsername = await User.findOne({ username });
        if(existingUsername){
            return res.status(400).json({message : "Username already exist!!!"});
        }
        

        // Get random profile Image
        const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
        const user = new User({
            username,
            email, 
            password,
            profileImage,
        });

        await user.save();
        const token = generateToken(user._id);

        res.status(201).json({
            token,
            user : {
                _id : user._id,
                username : user.username,
                email : user.email,
                profileImage : user.profileImage,
            }
        });

    } catch (error) {
        console.log("Error in the register route", error);
        res.status(500).json({ message: "Internal server error"});
    }
})

router.post("/login", async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || ! password){
            return res.status(400).json({message : "All Field are required !!!"});
        }

        //Check if the user exist
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({message : "User does not exist ^-^"});
        }
        // Is Password Correct
        const isPasswordCorrect = await user.comparePassword(password);
        if(!isPasswordCorrect){
            return res.status(400).json({message : "Incorrect Password -<>-"});
        }
        // Generate Token
        const token = generateToken(user._id);

        // Send user
        res.status(201).json({
            token,
            user : {
                id : user._id,
                username : user.username,
                email : user.email,
                profileImage : user.profileImage,
            }
        });

    } catch (error) {
        console.log("error in login route", error);
        res.status(500).json({message : "Internal Server Error"});
    }
});


export default router;