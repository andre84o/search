interface SwedishAnalysis {
  isSwedish: boolean;
  confidence: number;
  indicators: string[];
}

// Swedish keywords to search for
const SWEDISH_KEYWORDS = [
  // Direct Swedish references
  'svensk',
  'svenska',
  'sweden',
  'swedish',
  'scandinavian',
  'skandinavisk',
  'nordic',
  'nordisk',

  // Swedish cities
  'stockholm',
  'göteborg',
  'gothenburg',
  'malmö',
  'malmo',
  'uppsala',
  'västerås',
  'örebro',
  'linköping',
  'helsingborg',
  'norrköping',
  'jönköping',
  'lund',
  'umeå',
  'gävle',
  'borås',
  'eskilstuna',
  'södertälje',
  'karlstad',
  'täby',
  'växjö',
  'halmstad',
  'sundsvall',
  'luleå',
  'trollhättan',
  'östersund',
  'borlänge',
  'falun',
  'kalmar',
  'skövde',
  'kristianstad',
  'karlskrona',
  'skellefteå',
  'uddevalla',
  'varberg',
  'örnsköldsvik',
  'nyköping',
  'motala',

  // Common Swedish business terms
  'fika',
  'smörgås',
  'köttbullar',
  'meatballs',
  'ikea',
  'volvo',
  'husqvarna',
  'ericsson',
  'h&m',

  // Swedish food terms
  'knäckebröd',
  'kanelbulle',
  'semla',
  'prinsesstårta',
  'sill',
  'gravlax',
  'kroppkakor',
  'raggmunk',
  'pyttipanna',
  'tunnbröd',
  'surströmming',
  'janssons frestelse',
];

// Swedish-specific characters
const SWEDISH_CHARS = ['å', 'ä', 'ö', 'Å', 'Ä', 'Ö'];

// Swedish domain indicator
const SWEDISH_DOMAINS = ['.se', 'www.se'];

export function analyzeSwedishBusiness(
  name: string,
  description?: string,
  website?: string,
  reviews?: string[]
): SwedishAnalysis {
  const indicators: string[] = [];
  let score = 0;

  const textToAnalyze = [
    name,
    description || '',
    ...(reviews || []),
  ].join(' ').toLowerCase();

  // Check for Swedish keywords (high weight)
  for (const keyword of SWEDISH_KEYWORDS) {
    if (textToAnalyze.includes(keyword.toLowerCase())) {
      indicators.push(`Nyckelord: "${keyword}"`);
      score += 25;
    }
  }

  // Check for Swedish characters in name (medium weight)
  for (const char of SWEDISH_CHARS) {
    if (name.includes(char)) {
      indicators.push(`Svenskt tecken: "${char}"`);
      score += 15;
      break; // Only count once
    }
  }

  // Check for Swedish domain (high weight)
  if (website) {
    const lowerWebsite = website.toLowerCase();
    for (const domain of SWEDISH_DOMAINS) {
      if (lowerWebsite.includes(domain)) {
        indicators.push('Svensk domän (.se)');
        score += 30;
        break;
      }
    }
  }

  // Normalize score to 0-100
  const confidence = Math.min(100, score);

  // Consider Swedish if confidence is at least 25%
  const isSwedish = confidence >= 25;

  return {
    isSwedish,
    confidence,
    indicators,
  };
}

// Search query modifiers to find Swedish businesses
export function getSwedishSearchQueries(): string[] {
  return [
    'svensk',
    'svenska',
    'swedish',
    'scandinavian',
    'nordic',
    'sweden',
    'stockholm',
    'göteborg',
  ];
}
