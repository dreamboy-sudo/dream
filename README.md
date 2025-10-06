# Dream Ecosystem - Open Source AI Token Launcher Suite

This collection of projects for launching AI-powered tokens on Base (Ethereum L2) using the WoW protocol has been made available and released to the public domain.

## 📦 Projects Included

### 1. Dream Computer Marketing Site (`dream-computer-main/`)
A Next.js 15 marketing website showcasing the Dream ecosystem platform. Features include:
- AI Agent Launcher interface
- Token Launcher with one-click deployment
- Dream Chain information (built on Base)
- Dream Kit toolkit for AI agent development
- Investment Fund details for ecosystem support

**Tech Stack:** Next.js 15, Tailwind CSS, Radix UI, Vercel Analytics

### 2. DreamCoins Main Application (`dreamcoins-main/`)
The main web application for AI-powered token creation and management. Features include:
- AI-powered token generation with multiple AI models (Dreamgirl, Dreamboy, Baldo, Thankful)
- One-click token launch via WoW protocol
- Real-time token gallery and trading integration
- Creator fees system with optional wallet connection
- Buy & burn mechanism for protocol fees

**Tech Stack:** Next.js 14, PostgreSQL with Prisma ORM, Privy authentication, shadcn/ui components

### 3. DreamCoins API Backend (`dreamcoins-api-main/`)
A comprehensive backend service for token creation across multiple platforms. Features include:
- Multi-platform support (Twitter, Telegram, Farcaster, REST API)
- AI-powered token generation using Groq AI
- Image generation via Replicate
- IPFS storage through Pinata
- Automated token deployment on Base via Syndicate
- Robust job queue system with BullMQ and Redis

**Tech Stack:** Hono framework, Bun runtime, Redis, BullMQ, Web3 integration

## 🚀 Getting Started

Each project contains its own README with detailed setup instructions. Generally, you'll need:

1. **Prerequisites:**
   - Node.js 18+ and pnpm (or Bun for the API)
   - PostgreSQL database (for dreamcoins-main)
   - Redis server (for dreamcoins-api-main)

2. **Basic Setup:**
   ```bash
   # Clone the repository
   git clone [your-repo-url]
   
   # Navigate to desired project
   cd dream-computer-main  # or dreamcoins-main or dreamcoins-api-main
   
   # Install dependencies
   pnpm install  # or bun install for API
   
   # Configure environment variables
   cp .env.example .env.local
   
   # Run development server
   pnpm dev  # or bun dev for API
   ```

3. **Environment Configuration:**
   Each project includes a `.env.example` file with placeholder values. Replace these with your own API keys, wallet addresses, and service credentials.

## 🏗️ Architecture Overview

The ecosystem consists of three interconnected components:

```
dream/
├── dream-computer-main/     # Marketing and information site
├── dreamcoins-main/         # Main user-facing application
└── dreamcoins-api-main/     # Backend API and bot services
```

These projects can be deployed independently or work together as a complete token launcher platform.

## 🔒 Security Notes

- All wallet addresses and API keys have been extracted to environment variables
- Use the provided `.env.example` files as templates
- Never commit sensitive information to the repository
- All token deployments go through audited WoW protocol contracts

## 📄 License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

This project suite is released to the public domain under **CC0 1.0 Universal (Creative Commons Zero)**. To the extent possible under law, all copyright and related or neighboring rights have been waived worldwide.

### What This Means

This work has been dedicated to the public domain under CC0 1.0 Universal. You can:

- **Copy, modify, and distribute** this work, even for commercial purposes
- **Create derivative works** without asking permission
- **Use without attribution** (though attribution is appreciated)
- **Freely remix and build upon** this codebase for any purpose

The person who associated a work with this deed has dedicated the work to the public domain by waiving all of his or her rights to the work worldwide under copyright law, including all related and neighboring rights, to the extent allowed by law.

You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See the [LICENSE](LICENSE) file for the full legal text or visit [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) for more information.

## 🤝 Community & Future Development

The community is encouraged to:
- Fork any repository and create your own version
- Build new features and improvements
- Launch your own token platforms
- Create derivative works without restriction

## 🚢 Deployment

Each project can be deployed independently:
- **Marketing Site & Main App:** Optimized for Vercel deployment
- **API Backend:** Recommended for Railway or similar container platforms
- **Database:** PostgreSQL (for main app) and Redis (for API)

## ⚠️ Disclaimer

These projects are provided as-is without warranty, support, or ongoing development. Users who choose to fork and build upon this code are fully responsible for:
- Conducting their own security audits
- Ensuring regulatory compliance
- Managing their own infrastructure
- Providing user support
- Any modifications or derivative works

## 🌟 Background

These projects are part of the Dream ecosystem. All code has been open sourced and the Dream brand and intellectual property have been released to the public domain under CC0.

The technology stack includes:
- WoW Protocol for token creation
- Base (Ethereum L2) for blockchain infrastructure
- Various AI providers for content generation
- Modern web frameworks and tools

---

**This codebase is now yours to build upon. Fork it, modify it, rebrand it, and create something new. The future of AI-powered token creation is in your hands.**