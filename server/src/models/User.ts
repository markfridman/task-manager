import { User, CreateUserDto } from '../types/user';
import { AppError } from '../types/error';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

export class UserModel {
  private static readonly usersFilePath = path.join(__dirname, '../../_mockDB/users.json');

  private static async getUsers(): Promise<User[]> {
    try {
      const data = await fs.readFile(this.usersFilePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      // If file doesn't exist, return empty array
      return [];
    }
  }

  private static async saveUsers(users: User[]): Promise<void> {
    await fs.writeFile(this.usersFilePath, JSON.stringify(users, null, 2));
  }

  static async findByEmail(email: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.email === email) || null;
  }

  static async findById(id: string): Promise<User | null> {
    const users = await this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  static async create(data: CreateUserDto): Promise<User> {
    const users = await this.getUsers();

    // Check if user already exists
    if (users.some(user => user.email === data.email)) {
      throw new AppError(400, 'Email already in use', 'EMAIL_EXISTS');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser: User = {
      id: uuidv4(),
      ...data,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    users.push(newUser);
    await this.saveUsers(users);

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword as User;
  }
}