import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
  // ? sender
  const transporter = nodemailer.createTransport({
    host: "localhost",
    service: "gmail",
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  //   ? reciver
  if (html) {
    const info = await transporter.sendMail({
      from: `e commerce app c41 test <${process.env.EMAIL}>`,
      to,
      subject,
      html,
    });
  } else {
    const info = await transporter.sendMail({
      from: `e commerce app c41 test <${process.env.EMAIL}>`,
      to,
      subject,
      attachments,
    });
  }

  // if (info.rejected.length > 0) {
  //   return false;
  // }

  return true;
};
