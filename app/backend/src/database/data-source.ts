import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

import { Role } from '../role/role.entity';
import { Club } from '../club/club.entity';
import { AppUser } from '../app-user/app-user.entity';
import { Membership } from '../membership/membership.entity';
import { ClubEvent } from '../event/event.entity';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST ?? 'localhost',
  port: parseInt(process.env.DB_PORT ?? '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  entities: [Role, Club, AppUser, Membership, ClubEvent],

  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],

  synchronize: false,

  logging: process.env.NODE_ENV !== 'production',
});