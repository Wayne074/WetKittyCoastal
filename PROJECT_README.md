# Wet Kitty E-Commerce Platform

Premium coastal + biker lifestyle apparel e-commerce storefront powered by Shopify and Printful.

## Quick Start

### 1. Prerequisites
- Node.js 22.13.0+
- MySQL/TiDB database
- Shopify store with Storefront API access
- Printful account

### 2. Installation

```bash
# Install dependencies
pnpm install

# Create .env.local with your credentials
# Copy environment variables from references below

# Set up database
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Start development server
pnpm dev
```

Server runs on http://localhost:3000

### 3. Build & Deploy

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Project Structure

```
├── client/              # React 19 frontend
│   ├── src/
│   │   ├── pages/      # Page components
│   │   ├── components/ # Reusable UI components
│   │   ├── contexts/   # React contexts
│   │   ├── hooks/      # Custom hooks
│   │   └── index.css   # Global styles
│   └── index.html
├── server/              # Express 4 + tRPC backend
│   ├── _core/          # Framework plumbing
│   ├── routers/        # tRPC routers
│   └── db.ts           # Database helpers
├── drizzle/            # Database schema & migrations
├── shared/             # Shared types
├── references/         # Integration guides
├── package.json
├── pnpm-lock.yaml      # Dependency lock file
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

## Features

- **Shopify Integration** - Live product catalog, pricing, inventory
- **Printful Support** - Print-on-demand with embroidery
- **User Authentication** - Manus OAuth 2.0
- **Wishlist & Reviews** - Database-backed user features
- **Loyalty System** - Points and rewards
- **Community** - Join the Crew, Beach Rally calendar
- **Dark/Light Theme** - Full theme support
- **SEO Optimized** - JSON-LD schema, Open Graph tags
- **Mobile First** - Responsive design

## Environment Variables

Create `.env.local` in project root with:

```
DATABASE_URL=mysql://user:password@host:3306/wetkitty
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_API_ACCESS_TOKEN=your_storefront_token
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://app.manus.im
JWT_SECRET=your_random_secret_key_here_min_32_chars
OWNER_OPEN_ID=your_open_id
OWNER_NAME=Your Name
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your_frontend_api_key
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your_website_id
```

## Database

### Schema
See `drizzle/schema.ts` for full database schema.

### Migrations
Migrations are in `drizzle/migrations/`

### Running Migrations
```bash
pnpm drizzle-kit generate  # Generate from schema
pnpm drizzle-kit migrate   # Apply to database
```

## Testing

```bash
pnpm test              # Run all tests
pnpm vitest --watch    # Watch mode
pnpm check             # TypeScript check
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm check` - TypeScript type check
- `pnpm format` - Format code with Prettier

## Shopify Integration

### Setup
1. Create Shopify store
2. Go to Settings → Apps and integrations → Develop apps
3. Create app with Storefront API access
4. Generate access token
5. Add to `.env.local`:
   - `SHOPIFY_STORE_DOMAIN`
   - `SHOPIFY_STOREFRONT_API_ACCESS_TOKEN`

### API Routes
- `commerce.products.list` - Get products with filters
- `commerce.products.byHandle` - Get single product
- `commerce.cart.*` - Cart operations

See `references/shopify.md` for details.

## Printful Integration

1. Connect Shopify store in Printful dashboard
2. Configure embroidery settings
3. Products marked as "embroidery" support customization
4. Printful handles fulfillment automatically

## Deployment

### Manus (Recommended)
1. Create checkpoint in Manus UI
2. Click Publish button
3. Configure custom domain
4. Site goes live automatically

### External Hosting
Deploy to any Node.js host (Vercel, Railway, Render, etc.):

```bash
pnpm build
# Deploy dist/ folder and run: pnpm start
```

## Support & References

- `references/shopify.md` - Shopify integration guide
- `references/file-storage.md` - File upload guide
- `references/llm-integration.md` - AI features
- `references/manus-oauth.md` - Authentication
- `references/periodic-updates.md` - Scheduled tasks

## License

MIT

---

Built for Wet Kitty - Premium Coastal + Biker Lifestyle Apparel
