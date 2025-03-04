# AUTOMATED-PSV-SEAT-RESERVATION-SYSTEM Setup

## 1. Create a `package.json`
Run the following command to create a `package.json` file:
```bash
pnpm init
```
## 2. Install the required dependencies
Run the following command to install the required dependencies:
```bash
pnpm add drizzle-orm pg dotenv
pnpm add -D drizzle-kit @types/pg
```
## 3. Install Dev Dependencies
Run the following command to install the dev dependencies:
```bash
pnpm add -D drizzle-kit @faker-js/faker @types/node pg tsx typescript
```
## Create a `.env` file
Create a `.env` file in the root directory and add the following environment variables:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=psv_seat_reservation_system
```
## 5. Create a tsconfig.json File
Run the following command to create a `tsconfig.json` file:
```bash
pnpm tsc --init
```

## Update the `tsconfig.json` file
Update the `tsconfig.json` file with the following configurations:
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```
## 6. Create a `src` Directory
Create a `src` directory in the root directory and add the following files:
- `index.ts`
- `database.ts`
- `migrations.ts`
- `server.ts`
- `middlewares.ts`
- `utils.ts`

```typescript
async function nameSalute(name: string) {
  console.log(`Hello, my name is ${name}`);
}

nameSalute("Gideon Ngetich");
```


## 6. Create a .gitignore File
Create a `.gitignore` file in the root directory and add the following files and directories:
```gitignore
node_modules
dist
.env
```
## 8. Update the package.json File
Update the `package.json` file with the following scripts:
```json
"scripts": {
  "dev": "tsx watch ./src/index.ts",
  "start": "node ./dist/index.js",
  "build": "tsc",
  "gen": "drizzle-kit generate",
  "migrate": "tsx src/drizzle/migrate.ts",
  "studio": "drizzle-kit studio",
  "push": "drizzle-kit generate && tsx src/drizzle/migrate.ts"
}
```
## 9. Run the Application
Run the following command to start the application:
```bash
pnpm run dev
```