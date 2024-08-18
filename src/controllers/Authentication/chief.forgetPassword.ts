import { Request, Response } from "express";
import { Chief } from "../../model/official.Chief";
import crypto from "crypto";
import { transporter } from "../../helper/nodemailer";
import dotenv from "dotenv";
dotenv.config();

export const forgetPassword = async (req: Request, res: Response) => {
  try {
    const chief = await Chief.findOne({
      email: req.body.email,
    });
    if (!chief) {
      return res.status(400).json({
        status: "fail",
        message: "No user found",
      });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");

    chief.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    chief.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await chief.save({ validateBeforeSave: false });
    const resetURL = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/chief/resetPassword/${resetToken}`;
    const message = `Forgot your passsword? Please submit a PATCH request with a new Password to: ${resetURL}.\n If you don't forget the password please ignore this mail! `;
    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: chief.email,
        subject: "InvertisCare: Forget Password Mail",
        text: message,
      });
      res.status(200).json({
        status: "success",
        message: "Token sent to email!",
      });
    } catch (err) {
      chief.passwordResetToken = undefined;
      chief.passwordResetExpires = undefined;
      await chief.save();
      return res.status(400).json({
        status: "fail",
        message: err,
      });
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
