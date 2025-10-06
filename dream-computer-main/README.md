# Dream Computer Marketing Site

This marketing website for Dream Computer - a platform for launching AI agents and tokens on Base - has been made available and released to the public domain.

## Features

- **AI Agent Launcher**: Launch your own AI agents with ease
- **Token Launcher**: Create tokens on Base with one click, no wallet needed
- **Dream Chain**: Built on Base, optimized for AI agents
- **Dream Kit**: Complete toolkit for AI agent development
- **Investment Fund**: Supporting the Dream ecosystem

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org) 15 with App Router
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives
- **Analytics**: Vercel Analytics
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (install with `npm install -g pnpm`)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/dream-computer.git
cd dream-computer
```

2. Install dependencies:
```bash
pnpm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Development

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── (machine)/   # Marketing pages
│   └── fonts/       # Custom fonts
├── components/      # React components
│   ├── agents/      # Agent-related components
│   ├── chain/       # Chain-related components
│   ├── computer/    # Computer UI components
│   ├── dreamcoins/  # Token launcher components
│   ├── home/        # Homepage components
│   ├── launchpad/   # Launchpad components
│   └── ui/          # Shared UI components
├── hooks/           # React hooks
└── lib/             # Utilities and constants
```

## Deployment

The site is optimized for deployment on [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/dream-computer)

## Links

- [Dream on Uniswap](https://app.uniswap.org/explore/tokens/base/)
- [Dream on DexScreener](https://dexscreener.com/base/)
- [Twitter/X](https://x.com/dreamcoinswow)

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

This work is dedicated to the public domain under **CC0 1.0 Universal (Creative Commons Zero)**. To the extent possible under law, all copyright and related or neighboring rights have been waived worldwide. You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See the [LICENSE](LICENSE) file for the full legal text.

## Disclaimer

This project has been made available and is provided as-is for the community to build upon.

## Contributing

The codebase has been open sourced for the community to fork, modify, and build upon freely.