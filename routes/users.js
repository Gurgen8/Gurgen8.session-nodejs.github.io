import express from "express";
import UsersController from "../controllers/UsersController";

const router = express.Router();

router.get('/', UsersController.index);

router.get('/login', UsersController.login);

router.post('/login', UsersController.loginPost);

router.get('/registration', UsersController.registration);
router.post('/registration', UsersController.registrationPost);

router.get('/profile', UsersController.profile);

// router.get('/list', UsersController.login);


export default router;
