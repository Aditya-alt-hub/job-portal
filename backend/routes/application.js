import express from"express";
import auth from "../middlewares/auth.js";
import { admingetApplicants, applicationStatus, getJobAppllied, jobApply } from "../controllers/application.js";

const router=express.Router();

router.route("/jobApply/:id").get(auth,jobApply);
router.route("/jobApplied").get(auth,getJobAppllied);
router.route("/:id/applicants").get(auth,admingetApplicants);
router.route("/status/:id/update").post(auth,applicationStatus);

export default router;