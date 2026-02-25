import tokens from './tokens.json';

// TypeScript 타입 생성
type TokenKeys = keyof typeof tokens;

export type CSSTokenMap = {
  [K in TokenKeys]: `var(${(typeof tokens)[K]})`;
};

export type CSSToken = CSSTokenMap[keyof CSSTokenMap];

const CSS_PREFIX = 'ds';
const TOKEN_NOT_FOUND_CSS_VAR: '--ds-token-not-found' = `--${CSS_PREFIX}-token-not-found`;

type Tokens = typeof tokens;

export function rawToken<T extends keyof Tokens>(path: T, fallback?: string): CSSTokenMap[T] {
  let token: Tokens[keyof Tokens] | typeof TOKEN_NOT_FOUND_CSS_VAR = tokens[path];

  if (!token) {
    token = TOKEN_NOT_FOUND_CSS_VAR;
  }

  const tokenCall = fallback ? `var(${token}, ${fallback})` : `var(${token})`;

  return tokenCall as CSSTokenMap[T];
}

export function token<T extends keyof Tokens>(property: string, path: T, fallback?: string) {
  return `${property}-[${rawToken(path, fallback)}]`;
}
