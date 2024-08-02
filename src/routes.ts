import { Router } from "express";
import 'reflect-metadata';

/* Controllers */
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { handleController } from "./controllers/protocols/HandleController";
import { ClockInController } from "./controllers/clockin/ClockInController";
import { ClockOutController } from "./controllers/clockout/ClockOutController";
import { ListUserClockRecordsController } from "./controllers/listClockRecords/listClockRecordController";
import { LunchBreakStartController } from "./controllers/lunchBreak/LunchBreakStartController";
import { LunchBreakEndController } from "./controllers/lunchEnd/LunchBreakEndController";
import { isAdmin } from "./middlewares/isAdmin";

const router = Router();

/* USER */
router.post("/user", handleController(CreateUserController));
router.post("/auth", handleController(AuthUserController));

router.post("/clockin", isAuthenticated, handleController(ClockInController));

router.post("/clockout", isAuthenticated, handleController(ClockOutController));

router.post("/lunchbreak/start", isAuthenticated, handleController(LunchBreakStartController));
router.post("/lunchbreak/end", isAuthenticated, handleController(LunchBreakEndController));

router.get("/record/list", isAuthenticated, handleController(ListUserClockRecordsController));

router.get('/admin-only', isAuthenticated, isAdmin, (req, res) => {
  res.send('Admin content');
});



export { router };
