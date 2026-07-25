import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const companies = [
  {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Consumer Electronics',
    country: 'US',
    description:
      'Apple designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories.',
  },
  {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Software — Infrastructure',
    country: 'US',
    description:
      'Microsoft develops and licenses consumer and enterprise software, cloud solutions, and hardware devices.',
  },
  {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    country: 'US',
    description:
      'Alphabet is the parent company of Google, offering search, advertising, cloud computing, and various internet services.',
  },
  {
    ticker: 'AMZN',
    name: 'Amazon.com Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Internet Retail',
    country: 'US',
    description:
      'Amazon is a multinational technology company focused on e-commerce, cloud computing (AWS), and artificial intelligence.',
  },
  {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    exchange: 'NASDAQ',
    sector: 'Technology',
    industry: 'Semiconductors',
    country: 'US',
    description:
      'NVIDIA designs GPUs and system-on-chip units for gaming, professional visualization, data center, and automotive markets.',
  },
  {
    ticker: 'META',
    name: 'Meta Platforms Inc.',
    exchange: 'NASDAQ',
    sector: 'Communication Services',
    industry: 'Internet Content & Information',
    country: 'US',
    description:
      'Meta Platforms builds technologies that help people connect through social media, messaging, and virtual reality.',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc.',
    exchange: 'NASDAQ',
    sector: 'Consumer Cyclical',
    industry: 'Auto Manufacturers',
    country: 'US',
    description:
      'Tesla designs, develops, manufactures, and sells electric vehicles, energy generation, and storage systems.',
  },
  {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    exchange: 'NYSE',
    sector: 'Financial Services',
    industry: 'Banks — Diversified',
    country: 'US',
    description:
      'JPMorgan Chase is a global financial services firm offering investment banking, asset management, and consumer banking.',
  },
  {
    ticker: 'V',
    name: 'Visa Inc.',
    exchange: 'NYSE',
    sector: 'Financial Services',
    industry: 'Credit Services',
    country: 'US',
    description:
      'Visa operates a global payments technology network facilitating electronic funds transfers.',
  },
  {
    ticker: 'JNJ',
    name: 'Johnson & Johnson',
    exchange: 'NYSE',
    sector: 'Healthcare',
    industry: 'Drug Manufacturers — General',
    country: 'US',
    description:
      'Johnson & Johnson researches, develops, manufactures, and sells healthcare products including pharmaceuticals and medical devices.',
  },
  {
    ticker: 'WMT',
    name: 'Walmart Inc.',
    exchange: 'NYSE',
    sector: 'Consumer Defensive',
    industry: 'Discount Stores',
    country: 'US',
    description:
      'Walmart operates a chain of hypermarkets, discount stores, and grocery stores worldwide.',
  },
  {
    ticker: 'XOM',
    name: 'Exxon Mobil Corporation',
    exchange: 'NYSE',
    sector: 'Energy',
    industry: 'Oil & Gas Integrated',
    country: 'US',
    description:
      'Exxon Mobil is a multinational oil and gas corporation engaged in exploration, production, refining, and marketing of petroleum.',
  },
];

async function main() {
  console.log('Seeding companies...');

  for (const company of companies) {
    await prisma.company.upsert({
      where: { ticker: company.ticker },
      update: company,
      create: company,
    });
  }

  console.log(`Seeded ${companies.length} companies.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
