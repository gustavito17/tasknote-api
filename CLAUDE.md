# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TaskNote** is a full-stack task and note management system:
- **Backend** (`d:\MiApp\`): Node.js/Express REST API using Supabase as database
- **Mobile** (`d:\MiApp\mobile\`): Expo/React Native app (SDK 54, RN 0.81.5)

The mobile app is a **separate git repo** inside `mobile/` with its own `package.json`.

---

## Backend (root: `d:\MiApp\`)

### Commands
```bash
npm run dev          # Development with nodemon
npm start            # Production
npm test             # Jest with coverage
npm run test:watch   # Jest watch mode
npm run migrate      # Run Knex migrations (legacy, DB is Supabase now)
```

Single test file: `jest tests/unit/auth-service.test.js`

### Environment
Copy `.env.example` → `.env`. Required vars: `SUPABASE_URL`, `SUPABASE_KEY`, `JWT_SECRET`, `JWT_EXPIRES_IN`.  
Tests use `.env.test` (loaded automatically by `jest.config.js`).

### Architecture
Layered modular architecture under `src/modules/{auth,tasks,notes}/`:
- `presentation/` — Express routes + controllers
- `business-logic/` — Services (core logic lives here)
- `data-access/` — Repositories (Supabase queries) + model definitions
- `validators/` — Joi validation schemas

`src/shared/` contains middleware (`auth-middleware.js`, `error-handler.js`, `validator-middleware.js`) and utils used across all modules.

**Database**: Supabase (`src/config/supabase.js`). `knexfile.js` and `src/config/database.js` are legacy wrappers kept for compatibility — new code should use `supabase` directly.

**Auth flow**: JWT issued on login/register, verified by `auth-middleware.js` on protected routes.

**Notes are always scoped to a task**: `GET /api/tasks/:taskId/notes`, `POST /api/tasks/:taskId/notes`.

---

## Mobile (`d:\MiApp\mobile\`)

### Commands
```bash
# Run from d:\MiApp\mobile\
JAVA_HOME='D:\Android Studio\jbr' npx expo run:android   # Build & deploy to connected device
npx expo start                                             # Metro bundler (JS only, no native build)
```

### Environment
Copy `mobile/.env.example` → `mobile/.env`. Set `API_BASE_URL` to your local machine's IP when testing on a physical device (not `localhost`).

The API base URL resolution order in `src/api/client.ts`: `app.json extra.apiUrl` → `EXPO_PUBLIC_API_URL` → hardcoded `https://tasknote-api.onrender.com/api`.

### Architecture
```
mobile/src/
├── api/          # Axios client (singleton ApiClient) + per-resource modules (auth, tasks, notes)
├── context/      # React contexts (Auth, Task, Note, Network) — global state via useReducer
├── navigation/   # AppNavigator: RootStack → Auth stack OR Main tab navigator
├── screens/      # One file per screen; some have duplicate .js/.tsx (prefer .tsx)
├── components/   # Shared UI primitives
├── storage/      # AsyncStorage/SecureStore wrappers
└── types/        # TypeScript interfaces
```

**Auth is the root gate**: `AppNavigator` checks `useAuth().isAuthenticated` to render either Auth stack (Login/Register) or Main tab navigator (Home + Profile). Token is stored in `expo-secure-store`.

**Navigation structure**: RootStack → MainTab → HomeStack (Home → CreateTask → TaskDetail → CreateNote → NoteDetail).

### Android Build Configuration (Windows)
Critical settings already applied in this repo — do not change without reason:

| File | Key setting |
|------|-------------|
| `android/build.gradle` | `compileSdkVersion=36`, `ndkVersion="27.1.12297006"` |
| `android/gradle.properties` | `org.gradle.java.home=D:\\Android Studio\\jbr`, `newArchEnabled=true` |
| `android/local.properties` | `sdk.dir=D:\\android` |

- **JDK**: Must use `D:\Android Studio\jbr` (Java 21). System `JAVA_HOME` points to a nonexistent path — always pass `JAVA_HOME='D:\Android Studio\jbr'` or rely on `org.gradle.java.home`.
- **ADB**: Windows binaries are at `D:\android\platform-tools\adb.exe`. Run `adb devices` before building to ensure the device shows as `device` (not `unauthorized`).
- **NDK 27** is required for C++20 `std::format` used by React Native 0.81.5. NDK 26 will fail to compile.
- If cmake configuration fails with `CMAKE_CXX_COMPILER not set`: delete `.cxx/` directories inside affected `node_modules/*/android/` and rebuild.
- If build fails with `Invalid classfile header` on `expo-modules-core`: delete `node_modules/expo/node_modules/expo-modules-core/android/build/` and rebuild.
