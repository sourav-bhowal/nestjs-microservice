import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UserService {
  // Inject the user model into the service
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  // Create a new user
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  // Find a user by their clerkUserId
  async findUserByClerkId(clerkUserId: string): Promise<User | null> {
    return this.userModel.findOne({ clerkUserId }).exec();
  }

  // Find all users
  async findAllUsers(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  // Update a user
  async updateUser(
    clerkUserId: string,
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    return this.userModel
      .findOneAndUpdate({ clerkUserId }, updateUserDto, { new: true })
      .exec();
  }

  // Delete a user
  async deleteUser(clerkUserId: string): Promise<User | null> {
    return this.userModel.findOneAndDelete({ clerkUserId }).exec();
  }
}
