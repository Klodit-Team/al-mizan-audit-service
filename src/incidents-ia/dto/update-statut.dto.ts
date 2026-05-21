import { IsEnum } from 'class-validator';
import { StatutIncident } from '../../common/enums/statut-incident.enum';

export class UpdateStatutDto {
  @IsEnum(StatutIncident)
  statut!: StatutIncident;
}
