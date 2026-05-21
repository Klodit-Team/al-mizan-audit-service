import { Type } from 'class-transformer';
import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { Gravite } from '../../common/enums/gravite.enum';
import { TypeIncident } from '../../common/enums/type-incident.enum';

export class CreateIncidentDto {
  @IsEnum(TypeIncident)
  type_incident!: TypeIncident;

  @IsString()
  entite_source!: string;

  @IsUUID()
  entite_id!: string;

  @IsString()
  modele_ia!: string;

  @IsOptional()
  @IsString()
  decision_ia?: string;

  @IsOptional()
  @IsString()
  decision_humaine?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ecart_score?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  confiance_ia?: number;

  @IsEnum(Gravite)
  gravite!: Gravite;

  @IsISO8601()
  date_detection!: string;
}
