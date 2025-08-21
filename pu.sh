#!/bin/bash

# 🚀 eXocriador's Git Push Script
# Usage: ./pu.sh "your commit message"

# Colors for stylish output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Check if commit message is provided
if [ $# -eq 0 ]; then
    echo -e "${RED}❌ Error: No commit message provided!${NC}"
    echo -e "${YELLOW}Usage: ./pu.sh \"your commit message\"${NC}"
    echo -e "${BLUE}Example: ./pu.sh \"feat: add new feature\"${NC}"
    exit 1
fi

COMMIT_MESSAGE="$1"

echo -e "${CYAN}🚀 Git Push Script${NC}"
echo -e "${BLUE}📝 Commit:${NC} $COMMIT_MESSAGE"
echo ""

# Step 1: Git Add
echo -e "${PURPLE}📦 Adding files...${NC}"
if git add .; then
    echo -e "${GREEN}✅ Added${NC}"
else
    echo -e "${RED}❌ Failed to add files${NC}"
    exit 1
fi

# Step 2: Git Commit
echo -e "${PURPLE}💾 Committing...${NC}"
if git commit -m "$COMMIT_MESSAGE"; then
    echo -e "${GREEN}✅ Committed${NC}"
else
    echo -e "${RED}❌ Failed to commit${NC}"
    exit 1
fi

# Step 3: Git Push
echo -e "${PURPLE}🚀 Pushing...${NC}"
if git push; then
    echo -e "${GREEN}✅ Pushed${NC}"
else
    echo -e "${RED}❌ Failed to push${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}🎉 All done! Code is live on GitHub${NC}"
echo -e "${YELLOW}🕐 $(date)${NC}"
