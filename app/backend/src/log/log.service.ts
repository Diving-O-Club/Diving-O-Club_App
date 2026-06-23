import { Injectable, Logger } from '@nestjs/common';

/**
 * Audit logging. Each helper writes a typed entry (auth, membership or error)
 * to the application logger. Writes are best-effort and never propagate —
 * logging can never break a request.
 *
 * The previous Mongo-backed implementation is preserved in
 * `schemas/log.schema.ts`; re-wire `MongooseModule` and inject the model here
 * to restore persistent audit logs.
 */
@Injectable()
export class LogService {
  private readonly logger = new Logger(LogService.name);

  /** Record an authentication event (register, login success/failure, logout). */
  async logAuth(data: {
    action: string;
    userId?: number;
    email?: string;
    ip?: string;
  }): Promise<void> {
    this.logger.log(`auth ${JSON.stringify(data)}`);
  }

  /** Record a membership or event action (request, role change, registration…). */
  async logMembership(data: {
    action: string;
    actorId?: number;
    targetUserId?: number;
    clubId?: number;
    clubName?: string;
  }): Promise<void> {
    this.logger.log(`membership ${JSON.stringify(data)}`);
  }

  /** Record a handled error (status code, endpoint, message). */
  async logError(data: {
    statusCode: number;
    endpoint: string;
    message: string;
    userId?: number;
  }): Promise<void> {
    this.logger.log(`error ${JSON.stringify(data)}`);
  }
}
