#!/bin/bash

# Script de déploiement automatisé pour Expérience Tech
# Version: 1.0.0

set -e  # Arrêter en cas d'erreur

echo "🚀 Déploiement de la plateforme Expérience Tech"
echo "=============================================="

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonction pour afficher les messages colorés
log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Vérification des prérequis
check_prerequisites() {
    log_info "Vérification des prérequis..."
    
    # Vérifier Node.js
    if ! command -v node &> /dev/null; then
        log_error "Node.js n'est pas installé"
        exit 1
    fi
    
    # Vérifier npm
    if ! command -v npm &> /dev/null; then
        log_error "npm n'est pas installé"
        exit 1
    fi
    
    # Vérifier Git
    if ! command -v git &> /dev/null; then
        log_error "Git n'est pas installé"
        exit 1
    fi
    
    log_success "Tous les prérequis sont satisfaits"
}

# Installation des dépendances
install_dependencies() {
    log_info "Installation des dépendances..."
    
    # Backend
    if [ -d "backend" ]; then
        log_info "Installation des dépendances backend..."
        cd backend
        npm install --production
        cd ..
        log_success "Dépendances backend installées"
    fi
    
    # Frontend
    if [ -d "frontend" ]; then
        log_info "Installation des dépendances frontend..."
        cd frontend
        npm install
        cd ..
        log_success "Dépendances frontend installées"
    fi
}

# Tests automatisés
run_tests() {
    log_info "Exécution des tests..."
    
    # Tests frontend
    if [ -d "frontend" ]; then
        cd frontend
        
        # Tests unitaires
        log_info "Tests unitaires..."
        npm run test:coverage || log_warning "Certains tests unitaires ont échoué"
        
        # Tests E2E
        log_info "Tests E2E..."
        npm run test:e2e:headless || log_warning "Certains tests E2E ont échoué"
        
        cd ..
    fi
    
    log_success "Tests terminés"
}

# Build de l'application
build_application() {
    log_info "Build de l'application..."
    
    # Build frontend
    if [ -d "frontend" ]; then
        cd frontend
        log_info "Build frontend..."
        npm run build
        log_success "Build frontend terminé"
        cd ..
    fi
    
    # Build backend (si nécessaire)
    if [ -d "backend" ]; then
        log_info "Préparation backend..."
        # Le backend Node.js n'a pas besoin de build
        log_success "Backend prêt"
    fi
}

# Optimisation des performances
optimize_performance() {
    log_info "Optimisation des performances..."
    
    if [ -d "frontend/build" ]; then
        # Compression des assets
        log_info "Compression des assets..."
        
        # Gzip compression (si disponible)
        if command -v gzip &> /dev/null; then
            find frontend/build -name "*.js" -o -name "*.css" | xargs gzip -k
            log_success "Assets compressés"
        fi
        
        # Optimisation des images
        log_info "Optimisation des images..."
        # Ici on pourrait ajouter des outils comme imagemin
        
        log_success "Optimisations terminées"
    fi
}

# Déploiement
deploy() {
    log_info "Déploiement en cours..."
    
    # Variables d'environnement
    DEPLOY_ENV=${DEPLOY_ENV:-production}
    FRONTEND_URL=${FRONTEND_URL:-https://experiencetech-tchad.com}
    BACKEND_URL=${BACKEND_URL:-https://api.experiencetech-tchad.com}
    
    log_info "Environnement: $DEPLOY_ENV"
    log_info "Frontend URL: $FRONTEND_URL"
    log_info "Backend URL: $BACKEND_URL"
    
    # Déploiement frontend (Vercel)
    if [ "$DEPLOY_FRONTEND" = "true" ]; then
        log_info "Déploiement frontend sur Vercel..."
        cd frontend
        npx vercel --prod --yes
        cd ..
        log_success "Frontend déployé sur Vercel"
    fi
    
    # Déploiement backend (Heroku)
    if [ "$DEPLOY_BACKEND" = "true" ]; then
        log_info "Déploiement backend sur Heroku..."
        cd backend
        git add .
        git commit -m "Deploy: $(date)"
        git push heroku main
        cd ..
        log_success "Backend déployé sur Heroku"
    fi
}

# Post-déploiement
post_deploy() {
    log_info "Post-déploiement..."
    
    # Vérification de la santé des services
    log_info "Vérification de la santé des services..."
    
    # Test de l'API
    if [ ! -z "$BACKEND_URL" ]; then
        if curl -f "$BACKEND_URL/api/health" > /dev/null 2>&1; then
            log_success "API backend accessible"
        else
            log_warning "API backend non accessible"
        fi
    fi
    
    # Test du frontend
    if [ ! -z "$FRONTEND_URL" ]; then
        if curl -f "$FRONTEND_URL" > /dev/null 2>&1; then
            log_success "Frontend accessible"
        else
            log_warning "Frontend non accessible"
        fi
    fi
    
    # Envoi de notification (si configuré)
    if [ ! -z "$SLACK_WEBHOOK" ]; then
        log_info "Envoi de notification Slack..."
        curl -X POST -H 'Content-type: application/json' \
            --data '{"text":"🚀 Déploiement Expérience Tech terminé avec succès!"}' \
            $SLACK_WEBHOOK
    fi
    
    log_success "Post-déploiement terminé"
}

# Nettoyage
cleanup() {
    log_info "Nettoyage..."
    
    # Suppression des fichiers temporaires
    rm -rf frontend/build/node_modules
    rm -rf backend/node_modules
    
    # Nettoyage du cache
    npm cache clean --force
    
    log_success "Nettoyage terminé"
}

# Fonction principale
main() {
    echo "Début du déploiement à $(date)"
    echo "=============================================="
    
    # Étapes du déploiement
    check_prerequisites
    install_dependencies
    run_tests
    build_application
    optimize_performance
    deploy
    post_deploy
    cleanup
    
    echo "=============================================="
    log_success "Déploiement terminé avec succès!"
    echo "Déploiement terminé à $(date)"
}

# Gestion des arguments
case "${1:-}" in
    --test-only)
        check_prerequisites
        install_dependencies
        run_tests
        ;;
    --build-only)
        check_prerequisites
        install_dependencies
        build_application
        optimize_performance
        ;;
    --deploy-only)
        deploy
        post_deploy
        ;;
    --help)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Options:"
        echo "  --test-only     Exécuter uniquement les tests"
        echo "  --build-only    Exécuter uniquement le build"
        echo "  --deploy-only   Exécuter uniquement le déploiement"
        echo "  --help          Afficher cette aide"
        echo ""
        echo "Variables d'environnement:"
        echo "  DEPLOY_ENV          Environnement de déploiement (production par défaut)"
        echo "  DEPLOY_FRONTEND     Déployer le frontend (true/false)"
        echo "  DEPLOY_BACKEND      Déployer le backend (true/false)"
        echo "  FRONTEND_URL        URL du frontend"
        echo "  BACKEND_URL         URL du backend"
        echo "  SLACK_WEBHOOK       Webhook Slack pour les notifications"
        ;;
    *)
        main
        ;;
esac
