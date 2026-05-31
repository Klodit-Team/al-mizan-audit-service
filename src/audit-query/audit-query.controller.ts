import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuditQueryService } from './audit-query.service';
import { FilterAuditDto } from './dto/filter-audit.dto';
import { AuditLogEntity } from '../audit-logger/entities/audit-log.entity';

@ApiTags('audit')
@Controller('audit')
export class AuditQueryController {
  constructor(private readonly auditQueryService: AuditQueryService) {}

  @Get('logs')
  @ApiOperation({ summary: 'Rechercher et filtrer les logs d\'audit' })
  @ApiResponse({ status: 200, type: [AuditLogEntity], description: 'Audit logs fetched' })
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

  @Get('activities')
  @ApiOperation({ summary: 'Récupérer le flux d\'activités simplifié pour le dashboard' })
  @ApiResponse({ status: 200, description: 'Activities fetched' })
  async getActivities(
    @Query('serviceContractantId') serviceContractantId?: string,
    @Query('operateurId') operateurId?: string,
    @Query('limit') limit?: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const activities = await this.auditQueryService.findActivities({
      userId: serviceContractantId || operateurId,
      limit: limit ? parseInt(limit, 10) : 10,
    });
    return { success: true, data: activities, message: 'Activities fetched' };
  }

  @Get('logs/:id')
  @ApiOperation({ summary: 'Obtenir le détail d\'un log d\'audit par son ID' })
  @ApiResponse({ status: 200, type: AuditLogEntity, description: 'Audit log fetched' })
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
  @ApiOperation({ summary: 'Obtenir l\'historique d\'une entité spécifique' })
  @ApiResponse({ status: 200, type: [AuditLogEntity], description: 'Audit logs fetched' })
  async getLogsByEntity(
    @Param('entite') entite: string,
    @Param('entite_id') entite_id: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const logs = await this.auditQueryService.findByEntity(entite, entite_id);
    return { success: true, data: logs, message: 'Audit logs fetched' };
  }
}