import { Controller, Get } from '@nestjs/common';
import { IntegrityCheckerService } from './integrity-checker.service';

@Controller('integrity')
export class IntegrityCheckerController {
  constructor(private readonly integrityCheckerService: IntegrityCheckerService) {}

  @Get('verify')
  async verify(): Promise<{ success: boolean; data: unknown; message: string }> {
    const report = await this.integrityCheckerService.verifyChain();
    return { success: true, data: report, message: 'Integrity check completed' };
  }

  @Get('status')
  status(): { success: boolean; data: unknown; message: string } {
    const report = this.integrityCheckerService.getLastReport();
    return {
      success: true,
      data: report,
      message: report ? 'Last integrity report' : 'No integrity report yet',
    };
  }
}
