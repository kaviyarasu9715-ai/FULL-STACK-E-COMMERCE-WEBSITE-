export function getFallbackProductSvg(title: string = 'Flipkart Product'): string {
  const cleanTitle = title.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, 24);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="100%" height="100%" fill="#f8fafc"/>
    <rect x="20" y="20" width="360" height="360" rx="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
    <circle cx="200" cy="180" r="70" fill="#eff6ff"/>
    <path d="M175 160h50v40h-50z" fill="#2874f0" rx="4"/>
    <circle cx="185" cy="150" r="10" fill="#2874f0"/>
    <circle cx="215" cy="150" r="10" fill="#2874f0"/>
    <text x="200" y="280" font-family="-apple-system, sans-serif" font-size="14" font-weight="bold" fill="#1e293b" text-anchor="middle">${cleanTitle}</text>
    <text x="200" y="302" font-family="-apple-system, sans-serif" font-size="11" font-weight="600" fill="#2874f0" text-anchor="middle">Flipkart Assured</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export function handleImageError(e: React.SyntheticEvent<HTMLImageElement, Event>, title?: string) {
  const target = e.currentTarget;
  target.onerror = null; // prevent infinite loop
  target.src = getFallbackProductSvg(title);
}
