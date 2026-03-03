import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { WizkidRole } from '../wizkid-role.enum';

export type WizkidDocument = Wizkid & Document;

@Schema({ timestamps: true })
export class Wizkid {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ required: true, enum: Object.values(WizkidRole) })
  role: WizkidRole;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ trim: true })
  profilePicture?: string;

  @Prop({ trim: true })
  phone?: string;

  @Prop()
  passwordHash?: string;

  @Prop({ type: Date, default: null })
  firedAt?: Date | null;
}

export const WizkidSchema = SchemaFactory.createForClass(Wizkid);

// Practical indexes for filtering
WizkidSchema.index({ role: 1 });
WizkidSchema.index({ name: 'text', email: 'text' }); // for text search
