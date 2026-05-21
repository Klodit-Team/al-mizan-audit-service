import { IsOptional, IsString } from 'class-validator';

export class ResolveIncidentDto {
  @IsOptional()
  @IsString()
  resolution_notes?: string;
}
