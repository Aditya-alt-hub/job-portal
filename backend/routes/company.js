import express from "express";
import auth from "../middlewares/auth.js";
import { authorizeRoles } from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";
import { getCompany, getCompanyById, registerCompany, updateCompany } from "../controllers/company.js";

const router=express.Router();

router.route("/register").post(auth,authorizeRoles("recruiter"),registerCompany);
router.route("/getCompany").get(auth,getCompany);
router.route("/get/:id").get(auth,getCompanyById);
router.route("/update/:id").put(auth,authorizeRoles("recruiter"),singleUpload,updateCompany);

export default router;