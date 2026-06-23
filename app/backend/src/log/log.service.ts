import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log, LogDocument } from './schemas/log.schema';

/**
 * Audit logging to MongoDB. Each helper writes a typed entry (auth, membership
 * or error). Writes are best-effort: failures are caught and logged locally,
 * never propagated — logging can never break a request.
 */
@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  constructor(
    @InjectModel(Log.name) private readonly logModel: Model<LogDocument>,
  ) {}

  /** Record an authentication event (register, login success/failure, logout). */
  async logAuth(data: {
    action: string;
    userId?: number;
    email?: string;
    ip?: string;
  }): Promise<void> {
    try {
      await this.logModel.create({ type: 'auth', ...data });
    } catch (err) {
      this.logger.error('Failed to write auth log', err);
    }
  }

  /** Record a membership or event action (request, role change, registration…). */
  async logMembership(data: {
    action: string;
    actorId?: number;
    targetUserId?: number;
    clubId?: number;
    clubName?: string;
  }): Promise<void> {
    try {
      await this.logModel.create({
        type: 'membership',
        userId: data.actorId,
        ...data,
      });
    } catch (err) {
      this.logger.error('Failed to write membership log', err);
    }
  }

  /** Record a handled error (status code, endpoint, message). */
  async logError(data: {
    statusCode: number;
    endpoint: string;
    message: string;
    userId?: number;
  }): Promise<void> {
    try {
      await this.logModel.create({ type: 'error', ...data });
    } catch (err) {
      this.logger.error('Failed to write error log', err);
    }
  }
}
