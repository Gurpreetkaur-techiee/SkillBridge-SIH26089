const SERVICE_KEYWORDS = {
  electrician: [
    "electric",
    "electrician",
    "fan",
    "switch",
    "socket",
    "wiring",
    "light",
    "bulb",
    "power",
    "voltage"
  ],

  plumber: [
    "plumber",
    "tap",
    "faucet",
    "pipe",
    "leak",
    "leaking",
    "water",
    "sink",
    "toilet",
    "drain"
  ],

  cleaner: [
    "cleaner",
    "cleaning",
    "clean",
    "house cleaning",
    "room cleaning",
    "bathroom cleaning",
    "deep cleaning"
  ],

  mechanic: [
    "mechanic",
    "car",
    "bike",
    "motorcycle",
    "engine",
    "brake",
    "tyre",
    "tire",
    "vehicle",
    "oil change"
  ],

  carpenter: [
    "carpenter",
    "wood",
    "wooden",
    "furniture",
    "table",
    "chair",
    "door",
    "shelf",
    "cabinet"
  ],

  painter: [
    "painter",
    "painting",
    "paint",
    "wall",
    "walls",
    "colour",
    "color",
    "repaint"
  ]
};

export function analyzeService(text) {
  if (!text || typeof text !== "string") {
    return {
      service: "unknown",
      confidence: 0
    };
  }

  const input = text.toLowerCase().trim();

  if (!input) {
    return {
      service: "unknown",
      confidence: 0
    };
  }

  const scores = {};

  for (const [service, keywords] of Object.entries(SERVICE_KEYWORDS)) {
    let score = 0;

    for (const keyword of keywords) {
      if (input.includes(keyword)) {
        score += 1;
      }
    }

    scores[service] = score;
  }

  const bestMatch = Object.entries(scores).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const [service, score] = bestMatch;

  if (score === 0) {
    return {
      service: "unknown",
      confidence: 0
    };
  }

  const confidence = Math.min(0.99, 0.75 + score * 0.08);

  return {
    service,
    confidence: Number(confidence.toFixed(2))
  };
}