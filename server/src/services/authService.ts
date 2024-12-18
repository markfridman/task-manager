import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { UserModel } from '../models/User';
import { CreateUserDto, LoginDto, User } from '../types/user';
import { AppError } from '../types/error';
import { config } from '../config';

export class AuthService {
  async register(data: CreateUserDto): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const user = await UserModel.create(data);
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  async login(data: LoginDto): Promise<{ user: Omit<User, 'password'>, token: string }> {
    const user = await UserModel.findByEmail(data.email);
    if (!user) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }

    const token = this.generateToken(user.id);
    const { password, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      token
    };
  }

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await UserModel.findById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'USER_NOT_FOUND');
    }

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn
    });
  }
}