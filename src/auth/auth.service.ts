import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/users.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<string | null> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new Error('INVALID_USERNAME_OR_PASSWORD');
    }
  
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('INVALID_USERNAME_OR_PASSWORD');
    }
    
    const payload = { userId: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  async registerUser(username: string, password: string, email: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
  
    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error('USERNAME_EXISTS');
      }
      if (existingUser.email === email) {
        throw new Error('EMAIL_EXISTS');
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({ username, password: hashedPassword, email: email, language: 'en' });
    return this.userRepository.save(newUser);
  }
}
