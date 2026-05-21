import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { IncidentsIaService } from './incidents-ia.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { FilterIncidentDto } from './dto/filter-incident.dto';
import { ResolveIncidentDto } from './dto/resolve-incident.dto';
import { UpdateStatutDto } from './dto/update-statut.dto';

@Controller('incidents')
export class IncidentsIaController {
  constructor(private readonly incidentsIaService: IncidentsIaService) {}

  @Post()
  async createIncident(
    @Body() dto: CreateIncidentDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.createIncident(dto);
    return { success: true, data, message: 'Incident created' };
  }

  @Get()
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
  async getIncident(
    @Param('id') id: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.findById(id);
    return { success: true, data, message: 'Incident fetched' };
  }

  @Patch(':id/resolve')
  async resolveIncident(
    @Param('id') id: string,
    @Body() dto: ResolveIncidentDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.resolveIncident(id, dto);
    return { success: true, data, message: 'Incident resolved' };
  }

  @Patch(':id/statut')
  async updateStatut(
    @Param('id') id: string,
    @Body() dto: UpdateStatutDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.incidentsIaService.updateStatut(id, dto);
    return { success: true, data, message: 'Incident status updated' };
  }
}
