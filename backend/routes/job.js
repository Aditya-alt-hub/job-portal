import express from "express";
import auth from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/auth.js";
import { getadmin, getAllJobs, getJobsById, postJob } from "../controllers/job.js";

const router=express.Router();

router.route("/postJob").post(auth,authorizeRoles("recruiter"),postJob);
router.route("/getAllJobs").get(auth,getAllJobs);
router.route("/getJobsById/:id").get(getJobsById);
router.route("/getadmin").get(auth,authorizeRoles("recruiter"),getadmin);

export default router;