import { Module } from '@nestjs/common';
import { AuditQueryService } from './audit-query.service';
import { AuditQueryController } from './audit-query.controller';
import { IntegrityCheckerModule } from '../integrity-checker/integrity-checker.module';

@Module({
  imports: [IntegrityCheckerModule],
  providers: [AuditQueryService],
  controllers: [AuditQueryController],
})
export class AuditQueryModule {}
