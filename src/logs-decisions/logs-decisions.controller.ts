import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LogsDecisionsService } from './logs-decisions.service';
import { CreateDecisionDto } from './dto/create-decision.dto';

@Controller('decisions')
export class LogsDecisionsController {
  constructor(private readonly logsDecisionsService: LogsDecisionsService) {}

  @Post()
  async createDecision(
    @Body() dto: CreateDecisionDto,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.logsDecisionsService.createDecision(dto);
    return { success: true, data, message: 'Decision log created' };
  }

  @Get('incident/:incident_id')
  async getByIncident(
    @Param('incident_id') incident_id: string,
  ): Promise<{ success: boolean; data: unknown; message: string }> {
    const data = await this.logsDecisionsService.findByIncident(incident_id);
    return { success: true, data, message: 'Decision logs fetched' };
  }
}
