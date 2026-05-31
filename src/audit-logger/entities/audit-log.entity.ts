import { ApiProperty } from '@nestjs/swagger';

export class AuditLogEntity {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  id!: string;

  @ApiProperty({ required: false, nullable: true, example: '550e8400-e29b-41d4-a716-446655440001' })
  user_id!: string | null;

  @ApiProperty({ example: 'CREATE' })
  action!: string;

  @ApiProperty({ example: 'AppelOffres' })
  entite!: string;

  @ApiProperty({ required: false, nullable: true, example: '6c3b19c4-5119-4b62-9cc4-738459f0fe25' })
  entite_id!: string | null;

  @ApiProperty({ required: false, nullable: true, example: 'Created Appel d\'Offres via Gateway' })
  details!: string | null;

  @ApiProperty({ required: false, nullable: true, example: '127.0.0.1' })
  ip_address!: string | null;

  @ApiProperty({ required: false, nullable: true, example: 'Mozilla/5.0...' })
  user_agent!: string | null;

  @ApiProperty({ example: 'a6b8c9d0bc658abc...' })
  hash_sha256!: string;

  @ApiProperty({ example: 'b7c9d0e1b2b2b4cf...' })
  hash_precedent!: string;

  @ApiProperty({ example: '2026-05-31T14:36:53.735Z' })
  horodatage!: Date;
}