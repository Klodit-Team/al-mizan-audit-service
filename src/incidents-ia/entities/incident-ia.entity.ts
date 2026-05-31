import { ApiProperty } from '@nestjs/swagger';
import { TypeIncident } from '../../common/enums/type-incident.enum';
import { Gravite } from '../../common/enums/gravite.enum';
import { StatutIncident } from '../../common/enums/statut-incident.enum';

export class IncidentIaEntity {
  @ApiProperty({ example: 'a12b3c4d-5e6f-7a8b-9c0d-1e2f3a4b5c6d' })
  id!: string;

  @ApiProperty({ enum: TypeIncident, example: TypeIncident.DIVERGENCE_GRE_A_GRE })
  type_incident!: TypeIncident;

  @ApiProperty({ example: 'appel-offres-service' })
  entite_source!: string;

  @ApiProperty({ example: '6c3b19c4-5119-4b62-9cc4-738459f0fe25' })
  entite_id!: string;

  @ApiProperty({ example: 'gpt-4o' })
  modele_ia!: string;

  @ApiProperty({ required: false, nullable: true, example: 'ACCEPTER' })
  decision_ia!: string | null;

  @ApiProperty({ required: false, nullable: true, example: 'REJETER' })
  decision_humaine!: string | null;

  @ApiProperty({ required: false, nullable: true, type: 'number', example: 0.15 })
  ecart_score!: number | null;

  @ApiProperty({ required: false, nullable: true, type: 'number', example: 0.85 })
  confiance_ia!: number | null;

  @ApiProperty({ enum: Gravite, example: Gravite.MOYENNE })
  gravite!: Gravite;

  @ApiProperty({ enum: StatutIncident, example: StatutIncident.OUVERT })
  statut!: StatutIncident;

  @ApiProperty({ required: false, nullable: true, example: '550e8400-e29b-41d4-a716-446655440001' })
  assignee_id!: string | null;

  @ApiProperty({ required: false, nullable: true, example: 'Notes on resolution process' })
  resolution_notes!: string | null;

  @ApiProperty({ example: '2026-05-31T14:36:53.735Z' })
  date_detection!: Date;

  @ApiProperty({ required: false, nullable: true, example: '2026-05-31T15:00:00.000Z' })
  date_resolution!: Date | null;

  @ApiProperty({ example: '2026-05-31T14:36:53.735Z' })
  created_at!: Date;
}