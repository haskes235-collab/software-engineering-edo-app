# EDMS — Document Management Module

A desktop application for managing documents in an Electronic Document Management System. Lab Assignment #3.

## Stack

- Electron 30 + React 18 + TypeScript
- SQLite via better-sqlite3
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
yarn install
```

### Development mode

```bash
yarn dev
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
│   │   │   ├── database.ts   # SQLite connection singleton
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

### better-sqlite3

Using better-sqlite3 in the Electron main process provides:
- Native SQLite driver without a separate WASM asset
- Simple synchronous API that fits Electron desktop apps well
- Direct file persistence without manual export/save steps

### Atomic versioning

Every document update is atomic — the previous content is saved as a new version row and the document update happen in a single transaction. If either fails, both are rolled back.
