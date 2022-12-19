import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, ObjectId } from 'mongoose';

export type UsersDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true })
  username: string;
  @Prop({ required: true })
  password: string;
  _id: ObjectId | string;

}

export const UsersSchema = SchemaFactory.createForClass(User);
