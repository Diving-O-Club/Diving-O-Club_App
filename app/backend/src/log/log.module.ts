import { Module } from '@nestjs/common';
import { LogService } from './log.service';

/**
 * Logging module: exposes {@link LogService}. Logs are written to the
 * application logger (console). The Mongo-backed implementation is kept in
 * `schemas/log.schema.ts` for a future re-enable.
 */
@Module({
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
