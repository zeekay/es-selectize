export var IS_MAC        = /Mac/.test(navigator.userAgent);

export var KEY_A         = 65;
export var KEY_COMMA     = 188;
export var KEY_RETURN    = 13;
export var KEY_ESC       = 27;
export var KEY_LEFT      = 37;
export var KEY_UP        = 38;
export var KEY_P         = 80;
export var KEY_RIGHT     = 39;
export var KEY_DOWN      = 40;
export var KEY_N         = 78;
export var KEY_BACKSPACE = 8;
export var KEY_DELETE    = 46;
export var KEY_SHIFT     = 16;
export var KEY_CMD       = IS_MAC ? 91 : 17;
export var KEY_CTRL      = IS_MAC ? 18 : 17;
export var KEY_TAB       = 9;

export var TAG_SELECT    = 1;
export var TAG_INPUT     = 2;

// for now, android support in general is too spotty to support validity
export var SUPPORTS_VALIDITY_API = !/android/i.test(window.navigator.userAgent) && !!document.createElement('input').validity;
