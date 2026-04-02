import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { Role } from './role/role.entity';
import { Club } from './club/club.entity';
import { AppUser } from './app-user/app-user.entity';
import { Membership } from './membership/membership.entity';
import { ClubEvent } from './event/event.entity';
import { ClubModule } from './club/club.module';

const dbEnabled = process.env.DB_ENABLED === 'true';

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
            entities: [Role, Club, AppUser, Membership, ClubEvent],
            synchronize: false,
            migrationsRun: true,
            migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          }),
          ClubModule,
        ]
      : []),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}