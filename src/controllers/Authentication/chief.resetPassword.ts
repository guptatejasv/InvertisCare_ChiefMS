import { Request, Response } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
import { sign } from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { Chief } from "../../model/official.Chief";
import { transporter } from "../../helper/nodemailer";
dotenv.config();

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const hashedtoken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");
    const chief = await Chief.findOne({
      passwordResetToken: hashedtoken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!chief) {
      return res.status(400).json({
        status: "fail",
        message: "Token is invalid or expired",
      });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    chief.password = hashedPassword;
    chief.passwordResetToken = undefined;
    chief.passwordResetExpires = undefined;
    await chief.save({ validateBeforeSave: false });
    const secret = process.env.JWT_SECRET as string;
    const token = sign({ id: chief._id }, secret, {
      expiresIn: "90d",
    });
    // localStorage.setItem("authToken", token);
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: chief.email,
      subject: "InvertisCare: Password Changed Successfully!",
      text: "Your Password at InvertisCare Portal has been changed successfully!",
    });
    res.status(200).json({
      status: "success",
      message: "Password changed successfully!",
      token,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
