import { Request, Response } from "express";
import { Chief } from "../../model/official.Chief";
import ChiefNotification from "../../model/chief.notifications";
export const readNotification = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id;
    const userId = req.user.id;
    const checkUser = await Chief.findById(userId);
    if (checkUser) {
      if (checkUser.isDeleted == true || checkUser.isBlocked == true) {
        return res.status(400).json({
          status: "fail",
          message:
            "You can not update your profile, Your account is deleted or block!",
        });
      }
    }
    const notificationCheck = await ChiefNotification.findById(notificationId);
    if (notificationCheck?.ChiefId.toString() !== userId) {
      return res.status(400).json({
        status: "fail",
        message: "You are not authorized to mark this notification as read..",
      });
    }
    const notification = await ChiefNotification.findById(notificationId);
    if (notification) {
      notification.read = true;
      await notification.save();
    }
    if (!notification) {
      return res.status(404).json({
        status: "fail",
        message: "Notification not found.",
      });
    }

    res.status(200).json({
      status: "success",
      message: "Notification marked as read.",
      data: notification,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};
