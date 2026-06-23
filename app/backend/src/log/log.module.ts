import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Log, LogSchema } from './schemas/log.schema';
import { LogService } from './log.service';

/** Logging module: exposes {@link LogService}, backed by the Mongo `logs` collection. */
@Module({
  imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
  providers: [LogService],
  exports: [LogService],
})
export class LogModule {}
