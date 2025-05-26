# friendster-be

A simple Express.js backend for securely serving Firebase configuration (e.g. API keys) to a frontend application.

## 📁 Project Structure

friendster-be/
├── src/
│ ├── routes/
│ │ └── api.ts # API route handler for /api/getApiKey
│ └── index.ts # Express app setup and server entry point
├── .env # Environment variables (e.g. FIREBASE_API_KEY)
├── .gitignore
├── package.json
├── tsconfig.json # TypeScript configuration
└── README.md # This file


## 🚀 Getting Started

1. Clone the repo:

   ```bash
   git clone https://github.com/yourusername/friendster-be.git
   cd friendster-be

2. Install Dependencies

   ```bash
   npm install

3. Run the Server

   For development with automatic reloads:

   ```bash
   npm run dev

   To compile and run the production server:

   npm run build
   npm start

4. API Endpoints

   GET /api/getApiKey
   Returns the Firebase API key stored in your .env.

   Example response:
   {
      "apiKey": "AIzaSyExample123"
   }

## SCRIPTS

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Starts dev server with ts-node-dev |
| `npm run build` | Compiles TypeScript to JavaScript  |
| `npm start`     | Runs compiled production build     |


## SECURITY NOTES
Do not expose any sensitive credentials or write-access keys through this API.

Consider additional authentication (e.g. IP filtering or tokens) before deploying to production.