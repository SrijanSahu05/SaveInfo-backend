import express from 'express';
import { LoginUser, RegisterUser } from '../controllers/userController.js';

const router = express.Router();

//Route to SignUp page.
router.post('/SignUp', RegisterUser);
//Route to Login page.
router.post('/LogIn', LoginUser);

export default router;