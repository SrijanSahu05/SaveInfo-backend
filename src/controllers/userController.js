import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Function that register the user.
export async function RegisterUser(req, res) {
    const { name, email, password } = req.body;

    try{
        if(!name || !email || !password) {
            return res.status(400).json({ message: "Please enter all fields."});
        }

        const isUserExists = await User.findOne({ email });

        if(isUserExists){
            return res.status(400).json({ message: "User already exists."});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        if(user){
            const token = jwt.sign(
                {id: user._id},
                process.env.JWT_SECRET,
                { expiresIn: '30d' } //token expires in 30 days
            );

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

//Function to login to there account.
export async function LoginUser (req, res) {
    const { email, password } = req.body;

    try{
        if(!email || !password) {
            return res.status(400).json({ message: "Please enter all fields."});
        }

        const user = await User.findOne({ email });

        if(user && (await bcrypt.compare(password, user.password))){
            const token = jwt.sign(
                {id: user._id},
                process.env.JWT_SECRET,
                { expiresIn: '30d' }
            );

            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                token: token,
            });
        } else {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};