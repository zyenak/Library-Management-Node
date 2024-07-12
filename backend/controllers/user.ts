
import { Request, Response } from 'express';
import User from '../models/user';
import { omit } from 'lodash';
import bcrypt from 'bcryptjs';

interface AuthenticatedRequest extends Request {
  user?: { id: string; role: 'admin' | 'user' };
}


export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll();
    const usersWithoutPassword = users.map(user => omit(user.get(), ['password']));
    res.json(usersWithoutPassword);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);
    if (user) {
      const userWithoutPassword = omit(user.get(), ['password']);
      res.json(userWithoutPassword);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user by id:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const newUser = await User.create(req.body);
    const userWithoutPassword = omit(newUser.get(), ['password']);
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing' });
    return;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const validatePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  const { currentPassword } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(400).json({ message: 'User ID is missing' });
    return;
  }

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    } else {
      res.status(200).json({ message: 'Current password is correct' });
      return;
    }
  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

