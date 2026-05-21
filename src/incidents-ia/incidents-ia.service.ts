import { Injectable, NotFoundException } from '@nestjs/common';
import { IncidentIa, LogIaDecision, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ActeurType } from '../common/enums/acteur-type.enum';
import { StatutIncident } from '../common/enums/statut-incident.enum';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { FilterIncidentDto } from './dto/filter-incident.dto';
import { ResolveIncidentDto } from './dto/resolve-incident.dto';
import { UpdateStatutDto } from './dto/update-statut.dto';

@Injectable()
export class IncidentsIaService {
  constructor(private readonly prismaService: PrismaService) {}

  async createIncident(dto: CreateIncidentDto): Promise<IncidentIa> {
    return this.prismaService.incidentIa.create({
      data: {
        type_incident: dto.type_incident,
        entite_source: dto.entite_source,
        entite_id: dto.entite_id,
        modele_ia: dto.modele_ia,
        decision_ia: dto.decision_ia ?? null,
        decision_humaine: dto.decision_humaine ?? null,
        ecart_score: dto.ecart_score !== undefined ? new Prisma.Decimal(dto.ecart_score) : null,
        confiance_ia: dto.confiance_ia !== undefined ? new Prisma.Decimal(dto.confiance_ia) : null,
        gravite: dto.gravite,
        date_detection: new Date(dto.date_detection),
      },
    });
  }

  async findAll(filters: FilterIncidentDto): Promise<{ data: IncidentIa[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, dateMin, dateMax, ...rest } = filters;
    const where: Prisma.IncidentIaWhereInput = {
      ...rest,
      date_detection: dateMin || dateMax ? {
        gte: dateMin ? new Date(dateMin) : undefined,
        lte: dateMax ? new Date(dateMax) : undefined,
      } : undefined,
    };

    const [data, total] = await Promise.all([
      this.prismaService.incidentIa.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.incidentIa.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<(IncidentIa & { logsDecisions: LogIaDecision[] })> {
    const incident = await this.prismaService.incidentIa.findUnique({
      where: { id },
      include: { logsDecisions: { orderBy: { horodatage: 'asc' } } },
    });

    if (!incident) {
      throw new NotFoundException('Incident not found');
    }

    return incident;
  }

  async resolveIncident(id: string, dto: ResolveIncidentDto): Promise<IncidentIa> {
    const existing = await this.prismaService.incidentIa.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Incident not found');
    }

    const [incident] = await this.prismaService.$transaction([
      this.prismaService.incidentIa.update({
        where: { id },
        data: {
          statut: StatutIncident.RESOLU,
          resolution_notes: dto.resolution_notes ?? null,
          date_resolution: new Date(),
        },
      }),
      this.prismaService.logIaDecision.create({
        data: {
          incident_id: id,
          action: 'RESOLUTION',
          acteur_type: ActeurType.HUMAIN,
          acteur_id: null,
          donnees_contexte: Prisma.JsonNull,
          metadata: Prisma.JsonNull,
          horodatage: new Date(),
        },
      }),
    ]);

    return incident;
  }

  async updateStatut(id: string, dto: UpdateStatutDto): Promise<IncidentIa> {
    const existing = await this.prismaService.incidentIa.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Incident not found');
    }

    return this.prismaService.incidentIa.update({
      where: { id },
      data: { statut: dto.statut },
    });
  }
}
