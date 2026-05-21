import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Gravite } from '../../common/enums/gravite.enum';
import { StatutIncident } from '../../common/enums/statut-incident.enum';
import { TypeIncident } from '../../common/enums/type-incident.enum';

export class FilterIncidentDto {
  @IsOptional()
  @IsEnum(TypeIncident)
  type_incident?: TypeIncident;

  @IsOptional()
  @IsEnum(StatutIncident)
  statut?: StatutIncident;

  @IsOptional()
  @IsEnum(Gravite)
  gravite?: Gravite;

  @IsOptional()
  @IsString()
  entite_source?: string;

  @IsOptional()
  @IsDateString()
  dateMin?: string;

  @IsOptional()
  @IsDateString()
  dateMax?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}
