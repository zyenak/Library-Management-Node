import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { userModel } from '../models';
import { User } from '../models/user';

interface RegisterRequest extends Request {
  body: {
    username: string;
    password: string;
    role: 'admin' | 'user';
  };
}

interface LoginRequest extends Request {
  body: {
    username: string;
    password: string;
  };
}

export const register = async (req: RegisterRequest, res: Response): Promise<Response> => {
  const { username, password, role } = req.body;
  const users: User[] = await userModel.getAllUsers();
  const userExists = users.find(user => user.username === username);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = { id: Date.now().toString(), username, password: hashedPassword, role };
  await userModel.addUser(newUser);
  return res.status(201).json({ message: 'User registered successfully' });
};

export const login = async (req: LoginRequest, res: Response): Promise<Response> => {
  const { username, password } = req.body;
  const users: User[] = await userModel.getAllUsers();
  const user = users.find(user => user.username === username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role }, // Ensure role is included
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  return res.json({ token, id: user.id, username: user.username, role: user.role });
};
