import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LogsDecisionsService } from './logs-decisions.service';
import { CreateDecisionDto } from './dto/create-decision.dto';
import { LogIaDecisionEntity } from './entities/log-ia-decision.entity';

@ApiTags('decisions')
@Controller('decisions')
export class LogsDecisionsController {
  constructor(private readonly logsDecisionsService: LogsDecisionsService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un log de décision IA/humaine' })
  @ApiResponse({ status: 201, type: LogIaDecisionEntity, description: 'Decision log created' })
  async createDecision(
    @Body() dto: CreateDecisionDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.logsDecisionsService.createDecision(dto);
    return { success: true, data, message: 'Decision log created' };
  }

  @Get('incident/:incident_id')
  @ApiOperation({ summary: 'Lister toutes les décisions rattachées à un incident IA' })
  @ApiResponse({ status: 200, type: [LogIaDecisionEntity], description: 'Decision logs fetched' })
  async getByIncident(
    @Param('incident_id') incident_id: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.logsDecisionsService.findByIncident(incident_id);
    return { success: true, data, message: 'Decision logs fetched' };
  }
}