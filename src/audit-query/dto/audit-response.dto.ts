import { AuditLog } from '@prisma/client';

export interface AuditResponseDto {
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
}
