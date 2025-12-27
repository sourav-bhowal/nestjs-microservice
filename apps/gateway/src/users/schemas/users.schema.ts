import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../../types/auth.type';

// Define the User schema using decorators
@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true, index: true })
  clerkUserId: string; // Define a property 'clerkUserId' of type string

  @Prop({ required: true })
  name: string; // Define a property 'name' of type string

  @Prop({ unique: true, required: true, index: true, lowercase: true })
  email: string; // Define a property 'email' of type string

  @Prop({ default: Role.USER, enum: Role })
  role: Role; // Define a property 'role' of type Role with a default value of 'student'

  @Prop({ default: true })
  isActive: boolean; // Define a property 'isActive' of type boolean with a default value of true
}

// Define a type alias for User document
export type UserDocument = HydratedDocument<User>;

// Create a Mongoose schema from the User class
export const UserSchema = SchemaFactory.createForClass(User);
