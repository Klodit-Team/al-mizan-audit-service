import { Injectable } from '@nestjs/common';
import { LogIaDecision, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDecisionDto } from './dto/create-decision.dto';

@Injectable()
export class LogsDecisionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDecision(dto: CreateDecisionDto): Promise<LogIaDecision> {
    const donnees_contexte = dto.donnees_contexte
      ? (dto.donnees_contexte as Prisma.InputJsonValue)
      : Prisma.JsonNull;
    const metadata = dto.metadata
      ? (dto.metadata as Prisma.InputJsonValue)
      : Prisma.JsonNull;

    return this.prismaService.logIaDecision.create({
      data: {
        incident_id: dto.incident_id,
        action: dto.action,
        acteur_type: dto.acteur_type,
        acteur_id: dto.acteur_id ?? null,
        donnees_contexte,
        metadata,
        horodatage: new Date(dto.horodatage),
      },
    });
  }

  async findByIncident(incident_id: string): Promise<LogIaDecision[]> {
    return this.prismaService.logIaDecision.findMany({
      where: { incident_id },
      orderBy: { horodatage: 'asc' },
    });
  }
}
