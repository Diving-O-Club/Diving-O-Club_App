import { Injectable } from '@nestjs/common';

/** Trivial root service backing the greeting endpoint. */
@Injectable()
export class AppService {
  /** Return a static greeting. */
  getHello(): string {
    return 'Hello World!';
  }
}
