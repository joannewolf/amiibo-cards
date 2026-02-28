# amiibo-cards

Animal Crossing amiibo card gallery with sorting/grouping and multilingual support (EN/JP/繁中).

## Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build card data (run after editing data/cards.tsv)
npx tsx scripts/build-card-data.ts

# Download card images from Nintendo JP
npx tsx scripts/download-images.ts

# Production build
npm run build
```

## Data files

| File | Purpose |
|---|---|
| `data/cards.tsv` | Raw card data (edit this to add/modify cards) |
| `data/view-options.json` | Configure "View by" options (groupBy + sortBy) |
| `data/species-i18n.json` | Species translations (EN → JA/繁中) |
| `src/data/cards.json` | Generated — do not edit directly |
