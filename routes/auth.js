import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/User.js";

//Register or Signup
export const signup = async(req,res)=>{
    try {
        const {firstname, lastname, email, password} = req.body;
        let user = await User.findOne({email:req.body.email});
        if(user)
        {res.status(400).json({error:"The user already exists"});}
        else{
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password,salt);
    
            const newUser = new User({
                firstname,
                lastname,
                email,
                password:passwordHash
            });
    
            const savedUser = await newUser.save();
            res.status(201).json(savedUser);
        }

       
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//Login
export const login = async(req,res)=>{
   
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email:email});
        if(!user) res.staus(400).json({msg:'User not found'});
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) res.status(400).json({msg:'Incorrect password'});
        const token = jwt.sign({id:user.id}, process.env.JWT_SECRET);
        delete user.password;  //Check the response in the frontend that password is visible or not
        res.status(200).json({token,user});
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
