import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";
import { Student } from "../../model/student.user";
import Notification from "../../model/student.notificaitons";
import { transporter } from "../../helper/nodemailer";
import { HOD } from "../../model/official.HOD";
import { Dean } from "../../model/official.deans";
import { Chief } from "../../model/official.Chief";
import HODNotification from "../../model/hod.notifications";
import DeanNotification from "../../model/dean.notifications";
export const reviewComplaint = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const compId = req.params.id;
    const complaint = await Complaint.findById(compId)
      .populate({ path: "assignedTo", model: HOD })
      .populate({ path: "escalatedToDean", model: Dean })
      .exec();

    if (complaint) {
      if (!complaint.escalatedToChief) {
        return res.status(203).json({
          status: "fail",
          message: "You are not autherized to access this Compalint.",
        });
      }
      if (complaint.escalatedToChief) {
        if (complaint.escalatedToChief.toString() !== userId) {
          return res.status(203).json({
            status: "fail",
            message: "You are not autherized to access this Compalint.",
          });
        }
      }
    }
    const chief = await Chief.findById(userId);
    if (!complaint) {
      return res.status(400).json({
        status: "fail",
        message: "Complaint with this id does not exist..",
      });
    }
    if (complaint) {
      const student = await Student.findById(complaint.studentRefId);
      if (student) {
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: student.email,
          subject: "InvertisCare: Complaint Reviewed",
          text: `Your Complaint with ${compId} at InvertisCare is Opened by ${chief?.name}(${chief?.designation}).\nPlease keep checking your mail for future updates.`,
        });
      }
    }
    await HODNotification.create({
      HODId: complaint.assignedTo.toString(),
      message: `The Complaint with ${compId} at InvertisCare is Opened by ${chief?.name}(${chief?.designation})`,
      type: "Complaint Update",
    });
    await DeanNotification.create({
      DeanId: complaint.escalatedToDean,
      message: `The Complaint with ${compId} at InvertisCare is Opened by ${chief?.name}(${chief?.designation})`,
      type: "Complaint Update",
    });
    await Notification.create({
      studentRefId: complaint.studentRefId,
      message: `Your Complaint with ${compId} at InvertisCare is Opened by ${chief?.name}(${chief?.designation})`,
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
