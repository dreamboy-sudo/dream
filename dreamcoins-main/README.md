# DreamCoins - AI-Powered Token Launcher on Base

![DreamCoins](./public/og-image.png)

DreamCoins is an AI-powered token launcher built on Base (Ethereum L2) that leverages the WoW protocol. This project has been made available and released to the public domain. Users can "dream" tokens into existence by providing prompts that generate token metadata, imagery, and deploy them directly to the blockchain.

## 🌟 Features

- **AI-Powered Token Generation**: Multiple AI models (Dreamgirl, Dreamboy, Baldo, Thankful) to generate unique token concepts
- **One-Click Token Launch**: Seamless token deployment on Base through WoW protocol integration
- **Creator Fees**: Optional creator fees for token launchers (requires wallet connection)
- **Real-time Trading**: Integration with Uniswap, Dexscreener, and GeckoTerminal for immediate trading
- **Token Gallery**: Browse and discover launched tokens with real-time status updates
- **Buy & Burn Mechanism**: Protocol fees are used to buy and burn $DREAM tokens

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Privy for wallet authentication
- **Blockchain**: Base (Ethereum L2)
- **Smart Contracts**: WoW Protocol for token creation
- **State Management**: React Context API + SWR for data fetching
- **Type Safety**: TypeScript throughout

### Project Structure

```
dreamcoins-main/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes for backend logic
│   ├── frame/             # Frame page for social sharing
│   ├── profile/           # User profile page
│   ├── token/[id]/        # Individual token pages
│   ├── upload/            # Image upload page
│   └── wall/              # Token wall display
├── components/            
│   ├── app/               # Feature-specific components
│   ├── icons/             # Custom icon components
│   ├── layout/            # Layout components (Header, etc.)
│   ├── ui/                # Reusable UI components
│   └── abis/              # Smart contract ABIs
├── contexts/              # React context providers
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions and constants
├── prisma/                # Database schema and migrations
├── providers/             # App-wide providers
└── public/                # Static assets
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database
- Privy account for authentication
- Base RPC endpoint

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dreamcoins"

# Privy Authentication
NEXT_PUBLIC_PRIVY_APP_ID="your-privy-app-id"
PRIVY_APP_SECRET="your-privy-app-secret"

# API Configuration
API_TOKEN="your-api-token"
NEXT_PUBLIC_API_URL="http://localhost:3000"

# Chain Configuration
NEXT_PUBLIC_CHAIN_ID="8453"  # Base mainnet
APP_ENV="production"  # or "local" for development

# Optional: Analytics
NEXT_PUBLIC_VERCEL_ANALYTICS_ID="your-analytics-id"
```

### Installation

1. Clone the repository:
```bash
git clone [your-fork-url]
cd dreamcoins-main
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
```bash
pnpm prisma:generate
pnpm prisma:migrate
```

4. Run the development server:
```bash
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🎨 Development Patterns

### Component Architecture

The project follows a modular component architecture:

- **UI Components** (`/components/ui/`): Generic, reusable components from shadcn/ui
- **Feature Components** (`/components/app/`): Business logic components
- **Layout Components** (`/components/layout/`): App structure components

Example component pattern:
```tsx
// components/app/DreamCard.tsx
export default function DreamCard({ dream }: { dream: Dream }) {
  // Component logic here
}
```

### Data Fetching

Uses SWR for client-side data fetching with automatic revalidation:

```tsx
// hooks/getDreams.tsx
export function useDreams() {
  const { data, mutate, isLoading } = useSWR(
    '/api/dream',
    fetcher
  );
  // Auto-refresh every 5 seconds
  useInterval(() => mutate(), 5000);
  return { dreams: data?.data ?? [], isLoading, refresh: mutate };
}
```

### API Routes

API routes handle backend logic with proper validation:

```tsx
// app/api/dream/route.ts
export async function POST(req: Request) {
  const body = createDreamSchema.parse(await req.json());
  // Process and store dream
  return NextResponse.json(result);
}
```

### State Management

Global state uses React Context:

```tsx
// contexts/DreamModeContext.tsx
export function useDreamMode() {
  const context = useContext(DreamModeContext);
  return context;
}
```

### Styling Patterns

Uses Tailwind CSS with custom design tokens:

```tsx
// Consistent color scheme
<div className="text-dream-primary bg-white/10">
  {/* Component content */}
</div>
```

Custom animations and effects:
```css
/* tailwind.config.js */
animation: {
  'float': 'float 6s ease-in-out infinite',
  'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
}
```

## 🔧 Core Features Implementation

### Token Creation Flow

1. **Prompt Input**: User enters a creative prompt
2. **AI Generation**: Selected model generates token metadata
3. **Preview**: User previews and can regenerate
4. **Deployment**: Token deployed to Base via WoW protocol
5. **Trading**: Token immediately available on DEXs

### Smart Contract Integration

The app integrates with WoW Protocol contracts:

- **Token Proxy**: Handles token creation and initial liquidity
- **Protocol Rewards**: Manages fee distribution
- **Bonding Curve**: Determines token pricing

### Database Schema

Key models:
```prisma
model Dream {
  id        Int         @id
  prompt    String      // User's input prompt
  name      String?     // Generated token name
  ticker    String?     // Generated token ticker
  imageUrl  String?     // Generated token image
  address   String?     // Deployed contract address
  status    DreamStatus // PENDING | COMPLETED | FAILED
  user      User?       @relation
}
```

### Image Processing

- Supports image upload and cropping
- AI-generated images for tokens
- Stored in cloud storage with CDN delivery

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Lint code:
```bash
pnpm lint
```

## 📦 Building for Production

1. Build the application:
```bash
pnpm build
```

2. Start the production server:
```bash
pnpm start
```

## 🚢 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy with automatic CI/CD

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm build
CMD ["pnpm", "start"]
```

## 🔒 Security Considerations

- All token deployments go through audited WoW protocol contracts
- User authentication via Privy with secure wallet management
- Input validation and sanitization on all endpoints
- Rate limiting on API routes
- Secure environment variable management

## 🤝 Contributing

The community is encouraged to fork the repository and launch your own version of DreamCoins.

### Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Keep components small and focused
- Add proper types for all props and returns
- Use meaningful variable names
- Comment complex logic

### Commit Convention

Follow conventional commits:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test updates
- `chore:` Build/config updates

## 📄 License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

This work is dedicated to the public domain under **CC0 1.0 Universal (Creative Commons Zero)**. To the extent possible under law, all copyright and related or neighboring rights have been waived worldwide.

This means you can:
- **Copy, modify, and distribute** this work, even for commercial purposes
- **Create derivative works** without asking permission
- **Use without attribution** (though attribution is appreciated)
- **Freely remix and build upon** this codebase for any purpose

You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See the [LICENSE](LICENSE) file for the full legal text or visit [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) for more information.


## 💡 Support & Disclaimer

This project has been made available and is provided as-is without warranty or support. Use this repository as a starting point to launch your own token platform.