import mongoose from "mongoose";

const applecationSchema=new mongoose.Schema(
   {
    job:
    {
        type:mongoose.Schema.Types.ObjectId,ref:"Job",
        required:true,
    },
    applicant:
    {
        type:mongoose.Schema.Types.ObjectId,ref:"User",
        required:true,
    },
    status:
    {
        type:String,
        enum:["Applied","shortlisted","Rejected"],
        default:"Applied",
    },
   },
   {
    timestamps:true,
   }
);

export const Application=mongoose.model("Application",applecationSchema);