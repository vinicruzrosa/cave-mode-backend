import { UserRepository } from '../repositories/UserRepository';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { generateToken } from '../utils/jwt';

export class AuthService {
  static async signup(email: string, password: string) {
    const hashed = await hashPassword(password);
    const user = await UserRepository.create({ email, password: hashed });
    return { id: user.id, email: user.email };
  }

  static async login(email: string, password: string) {
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');
    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error('Invalid credentials');
    return generateToken({ id: user.id, email: user.email });
  }
} 