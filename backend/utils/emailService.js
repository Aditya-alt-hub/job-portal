

// import nodemailer from "nodemailer";

// import dotenv from "dotenv";

// dotenv.config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// transporter.verify((err, success) => {
//   if (err) {
//     console.log("SMTP ERROR:", err);
//   } else {
//     console.log("SMTP READY");
//   }
// });

// export const sendEmail = async ({ to, subject, html }) => {
//   try {
//     console.log("Sending email to:", to);

//     const info = await transporter.sendMail({
//       from: `"Job Portal" <${process.env.EMAIL_USER}>`,
//       to,
//       subject,
//       html,
//     });

//     console.log(" Email sent:", info.response);
//   } catch (error) {
//     console.log("Email error message:", error.message);
// console.log("Email error code:", error.code);
// console.log("Email response:", error.response);
// console.log("Full error:", error);
//   }
// };



import { Resend } from "resend";

import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: "Job Portal <onboarding@resend.dev>",
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT:", data);
  } catch (error) {
    console.log("EMAIL FAILED:", error);
  }
};

