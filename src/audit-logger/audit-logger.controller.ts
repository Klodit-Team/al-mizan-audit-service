import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditLoggerService } from './audit-logger.service';
import { AuditEventDto } from './dto/audit-event.dto';
import { AuditLogEntity } from './entities/audit-log.entity';

@ApiTags('audit')
@Controller('audit')
export class AuditLoggerController {
  constructor(private readonly auditLoggerService: AuditLoggerService) {}

  @Post('logs')
  @ApiOperation({ summary: 'Create a new audit log manually' })
  @ApiResponse({ status: 201, type: AuditLogEntity, description: 'Audit log created' })
  async createLog(
    @Body() dto: AuditEventDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.auditLoggerService.createLog(dto);
    return { success: true, data, message: 'Audit log created' };
  }
}