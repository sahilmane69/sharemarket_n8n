# AutoFlow - AI-Powered Workflow Automation Platform

AutoFlow is a modern, open-source workflow automation platform inspired by n8n. It provides a visual interface to create, configure, and execute complex workflows with support for AI-powered automation, making it a lightweight alternative focused on AI-driven automations.

## ✨ Features

### Core Platform
- **Visual Workflow Builder**: Drag-and-drop interface for creating workflows using React Flow
- **Node Library**: Six essential node types for building powerful automations:
  - **Trigger**: Start workflows manually, on schedule, or via webhook
  - **API**: Make HTTP requests (GET, POST, PUT, DELETE, PATCH)
  - **AI**: Leverage AI models (OpenAI, Anthropic) for intelligent processing
  - **Condition**: Branch logic with AND/OR operators
  - **Email**: Send automated emails
  - **Database**: Query and manipulate databases

### Workflow Management
- **Save & Load**: Persistent storage using browser localStorage
- **Import/Export**: Exchange workflows as JSON files
- **Workflow Templates**: Pre-built templates for common automation patterns
- **Execution Logs**: Real-time execution tracking and state management

### Dark Theme
- Beautiful, modern dark-themed interface using Tailwind CSS
- Responsive design that works on all screen sizes
- Color-coded nodes for easy identification

### AI Stock Research Agent Template
A showcase template that demonstrates the platform's AI capabilities:
- Fetches real-time stock data via API
- Gathers latest news using web scraping
- Analyzes sentiment using AI
- Generates trading recommendations
- Sends comprehensive report via email
- Logs all results to database

## 🚀 Quick Start

### Installation

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   bun install
   # or
   npm install
   ```

3. **Start development server**:
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
# or
bun run build
```

## 📖 Usage Guide

### Creating a Workflow

1. **Go to Dashboard**: The home page displays all your workflows and templates
2. **Create New**: Click "New Workflow" to start from scratch
3. **Add Nodes**: Drag nodes from the left panel onto the canvas
4. **Connect Nodes**: Click and drag between node outputs and inputs
5. **Configure Nodes**: Click nodes to edit their settings
6. **Save Workflow**: Click "Save" to persist your workflow
7. **Execute**: Click "Execute" to run your workflow

### Using Templates

1. **Browse Templates**: Templates are displayed on the dashboard
2. **Use Template**: Click "Use Template" on any template card
3. **Edit**: The template workflow opens in the editor for customization
4. **Save**: Save your customized version

### AI Stock Research Agent Template

This template demonstrates a complete AI-powered workflow:

```
Trigger → Stock Data API → AI Sentiment Analysis → Trading Plan → Email Report
              ↓                      ↓
            News API ─────────────────┘
                                      ↓
                                   Log to DB
```

**Flow**:
1. **Trigger**: Start the workflow manually
2. **Fetch Stock Data**: API call to get current stock prices
3. **Gather News**: API call to retrieve recent news articles
4. **AI Analysis**: Combine data and use AI to analyze sentiment
5. **Generate Plan**: AI creates trading recommendations
6. **Send Email**: Email report to trader
7. **Log Results**: Store analysis in database for historical tracking

## 🏗️ Architecture

### Technology Stack
- **Frontend Framework**: React 19 with TypeScript
- **Visual Editor**: React Flow
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **Router**: React Router v7
- **Icons**: Lucide React

### Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── nodes/           # Node type components
│   │   ├── WorkflowCanvas   # Main canvas component
│   │   ├── NodePanel        # Node library panel
│   │   └── ExecutionPanel   # Execution logs panel
│   ├── pages/               # Page components
│   │   ├── Dashboard        # Workflows overview
│   │   └── WorkflowEditor   # Editor page
│   ├── lib/                 # Utilities and helpers
│   │   ├── workflowUtils    # Core workflow operations
│   │   └── templates        # Workflow templates
│   ├── types/               # TypeScript definitions
│   │   └── workflow         # Workflow type definitions
│   ├── App.tsx              # Root component
│   └── main.tsx             # Entry point
├── package.json
└── tsconfig.json
```

### Data Model

#### WorkflowData
```typescript
interface WorkflowData {
  id: string;
  name: string;
  description: string;
  nodes: NodeConfig[];
  edges: EdgeConfig[];
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}
```

#### NodeTypes
- **TriggerNodeConfig**: Defines workflow start conditions
- **APINodeConfig**: HTTP request configuration
- **AINodeConfig**: AI model and prompt settings
- **ConditionNodeConfig**: Branching logic
- **EmailNodeConfig**: Email sending settings
- **DatabaseNodeConfig**: Database operations

## 🎨 UI Components

### Dashboard
- Displays all saved workflows
- Shows workflow templates with preview
- Create, edit, delete, and run workflows
- Import workflows from JSON files

### Workflow Canvas
- **Canvas Area**: Visual representation of the workflow
- **Node Library**: Available nodes to drag onto canvas
- **Execution Logs**: Real-time execution tracking
- **Toolbar**: Save, Execute, Export, Import buttons
- **Controls**: Zoom, pan, fit to view

### Node Panel
- List of available node types
- Quick add buttons
- Delete selected node functionality

### Execution Panel
- Live execution logs
- Status indicators (pending, running, success, error)
- Execution duration and timestamps
- Clear logs button

## 🔧 API Integration

### Supported APIs
The platform supports any RESTful API:
- Authentication: Headers can include API keys
- HTTP Methods: GET, POST, PUT, DELETE, PATCH
- Request Bodies: JSON payload support
- Query Parameters: URL parameter support

### Example API Node Configuration
```typescript
{
  method: "GET",
  url: "https://api.example.com/stocks/AAPL",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_API_KEY"
  },
  params: {
    "interval": "1min"
  }
}
```

## 🤖 AI Integration

The platform supports multiple AI providers:
- **OpenAI**: GPT-4, GPT-3.5-turbo
- **Anthropic**: Claude models
- **Local**: Local model support

### AI Node Configuration
```typescript
{
  provider: "openai",
  model: "gpt-4",
  prompt: "Analyze the sentiment of these stock news articles",
  temperature: 0.7,
  maxTokens: 1000
}
```

## 💾 Storage

### LocalStorage
- All workflows are stored in browser localStorage
- Execution logs are persisted per workflow
- Workflows can be exported as JSON for backup

### Data Persistence
```typescript
// Save workflow
workflowUtils.saveWorkflowLocal(workflow);

// List all workflows
const workflows = workflowUtils.listWorkflowsLocal();

// Load specific workflow
const workflow = workflowUtils.loadWorkflowLocal(workflowId);

// Delete workflow
workflowUtils.deleteWorkflowLocal(workflowId);
```

## 🧪 Testing the Platform

### Manual Testing
1. **Create Workflow**: Build a simple workflow with 2-3 nodes
2. **Add Nodes**: Test adding each node type
3. **Connect Nodes**: Verify node connections work
4. **Save/Load**: Test saving and reloading workflows
5. **Execute**: Run workflows and check execution logs
6. **Templates**: Test creating workflows from templates

### Test Scenarios
- **Simple Flow**: Trigger → Email (basic setup)
- **API Integration**: Trigger → API → Email (with data passing)
- **Conditional Flow**: Trigger → Condition → Email (branching logic)
- **Complex Flow**: Use the AI Stock Research template

## 🚀 Advanced Features

### Workflow Execution Engine
- Sequential node execution
- Variable passing between nodes
- Error handling and retry logic
- Execution state management

### Template Library
Three pre-built templates:
1. **AI Stock Research Agent**: Full AI-powered analysis workflow
2. **Data Processing Pipeline**: Scheduled data fetching and transformation
3. **Conditional Notification**: Event-triggered notifications

### Export/Import
- Export workflows as JSON for version control
- Import workflows from JSON files
- Share workflows with team members

## 🔐 Security Notes

- **LocalStorage**: All data is stored locally in the browser
- **API Keys**: Configure API keys directly in node settings (consider environment variables for production)
- **CORS**: API calls may require CORS-enabled endpoints
- **No Backend**: This is a frontend-only application

## 📈 Performance

- **Lazy Loading**: Components load on demand
- **Memoization**: React components are optimized
- **Bundle Size**: ~435KB (gzipped ~139KB)
- **Fast Rendering**: React Flow optimized for large workflows

## 🛣️ Roadmap

Future enhancements:
- [ ] Backend API integration
- [ ] Cloud workflow synchronization
- [ ] Team collaboration features
- [ ] Workflow versioning
- [ ] Advanced scheduling (cron jobs)
- [ ] Custom node development
- [ ] Marketplace for templates and nodes
- [ ] Workflow performance analytics
- [ ] Error recovery and retry strategies
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Areas for improvement:
- Additional node types
- Enhanced AI integrations
- Better error handling
- Performance optimizations
- UI/UX improvements

## 📝 License

This project is open-source and available under the MIT License.

## 🙋 Support

For questions or issues:
1. Check the documentation above
2. Review example templates
3. Check browser console for errors
4. Verify API configurations

## 🎯 Use Cases

- **Stock Market Analysis**: Automated research and trading decisions
- **Data Pipeline**: Extract, transform, load (ETL) workflows
- **Email Marketing**: Conditional email campaigns
- **Monitoring & Alerts**: Watch systems and send notifications
- **Content Generation**: AI-powered content creation
- **Data Processing**: Automated data transformation
- **Report Generation**: Periodic report compilation and distribution

## 📞 Contact

AutoFlow - Making workflow automation accessible to everyone.

Built with ❤️ using React, TypeScript, Tailwind CSS, and React Flow.
