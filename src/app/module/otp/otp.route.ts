import { Router } from "express";
import { optController } from "./opt.controller";

const router = Router()

router.post('/verify-otp', optController.otp)


export const optRoute = router