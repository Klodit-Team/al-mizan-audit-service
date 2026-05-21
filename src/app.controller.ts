import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health(): { success: boolean; data: { status: string; service: string }; message: string } {
    return {
      success: true,
      data: { status: 'ok', service: 'ms-audit-logger' },
      message: 'Service healthy',
    };
  }
}
