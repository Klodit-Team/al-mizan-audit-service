# ms-audit-logger

Microservice NestJS d'audit pour un système universitaire distribué. Il journalise les actions, gère les incidents IA et expose une API de consultation avec vérification d'intégrité SHA-256.

## Démarrage rapide

- Copiez `.env.example` vers `.env` et ajustez les valeurs si besoin.
- Démarrez PostgreSQL et RabbitMQ via Docker Compose.
- Lancez le microservice en local ou via Docker.

## Fonctionnalités clés

- Journalisation append-only des actions avec hash chainé.
- Consultation paginée des logs et historiques d'entités.
- Gestion des incidents IA (création, résolution, statut).
- Journal des décisions IA/humaines/système.
- Vérification planifiée et manuelle de l'intégrité des logs.

## Schéma global (Vue d'ensemble)

Le microservice s'appuie sur trois tables principales :

- `audit_logs` : journal append-only de toutes les actions des microservices.
- `incidents_ia` : suivi des incidents IA détectés et leur résolution.
- `logs_ia_decisions` : traçabilité des décisions IA/humaines/système liées aux incidents.

### Relations et règles métiers

- `audit_logs` est strictement append-only (aucun UPDATE/DELETE).
- `incidents_ia` peut avoir plusieurs `logs_ia_decisions` (relation 1→N).
- La chaîne de hash SHA-256 assure l'intégrité des logs d'audit.
- Les statuts et types d'incidents sont contrôlés par enums.

## Endpoints

- `GET /health`
- `GET /audit/logs`
- `GET /audit/logs/:id`
- `GET /audit/logs/entite/:entite/:entite_id`
- `POST /incidents`
- `GET /incidents`
- `GET /incidents/:id`
- `PATCH /incidents/:id/resolve`
- `PATCH /incidents/:id/statut`
- `POST /decisions`
- `GET /decisions/incident/:incident_id`
- `GET /integrity/verify`
- `GET /integrity/status`
