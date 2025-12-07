# 🏙️ Highway Maker V4 - City Builder

**Professional city-building simulation inspired by Cities: Skylines**

![Version](https://img.shields.io/badge/version-4.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🎮 About

Highway Maker V4 is a comprehensive city-building simulation game. Design highway networks, manage zones, provide utilities and services, build public transport, and watch your city grow with thousands of simulated citizens.

## ✨ Core Features

### 🏗️ Advanced Zoning (4 Types × 3 Densities)
- **Residential** 🏠 - Housing for citizens
- **Commercial** 🏢 - Shops and businesses
- **Industrial** 🏭 - Factories and warehouses
- **Office** 🏛️ - Corporate buildings
- Each with Low, Medium, and High density options

### ⚡ Utilities Management
- **Power**: Coal, Nuclear, Wind, Solar plants
- **Water**: Pumping stations and treatment facilities
- **Sewage**: Outlets and treatment plants
- Full network simulation with coverage tracking

### 🏥 City Services
- **Police** 👮 - Safety and crime reduction
- **Fire** 🚒 - Fire protection
- **Healthcare** 🏥 - Clinics and hospitals
- **Education** 🎓 - Schools and universities
- **Parks** 🌳 - Recreation and happiness

### 🚇 Public Transport
- **Bus** 🚌 - Local transport ($500/stop)
- **Metro** 🚇 - Underground rapid transit ($5k/station)
- **Train** 🚆 - Regional rail ($8k/station)
- Create routes, manage ridership, track efficiency

### 🗺️ Districts & Policies
- Paint custom district boundaries
- 12 policy types (taxes, eco-zones, restrictions)
- Adjust tax rates per district (-29% to +29%)
- Specialized zones for unique gameplay

### 👥 Demographics Simulation
- Individual citizen simulation
- Age, employment, education tracking
- Life cycles and population growth
- Happiness and unemployment monitoring

## 🎨 Modern UI Components

### MainMenuV4
Futuristic glassmorphism design with:
- 30 animated floating particles
- City skyline silhouette SVG
- Career vs Sandbox mode selection
- Smooth Framer Motion animations

### LoadingScreenV4
Engaging loading experience with:
- 5 animated buildings growing with progress
- Window lighting effects
- Pro tips and feature badges
- Stage-based progress messages

### CityBuilderHUD
Complete game interface showing:
- **Top Bar**: Real-time balance, monthly income/expenses
- **Center**: Population, area, happiness stats
- **Left Panel**: RCI demand bars (color-coded)
- **Right Panel**: Utilities and service coverage
- **Notifications**: Budget crisis alerts

### BuildTools
Comprehensive build menu with:
- **5 Tabs**: Zones, Utilities, Services, Transport, Districts
- **24 Buildable Items**: Complete construction options
- **Affordability Checks**: Items disabled when broke
- **Visual Feedback**: Hover effects and selection states

## 🎮 Controls

**Building**: Click items in BuildTools → Click map to place  
**Camera**: WASD/Arrows to pan, Mouse wheel to zoom  
**Hotkeys**: 
- `Ctrl+P` - Performance monitor
- `Escape` - Pause/cancel

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Game opens at `http://localhost:5173`

## 🛠️ Tech Stack

- **React 19** + **TypeScript 5.9**
- **Three.js** + **React Three Fiber** - 3D rendering
- **Framer Motion** - Animations
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 📦 Project Structure

```
src/
├── components/
│   ├── UI/
│   │   ├── MainMenuV4.tsx           # Modern main menu
│   │   ├── LoadingScreenV4.tsx      # Animated loading
│   │   ├── CityBuilderHUD.tsx       # Game HUD
│   │   └── BuildTools.tsx           # Build menu
│   ├── Scene.tsx                     # 3D scene
│   └── ...                           # Other 3D components
├── systems/
│   ├── CitiesSkylinesSystemV4.tsx   # Master coordinator
│   ├── ZoningSystemV4.ts            # Zone management
│   ├── DistrictSystemV4.ts          # Districts & policies
│   ├── UtilitiesSystemV4.ts         # Power/water/sewage
│   ├── ServicesSystemV4.ts          # City services
│   ├── PublicTransportSystemV4.ts   # Transport routes
│   └── DemographicsSystemV4.ts      # Citizen simulation
├── store/
│   └── gameStore.ts                  # Global state
└── utils/                            # Helper utilities
```

## 📚 Documentation

- **CITIES_SKYLINES_V4.md** - Complete feature guide (all 7 systems)
- **QUICK_START_V4.md** - Integration tutorial
- **V4_UI_COMPLETE.md** - UI component documentation
- **ROADMAP.md** - Future plans
- **CHANGELOG.md** - Version history

## 🎯 Game Modes

**Career Mode**: Start with limited budget, unlock progressively  
**Sandbox Mode**: Unlimited funds, creative freedom

## 💰 Economy

- **Income**: Taxes from zones, varies by density
- **Expenses**: Construction, maintenance, utilities, services
- **Budget Tracking**: Real-time profit/loss monitoring
- **Crisis Alerts**: Red notifications when balance < 0

## 🎨 Design Language

- **Glassmorphism**: `backdrop-blur-xl`, translucent panels
- **Gradients**: Blue → Purple → Pink accent colors
- **Animations**: Smooth Framer Motion transitions
- **Responsive**: Hover states, disabled states, visual cues

## 🤝 Contributing

Educational project showcasing:
- React + Three.js integration
- Complex state management patterns
- City simulation algorithms
- Modern UI/UX design

Contributions welcome via Pull Requests!

## 📝 License

MIT License - Free for learning and experimentation

## 🙏 Acknowledgments

Inspired by **Cities: Skylines** (Colossal Order) and **SimCity** (Maxis)

Built with ❤️ using React, Three.js, and TypeScript

---

**Highway Maker V4** - Professional City Building Simulation
