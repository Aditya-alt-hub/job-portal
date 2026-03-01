import express from "express";
import auth from "../middlewares/auth.js";
import { getadmin, getAllJobs, getJobsById, postJob } from "../controllers/job.js";

const router=express.Router();

router.route("/postJob").post(auth,postJob);
router.route("/getAllJobs").get(auth,getAllJobs);
router.route("/getJobsById/:id").get(auth,getJobsById);
router.route("/getadmin").get(auth,getadmin);

export default router;