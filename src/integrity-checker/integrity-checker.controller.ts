import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IntegrityCheckerService } from './integrity-checker.service';
import { IntegrityReportEntity } from './entities/integrity-report.entity';

@ApiTags('audit')
@Controller('integrity')
export class IntegrityCheckerController {
  constructor(private readonly integrityCheckerService: IntegrityCheckerService) {}

  @Get('verify')
  @ApiOperation({ summary: 'Déclencher manuellement la vérification d\'intégrité de la chaîne' })
  @ApiResponse({ status: 200, type: IntegrityReportEntity, description: 'Integrity check completed' })
  async verify(): Promise<{ success: boolean; data: unknown; message: string }> {
    const report = await this.integrityCheckerService.verifyChain();
    return { success: true, data: report, message: 'Integrity check completed' };
  }

  @Get('status')
  @ApiOperation({ summary: 'Consulter le dernier rapport de vérification d\'intégrité' })
  @ApiResponse({ status: 200, type: IntegrityReportEntity, description: 'Last integrity report' })
  status(): { success: boolean; data: unknown; message: string } {
    const report = this.integrityCheckerService.getLastReport();
    return {
      success: true,
      data: report,
      message: report ? 'Last integrity report' : 'No integrity report yet',
    };
  }
}