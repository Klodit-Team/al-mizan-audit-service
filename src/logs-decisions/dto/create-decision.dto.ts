import { IsEnum, IsISO8601, IsOptional, IsString, IsUUID } from 'class-validator';
import { ActeurType } from '../../common/enums/acteur-type.enum';

export class CreateDecisionDto {
  @IsUUID()
  incident_id!: string;

  @IsString()
  action!: string;

  @IsEnum(ActeurType)
  acteur_type!: ActeurType;

  @IsOptional()
  @IsString()
  acteur_id?: string;

  @IsOptional()
  donnees_contexte?: Record<string, unknown>;

  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsISO8601()
  horodatage!: string;
}
