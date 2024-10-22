# ats

Un projet de suivi de candidature et d'analyse de CV

# Backsetup :

Launch back :

```
uvicorn back.main:app --port 8000 --reload
```

# Back representation :

```
/my_fastapi_project
│
├── app/
│   ├── __init__.py
│   ├── main.py              # Point d'entrée de l'application (FastAPI instance et démarrage)
│   ├── core/                # Configuration principale de l'application
│   │   ├── __init__.py
│   │   ├── config.py        # Variables de configuration (base de données, clés secrètes, etc.)
│   │   └── security.py      # Gestion de la sécurité (authentification, permissions, etc.)
│   ├── schemas/             # Schémas Pydantic (requêtes et réponses)
│   │   ├── __init__.py
│   │   └── user_schem.py          # Exemple de schéma pour les données d'utilisateur
│   ├── api/                 # Endpoints de l'API (routes)
│   │   ├── __init__.py
│   │   │   ├── __init__.py
│   │   ├── endpoints/   # Fichiers pour chaque endpoint
│   │   │   ├── __init__.py
│   │   │   └── user.py  # Exemple de routes pour les opérations liées aux utilisateurs
│   │   └── router.py    # Enregistrement des routes (regroupe toutes les routes d'api_v1)
│   ├── services/                # Opérations CRUD
│   │   ├── __init__.py
│   │   └── user_services.py          # Logique CRUD pour les utilisateurs et de service
│   ├── db/                  # Gestion de la base de données
│   │   ├── models/              # Modèles Pydantic et ORM
│   │   │   ├── __init__.py
│   │   │   └── User.py          # Exemple de modèle de base de données pour un utilisateur
│   │   ├── __init__.py
│   │   ├── base.py          # Base ORM et création des tables
│   │   └── session.py       # Connexion et session avec la base de données
│   ├── utils/               # Utilitaires divers (fonctionnalités réutilisables)
│   │   ├── __init__.py
│   │   └── helpers.py       # Fonctions auxiliaires générales
│   └── tests/               # Tests pour l'application (à voir si l'on a le temps)
│       ├── __init__.py
│       ├── test_main.py     # Tests unitaires pour `main.py`
│       └── test_user.py     # Tests unitaires pour les fonctionnalités utilisateur
│
├── .env                     # Fichier de variables d'environnement
├── requirements.txt         # Liste des dépendances Python
└── Dockerfile               # Dockerisation de l'application (à add plus tard si le temps est à notre aventage)
```
