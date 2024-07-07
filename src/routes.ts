import { Router } from "express";
import 'reflect-metadata';

/* Controllers */
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { handleController } from "./controllers/protocols/HandleController";

const router = Router();

/* USER */
router.post("/user", handleController(CreateUserController));
router.post("/auth", new AuthUserController().handle);


export { router };
