
import fs from 'fs/promises';
import path from 'path';

const dataPath = path.join(__dirname, '../data/users.json');

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
}


export const readJSONFile = async (): Promise<User[]> => {
  try {
    const data = await fs.readFile(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users.json:', error);
    return [];
  }
};

export const writeJSONFile = async (data: User[]): Promise<void> => {
  try {
    await fs.writeFile(dataPath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing users.json:', error);
  }
};

export const getAllUsers = async (): Promise<User[]> => {
  return await readJSONFile();
};

export const getUserById = async (id: string): Promise<User | undefined> => {
  const users = await readJSONFile();
  return users.find(user => user.id === id);
};

export const addUser = async (user: User): Promise<void> => {
  const users = await readJSONFile();
  users.push(user);
  await writeJSONFile(users);
};

export const updateUser = async (id: string, updatedUser: Partial<User>): Promise<boolean> => {
  const users = await readJSONFile();
  const index = users.findIndex(user => user.id === id);
  if (index !== -1) {
    users[index] = { ...users[index], ...updatedUser };
    await writeJSONFile(users);
    return true;
  }
  return false;
};


export const deleteUser = async (id: string): Promise<void> => {
  const users = await readJSONFile();
  const filteredUsers = users.filter(user => user.id !== id);
  await writeJSONFile(filteredUsers);
};
