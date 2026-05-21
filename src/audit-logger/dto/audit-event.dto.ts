import { IsISO8601, IsIP, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class AuditEventDto {
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @IsString()
  @MaxLength(100)
  action!: string;

  @IsString()
  @MaxLength(100)
  entite!: string;

  @IsOptional()
  @IsUUID()
  entite_id?: string;

  @IsOptional()
  @IsString()
  details?: string;

  @IsOptional()
  @IsIP()
  ip_address?: string;

  @IsOptional()
  @IsString()
  user_agent?: string;

  @IsISO8601()
  horodatage!: string;
}
