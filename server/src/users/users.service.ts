import { Injectable,  NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id } });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { login } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { email } });
  }

  async create(user: Partial<User>): Promise<User> {
    const entity = this.usersRepo.create(user);
    return this.usersRepo.save(entity);
  }

  async updateProfile(id: string, data: Pick<User, 'displayName'>): Promise<User> {
    const user = await this.findById(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.displayName = data.displayName;
    return this.usersRepo.save(user);
  }
  
}