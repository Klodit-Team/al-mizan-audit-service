import { createHash } from 'crypto';
import * as crypto from 'crypto';
import { AuditLoggerService } from './audit-logger.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditEventDto } from './dto/audit-event.dto';
import { AuditLog } from '@prisma/client';

const buildHash = (chainInput: string): string => createHash('sha256').update(chainInput).digest('hex');

type PrismaServiceMock = PrismaService & {
  auditLog: {
    findFirst: jest.Mock;
    create: jest.Mock;
  };
};

describe('AuditLoggerService', () => {
  let service: AuditLoggerService;
  let prismaService: PrismaServiceMock;

  beforeEach(() => {
    prismaService = {
      auditLog: {
        findFirst: jest.fn(),
        create: jest.fn(),
      },
    } as PrismaServiceMock;

    service = new AuditLoggerService(prismaService);
  });

  it('calcule correctement hash_sha256 SHA-256', async () => {
  jest.spyOn(crypto, 'randomUUID').mockReturnValue('11111111-1111-1111-1111-111111111111');
    (prismaService.auditLog.findFirst as jest.Mock).mockResolvedValue(null);
  (prismaService.auditLog.create as jest.Mock).mockImplementation(({ data }: { data: AuditLog }) => data);

    const dto: AuditEventDto = {
      action: 'CREATE',
      entite: 'MEMOIRE',
      horodatage: '2026-05-15T10:00:00.000Z',
    };

    const result = await service.createLog(dto);

  const chainInput = `11111111-1111-1111-1111-111111111111${new Date(dto.horodatage).toISOString()}${dto.user_id ?? ''}${dto.action}${dto.entite}${dto.entite_id ?? ''}GENESIS`;
    expect(result.hash_sha256).toBe(buildHash(chainInput));
  });

  it('utilise GENESIS si aucun log en base', async () => {
  jest.spyOn(crypto, 'randomUUID').mockReturnValue('22222222-2222-2222-2222-222222222222');
    (prismaService.auditLog.findFirst as jest.Mock).mockResolvedValue(null);
  (prismaService.auditLog.create as jest.Mock).mockImplementation(({ data }: { data: AuditLog }) => data);

    const dto: AuditEventDto = {
      action: 'UPDATE',
      entite: 'NOTE',
      horodatage: '2026-05-15T11:00:00.000Z',
    };

    const result = await service.createLog(dto);
    expect(result.hash_precedent).toBe('GENESIS');
  });

  it('enchaîne le hash_sha256 du log précédent', async () => {
  jest.spyOn(crypto, 'randomUUID').mockReturnValue('33333333-3333-3333-3333-333333333333');
    (prismaService.auditLog.findFirst as jest.Mock).mockResolvedValue({
      hash_sha256: 'PREVIOUS_HASH',
    });
    (prismaService.auditLog.create as jest.Mock).mockImplementation(({ data }: { data: AuditLog }) => data);

    const dto: AuditEventDto = {
      action: 'DELETE',
      entite: 'JURY',
      horodatage: '2026-05-15T12:00:00.000Z',
    };

    const result = await service.createLog(dto);
    expect(result.hash_precedent).toBe('PREVIOUS_HASH');
  });
});
