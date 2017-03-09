export const IS_MAC        = /Mac/.test(navigator.userAgent);

export const KEY_A         = 65;
export const KEY_COMMA     = 188;
export const KEY_RETURN    = 13;
export const KEY_ESC       = 27;
export const KEY_LEFT      = 37;
export const KEY_UP        = 38;
export const KEY_P         = 80;
export const KEY_RIGHT     = 39;
export const KEY_DOWN      = 40;
export const KEY_N         = 78;
export const KEY_BACKSPACE = 8;
export const KEY_DELETE    = 46;
export const KEY_SHIFT     = 16;
export const KEY_CMD       = IS_MAC ? 91 : 17;
export const KEY_CTRL      = IS_MAC ? 18 : 17;
export const KEY_TAB       = 9;

export const TAG_SELECT    = 1;
export const TAG_INPUT     = 2;

// for now, android support in general is too spotty to support validity
export const SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement('input').validity;
