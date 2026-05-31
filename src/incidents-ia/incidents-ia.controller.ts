import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IncidentsIaService } from './incidents-ia.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { FilterIncidentDto } from './dto/filter-incident.dto';
import { ResolveIncidentDto } from './dto/resolve-incident.dto';
import { UpdateStatutDto } from './dto/update-statut.dto';
import { IncidentIaEntity } from './entities/incident-ia.entity';

@ApiTags('incidents')
@Controller('incidents')
export class IncidentsIaController {
  constructor(private readonly incidentsIaService: IncidentsIaService) {}

  @Post()
  @ApiOperation({ summary: 'Signaler un nouvel incident IA' })
  @ApiResponse({ status: 201, type: IncidentIaEntity, description: 'Incident created' })
  async createIncident(
    @Body() dto: CreateIncidentDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.createIncident(dto);
    return { success: true, data, message: 'Incident created' };
  }

  @Get()
  @ApiOperation({ summary: 'Lister les incidents IA avec filtres' })
  @ApiResponse({ status: 200, type: [IncidentIaEntity], description: 'Incidents fetched' })
  async getIncidents(
    @Query() filters: FilterIncidentDto,
  ): Promise<{ success: boolean; data: unknown; message: string; meta?: Record<string, unknown> }> {
    const result = await this.incidentsIaService.findAll(filters);
    return {
      success: true,
      data: result.data,
      message: 'Incidents fetched',
      meta: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtenir les détails d\'un incident IA spécifique' })
  @ApiResponse({ status: 200, type: IncidentIaEntity, description: 'Incident fetched' })
  async getIncident(
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.findById(id);
    return { success: true, data, message: 'Incident fetched' };
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Résoudre un incident IA (PV humain de décision)' })
  @ApiResponse({ status: 200, type: IncidentIaEntity, description: 'Incident resolved' })
  async resolveIncident(
    @Param('id') id: string,
    @Body() dto: ResolveIncidentDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.resolveIncident(id, dto);
    return { success: true, data, message: 'Incident resolved' };
  }

  @Patch(':id/statut')
  @ApiOperation({ summary: 'Mettre à jour le statut d\'un incident IA' })
  @ApiResponse({ status: 200, type: IncidentIaEntity, description: 'Incident status updated' })
  async updateStatut(
    @Param('id') id: string,
    @Body() dto: UpdateStatutDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.updateStatut(id, dto);
    return { success: true, data, message: 'Incident status updated' };
  }
}