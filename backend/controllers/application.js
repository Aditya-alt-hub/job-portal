// import {Application} from "../models/application.js";
// import {Job} from "../models/job.js";

// export const jobApply = async (req,res)=>
// {
//     try
//     {
//         const userId=req.id;
//         const jobId=req.params.id;
//         if(!jobId)
//         {
//             return res.status(400).json(
//                 {
//                     message:"Job id is required",
//                     success:false,
//                 }
//             );
//         }
//         //check if the user has already applied for the job or not 
//         const exist=await Application.findOne({job:jobId,applicant:userId});
//         if(exist)
//         {
//             return res.status(400).json(
//                 {
//                     message:"You have already applied for this job",
//                     success:false,
//                 }
//             );
//         }

//         //check if job exist or not
//         const job = await Job.findById(jobId);
//         if(!job)
//         {
//             return res.status(404).json(
//                 {
//                     message:"Job is not found",
//                     success:false,
//                 }
//             );
//         }

//         //user apply the job application
//         const applyJob=await Application.create({
//             job:jobId,
//             applicant:userId,
//         });
//         job.applications.push(applyJob._id);
//         await job.save();

//         return res.status(200).json(
//             {
//                 message:"job application is successfull",
//                 success:true,
//             }
//         );    
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// }

// export const getJobAppllied=async (req,res)=>
// {
//     try
//     {
//         const userId=req.id;
//         const application=await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
//             path:"job",
//             options:{sort:{createdAt:-1}},

//             populate:{
//                 path:"company",
//                 options:{sort:{createdAt:-1}},
//             }
//         });
//         if(!application)
//         {
//             return res.status(404).json(
//                 {
//                     message:"not found",
//                     success:false,
//                 }
//             );
//         }

//         return res.status(200).json(
//             {
//                 application,
//                 success:true,
//             }
//         );
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// }
// export const admingetApplicants=async(req,res)=>
// {
//     try
//     {
//         const jobId=req.params.id;
//         const job=await Job.findById(jobId).populate(
//             {
//                 path:"applications",
//                 options:{sort:{createdAt:-1}},

//                 populate:{
//                     path:"applicant",
//                 }
//             }
//         );
//         if(!job)
//         {
//             return res.status(404).json(
//                 {
//                     message:"Not found",
//                     success:false,
//                 }
//             );
//         }
//         return res.status(200).json(
//             {
//                 job,
//                 success:true,
//             }
//         );

//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// }

// export const applicationStatus=async(req,res)=>
// {
//     try
//     {
//         const {status}=req.body;
//         const applicationId=req.params.id;
//         if(!status)
//         {
//             return res.status(400).json(
//                 {
//                     message:"status is required",
//                     success:false,
//                 }
//             );
//         }

//         const application=await Application.findOne({_id:applicationId});
//         if(!application)
//         {
//             return res.status(404).json(
//                 {
//                     message:"Not found",
//                     success:false,
//                 }
//             );
//         }

//         //status updation
//         application.status=status.toLowerCase();
//         await application.save();

//         return res.status(200).json(
//             {
//                 message:"updated Successfully",
//                 success:true,
//             }
//         );
//     }
//     catch(error)
//     {
//         console.log(error);
//     }
// }

import { Application } from "../models/application.js";
import { Job } from "../models/job.js";
import { User } from "../models/user.js";
import { sendEmail } from "../utils/emailService.js";


// ================= APPLY JOB =================
export const jobApply = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required",
        success: false,
      });
    }

    // Check already applied
    const exist = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (exist) {
      return res.status(400).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Check job exist
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job is not found",
        success: false,
      });
    }

    // Create application
    const applyJob = await Application.create({
      job: jobId,
      applicant: userId,
    });

    job.applications.push(applyJob._id);
    await job.save();

    // 🔥 Get applicant & recruiter
    const applicantUser = await User.findById(userId);
    const recruiterUser = await User.findById(job.created_by);

    // 1. Applicant confirmation email
    await sendEmail({
      to: applicantUser.email,
      subject: "Application Submitted Successfully",
      html: `
        <h3>Hello ${applicantUser.fullname}</h3>
        <p>You have successfully applied for <b>${job.title}</b>.</p>
        <p>We will notify you once the recruiter updates your status.</p>
      `,
    });

    // 2. Employer notification email
    if (recruiterUser?.email) {
      await sendEmail({
        to: recruiterUser.email,
        subject: "New Applicant for Your Job",
        html: `
          <h3>New Application Received</h3>
          <p>${applicantUser.fullname} has applied for <b>${job.title}</b>.</p>
        `,
      });
    }

    // 3. Admin alert
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "New Job Application Alert",
      html: `
        <p>${applicantUser.fullname} applied for <b>${job.title}</b>.</p>
      `,
    });

    return res.status(200).json({
      message: "Job application is successful",
      success: true,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};



// ================= GET APPLIED JOBS =================
export const getJobAppllied = async (req, res) => {
  try {
    const userId = req.id;

    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: { path: "company" },
      });

    return res.status(200).json({
      application,
      success: true,
    });

  } catch (error) {
    console.log(error);
  }
};



// ================= ADMIN GET APPLICANTS =================
export const admingetApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: { path: "applicant" },
    });

    if (!job) {
      return res.status(404).json({
        message: "Not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });

  } catch (error) {
    console.log(error);
  }
};



// ================= UPDATE APPLICATION STATUS =================
export const applicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;

    if (!status) {
      return res.status(400).json({
        message: "Status is required",
        success: false,
      });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        message: "Not found",
        success: false,
      });
    }

    // Update status (DO NOT use toLowerCase)
    application.status = status;
    await application.save();

    // 🔥 Get applicant & job
    const applicantUser = await User.findById(application.applicant);
    const job = await Job.findById(application.job);

    // 4. Status update email to applicant
    await sendEmail({
      to: applicantUser.email,
      subject: "Application Status Updated",
      html: `
        <h3>Hello ${applicantUser.fullname}</h3>
        <p>Your application for <b>${job.title}</b> is now <b>${status}</b>.</p>
      `,
    });

    //  Admin alert
    await sendEmail({
      to: process.env.ADMIN_EMAIL,
      subject: "Application Status Changed",
      html: `
        <p>${applicantUser.fullname}'s application for 
        <b>${job.title}</b> is now ${status}.</p>
      `,
    });

    return res.status(200).json({
      message: "Updated Successfully",
      success: true,
    });

  } catch (error) {
    console.log(error);
  }
};