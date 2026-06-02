# Backend Architecture Guide

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts              # Environment variables
│   │   └── database.ts         # MongoDB connection
│   ├── models/
│   │   ├── Workflow.ts         # Workflow schema
│   │   ├── Execution.ts        # Execution schema
│   │   └── Log.ts              # Log schema
│   ├── routes/
│   │   ├── workflows.ts        # Workflow routes
│   │   ├── executions.ts       # Execution routes
│   │   └── logs.ts             # Log routes
│   ├── controllers/
│   │   ├── workflowController.ts
│   │   ├── executionController.ts
│   │   └── logController.ts
│   ├── services/
│   │   ├── workflowService.ts
│   │   ├── executionService.ts
│   │   ├── logService.ts
│   │   └── nodeExecutors.ts    # Node execution handlers
│   ├── middleware/
│   │   └── index.ts            # CORS, error handling
│   ├── types/
│   │   ├── workflow.ts         # Core type definitions
│   │   └── api.ts              # API request/response types
│   ├── utils/
│   │   ├── error.ts            # Error handling
│   │   └── helpers.ts          # Utilities
│   └── server.ts               # Express app
├── dist/                       # Compiled JavaScript
├── package.json
├── tsconfig.json
└── .env
```

## Key Components

### 1. Configuration (`config/`)

**env.ts**: Loads and validates environment variables
```typescript
export const env = {
  PORT: 5000,
  MONGODB_URI: 'mongodb://localhost:27017/workflow_automation',
  // ...
};
```

**database.ts**: MongoDB connection and management
```typescript
connectDB()  // Connect to MongoDB
disconnectDB()  // Clean disconnect
```

### 2. Models (`models/`)

**Workflow.ts**: Stores workflow definitions
- Fields: name, description, nodes, edges, status, tags
- Indexes: None (small collection)

**Execution.ts**: Tracks workflow executions
- Fields: workflowId, status, nodeExecutions, finalOutput, timestamps
- Indexes: workflowId, createdAt

**Log.ts**: Stores execution logs
- Fields: executionId, nodeId, level, message, timestamp
- Indexes: executionId, nodeId, timestamp

### 3. Services (`services/`)

**workflowService.ts**
- `createWorkflow(data)`: Validate and create workflow
- `getWorkflow(id)`: Fetch single workflow
- `listWorkflows()`: List all workflows
- `updateWorkflow(id, data)`: Update workflow
- `deleteWorkflow(id)`: Delete workflow

**executionService.ts**
- `createExecution(workflowId)`: Create new execution
- `getExecution(id)`: Fetch execution details
- `listExecutions(workflowId)`: List executions
- `updateExecution(id, data)`: Update execution status

**logService.ts**
- `createLog(data)`: Add log entry
- `getExecutionLogs(executionId)`: Fetch all execution logs
- `getNodeLogs(executionId, nodeId)`: Fetch node-specific logs

**nodeExecutors.ts**: Executes individual node types
```typescript
executeTimerNode()    // Wait for duration
executeAPINode()      // Make HTTP request
executeAINode()       // Call AI model
executeLoggerNode()   // Log to database
```

### 4. Controllers (`controllers/`)

**workflowController.ts**
- HTTP handlers for workflow routes
- Calls workflowService methods
- Returns standardized JSON responses

**executionController.ts**
- Handles workflow execution
- Calls executeWorkflowAsync() for background execution
- Returns execution ID immediately (202 status)

**logController.ts**
- Returns execution logs
- Filters by nodeId if specified

### 5. Routes (`routes/`)

**workflows.ts**
```
POST   /api/workflows
GET    /api/workflows
GET    /api/workflows/:id
PUT    /api/workflows/:id
DELETE /api/workflows/:id
```

**executions.ts**
```
POST /api/executions/:workflowId/execute
GET  /api/executions
GET  /api/executions/:id
```

**logs.ts**
```
GET /api/logs/:executionId
GET /api/logs/:executionId/:nodeId
```

### 6. Middleware (`middleware/`)

**errorHandler**: Catches all errors and returns JSON
**corsMiddleware**: Allows frontend to call backend APIs

### 7. Utilities (`utils/`)

**error.ts**
```typescript
ApiError(statusCode, message)  // Custom error
handleError(error)             // Convert to HTTP response
```

**helpers.ts**
```typescript
generateId(prefix)           // UUID generation
sleep(ms)                    // Delay function
topologicalSort(nodes, edges)  // Execution order
validateWorkflow(nodes, edges)  // Validation logic
```

## Execution Engine

### Sequential Execution

```
1. Create Execution Record
   ↓
2. Build Node Map & Calculate Order
   ↓
3. For Each Node (in order):
   a. Mark as "running"
   b. Get input from previous nodes
   c. Execute node handler
   d. Store output
   e. Mark as "completed" or "failed"
   ↓
4. Finalize Execution
   - Mark as completed/failed
   - Calculate duration
   - Store final output
```

### Data Flow

```
NodeA Output: { value: 123 }
              ↓
NodeB Input: { nodeA-id: { value: 123 } }
NodeB Output: { result: 456 }
              ↓
NodeC Input: { nodeA-id: { value: 123 }, nodeB-id: { result: 456 } }
```

## Error Handling

1. **Node-Level Errors**: Caught in try-catch, stored in execution record
2. **Workflow-Level Errors**: Entire execution marked as failed
3. **Database Errors**: Logged and returned as 500 Internal Server Error
4. **Validation Errors**: Returned as 400 Bad Request

## TypeScript

### Non-null Assertions
```typescript
nodeId! // Tells TS the value exists
```

### Type Assertions
```typescript
node as TimerNodeConfig  // Cast to specific type
```

### Generics
```typescript
Promise<IWorkflow>  // Generic type parameter
Map<string, any>   // Type parameters
```

## Production Considerations

1. **Database**: Use MongoDB Atlas or managed service
2. **Error Tracking**: Integrate Sentry for production errors
3. **Logging**: Use structured logging (Winston, Pino)
4. **Security**: Add authentication/authorization
5. **Rate Limiting**: Prevent abuse
6. **Monitoring**: Track performance and uptime
7. **Scaling**: Use horizontal scaling with load balancer

## Development Commands

```bash
# Development server with hot reload
bun run dev

# Build for production
bun run build

# Run compiled version
bun start

# Type checking only
bun run lint
```
