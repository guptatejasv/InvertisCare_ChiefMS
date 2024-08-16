import { Router } from "express";
import { ChiefRegister } from "../controllers/Authentication/chief.register";

const router = Router();
router.post("/chief/register", ChiefRegister);
export default router;
