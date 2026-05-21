import { Injectable } from '@nestjs/common';
import { createHash, randomUUID } from 'crypto';
import { AuditLog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AuditEventDto } from './dto/audit-event.dto';

@Injectable()
export class AuditLoggerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createLog(dto: AuditEventDto): Promise<AuditLog> {
    const lastLog = await this.prismaService.auditLog.findFirst({
      orderBy: { horodatage: 'desc' },
    });

    const previousHash = lastLog?.hash_sha256 ?? 'GENESIS';
    const id = randomUUID();
    const horodatage = new Date(dto.horodatage);
    const chainInput = `${id}${horodatage.toISOString()}${dto.user_id ?? ''}${dto.action}${dto.entite}${dto.entite_id ?? ''}${previousHash}`;
    const hash_sha256 = createHash('sha256').update(chainInput).digest('hex');

    return this.prismaService.auditLog.create({
      data: {
        id,
        user_id: dto.user_id ?? null,
        action: dto.action,
        entite: dto.entite,
        entite_id: dto.entite_id ?? null,
        details: dto.details ?? null,
        ip_address: dto.ip_address ?? null,
        user_agent: dto.user_agent ?? null,
        hash_sha256,
        hash_precedent: previousHash,
        horodatage,
      },
    });
  }
}
