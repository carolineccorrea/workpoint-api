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

const router = Router();

/* USER */
router.post("/user", handleController(CreateUserController));
router.post("/auth", new AuthUserController().handle);

router.post("/clockin", handleController(ClockInController));

router.post("/clockout", handleController(ClockOutController));

router.get("/record/list", handleController(ListUserClockRecordsController));

export { router };
