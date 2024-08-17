import { Request, Response } from "express";
import Complaint from "../../model/official.complaint";
import { Chief } from "../../model/official.Chief";
export const getComplaints = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const chief = await Chief.findById(userId);
    if (chief) {
      if (chief.role == "Chief") {
        const complaint = await Complaint.find({
          escalatedToChief: userId,
        });
        if (!complaint) {
          return res.status(400).json({
            status: "fail",
            message: "No Complaint does exist.",
          });
        }
        res.status(200).json({
          status: "success",
          results: complaint.length,
          complaint,
        });
      }
    } else {
      res.send("Something went wrong!");
    }
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
