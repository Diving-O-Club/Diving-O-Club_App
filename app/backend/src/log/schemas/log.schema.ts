import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogDocument = Log & Document;

/**
 * Mongo document for an audit log entry. Fields are sparse depending on `type`
 * (auth / membership / error). A TTL index removes entries after 30 days.
 */
@Schema({ timestamps: true, collection: 'logs' })
export class Log {
  @Prop({ required: true, enum: ['auth', 'membership', 'error'] })
  type: string;

  @Prop({ required: true })
  action: string;

  @Prop({ type: Number, default: null })
  userId: number | null;

  @Prop({ type: String, default: null })
  email: string | null;

  @Prop({ type: String, default: null })
  ip: string | null;

  @Prop({ type: Number, default: null })
  targetUserId: number | null;

  @Prop({ type: Number, default: null })
  clubId: number | null;

  @Prop({ type: String, default: null })
  clubName: string | null;

  @Prop({ type: Number, default: null })
  statusCode: number | null;

  @Prop({ type: String, default: null })
  endpoint: string | null;

  @Prop({ type: String, default: null })
  message: string | null;
}

export const LogSchema = SchemaFactory.createForClass(Log);

// Delete logs after 30 days
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });
