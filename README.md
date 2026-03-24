# Real Estate Flyer Generator

A Next.js web application for real estate agents to generate professional PDF flyers.

## Features

- Easy form interface for property details
- Drag & drop image uploads
- Live preview
- Server-side PDF generation with Puppeteer
- Premium A4 flyer layout

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Puppeteer** - Server-side PDF generation

## Why This Architecture?

Server-side PDF generation with Puppeteer provides the best print-quality output. The HTML template renders identically in the PDF as it does in browser, ensuring professional results.

## Local Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deployment

### Vercel (Recommended)

```bash
npm run build
vercel --prod
```

Or push to GitHub and connect to Vercel.

### Hostinger (VPS/Cloud)

For Hostinger VPS or Cloud hosting with SSH access:

1. Install Node.js 18+
2. Clone the repository
3. Run `npm install`
4. Run `npm run build`
5. Run `npm start`

Or use PM2 for process management:

```bash
npm install -g pm2
pm2 start npm --name "flyer-generator" -- start
pm2 save
pm2 startup
```

## Files

```
├── app/
│   ├── api/generate-pdf/route.ts   # PDF generation endpoint
│   ├── components/                  # UI components
│   ├── lib/utils.ts                 # Utility functions
│   ├── types/index.ts               # TypeScript types
│   └── page.tsx                     # Main page
├── package.json
└── README.md
```

## License

MIT
