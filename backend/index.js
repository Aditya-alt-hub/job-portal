import dotenv from "dotenv";
dotenv.config({});
import { sendEmail } from "./utils/emailService.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoute from "./routes/user.js";
import companyRoute from "./routes/company.js";
import jobRoute from "./routes/job.js";
import applicationRoute from "./routes/application.js";

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

const app= express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
const corsOptions=
{
    origin:['http://localhost:5173',
      "https://talent-trellis-fe.lovable.app"
    ],
    credentials:true,
}
app.use(cors(corsOptions));


const PORT=process.env.PORT||3000;

//apis 

app.use("/api/v1/user",userRoute);
// "http://localhost:8000/register"
// "http://localhost:8000/login"
// "http://localhost:8000/profile/update"

app.use("/api/v1/company",companyRoute);

app.use("/api/v1/job",jobRoute);

app.use("/api/v1/application",applicationRoute);

app.get("/test-email", async (req, res) => {
  await sendEmail({
    to: "adityabhadauria63@gmail.com",
    subject: "Test Email",
    html: "<h1>Email working from Job Portal</h1>",
  });

  res.send("Email sent");
});


app.listen(PORT,()=>
{
    connectDB();
    console.log(`Server running at ${PORT}`);
})