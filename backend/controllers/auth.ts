import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { username, password, role } = req.body;

  const userExists = await User.findOne({ where: { username } });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, password: hashedPassword, role });

  return res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  return res.json({ token, id: user.id, username: user.username, role: user.role });
};
