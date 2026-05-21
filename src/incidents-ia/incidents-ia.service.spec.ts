import { IncidentsIaService } from './incidents-ia.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateIncidentDto } from './dto/create-incident.dto';
import { Gravite } from '../common/enums/gravite.enum';
import { TypeIncident } from '../common/enums/type-incident.enum';
import { StatutIncident } from '../common/enums/statut-incident.enum';
import { ActeurType } from '../common/enums/acteur-type.enum';

const baseIncident = {
  id: 'incident-1',
  type_incident: TypeIncident.ERREUR_IA,
  entite_source: 'MEMOIRE',
  entite_id: 'uuid-1',
  modele_ia: 'model-x',
  decision_ia: null,
  decision_humaine: null,
  ecart_score: null,
  confiance_ia: null,
  gravite: Gravite.MOYENNE,
  statut: StatutIncident.OUVERT,
  assignee_id: null,
  resolution_notes: null,
  date_detection: new Date('2026-05-15T10:00:00.000Z'),
  date_resolution: null,
  created_at: new Date('2026-05-15T10:00:00.000Z'),
};

type PrismaServiceMock = PrismaService & {
  incidentIa: {
    create: jest.Mock;
    findMany: jest.Mock;
    count: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
  };
  logIaDecision: {
    create: jest.Mock;
  };
  $transaction: jest.Mock;
};

describe('IncidentsIaService', () => {
  let service: IncidentsIaService;
  let prismaService: PrismaServiceMock;

  beforeEach(() => {
    prismaService = {
      incidentIa: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      logIaDecision: {
        create: jest.fn(),
      },
      $transaction: jest.fn(),
    } as PrismaServiceMock;

    service = new IncidentsIaService(prismaService);
  });

  it('crée un incident avec statut OUVERT par défaut', async () => {
    const dto: CreateIncidentDto = {
      type_incident: TypeIncident.ERREUR_IA,
      entite_source: 'MEMOIRE',
      entite_id: 'uuid-1',
      modele_ia: 'model-x',
      gravite: Gravite.MOYENNE,
      date_detection: '2026-05-15T10:00:00.000Z',
    };

    (prismaService.incidentIa.create as jest.Mock).mockResolvedValue({
      ...baseIncident,
      statut: StatutIncident.OUVERT,
    });

    const result = await service.createIncident(dto);
    expect(result.statut).toBe(StatutIncident.OUVERT);
  });

  it('resolveIncident met à jour statut + crée un LogIaDecision HUMAIN', async () => {
    (prismaService.incidentIa.findUnique as jest.Mock).mockResolvedValue(baseIncident);
    (prismaService.logIaDecision.create as jest.Mock).mockReturnValue({
      data: { acteur_type: ActeurType.HUMAIN },
    });
    (prismaService.$transaction as jest.Mock).mockResolvedValue([
      { ...baseIncident, statut: StatutIncident.RESOLU },
      {
        incident_id: baseIncident.id,
        acteur_type: ActeurType.HUMAIN,
      },
    ]);

    const result = await service.resolveIncident(baseIncident.id, { resolution_notes: 'Ok' });
    expect(result.statut).toBe(StatutIncident.RESOLU);

  const transactionArgs = (prismaService.$transaction as jest.Mock).mock.calls[0][0] as Array<{ data?: { acteur_type?: ActeurType } }>;
  const logCreateCall = transactionArgs[1];
  expect(logCreateCall.data?.acteur_type).toBe(ActeurType.HUMAIN);
  });

  it('filtre par gravite, statut, type_incident', async () => {
    (prismaService.incidentIa.findMany as jest.Mock).mockResolvedValue([baseIncident]);
    (prismaService.incidentIa.count as jest.Mock).mockResolvedValue(1);

    await service.findAll({
      gravite: Gravite.MOYENNE,
      statut: StatutIncident.OUVERT,
      type_incident: TypeIncident.ERREUR_IA,
      page: 1,
      limit: 10,
    });

    const whereArg = (prismaService.incidentIa.findMany as jest.Mock).mock.calls[0][0].where;
    expect(whereArg.gravite).toBe(Gravite.MOYENNE);
    expect(whereArg.statut).toBe(StatutIncident.OUVERT);
    expect(whereArg.type_incident).toBe(TypeIncident.ERREUR_IA);
  });
});
