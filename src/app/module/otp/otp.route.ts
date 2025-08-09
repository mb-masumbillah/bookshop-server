import { Router } from "express";
import { optController } from "./opt.controller";

const router = Router()

router.post('/send-otp', optController.sendOTP)

router.post('/resend-otp', optController.updateOtp)


export const optRoute = router