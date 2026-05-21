import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { AuditLog } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

export interface IntegrityReport {
  checkedCount: number;
  invalidCount: number;
  invalidIds: string[];
  checkedAt: Date;
}

@Injectable()
export class IntegrityCheckerService {
  private lastReport: IntegrityReport | null = null;

  constructor(private readonly prismaService: PrismaService) {}

  async verifyChain(): Promise<IntegrityReport> {
    const logs = await this.prismaService.auditLog.findMany({
      orderBy: { horodatage: 'asc' },
    });

    const invalidIds: string[] = [];
    let previousHash = 'GENESIS';

    for (const log of logs) {
      const computed = this.computeHash(log, previousHash);
      if (computed !== log.hash_sha256) {
        invalidIds.push(log.id);
      }
      previousHash = log.hash_sha256;
    }

    const report: IntegrityReport = {
      checkedCount: logs.length,
      invalidCount: invalidIds.length,
      invalidIds,
      checkedAt: new Date(),
    };

    this.lastReport = report;
    return report;
  }

  getLastReport(): IntegrityReport | null {
    return this.lastReport;
  }

  private computeHash(log: AuditLog, previousHash: string): string {
    const chainInput = `${log.id}${log.horodatage.toISOString()}${log.user_id ?? ''}${log.action}${log.entite}${log.entite_id ?? ''}${previousHash}`;
    return createHash('sha256').update(chainInput).digest('hex');
  }
}
