# Configuration Dockerfile pour Anim'Média
# Image Docker optimisée pour la production

FROM python:3.11-slim

# Variables d'environnement
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    FLASK_ENV=production \
    FLASK_DEBUG=False

# Créer un utilisateur non-root pour la sécurité
RUN useradd --create-home --shell /bin/bash animmedia

# Définir le répertoire de travail
WORKDIR /app

# Copier les requirements et installer les dépendances
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copier le code de l'application
COPY --chown=animmedia:animmedia . .

# Créer les dossiers nécessaires
RUN mkdir -p logs backups && \
    chown -R animmedia:animmedia /app

# Passer à l'utilisateur non-root
USER animmedia

# Exposer le port
EXPOSE 8000

# Variables d'environnement de production
ENV SECRET_KEY=your-production-secret-key-change-me \
    JWT_SECRET_KEY=your-production-jwt-secret-change-me

# Commande de démarrage
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "--timeout", "120", "app:app"]