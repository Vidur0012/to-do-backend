import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import jwt from 'jsonwebtoken';
import { getDefaultUserRoleId } from '../utils/roleCache';

// Sign up new user
export const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user
        const user = await UserModel.create({
            email: email,
            password: password,
            role: await getDefaultUserRoleId()
        });

        // sign JWT token
        const token = jwt.sign(
            { userId: user._id, role: 'user' },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        // Return success response with token
        res.status(201).json({
            message: 'User signed up successfully',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Sign in existing user
export const signin = async (req: Request, res: Response) => {
    try {

        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email }).populate('role');
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role?.name },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Signin successful',
            token,
            user: {
                id: user._id,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
