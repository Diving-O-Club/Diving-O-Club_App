import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Role } from './role/role.entity';
import { Club } from './club/club.entity';
import { User } from './user/user.entity';
import { Membership } from './membership/membership.entity';
import { ClubEvent } from './event/event.entity';
import { EventRegistration } from './event/event-registration.entity';
import { Certificate } from './certificate/certificate.entity';
import { Payment } from './payment/payment.entity';
import { ClubModule } from './club/club.module';
import { AuthModule } from './auth/auth.module';
import { MembershipModule } from './membership/membership.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EventModule } from './event/event.module';
import { LogModule } from './log/log.module';

const dbEnabled = process.env.DB_ENABLED === 'true';

/**
 * Root application module. Wires the PostgreSQL (TypeORM) and MongoDB (Mongoose)
 * connections and registers every feature module. Database wiring is gated by
 * the DB_ENABLED flag (migrations run automatically on boot).
 */
@Module({
  imports: [
    ...(dbEnabled
      ? [
          TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT ?? '5432', 10),
            username: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: [
              Role,
              Club,
              User,
              Membership,
              ClubEvent,
              EventRegistration,
              Certificate,
              Payment,
            ],
            synchronize: false,
            migrationsRun: true,
            migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          }),
          ClubModule,
          AuthModule,
          MembershipModule,
          MongooseModule.forRoot(process.env.MONGO_URL ?? ''),
          LogModule,
          EventModule,
        ]
      : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
