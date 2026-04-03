import express from "express";
import {register, updateProfile} from "../controllers/user.js";
import {login} from "../controllers/user.js"
import {logout} from "../controllers/user.js";
import auth from "../middlewares/auth.js";
import { singleUpload } from "../middlewares/multer.js";

const router=express.Router();

router.route("/register").post(singleUpload,register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(auth,singleUpload,updateProfile);

export default router;