# DreamCoins API

This token launcher backend built on Base using the WoW protocol has been made available and released to the public domain. The API enables AI-powered token creation through multiple social platforms including Twitter, Telegram, and Farcaster.

## Features

- **AI-Powered Token Generation**: Uses Groq AI to generate token names, symbols, and descriptions from prompts
- **Multi-Platform Support**: Create tokens via Twitter, Telegram, Farcaster, or REST API
- **Image Generation**: AI-generated token images using Replicate
- **IPFS Storage**: Token metadata stored on IPFS via Pinata
- **Cloud Storage**: Images stored in Google Cloud Storage
- **Automated Deployment**: Token deployment on Base via Syndicate and WoW protocol
- **Queue System**: Robust job queue system using BullMQ and Redis
- **Real-time Webhooks**: Support for Farcaster and Syndicate webhooks

## Architecture

### Core Components

```
src/
├── actions/         # Business logic for token creation
│   ├── dream.ts     # Main token creation flow
│   ├── dreambot.ts  # Social media bot integration
│   └── web.ts       # Web API actions
├── ai/              # AI services
│   ├── agents.ts    # AI agent configurations
│   ├── config.ts    # AI provider configuration
│   ├── index.ts     # Token generation logic
│   ├── painter.ts   # Image generation
│   └── prompts.ts   # AI prompt templates
├── cache/           # Redis caching layer
├── farcaster/       # Farcaster integration
├── jobs/            # Background job processing
├── storage/         # File storage (GCS & Pinata)
├── telegram/        # Telegram bot
├── tokens/          # Blockchain interactions
│   ├── chain.ts     # Syndicate chain operations
│   ├── syndicate.ts # Token deployment
│   └── web3.ts      # Web3 utilities
├── twitter/         # Twitter/X integration
└── main.ts          # API server entry point
```

### Token Creation Flow

1. **Input Processing**: User submits prompt via API/Twitter/Telegram/Farcaster
2. **AI Generation**: 
   - Groq AI generates token name, symbol, and description
   - Replicate generates token image
3. **Storage**:
   - Image uploaded to Google Cloud Storage
   - Image and metadata uploaded to IPFS via Pinata
4. **Deployment**:
   - Token deployed on Base via Syndicate API
   - Transaction tracked via webhooks
5. **Notification**: User notified of successful deployment

## Installation

### Prerequisites

- [Bun](https://bun.sh/) runtime (v1.0+)
- Redis server
- Node.js 18+ (for some dependencies)

### Setup

1. Clone the repository:
```bash
git clone [your-fork-url]
cd dreamcoins-api
```

2. Install dependencies:
```bash
bun install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with required credentials (see [Environment Variables](#environment-variables))

5. Start Redis:
```bash
redis-server
```

6. Run the development server:
```bash
bun dev
```

## Environment Variables

### Required Variables

#### API Configuration
- `API_TOKEN` - Authentication token for API endpoints
- `WEB_API_TOKEN` - Token for web-specific endpoints
- `AGENT_PLATFORM_TOKEN` - Token for agent platform integration

#### Blockchain & Token Services
- `SYNDICATE_API_TOKEN` - Syndicate API authentication
- `SYNDICATE_PROJECT_ID` - Your Syndicate project ID
- `SYNDICATE_ADMIN_ACCOUNT` - Admin wallet address for role management
- `ALCHEMY_API_KEY` - Alchemy API key for Web3 operations

#### AI Services
- `GROQ_API_KEY` - Groq AI API key for token generation
- `REPLICATE_API_TOKEN` - Replicate API token for image generation

#### Storage Services
- `REDIS_URL` - Redis connection URL (e.g., `redis://localhost:6379`)
- `GCP_PROJECT_ID` - Google Cloud project ID
- `GCP_STORAGE_BUCKET` - GCS bucket name for images
- `GCP_PRIVATE_KEY_ID` - GCP service account key ID
- `GCP_PRIVATE_KEY` - GCP service account private key
- `GCP_CLIENT_EMAIL` - GCP service account email
- `GCP_CLIENT_ID` - GCP service account client ID
- `PINATA_API_KEY` - Pinata API key for IPFS
- `PINATA_SECRET_API_KEY` - Pinata secret key

#### Social Platform Integrations

**Twitter/X:**
- `TWITTER_API_KEY` - Twitter API consumer key
- `TWITTER_API_SECRET` - Twitter API consumer secret
- `TWITTER_BEARER_TOKEN` - Twitter bearer token
- `TWITTER_ACCESS_TOKEN` - Twitter access token
- `TWITTER_ACCESS_SECRET` - Twitter access secret
- `TWITTER_ACCOUNT_ID` - Your Twitter account ID
- `TWITTER_ACCOUNT_USERNAME` - Your Twitter username

**Farcaster:**
- `NEYNAR_API_KEY` - Neynar API key
- `NEYNAR_SIGNER_UUID` - Neynar signer UUID
- `NEYNAR_WEBHOOK_SECRET` - Webhook verification secret
- `FARCASTER_API_KEY` - Farcaster API key
- `FARCASTER_ACCOUNT_FID` - Your Farcaster FID
- `FARCASTER_ACCOUNT_USERNAME` - Your Farcaster username

**Telegram:**
- `TELEGRAM_BOT_TOKEN` - Telegram bot token
- `TELEGRAM_BOT_USERNAME` - Telegram bot username
- `DREAMBOY_APPROVED_IDS` - Comma-separated list of approved Telegram user IDs

### Optional Configuration
- `PORT` - Server port (default: 3000)
- `LOCAL` - Set to "true" for local development
- `DEBUG_LOGGING` - Enable debug logs
- `USE_MAINNET` - Use mainnet instead of testnet
- `DREAM_ONCHAIN` - Enable actual on-chain deployment
- `TWEET_DREAMS` - Auto-tweet created tokens
- `SEND_CASTS` - Auto-post to Farcaster

## API Endpoints

### Health Check
```
GET /
```
Returns "gm" - simple health check

### Create Token from Prompt
```
POST /dream
Authorization: Bearer <API_TOKEN>
Content-Type: application/json

{
  "id": 123,
  "prompt": "a token for coffee lovers",
  "mode": "dream",              // optional: "dream", "dreamgirl", "baldo", "thanksgiving"
  "walletAddress": "0x...",     // optional: creator wallet
  "noDeploy": false              // optional: generate without deploying
}
```

### Create Token with Exact Details
```
POST /dream
Authorization: Bearer <API_TOKEN>
Content-Type: application/json

{
  "id": 123,
  "token": {
    "name": "Coffee Coin",
    "symbol": "COFFEE",
    "imageUrl": "https://...",
    "description": "The best coffee token"
  },
  "walletAddress": "0x..."
}
```

### Parse Social Media Post
```
POST /parser
Authorization: Bearer <API_TOKEN>
Content-Type: application/json

{
  "text": "Create a token for coffee lovers",
  "imageUrl": "https://...",     // optional
  "agentId": "agent-123",
  "tweetId": "tweet-123"         // or "farcasterId"
}
```

### Upload Image
```
POST /upload
Authorization: Bearer <API_TOKEN>
Content-Type: multipart/form-data

file: <image-file>
```

### Webhooks

#### Farcaster Mentions
```
POST /webhooks/farcaster/mentions
X-Neynar-Signature: <signature>
```

#### Syndicate Transaction Updates
```
POST /webhooks/syndicate
```

## Social Platform Commands

### Telegram
- **Direct Message**: `/dream <prompt>` - Create a token from prompt
- **Group Chat**: `@yourbotname <prompt>` - Mention the bot with a prompt

### Twitter/X
The bot monitors mentions and replies. Simply mention the bot with your token idea.

### Farcaster
Mention or reply to the bot account with your token idea.

## Development

### Running Tests
```bash
bun test
```

### Linting
```bash
bun lint
```

### Formatting
```bash
bun format
```

### Building for Production
```bash
bun build
```

## Queue System

The application uses BullMQ for background job processing:

- **Farcaster Jobs**: Process Farcaster mentions and replies
- **Token Deployment**: Handle async token deployment
- **Transaction Monitoring**: Track deployment status

Queue workers automatically start unless `LOCAL=true`.

## Database & Caching

- **Redis**: Used for caching dreams, rate limiting, and job queues
- **No SQL Database Required**: All persistent data stored in Redis or on-chain

## Token Deployment Process

1. **Metadata Creation**: Token metadata formatted to WoW protocol standards
2. **IPFS Upload**: Metadata and images uploaded to IPFS
3. **Smart Contract Deployment**: Deployed via Syndicate API on Base
4. **Transaction Tracking**: Webhook monitors deployment status
5. **Notification**: Users notified upon successful deployment

## Security Considerations

- All API endpoints protected with bearer token authentication
- Webhook signatures verified for Farcaster
- Environment variables for sensitive data
- Rate limiting via Redis cache
- Input validation with Zod schemas

## Monitoring

The application uses Pino for structured logging:
- Development: Pretty-printed console output
- Production: JSON formatted logs
- Debug mode: `DEBUG_LOGGING=true`

## Contributing

The community is encouraged to fork the repository and launch your own backend. Railway is recommended for deployment. 

## License

[![CC0](https://licensebuttons.net/p/zero/1.0/88x31.png)](https://creativecommons.org/publicdomain/zero/1.0/)

This work is dedicated to the public domain under **CC0 1.0 Universal (Creative Commons Zero)**. To the extent possible under law, all copyright and related or neighboring rights have been waived worldwide.

This means you can:
- **Copy, modify, and distribute** this work, even for commercial purposes
- **Create derivative works** without asking permission
- **Use without attribution** (though attribution is appreciated)
- **Freely remix and build upon** this codebase for any purpose

You can copy, modify, distribute and perform the work, even for commercial purposes, all without asking permission. See the [LICENSE](LICENSE) file for the full legal text or visit [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) for more information.

## Support & Disclaimer

This project has been made available and is provided as-is without warranty or support. Use this repository as a starting point to build your own token launcher backend.

## Acknowledgments

- Built with [Hono](https://hono.dev/) web framework
- Powered by [Bun](https://bun.sh/) runtime
- Token deployment via [Syndicate](https://syndicate.io/)
- Based on the [WoW Protocol](https://wow.xyz/)