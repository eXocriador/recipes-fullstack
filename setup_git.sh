#!/bin/bash

echo "Setting up Git repository and pushing to GitHub..."

# Initialize Git repository
git init

# Add remote origin
git remote add origin https://github.com/eXocriador/recipes-fullstack.git

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Fullstack Recipes App"

# Set main branch (GitHub default)
git branch -M main

# Push to GitHub (force push to overwrite empty repository)
git push -u origin main --force

echo "✓ Repository setup complete!"
echo "✓ All files pushed to https://github.com/eXocriador/recipes-fullstack.git"

