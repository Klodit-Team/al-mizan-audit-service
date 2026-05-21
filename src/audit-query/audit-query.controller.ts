import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { AuditQueryService } from './audit-query.service';
import { FilterAuditDto } from './dto/filter-audit.dto';

@Controller('audit')
export class AuditQueryController {
  constructor(private readonly auditQueryService: AuditQueryService) {}

  @Get('logs')
  async getLogs(
    @Query() filters: FilterAuditDto,
  ): Promise<{ success: boolean; data: unknown; message: string; meta?: Record<string, unknown> }> {
    const result = await this.auditQueryService.findAll(filters);
    return {
      success: true,
      data: result.data,
      message: 'Audit logs fetched',
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  @Get('logs/:id')
  async getLogById(
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const log = await this.auditQueryService.findById(id);
    if (!log) {
      throw new NotFoundException('Audit log not found');
    }
    return { success: true, data: log, message: 'Audit log fetched' };
  }

  @Get('logs/entite/:entite/:entite_id')
  async getLogsByEntity(
    @Param('entite') entite: string,
    @Param('entite_id') entite_id: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const logs = await this.auditQueryService.findByEntity(entite, entite_id);
    return { success: true, data: logs, message: 'Audit logs fetched' };
  }
}
