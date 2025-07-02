# Build Instructions for Pet Shop Inventory Management

## Quick Start

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Build and Deploy
```bash
npm run build:move
```

### 3. Start the Server
```bash
npm start
```

## Detailed Process

### Building the Client
The React client needs to be built for production before serving:

1. **Build the React app:**
   ```bash
   cd client
   npm run build
   ```

2. **Move build folder to server:**
   ```bash
   Move-Item -Path "client\build" -Destination "server\build" -Force
   ```

### Server Configuration
The server (`server/index.js`) is configured to:
- Serve static files from `server/build/` directory
- Handle React routing with a catch-all route
- Serve API endpoints at `/user`, `/inventory`, `/sales`, `/report`

### Available Scripts

- `npm run build` - Build the React client only
- `npm run build:move` - Build and move to server directory
- `npm start` - Start the production server
- `npm run dev:client` - Start React development server
- `npm run dev:server` - Start Node.js development server
- `npm run install:all` - Install all dependencies

### Development vs Production

**Development:**
- React dev server: `http://localhost:3000`
- Node.js server: `http://localhost:5000`

**Production:**
- Single server: `http://localhost:5000` (serves both API and React app)

### File Structure After Build
```
petShop/
├── client/          # React source code
├── server/
│   ├── build/       # React production build (moved from client)
│   ├── index.js     # Server entry point
│   └── ...
└── package.json     # Root package with build scripts
```

## Troubleshooting

1. **Build folder not found:** Make sure to run `npm run build` in the client directory first
2. **Server won't start:** Check if port 5000 is available or change the port in `server/index.js`
3. **Static files not loading:** Verify the build folder is in the correct location (`server/build/`) 