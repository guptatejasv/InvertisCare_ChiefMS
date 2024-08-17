import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";
import { transporter } from "../../helper/nodemailer";
import { Student } from "../../model/student.user";
import { Chief } from "../../model/official.Chief";
import Notification from "../../model/student.notificaitons";
import HODNotification from "../../model/hod.notifications";
import DeanNotification from "../../model/dean.notifications";
import dotenv from "dotenv";
dotenv.config();
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const userId = req.user.id;
    const compId = req.params.id;
    const chief = await Chief.findById(userId);
    const complaint = await Complaint.findById(compId);
    if (complaint) {
      if (!complaint.escalatedToChief) {
        return res.status(203).json({
          status: "fail",
          message: "You are not autherized to access this Compalint.",
        });
      }

      if (complaint.escalatedToChief.toString() !== userId) {
        return res.status(203).json({
          status: "fail",
          message: "You are not autherized to access this Compalint.",
        });
      }
      complaint.status = status;
      await complaint.save();
    }

    const student = await Student.findById(complaint?.studentRefId);
    if (student) {
      if (status == "In progress") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Status Update",
          text: `Your Complaint with ${compId} at InvertisCare is updated by ${chief?.name}(${chief?.designation}) and changed status to "${status}".\nPlease keep checking your mail for future updates.`,
        });
      } else if (status == "Resolved") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Status Update",
          text: `Your Complaint with ${compId} at InvertisCare is updated by ${chief?.name}(${chief?.designation}) and changed status to "${status}".\nPlease keep checking your mail for future updates.`,
        });
      } else if (status == "Closed") {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Status Update",
          text: `Your Complaint with ${compId} at InvertisCare is updated by ${chief?.name}(${chief?.designation}) and changed status to "${status}".\nPlease keep checking your mail for future updates.`,
        });
      }
    }
    await Notification.create({
      studentRefId: complaint?.studentRefId.toString(),
      message: `Your Complaint with ${compId} at InvertisCare is updated by ${chief?.name}(${chief?.designation}).`,
      type: "Complaint Update",
    });
    await HODNotification.create({
      HODId: complaint?.assignedTo.toString(),
      message: `The Complaint with ${compId} at InvertisCare is updated by ${chief?.name}(${chief?.designation}).`,
      type: "Complaint Update",
    });
    await DeanNotification.create({
      DeanId: complaint?.escalatedToDean,
      message: `The Complaint with ${compId} at InvertisCare is updated by ${chief?.name}(${chief?.designation}).`,
      type: "Complaint Update",
    });
    res.status(200).json({
      status: "success",
      complaint,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
