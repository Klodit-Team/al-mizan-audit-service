# al-mizan-audit-service

> **Service d'Audit & Traçabilité** — Journal immuable d'événements, intégrité par chaîne de hachage SHA-256, et suivi des incidents IA pour la plateforme Al-Mizan.

---

## Table des matières

1. [Aperçu](#aperçu)
2. [Technologies](#technologies)
3. [Architecture & Réseau](#architecture--réseau)
4. [Base de données](#base-de-données)
5. [Variables d'environnement](#variables-denvironnement)
6. [API REST](#api-rest)
7. [Messagerie RabbitMQ](#messagerie-rabbitmq)
8. [Commandes utiles](#commandes-utiles)
9. [Docker](#docker)

---

## Aperçu

`al-mizan-audit-service` est le service transversal de traçabilité et d'audit de la plateforme Al-Mizan. Il :

- **Consomme tous les événements métier** (créations, modifications, changements de statut) via RabbitMQ.
- **Persiste un journal d'audit immuable** (`AuditLog`) avec chaîne de hachage SHA-256 pour garantir l'intégrité (chaque log contient le hash précédent → blockchain-lite).
- **Vérifie l'intégrité** de la chaîne de hachage via un `integrity-checker`.
- **Gère les incidents IA** (`IncidentIa`) : divergences d'évaluation, erreurs de modèle, faible confiance.
- **Log les décisions IA/humaines** (`LogIaDecision`) pour chaque incident.
- **Recherche et filtrage** des logs via `audit-query`.
- **Planification** via `@nestjs/schedule` (tâches d'archivage, vérification périodique d'intégrité).

---

## Technologies

| Technologie           | Version  | Rôle                                              |
|-----------------------|----------|---------------------------------------------------|
| Node.js               | 20 LTS   | Runtime                                           |
| TypeScript            | ^5.5     | Langage                                           |
| NestJS                | ^10.4    | Framework (modules, DI, microservices)            |
| Prisma ORM            | ^5.19    | ORM MySQL                                         |
| MySQL                 | 8.x      | Base de données (`audit_db`)                      |
| @golevelup/nestjs-rabbitmq | ^5.4 | Client RabbitMQ décoratif (@RabbitSubscribe)   |
| @nestjs/schedule      | ^4.0     | Tâches planifiées (cron)                          |
| class-validator       | ^0.14    | Validation des DTOs                               |
| Jest                  | ^29.7    | Tests unitaires & e2e                             |

---

## Architecture & Réseau

```
[Tous les microservices] ──[events]──► RabbitMQ ──► audit-service (:3001)
                                                          │
                                                    MySQL (mysql:3306 → audit_db)
```

- **Port exposé** : `3001`
- **Réseau Docker** : `al-mizan-network`
- **Nom du conteneur** : `audit-service`

> ⚠️ Le port `3001` peut entrer en conflit avec `auth-service` si les deux sont déployés sur la même machine sans isolation réseau. Vérifier la configuration dans `al-mizan-deployments/docker-compose.yml`.

---

## Base de données

**Moteur** : MySQL 8 · **Schema** : `audit_db`

### Modèles Prisma

#### `AuditLog` — Journal immuable
| Champ           | Type     | Description                                             |
|-----------------|----------|---------------------------------------------------------|
| `id`            | String   | PK, UUID                                               |
| `user_id`       | String?  | Utilisateur à l'origine de l'action (optionnel)        |
| `action`        | String   | Nom de l'action (CREATE, UPDATE, DELETE, PUBLISH...)   |
| `entite`        | String   | Entité concernée (AppelOffres, Soumission, Recours...) |
| `entite_id`     | String?  | ID de l'entité concernée                               |
| `details`       | String?  | Détails textuels complémentaires                       |
| `ip_address`    | String?  | Adresse IP source                                      |
| `user_agent`    | String?  | User-Agent (navigateur ou service)                     |
| `hash_sha256`   | String   | Hash SHA-256 du log courant (chaîne d'intégrité)       |
| `hash_precedent`| String   | Hash SHA-256 du log précédent (blockchain-lite)        |
| `horodatage`    | DateTime | Date/heure de l'événement                              |

#### `IncidentIa` — Incidents liés à l'IA
| Champ            | Type         | Description                                      |
|------------------|--------------|--------------------------------------------------|
| `type_incident`  | TypeIncident | DIVERGENCE_GRE_A_GRE, DIVERGENCE_EVALUATION, ERREUR_IA, CONFIANCE_FAIBLE |
| `entite_source`  | String       | Service source de l'incident                     |
| `modele_ia`      | String       | Nom du modèle IA utilisé                         |
| `decision_ia`    | String?      | Décision produite par l'IA                       |
| `decision_humaine`| String?     | Décision humaine finale                           |
| `ecart_score`    | Decimal?     | Écart entre décisions IA et humaine              |
| `confiance_ia`   | Decimal?     | Score de confiance IA (0-1)                      |
| `gravite`        | Gravite      | FAIBLE, MOYENNE, ELEVEE, CRITIQUE                |
| `statut`         | StatutIncident | OUVERT, EN_ANALYSE, RESOLU, IGNORE             |

#### `LogIaDecision` — Historique des décisions (IA/Humaine/Système)
| Champ             | Type      | Description                          |
|-------------------|-----------|--------------------------------------|
| `incident_id`     | String    | FK → IncidentIa                      |
| `action`          | String    | Action de décision (RESOLUTION...)   |
| `acteur_type`     | ActeurType| `IA`, `HUMAIN`, ou `SYSTEME`         |
| `acteur_id`       | String?   | ID de l'acteur                       |
| `donnees_contexte`| Json?     | Contexte JSON de la décision         |
| `horodatage`      | DateTime  | Date/heure de la décision            |

---

## Variables d'environnement

```env
PORT=3001
NODE_ENV=development

# MySQL
DATABASE_URL=mysql://root:password@localhost:3306/audit_db

# RabbitMQ
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

> ⚠️ En production, remplacer `localhost` par les noms de conteneurs : `mysql`, `rabbitmq`.

---

## API REST

Base URL (directe) : `http://localhost:3001`

### Logs d'Audit

| Méthode  | Endpoint                              | Auth | Description                                    |
|----------|---------------------------------------|------|------------------------------------------------|
| `GET`    | `/audit/logs`                         | Oui  | Rechercher dans les logs (filtrés)             |
| `GET`    | `/audit/logs/:id`                     | Oui  | Détail d'un log d'audit                        |
| `GET`    | `/audit/logs/entite/:type/:id`        | Oui  | Tous les logs d'une entité spécifique          |
| `GET`    | `/audit/logs/user/:userId`            | Oui  | Tous les logs d'un utilisateur                 |
| `POST`   | `/audit/verify`                       | Oui  | Vérifier l'intégrité de la chaîne de hachage  |

### Incidents IA

| Méthode  | Endpoint                              | Auth | Description                                    |
|----------|---------------------------------------|------|------------------------------------------------|
| `GET`    | `/audit/incidents-ia`                 | Oui  | Lister les incidents IA (filtrés par statut)   |
| `GET`    | `/audit/incidents-ia/:id`             | Oui  | Détail d'un incident IA                        |
| `PATCH`  | `/audit/incidents-ia/:id/statut`      | Oui  | Mettre à jour le statut d'un incident          |
| `POST`   | `/audit/incidents-ia/:id/decisions`   | Oui  | Ajouter une décision à un incident             |

---

## Messagerie RabbitMQ

**Exchange** : `al-mizan.events` (type: `topic`, durable: `true`)

> Le service utilise `@golevelup/nestjs-rabbitmq` avec le décorateur `@RabbitSubscribe`.

### Événements consommés

| Routing Key                    | Source                | Action réalisée                              |
|--------------------------------|-----------------------|----------------------------------------------|
| `ao.created`                   | appel-offres-service  | Log : création d'AO                          |
| `ao.published`                 | appel-offres-service  | Log : publication d'AO                       |
| `ao.status_changed`            | appel-offres-service  | Log : changement de statut AO                |
| `ao.attribution.provisoire`    | appel-offres-service  | Log : attribution provisoire                 |
| `ao.attribution.definitive`    | appel-offres-service  | Log : attribution définitive                 |
| `ao.annule`                    | appel-offres-service  | Log : annulation AO                          |
| `soumission.deposee`           | soumission-service    | Log : dépôt d'une soumission                 |
| `evaluation.cloturee`          | evaluation-service    | Log : clôture évaluation                     |
| `recours.depose`               | recours-service       | Log : dépôt recours                          |
| `recours.accepte`              | recours-service       | Log : recours accepté                        |
| `recours.rejete`               | recours-service       | Log : recours rejeté                         |
| `user.registered`              | auth-service          | Log : inscription utilisateur                |
| `ao.gre_a_gre.submitted`       | appel-offres-service  | Log + Incident IA (analyse conformité)       |
| `ao.gre_a_gre.validated`       | appel-offres-service  | Log : décision gré-à-gré                     |

---

## Commandes utiles

### Développement local

```bash
npm install
npm run start:dev   # Hot-reload NestJS
npm run build       # Compilation TypeScript
npm start           # Production
```

### Base de données

```bash
npm run prisma:generate   # Générer le client Prisma
npm run prisma:migrate    # Créer et appliquer une migration
npx prisma db push        # Appliquer le schéma (dev rapide)
npx prisma studio         # Interface graphique Prisma
```

### Tests

```bash
npm test
npm run test:e2e
```

---

## Docker

### Build de l'image

```bash
docker build -t al-mizan-audit-service .
```

### Notes importantes sur le Dockerfile

- Image de base : `node:20-alpine`
- Prisma avec `binaryTargets = ["native", "linux-musl-openssl-3.0.x"]` pour Alpine.
- Au démarrage : `npx prisma db push && node dist/main.js`

### Déploiement via docker-compose

```bash
docker-compose up -d audit-service
docker-compose logs -f audit-service
```

---

*Maintenu par l'équipe Al-Mizan — voir `al-mizan-deployments` pour la configuration de déploiement complète.*
