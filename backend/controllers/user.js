import {User} from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//USER TO REGISTER FIRST
export const register = async(req,res)=>
{
    try
    {
        console.log(req.body);
        const{fullname,email,phoneNumber,password,role}=req.body;
        if(!fullname||!email||!phoneNumber||!password||!role)
        {
            return res.status(400).json({
                message:"SOMETHING IS MISSING",
                success:false,
            });
        };
        const file = req.file;
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);

        const user=await User.findOne({email}); //find user by email id;
        if(user)
        {
            return res.status(400).json(
                {
                    message: "USER ALREADY EXIST WITH THIS EMAIL ID",
                    success:false,
                }
            );
        }
        const hassedPassword=await bcrypt.hash(password,8);

        await User.create(
            {
                fullname,
                email,
                phoneNumber,
                password:hassedPassword,
                role,
                profile:{
                profilePhoto:cloudResponse.secure_url,
            }
            }
        );

        return res.status(201).json(
            {
                message:"ACCOUNT CREATED SUCCESSFULLY",
                success:true,
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
}

//NOW USER CAN LOGIN AFTER REGISTER 
export const login=async(req,res)=>
{
    try
    {
        const{email,password,role}=req.body;

        if(!email||!password||!role)
        {
            return res.status(400).json(
                {
                    message:"SOMETHING IS MISSING",
                    success:false,
                }
            );
        }
        let user=await User.findOne({email});

        if(!user)
        {
            return res.status(400).json(
                {
                    message:"INCORRECT EMAIL OR PASSWORD",
                    success:false,
                }
            );
        }
        const isPasswordMatch=await bcrypt.compare(password,user.password);
        if(!isPasswordMatch)
        {
            return res.status(400).json(
                {
                    message:"INCORRECT EMAIL OR PASSWORD",
                    success:false,
                }
            );
        }

        //check role is correct or not 
        if(role!=user.role)
        {
            return res.status(400).json(
                {
                    message:"ACCOUNT DOES NOT EXIST FOR CURRENT ROLE",
                    success:false,
                }
            );
        }

        const tokenData=
        {
            userId:user._id,
            //  role: user.role
            role: user.role.toLowerCase().trim()

        }
        const token= await jwt.sign(tokenData, process.env.SECRET_KEY,{expiresIn:"1d"});

        user=
        {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            phoneNumber:user.phoneNumber,
            role:user.role,
            profile:user.profile,
        }
        return res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpsOnly:true,secure: true,sameSite:"None"}).json(
            {
                message:`WELCOME BACK ${user.fullname}`,user,
                success:true,
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
}

//logout
export const logout=async(req,res)=>
{
    try
    {
        return res.status(200).cookie("token","",{maxAge:0}).json(
            {
                message:" logout Successfully",
                success:true,
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
}

export const updateProfile=async(req,res)=>
{
    try
    {
        const {fullname,email,phoneNumber,bio,skills}=req.body;
        const file=req.file;
        //    if(!fullname||!email||!phoneNumber||!bio||!skills)
        // {
        //     return res.status(400).json({
        //         message:"SOMETHING IS MISSING",
        //         success:false,
        //     });
        // };

        //cloudinary aayega idhar
        let cloudResponse;
        if(file){
              const fileUri = getDataUri(file);
         cloudResponse = await cloudinary.uploader.upload(fileUri.content,
            {
                resource_type:"raw"
            }
        );
        }
        // const fileUri = getDataUri(file);
        //  cloudResponse = await cloudinary.uploader.upload(fileUri.content,
        //     {
        //         resource_type:"raw"
        //     }
        // );

        //skills to be in array
        let skillsArray;
        if(skills)
        {
          skillsArray=skills.split(",");
        }
        const userId=req.id; //ye middleware authentication se aayega 
        let user=await User.findById(userId);

        if(!user)
        {
            return res.status(400).json(
                {
                    message:"User not found",
                    success:false,
                }
            );
        }

        //updating data
        if (fullname) user.fullname=fullname;
        if(email) user.email=email;
        if(phoneNumber) user.phoneNumber=phoneNumber;
        if(bio) user.profile.bio=bio;
        if(skills) user.profile.skills=skillsArray;

        //resume comes here later
          if(cloudResponse){
            user.profile.resume = cloudResponse.secure_url // save the cloudinary url
            user.profile.resumeOriginalName = file.originalname // Save the original file name
        }


        await user.save();

        user=
        {
            _id:user._id,
            fullname:user.fullname,
            email:user.email,
            role:user.role,
            profile:user.profile,
        }

        return res.status(200).json(
            {
                message:"Profile updated sucessfully",
                user,
                success:true,
            }
        );

    }
    catch(error)
    {
        console.log(error);
    }
}
// export const updateProfile = async (req, res) => {
//     try {
//         const userId = req.id;

//         const { fullname, email, phoneNumber, bio, skills } = req.body;

//         const updateData = {};

//         if (fullname) updateData.fullname = fullname;
//         if (email) updateData.email = email;
//         if (phoneNumber) updateData.phoneNumber = phoneNumber;

//         if (bio || skills) {
//             updateData.profile = {};
//             if (bio) updateData.profile.bio = bio;
//             if (skills) updateData.profile.skills = skills.split(",");
//         }

//         const user = await User.findByIdAndUpdate(
//             userId,
//             updateData,
//             {
//                 new: true,
//                 runValidators: false, //  VERY IMPORTANT
//             }
//         );

//         if (!user) {
//             return res.status(404).json({
//                 message: "User not found",
//                 success: false,
//             });
//         }

//         return res.status(200).json({
//             message: "Profile updated successfully",
//             success: true,
//             user: {
//                 _id: user._id,
//                 fullname: user.fullname,
//                 email: user.email,
//                 role: user.role,
//                 profile: user.profile,
//             },
//         });

//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({
//             message: "Profile update failed",
//             success: false,
//         });
//     }
// };
