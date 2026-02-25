/** @type {import('tailwindcss').Config} */
import tokens from './src/utils/tokens.json' with { type: 'json' };

// safelist 생성
const colorProps = ['bg', 'text', 'border', 'hover:bg', 'hover:text', 'hover:border', 'active:bg', 'active:text', 'active:border', 'focus:text', 'visited:text', 'after:border'];
const spacingProps = ['p', 'px', 'py', 'pt', 'pr', 'pb', 'pl', 'm', 'mx', 'my', 'gap', 'inset', 'after:inset'];
const radiusProps = ['rounded'];

const safelist = [];

Object.entries(tokens).forEach(([name, cssVar]) => {
  if (name.startsWith('color.') || name.startsWith('elevation.surface')) {
    colorProps.forEach(prop => safelist.push(`${prop}-[var(${cssVar})]`));
  }
  if (name.startsWith('space.')) {
    spacingProps.forEach(prop => safelist.push(`${prop}-[var(${cssVar})]`));
  }
  if (name.startsWith('radius.')) {
    radiusProps.forEach(prop => safelist.push(`${prop}-[var(${cssVar})]`));
  }
  if (name.startsWith('font.weight.')) {
    safelist.push(`[font-weight:var(${cssVar})]`);
  }
  if (name.startsWith('border.width')) {
    safelist.push(`after:border-[length:var(${cssVar})]`);
    safelist.push(`border-[length:var(${cssVar})]`);
  }
});

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  safelist,
  theme: {
    extend: {},
  },
  plugins: [],
};
