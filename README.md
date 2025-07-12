# Bomber Man Frontend

A modern TypeScript-based frontend for the Bomber Man multiplayer game, built with Vite and modular architecture.

## 🎮 Features

- **Real-time Multiplayer**: WebSocket communication for live gameplay
- **Canvas-based Rendering**: Smooth 2D graphics with HTML5 Canvas
- **TypeScript**: Full type safety and modern development experience
- **Modular Architecture**: Clean separation of concerns
- **Responsive Design**: Works on both desktop and mobile devices
- **Modern Build Tools**: Vite for fast development and optimized production builds

## 🏗️ Architecture

The project follows a modular architecture with clear separation of concerns:

- **Game Engine** (`src/game.ts`): Main game class coordinating all systems
- **Renderer** (`src/renderer.ts`): Canvas-based graphics rendering
- **WebSocket Manager** (`src/websocketManager.ts`): Real-time server communication
- **Input Handler** (`src/inputHandler.ts`): Keyboard input processing
- **UI Manager** (`src/uiManager.ts`): User interface updates
- **Asset Manager** (`src/assetManager.ts`): Image and resource loading
- **Utils** (`src/utils.ts`): Shared utility functions
- **Types** (`src/types.ts`): TypeScript type definitions
- **Config** (`src/config.ts`): Game configuration constants

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 🎯 Game Controls

- **Arrow Keys**: Move your character
- **Spacebar**: Place bombs
- **Enter your name**: Join the game

## 🔧 Development

### Project Structure

```
src/
├── core/                    # Core game logic and types
│   ├── config.ts           # Game configuration constants
│   ├── constants.ts        # UI and game constants
│   ├── types.ts            # TypeScript type definitions
│   └── index.ts            # Core exports
│
├── managers/               # State and resource managers
│   ├── assetManager.ts     # Image and asset loading
│   ├── gameStateManager.ts # Game state management
│   ├── uiManager.ts        # UI state management
│   └── index.ts            # Manager exports
│
├── rendering/              # Graphics and rendering
│   ├── renderer.ts         # Main canvas renderer
│   ├── patternGenerator.ts # Texture pattern generation
│   └── index.ts            # Rendering exports
│
├── network/                # Network communication
│   ├── websocketManager.ts # WebSocket handling
│   └── index.ts            # Network exports
│
├── input/                  # Input handling
│   ├── inputHandler.ts     # Keyboard input processing
│   └── index.ts            # Input exports
│
├── ui/                     # UI components
│   ├── scoreboardComponent.ts # Scoreboard component
│   └── index.ts            # UI exports
│
├── utils/                  # Utility functions
│   ├── utils.ts            # Helper functions
│   └── index.ts            # Utils exports
│
├── styles/                 # Stylesheets
│   ├── style.css           # Base Vite styles
│   └── game-styles.css     # Game-specific styles
│
├── game.ts                 # Main game orchestrator
└── main.ts                 # Application entry point
```

### Architecture Benefits

- **Modular Design**: Each module has a single responsibility
- **Type Safety**: Full TypeScript coverage with strict typing
- **Scalable**: Easy to add new features and components
- **Maintainable**: Clear separation of concerns
- **Testable**: Isolated modules for easier unit testing
- **Performance**: Tree-shaking enabled for optimal bundle size

### Module Responsibilities

- **Core**: Central types, configuration, and constants
- **Managers**: State management and resource handling  
- **Rendering**: All graphics and visual effects
- **Network**: WebSocket communication with backend
- **Input**: User interaction and controls
- **UI**: User interface components
- **Utils**: Shared utility functions
- **Styles**: CSS styling and themes

### WebSocket Protocol

The frontend communicates with the Rust backend using WebSocket messages:

- **Incoming**: Player ID, Game State, Player Movement, Bomb Events
- **Outgoing**: Join Game, Move Commands, Bomb Placement

## 🎨 Customization

### Colors and Themes

Edit `src/config.ts` to modify:
- Game colors
- Bomb colors
- Hero sprites

### UI Styling

Edit `src/game-styles.css` to customize:
- Game container appearance
- Scoreboard styling
- Button designs

## 🐛 Troubleshooting

### Common Issues

1. **Images not loading**: Ensure image assets are in `public/static/images/`
2. **WebSocket connection failed**: Check server is running on correct port
3. **Build errors**: Run `npm run build` to check TypeScript errors

## 📦 Build Output

The production build generates:
- Optimized JavaScript bundles
- Minified CSS
- Static assets
- Source maps for debugging

## 🤝 Contributing

1. Follow TypeScript best practices
2. Maintain modular architecture
3. Add proper type definitions
4. Update documentation

## 📄 License

This project is part of the Bomber Man game implementation.
