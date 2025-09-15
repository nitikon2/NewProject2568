# Copilot Instructions for AI Agents

## Project Overview
- **Monorepo for Alumni Management System**
- Main structure: `alumni-management/` (backend: Node.js/Express, frontend: React)
- Data: MySQL (schema in `alumni-management/backend/*.sql`)
- Quick start: `start.bat` (runs both backend and frontend)

## Key Workflows
- **Backend**: `cd alumni-management/backend && npm install && npm run dev` or `node server.js`
- **Frontend**: `cd alumni-management/frontend && npm install && npm start`
- **Database**: MySQL 5.7+, schema setup via provided `.sql` scripts
- **User Guide**: See `alumni-management/USER_GUIDE.md` for feature and usage details

## Architecture & Patterns
- **Backend**: REST API, main entry: `server.js`, routes in `routes/`, DB logic in `db.js`
- **Frontend**: React, main pages in `src/components/pages/`, e.g., `WorkHistoryNew.js`
- **API**: `/api/work-history` (POST, PUT, etc.), see backend and frontend for request/response patterns
- **Data Flow**: React frontend → Express backend → MySQL
- **Batch/Manual Start**: Use `start.bat` for both servers, or start each manually

## Conventions & Tips
- **Port usage**: Frontend on 3000, backend on 5000 (default)
- **Error handling**: Check browser console, terminal output, and MySQL connection for issues
- **Dependencies**: If errors, try deleting `node_modules` and `package-lock.json`, then reinstall
- **Schema changes**: Update SQL scripts and backend models together
- **Feature work**: Follow patterns in `WorkHistoryNew.js` (frontend) and `routes/workHistory.js` (backend)
- **Localization**: Some docs and comments are in Thai; use translation if needed

## Key Files & Directories
- `alumni-management/backend/` — Node.js API, SQL scripts, server logic
- `alumni-management/frontend/` — React app, main UI logic
- `alumni-management/USER_GUIDE.md` — User and feature guide
- `start.bat` — Quick launcher for both servers

## External Integrations
- **MySQL**: Ensure DB is running and schema is loaded before backend start
- **Node.js**: Version 14+ recommended

---

**For more details, see the README files and `USER_GUIDE.md`.**
