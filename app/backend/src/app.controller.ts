import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

/** Root and health-check endpoints. */
@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  /** Root greeting. */
  @Get()
  @ApiOperation({ summary: 'Root greeting' })
  @ApiResponse({ status: 200, description: 'Greeting string.' })
  getHello(): string {
    return this.appService.getHello();
  }

  /** Health check used by the infrastructure (load balancer, monitoring). */
  @Get('health')
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: 200, description: 'Service is up: { status: "ok" }.' })
  health() {
    return { status: 'ok' };
  }
}
