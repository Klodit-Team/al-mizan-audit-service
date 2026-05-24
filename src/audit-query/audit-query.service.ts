import { Injectable } from '@nestjs/common';
import { AuditLog, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { FilterAuditDto } from './dto/filter-audit.dto';

@Injectable()
export class AuditQueryService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(filters: FilterAuditDto): Promise<{ data: AuditLog[]; total: number; page: number; limit: number }> {
    const { page = 1, limit = 20, dateMin, dateMax, ...rest } = filters;

    const where: Prisma.AuditLogWhereInput = {
      ...rest,
      horodatage: dateMin || dateMax ? {
        gte: dateMin ? new Date(dateMin) : undefined,
        lte: dateMax ? new Date(dateMax) : undefined,
      } : undefined,
    };

    const [data, total] = await Promise.all([
      this.prismaService.auditLog.findMany({
        where,
        orderBy: { horodatage: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prismaService.auditLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findById(id: string): Promise<AuditLog | null> {
    return this.prismaService.auditLog.findUnique({ where: { id } });
  }

  async findByEntity(entite: string, entite_id: string): Promise<AuditLog[]> {
    return this.prismaService.auditLog.findMany({
      where: { entite, entite_id },
      orderBy: { horodatage: 'asc' },
    });
  }

  async findActivities(params: { userId?: string; limit?: number }): Promise<{
    id: string;
    type: string;
    title: string;
    subtitle: string;
    timestamp: string;
  }[]> {
    const { userId, limit = 10 } = params;

    const where: Prisma.AuditLogWhereInput = userId ? { user_id: userId } : {};

    const logs = await this.prismaService.auditLog.findMany({
      where,
      orderBy: { horodatage: 'desc' },
      take: limit,
    });

    return logs.map((log) => {
      const actionUpper = (log.action || '').toUpperCase();
      let type = 'STATUS';
      if (actionUpper.includes('SOUMISSION') || actionUpper.includes('SUBMIT')) {
        type = 'SOUMISSION';
      } else if (actionUpper.includes('RECOURS')) {
        type = 'RECOURS';
      } else if (actionUpper.includes('NOTIFICATION')) {
        type = 'NOTIFICATION';
      } else if (actionUpper.includes('RESULTAT') || actionUpper.includes('ATTRIBUTION')) {
        type = 'RESULTAT';
      }

      return {
        id: log.id,
        type,
        title: `${log.action} - ${log.entite}`,
        subtitle: log.details || `Action sur ${log.entite} ${log.entite_id || ''}`.trim(),
        timestamp: log.horodatage.toISOString(),
      };
    });
  }
}
