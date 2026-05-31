import { ApiProperty } from '@nestjs/swagger';
import { ActeurType } from '../../common/enums/acteur-type.enum';

export class LogIaDecisionEntity {
  @ApiProperty({ example: 'b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e' })
  id!: string;

  @ApiProperty({ example: 'a12b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' })
  incident_id!: string;

  @ApiProperty({ example: 'RESOLUTION' })
  action!: string;

  @ApiProperty({ enum: ActeurType, example: ActeurType.HUMAIN })
  acteur_type!: ActeurType;

  @ApiProperty({ required: false, nullable: true, example: '550e8400-e29b-41d4-a716-446655440001' })
  acteur_id!: string | null;

  @ApiProperty({ required: false, nullable: true, example: { comment: 'Manually verified' } })
  donnees_contexte!: any;

  @ApiProperty({ required: false, nullable: true, example: { browser: 'Chrome' } })
  metadata!: any;

  @ApiProperty({ example: '2026-05-31T14:36:53.735Z' })
  horodatage!: Date;
}