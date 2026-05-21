import { createHash } from 'crypto';
import { IntegrityCheckerService } from './integrity-checker.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditLog } from '@prisma/client';

const computeHash = (log: AuditLog, previousHash: string): string => {
  const chainInput = `${log.id}${log.horodatage.toISOString()}${log.user_id ?? ''}${log.action}${log.entite}${log.entite_id ?? ''}${previousHash}`;
  return createHash('sha256').update(chainInput).digest('hex');
};

type PrismaServiceMock = PrismaService & {
  auditLog: {
    findMany: jest.Mock;
  };
};

describe('IntegrityCheckerService', () => {
  let service: IntegrityCheckerService;
  let prismaService: PrismaServiceMock;

  beforeEach(() => {
    prismaService = {
      auditLog: {
        findMany: jest.fn(),
      },
    } as PrismaServiceMock;

    service = new IntegrityCheckerService(prismaService);
  });

  it('retourne 0 invalid si tous les hashs sont corrects', async () => {
    const log1: AuditLog = {
      id: '1',
      user_id: null,
      action: 'A1',
      entite: 'E1',
      entite_id: null,
      details: null,
      ip_address: null,
      user_agent: null,
      hash_sha256: '',
      hash_precedent: 'GENESIS',
      horodatage: new Date('2026-05-15T10:00:00.000Z'),
    };

    log1.hash_sha256 = computeHash(log1, 'GENESIS');

    const log2: AuditLog = {
      ...log1,
      id: '2',
      action: 'A2',
      horodatage: new Date('2026-05-15T11:00:00.000Z'),
      hash_precedent: log1.hash_sha256,
      hash_sha256: '',
    };
    log2.hash_sha256 = computeHash(log2, log1.hash_sha256);

    (prismaService.auditLog.findMany as jest.Mock).mockResolvedValue([log1, log2]);

    const report = await service.verifyChain();
    expect(report.invalidCount).toBe(0);
    expect(report.invalidIds).toHaveLength(0);
  });

  it('détecte une divergence de hash', async () => {
    const log1: AuditLog = {
      id: '1',
      user_id: null,
      action: 'A1',
      entite: 'E1',
      entite_id: null,
      details: null,
      ip_address: null,
      user_agent: null,
      hash_sha256: '',
      hash_precedent: 'GENESIS',
      horodatage: new Date('2026-05-15T10:00:00.000Z'),
    };

    log1.hash_sha256 = computeHash(log1, 'GENESIS');

    const log2: AuditLog = {
      ...log1,
      id: '2',
      action: 'A2',
      horodatage: new Date('2026-05-15T11:00:00.000Z'),
      hash_precedent: log1.hash_sha256,
      hash_sha256: 'INVALID_HASH',
    };

    (prismaService.auditLog.findMany as jest.Mock).mockResolvedValue([log1, log2]);

    const report = await service.verifyChain();
    expect(report.invalidCount).toBe(1);
    expect(report.invalidIds).toContain('2');
  });
});
