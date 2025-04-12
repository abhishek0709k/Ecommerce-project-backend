import Auth from "../models/auth.models.js";
import express from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const router = express.Router();

router.post("/register", async(req, res)=>{
    const { fullname, username, email, password } = req.body;
    if(!fullname){
        return res.json(401).json(new ApiError("Full name is required", 401))
    }
    if(!username){
        return res.json(401).json(new ApiError("username is required", 401))
    }
    if(!email){
        return res.json(401).json(new ApiError("email is required", 401))
    }
    if(!password){
        return res.json(401).json(new ApiError("password is required", 401))
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await Auth.create({
        fullname,
        username,
        password: hashedPassword,
        email
    })

    if(!newUser){
        return res.status(400).json(new ApiError("MongoDB Error", 400))
    }

    return res.status(200).json(new ApiResponse("User register successfully", 200, newUser))
})

router.post("/login", async(req, res)=>{
    const { username, password } = req.body; 
    if(!username){
        return res.status(401).json(new ApiError("Username is required", 401));
    }
    if(!password){
        return res.status(401).json(new ApiError("password is required", 401));
    }
    const existedUser = await Auth.findOne({ username })
    if(!existedUser){
        return res.status(401).json(new ApiError("User not found", 401))
    }

    const userPassword = await bcrypt.compare(password, existedUser.password)

    if(!userPassword){
        return res.status(401).json(new ApiError("Invalid password", 400))
    }

    const token = jwt.sign({ username }, process.env.JWT_SECRET);
    res.header("Authorization",`Bearer ${token}`)

    return res.status(200).json(new ApiResponse("LoggedIn successfully", 200, { token: token }))
})

export default router;