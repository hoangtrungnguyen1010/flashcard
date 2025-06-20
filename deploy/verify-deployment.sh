#!/bin/bash

# FlashcardApp Deployment Verification Script
# This script verifies that the application is ready for deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

print_header() {
    echo -e "${BLUE}=== $1 ===${NC}"
}

# Check if file exists
check_file() {
    if [ -f "$1" ]; then
        print_status "$1 exists"
        return 0
    else
        print_error "$1 missing"
        return 1
    fi
}

# Check if directory exists
check_directory() {
    if [ -d "$1" ]; then
        print_status "$1 exists"
        return 0
    else
        print_error "$1 missing"
        return 1
    fi
}

# Check if environment variable is set
check_env_var() {
    if [ -n "${!1}" ]; then
        print_status "$1 is set"
        return 0
    else
        print_warning "$1 is not set"
        return 1
    fi
}

# Check if command exists
check_command() {
    if command -v "$1" &> /dev/null; then
        print_status "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Main verification function
verify_deployment() {
    local errors=0
    local warnings=0
    
    print_header "FlashcardApp Deployment Verification"
    
    # Check project structure
    print_header "Project Structure"
    check_file "server/flashcards-api/main.py" || ((errors++))
    check_file "server/flashcards-api/requirements.txt" || ((errors++))
    check_file "server/flashcards-api/Dockerfile" || ((errors++))
    check_file "server/flashcards-api/docker-compose.yml" || ((errors++))
    check_file "client/package.json" || ((errors++))
    check_file "client/App.tsx" || ((errors++))
    
    # Check deployment files
    print_header "Deployment Files"
    check_file "deploy/aws-deploy.sh" || ((errors++))
    check_file "deploy/aws-config.sh" || ((errors++))
    check_file "deploy/terraform/main.tf" || ((errors++))
    check_file "deploy/terraform/variables.tf" || ((errors++))
    
    # Check configuration files
    print_header "Configuration Files"
    check_file ".gitignore" || ((errors++))
    check_file "README.md" || ((errors++))
    check_file "DEPLOYMENT_CHECKLIST.md" || ((errors++))
    
    # Check if .env files are properly ignored
    print_header "Security Check"
    if grep -q "\.env" .gitignore; then
        print_status ".env files are in .gitignore"
    else
        print_error ".env files are not in .gitignore"
        ((errors++))
    fi
    
    if grep -q "\.pem" .gitignore; then
        print_status ".pem files are in .gitignore"
    else
        print_error ".pem files are not in .gitignore"
        ((errors++))
    fi
    
    # Check for hardcoded secrets
    print_header "Secret Check"
    if grep -r "sk-" server/ 2>/dev/null | grep -v ".git" | grep -v "__pycache__" > /dev/null; then
        print_error "Found potential hardcoded OpenAI API keys"
        ((errors++))
    else
        print_status "No hardcoded OpenAI API keys found"
    fi
    
    if grep -r "your-secret-key" server/ 2>/dev/null | grep -v ".git" | grep -v "__pycache__" > /dev/null; then
        print_warning "Found placeholder secret keys (should be replaced in production)"
        ((warnings++))
    else
        print_status "No placeholder secret keys found"
    fi
    
    # Check dependencies
    print_header "Dependencies"
    check_file "server/flashcards-api/requirements.txt" || ((errors++))
    check_file "client/package.json" || ((errors++))
    
    # Check if required packages are in requirements.txt
    if grep -q "openai" server/flashcards-api/requirements.txt; then
        print_status "OpenAI package is in requirements.txt"
    else
        print_error "OpenAI package is missing from requirements.txt"
        ((errors++))
    fi
    
    if grep -q "google-search-results" server/flashcards-api/requirements.txt; then
        print_status "SerpAPI package is in requirements.txt"
    else
        print_error "SerpAPI package is missing from requirements.txt"
        ((errors++))
    fi
    
    # Check Docker configuration
    print_header "Docker Configuration"
    if grep -q "EXPOSE 8000" server/flashcards-api/Dockerfile; then
        print_status "Dockerfile exposes port 8000"
    else
        print_error "Dockerfile does not expose port 8000"
        ((errors++))
    fi
    
    if grep -q "HEALTHCHECK" server/flashcards-api/Dockerfile; then
        print_status "Dockerfile has health check"
    else
        print_error "Dockerfile missing health check"
        ((errors++))
    fi
    
    # Check API endpoints
    print_header "API Endpoints"
    if grep -q "/health" server/flashcards-api/main.py; then
        print_status "Health check endpoint exists"
    else
        print_error "Health check endpoint missing"
        ((errors++))
    fi
    
    if grep -q "search" server/flashcards-api/main.py; then
        print_status "Search router is included"
    else
        print_error "Search router is not included"
        ((errors++))
    fi
    
    # Check client configuration
    print_header "Client Configuration"
    if grep -q "API_BASE_URL" client/src/utils/api.ts; then
        print_status "API base URL is configurable"
    else
        print_error "API base URL is not configurable"
        ((errors++))
    fi
    
    # Check environment variables
    print_header "Environment Variables"
    check_env_var "OPENAI_API_KEY" || ((warnings++))
    check_env_var "SERPAPI_KEY" || ((warnings++))
    
    # Check tools
    print_header "Required Tools"
    check_command "docker" || ((warnings++))
    check_command "aws" || ((warnings++))
    check_command "terraform" || ((warnings++))
    
    # Summary
    echo ""
    print_header "Verification Summary"
    echo "Errors: $errors"
    echo "Warnings: $warnings"
    
    if [ $errors -eq 0 ]; then
        print_status "✅ Deployment verification passed!"
        if [ $warnings -gt 0 ]; then
            print_warning "⚠️  There are $warnings warnings to address"
        fi
        return 0
    else
        print_error "❌ Deployment verification failed with $errors errors"
        return 1
    fi
}

# Run verification
verify_deployment 