# Share Market n8n

A full-stack stock market automation platform that combines React, Node.js, MongoDB, and n8n to automate market-related workflows.

## Features

- Stock market workflow automation
- React frontend
- Node.js backend
- MongoDB database integration
- n8n workflow support
- Simple and extensible architecture

## Tech Stack

- React
- TypeScript
- Node.js
- Express
- MongoDB
- n8n

## Project Structure

```
sharemarket_n8n/
├── frontend/
├── backend/
├── docker-compose.yml
└── README.md
```

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/sahilmane69/sharemarket_n8n.git
cd sharemarket_n8n
```

### Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### Environment Variables

Create a `.env` file in the backend directory and add the required environment variables.

### Run the Project

```bash
# Backend
npm run dev

# Frontend
npm run dev
```

## Deployment

Frontend and backend can be deployed independently. MongoDB Atlas is recommended for database hosting.

## License

MIT
