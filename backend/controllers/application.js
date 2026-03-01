import {Application} from "../models/application.js";
import {Job} from "../models/job.js";

export const jobApply = async (req,res)=>
{
    try
    {
        const userId=req.id;
        const jobId=req.params.id;
        if(!jobId)
        {
            return res.status(400).json(
                {
                    message:"Job id is required",
                    success:false,
                }
            );
        }
        //check if the user has already applied for the job or not 
        const exist=await Application.findOne({job:jobId,applicant:userId});
        if(exist)
        {
            return res.status(400).json(
                {
                    message:"You have already applied for this job",
                    success:false,
                }
            );
        }

        //check if job exist or not
        const job = await Job.findById(jobId);
        if(!job)
        {
            return res.status(404).json(
                {
                    message:"Job is not found",
                    success:false,
                }
            );
        }

        //user apply the job application
        const applyJob=await Application.create({
            job:jobId,
            applicant:userId,
        });
        job.applications.push(applyJob._id);
        await job.save();

        return res.status(200).json(
            {
                message:"job application is successfull",
                success:true,
            }
        );    
    }
    catch(error)
    {
        console.log(error);
    }
}

export const getJobAppllied=async (req,res)=>
{
    try
    {
        const userId=req.id;
        const application=await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:"job",
            options:{sort:{createdAt:-1}},

            populate:{
                path:"company",
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application)
        {
            return res.status(404).json(
                {
                    message:"not found",
                    success:false,
                }
            );
        }

        return res.status(200).json(
            {
                application,
                success:true,
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
}
export const admingetApplicants=async(req,res)=>
{
    try
    {
        const jobId=req.params.id;
        const job=await Job.findById(jobId).populate(
            {
                path:"applications",
                options:{sort:{createdAt:-1}},

                populate:{
                    path:"applicant",
                }
            }
        );
        if(!job)
        {
            return res.status(404).json(
                {
                    message:"Not found",
                    success:false,
                }
            );
        }
        return res.status(200).json(
            {
                job,
                success:true,
            }
        );

    }
    catch(error)
    {
        console.log(error);
    }
}

export const applicationStatus=async(req,res)=>
{
    try
    {
        const {status}=req.body;
        const applicationId=req.params.id;
        if(!status)
        {
            return res.status(400).json(
                {
                    message:"status is required",
                    success:false,
                }
            );
        }

        const application=await Application.findOne({_id:applicationId});
        if(!application)
        {
            return res.status(404).json(
                {
                    message:"Not found",
                    success:false,
                }
            );
        }

        //status updation
        application.status=status.toLowerCase();
        await application.save();

        return res.status(200).json(
            {
                message:"updated Successfully",
                success:true,
            }
        );
    }
    catch(error)
    {
        console.log(error);
    }
}