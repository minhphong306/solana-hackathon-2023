export const blurDataForImage = (width: number, height: number) => {
  const shimmer = (w: number, h: number) => `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#333" offset="20%" />
          <stop stop-color="#222" offset="50%" />
          <stop stop-color="#333" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#333" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;

  const toBase64 = (str) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  return `data:image/svg+xml;base64,${toBase64(shimmer(width, height))}`;
};

export const TIER_NAME = [
  'Common',
  'Uncommon',
  'Rare',
  'Epic',
  'Mysthical',
  'Legendary',
];

export const robotTierCalculation = (data) => {
  let tier = undefined;
  if (typeof data == 'undefined') {
    return tier;
  }

  if (data.length < 5) {
    return tier;
  }

  tier = Math.max(
    TIER_NAME.indexOf(data[0].value.split(' ', 1)[0]),
    TIER_NAME.indexOf(data[1].value.split(' ', 1)[0]),
    TIER_NAME.indexOf(data[2].value.split(' ', 1)[0]),
    TIER_NAME.indexOf(data[3].value.split(' ', 1)[0]),
    TIER_NAME.indexOf(data[4].value.split(' ', 1)[0])
  );
  return tier;
};
