import { Router } from "express";
import { ChiefRegister } from "../controllers/Authentication/chief.register";
import { login } from "../controllers/Authentication/chief.login";
import { verify_token } from "../helper/jwtVerify";
import { getProfile } from "../controllers/Profile/chief.getProfile";
import { updateProfile } from "../controllers/Profile/chief.updateProfile";
import { getNotifications } from "../controllers/Notifications/chief.getNotifications";
import { readNotification } from "../controllers/Notifications/chief.markReadNotification";
import { updateStatus } from "../controllers/Complaint/chief.updateStatus";
import { reviewComplaint } from "../controllers/Complaint/chief.reviewComplaint";
import { getComplaints } from "../controllers/Complaint/chief.getComplaints";
import { getComments } from "../controllers/Complaint/chief.getComments";
import { addComment } from "../controllers/Complaint/chief.addComment";
import { deleteComment } from "../controllers/Complaint/dean.deleteComment";
import { updateComment } from "../controllers/Complaint/dean.updateComment";
import { forgetPassword } from "../controllers/Authentication/chief.forgetPassword";
import { resetPassword } from "../controllers/Authentication/chief.resetPassword";

const router = Router();
router.post("/chief/register", ChiefRegister);
router.post("/chief/login", login);
router.post("/chief/forgetPassword", forgetPassword);
router.patch("/chief/resetPassword/:token", resetPassword);
router.get("/chief/getProfile", verify_token, getProfile);
router.get("/chief/updateProfile", verify_token, updateProfile);
router.get("/chief/getNotifications", verify_token, getNotifications);
router.patch("/chief/readNotification/:id", verify_token, readNotification);
router.patch("/chief/updateStatus/:id", verify_token, updateStatus);
router.get("/chief/reviewComplaint/:id", verify_token, reviewComplaint);
router.get("/chief/getComplaints", verify_token, getComplaints);
router.post("/chief/addComment/:id", verify_token, addComment);
router.get("/chief/getComments/:id", verify_token, getComments);
router.delete("/chief/deleteComment/:id", verify_token, deleteComment);
router.patch("/chief/updateComment/:id", verify_token, updateComment);
export default router;
