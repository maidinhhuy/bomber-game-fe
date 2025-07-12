# Copilot Instructions for Bomber Man Frontend

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a TypeScript-based frontend project for a Bomber Man game client built with Vite. The project includes:

- Canvas-based game rendering with HTML5 Canvas API
- WebSocket communication for real-time multiplayer gameplay  
- Modular TypeScript architecture with proper type safety
- Modern build tools and development workflow

## Code Style Guidelines
- Use TypeScript with strict mode enabled
- Follow modular architecture patterns with clear separation of concerns
- Use modern ES6+ features and async/await for asynchronous operations
- Implement proper error handling and logging
- Use descriptive variable and function names
- Add JSDoc comments for complex functions and classes

## Architecture Patterns
- **Renderer**: Handle all canvas drawing operations
- **WebSocket Manager**: Manage real-time communication with game server
- **Game State**: Centralized state management for game data
- **Input Handler**: Process keyboard and mouse inputs
- **UI Manager**: Handle user interface updates and interactions
- **Utils**: Shared utility functions and helpers

## Technical Specifications
- Target modern browsers with ES2020+ support
- Use Canvas API for 2D graphics rendering
- WebSocket for real-time communication
- TypeScript for type safety and better developer experience
- Vite for fast development and optimized production builds

## Game-Specific Context
- The game is a multiplayer Bomber Man clone
- Players move on a grid-based map and place bombs
- Features include player sprites, bomb animations, explosions, and tombstones
- Real-time updates for player movements, bomb placements, and explosions
- Scoreboard with kill counts and game over states
