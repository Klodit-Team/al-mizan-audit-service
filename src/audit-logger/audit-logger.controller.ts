import { Body, Controller, Post } from '@nestjs/common';
import { AuditLoggerService } from './audit-logger.service';
import { AuditEventDto } from './dto/audit-event.dto';

@Controller('audit')
export class AuditLoggerController {
  constructor(private readonly auditLoggerService: AuditLoggerService) {}

  @Post('logs')
  async createLog(
    @Body() dto: AuditEventDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.auditLoggerService.createLog(dto);
    return { success: true, data, message: 'Audit log created' };
  }
}
