# Git Commit Instructions for ContractMaster ERP

## Prerequisites
Make sure you have:
1. Git configured with your GitHub credentials
2. SSH key set up for git@github.com:pedrobomlimeira/Castela.git
3. Write access to the repository

## Step-by-Step Commands

### 1. Initialize Git (if not already done)
```bash
cd /path/to/your/project
git init
```

### 2. Add the remote repository
```bash
git remote add origin git@github.com:pedrobomlimeira/Castela.git
```

### 3. Check current status
```bash
git status
```

### 4. Add all project files
```bash
git add .
```

### 5. Create the commit with descriptive message
```bash
git commit -m "feat: Complete ContractMaster ERP system with partner address management

- Implemented comprehensive contract management system
- Added partner management with billing/shipping addresses
- Created neumorphic UI design system
- Integrated PostgreSQL with Drizzle ORM
- Added multilingual support (pt-BR/en-US)
- Implemented complete CRUD operations for all entities
- Added expandable address management with tabbed interface
- Created master-detail views for contracts and beneficiaries
- Integrated form validation and error handling
- Added responsive design with professional navigation"
```

### 6. Push to GitHub
```bash
git push -u origin main
```

## Alternative: If you need to force push (use carefully)
```bash
git push -f origin main
```

## Files Included in This Commit
- Complete React frontend with TypeScript
- Express.js backend with API endpoints
- PostgreSQL database schema with Drizzle ORM
- Comprehensive UI components with shadcn/ui
- Partner address management system
- Multi-language support
- Professional neumorphic design system
- All configuration files (package.json, tsconfig.json, etc.)

## Project Status Documentation
See PROJECT_STATUS.md for complete feature list and technical details.