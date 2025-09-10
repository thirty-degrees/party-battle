# Project Overview

**Party Battle** is a real-time multiplayer game platform built as an npm workspace with distinct backend and frontend packages. The architecture supports multiple mini-games (Potato, Snake, Croc) with live player interactions via WebSocket connections.

### Architecture

- **Backend** (`backend-party-battle`): Node.js server with Colyseus game rooms
- **Frontend** (`frontend-party-battle`): Expo/React Native mobile app
- **Shared Types** (`types-party-battle`): Shared TypeScript schemas and configs between frontend and backend

### Core Technologies

- **Real-time Engine**: Colyseus for authoritative server game rooms
- **Frontend Framework**: Expo SDK with React Native
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **UI Components**: GlueStack UI component library (V3)

## Setup

### Workspace Installation
```bash
npm ci

# Build shared types first
npm run build --workspace=types-party-battle
```

### Development Environment
```bash
# Start backend development server (stays open until canceled)
npm run dev --workspace=backend-party-battle

# Start frontend development server (stays open until canceled)
npm run start --workspace=frontend-party-battle
```

## Test & Lint

### Testing Framework
```bash
npm test
```

### Linting & Code Quality
```bash
npm run lint
npm run lint:fix
```

## PR instructions

- This project uses the Release-Please commit style.
- PR Title format: type: description

types
- `feat`: New features
- `fix`: Bug fixes
- `deps`: Dependencies

## Coding Guidelines

- NEVER write comments in code. Write self-documenting code instead!
- Use existing UI components if possible. If no matching component is available, copy one from gluestack ui v3 into the components/ui directory
- Prefer tailwind over custom style props
- React Native does not support all features which are available in web browsers
