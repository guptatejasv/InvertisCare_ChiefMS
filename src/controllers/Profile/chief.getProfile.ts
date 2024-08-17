import { Request, Response } from "express";
import { Chief } from "../../model/official.Chief";

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const checkUser = await Chief.findById(userId);
    if (checkUser) {
      if (checkUser.isDeleted == true || checkUser.isBlocked == true) {
        return res.status(400).json({
          status: "fail",
          message:
            "You can not get your profile, Your account is deleted or block!",
        });
      }
    }
    const user = await Chief.findById(userId).select(
      "-password -_id -updatedAt"
    );
    console.log(user);
    res.status(200).json({
      status: "success",
      user,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err || "An error occurred while getting Profile.",
    });
  }
};
