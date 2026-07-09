

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

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  // service: "gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((err) => {
  if (err) {
    console.log("SMTP VERIFY ERROR");
    console.log(err);
  } else {
    console.log("SMTP READY");
  }
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    console.log("Sending email to:", to);

    const info = await transporter.sendMail({
      from: `"Job Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("EMAIL SENT");
    console.log(info);

  } catch (err) {
    console.log("EMAIL FAILED");
    console.log(err);
  }
};

