import { ApiProperty } from '@nestjs/swagger';

export class IntegrityReportEntity {
  @ApiProperty({ example: 1250 })
  checkedCount!: number;

  @ApiProperty({ example: 0 })
  invalidCount!: number;

  @ApiProperty({ type: [String], example: [] })
  invalidIds!: string[];

  @ApiProperty({ example: '2026-05-31T14:36:53.735Z' })
  checkedAt!: Date;
}