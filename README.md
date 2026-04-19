# EDMS — Document Management Module

A desktop application for managing documents in an Electronic Document Management System. Lab Assignment #3.

## Stack

- Electron 30 + React 18 + TypeScript
- SQLite via sql.js (WASM)
- Vite / electron-vite

## Features

- Create, edit, and delete documents
- Automatic versioning on every save — full history preserved
- Browse version history and view content of any past version
- Document status lifecycle: DRAFT → PENDING → APPROVED / REJECTED → ARCHIVED
- Filter document list by status

## Architecture

Three-layer architecture: Presentation (React) → Service → Repository (SQLite).

Design pattern: **Repository** — data access logic is hidden behind an interface, keeping the service layer storage-agnostic.

## Getting started

### Install dependencies

```bash
npm install
```

### Development mode

```bash
npm run dev
```

### Production build

```bash
npm run build
```

## Project structure

```
├── electron/              # Electron main process
│   ├── main.ts           # Main process, IPC handlers, window creation
│   └── preload.ts        # contextBridge API exposure
├── src/
│   ├── shared/           # Shared types and utilities
│   │   ├── types.ts      # Domain types (Document, DocumentVersion, DTOs)
│   │   ├── ipcChannels.ts # IPC channel name constants
│   │   └── utils.ts      # UUID and date formatting helpers
│   ├── main/             # Main process logic
│   │   ├── db/
│   │   │   ├── database.ts   # SQLite singleton (sql.js)
│   │   │   └── migrations.ts # Schema and seed data
│   │   ├── repositories/
│   │   │   ├── IDocumentRepository.ts # Repository interface
│   │   │   └── DocumentRepository.ts  # SQLite implementation
│   │   └── services/
│   │       └── DocumentService.ts     # Business logic layer
│   └── renderer/         # React UI
│       ├── App.tsx       # Main app with hash routing
│       ├── electron.d.ts # Window.electronAPI type declarations
│       ├── components/
│       │   ├── DocumentList/     # Document list with filter
│       │   ├── DocumentEditor/   # Create/edit form
│       │   ├── VersionHistory/   # Version list component
│       │   └── StatusBadge/      # Color-coded status pill
│       ├── hooks/
│       │   └── useDocuments.ts   # IPC data-fetching hook
│       └── pages/
│           ├── DocumentsPage.tsx      # Main list page
│           └── DocumentDetailPage.tsx # Detail view with version history
└── package.json
```

## Design decisions

### Repository pattern

All data access is encapsulated behind `IDocumentRepository` interface. This allows:
- Swapping the storage engine without changing business logic
- Easy unit testing via mock implementations
- Clear boundary between data and service layers

### sql.js (WASM SQLite)

Using sql.js instead of better-sqlite3 to avoid native compilation requirements. This provides:
- Pure JavaScript/WASM implementation
- No Visual Studio C++ build tools required
- Same synchronous API pattern as better-sqlite3

### Atomic versioning

Every document update is atomic — the previous content is saved as a new version row and the document update happen in a single transaction. If either fails, both are rolled back.