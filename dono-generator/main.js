const GRID_DIMENSIONS = {
    COLS: 22,
    ROWS: 4,
    TOTAL_PIXELS: 88,
    MAX_OUTPUT_LENGTH: 255
};

const MODES = {
    DEFAULT_COLOR: '#252728',
    DOT_MODE_VALUE: 'DOT_MODE_VALUE'
};

const COLOR_MAP = {
    '#DA2C27': '{63}',
    '#F67621': '{64}',
    '#FDB71D': '{65}',
    '#109B47': '{66}',
    '#2082C5': '{67}',
    '#712D8E': '{68}',
    '#FFFFFF': '{70}',
    '#252728': '{71}'
};

const REVERSE_COLOR_MAP = {
    '{63}': '#DA2C27',
    '{64}': '#F67621',
    '{65}': '#FDB71D',
    '{66}': '#109B47',
    '{67}': '#2082C5',
    '{68}': '#712D8E',
    '{70}': '#FFFFFF',
    '{71}': '#252728'
};

const PALETTE_COLORS = Object.keys(COLOR_MAP);
const COLOR_NAMES = {
    '#DA2C27': 'Red', '#F67621': 'Orange', '#FDB71D': 'Yellow',
    '#109B47': 'Green', '#2082C5': 'Blue', '#712D8E': 'Purple',
    '#fff': 'White', '#252728': 'Black',
    [MODES.DOT_MODE_VALUE]: 'Dot/Blank'
};

const COLOR_LITERALS = Object.keys(REVERSE_COLOR_MAP);
const ORDERED_COLOR_LITERALS = ['{71}', '{70}', '{63}', '{64}', '{65}', '{66}', '{67}', '{68}'];

const ALLOWED_CHARS_BASE = [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '!', '@', '#', '$', '%', '&', '(', ')', '-', '+', '=', ';', ':', '/', '"', '\'', ',', '.', '?', '°', ' ',
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'
];

const ALLOWED_CHARS_SET = new Set(ALLOWED_CHARS_BASE);
ALLOWED_CHARS_BASE.filter(char => char.match(/[A-Z]/)).map(char => char.toLowerCase()).forEach(char => ALLOWED_CHARS_SET.add(char));

const TOKEN_MAPPING = {
    TO_INDEX: {},
    TO_TOKEN: []
};
let mappingIndex = 0;

ORDERED_COLOR_LITERALS.forEach(token => {
    TOKEN_MAPPING.TO_INDEX[token] = mappingIndex;
    TOKEN_MAPPING.TO_TOKEN[mappingIndex] = token;
    mappingIndex++;
});

ALLOWED_CHARS_BASE.forEach(token => {
    TOKEN_MAPPING.TO_INDEX[token] = mappingIndex;
    TOKEN_MAPPING.TO_TOKEN[mappingIndex] = token;
    mappingIndex++;
});

let currentColor = MODES.DEFAULT_COLOR;
let isTextModeActive = false;
let typingIndex = 0;
let isRendering = false;
let isDrawing = false;

const elements = {
    pixelGrid: document.getElementById('pixelGrid'),
    colorPalette: document.getElementById('colorPalette'),
    outputString: document.getElementById('outputString'),
    currentModeDisplay: document.querySelector('#currentModeDisplay span'),
    copyMessage: document.getElementById('copyMessage'),
    lengthWarning: document.getElementById('lengthWarning'),
    spaceWarning: document.getElementById('spaceWarning'),
    centeringWarning: document.getElementById('centeringWarning'),
    textModeButton: document.getElementById('textModeButton'),
    dotModeButton: document.getElementById('dotModeButton'),
    shareUrlInput: document.getElementById('shareUrlInput')
};

function getAllTokens(inputString) {
    const tokens = [];
    let i = 0;

    while (i < inputString.length && tokens.length < GRID_DIMENSIONS.TOTAL_PIXELS) {
        let currentToken = '';
        let tokenLength = 1;

        if (inputString.substring(i, i + 1) === '{' && inputString.length >= i + 4) {
            const potentialLiteral = inputString.substring(i, i + 4);
            if (COLOR_LITERALS.includes(potentialLiteral)) {
                currentToken = potentialLiteral;
                tokenLength = 4;
            }
        }

        if (!currentToken) {
            currentToken = inputString[i];
            tokenLength = 1;
        }

        if (currentToken.length === 1 && !TOKEN_MAPPING.TO_INDEX[currentToken]) {
            currentToken = '.';
        }

        tokens.push(currentToken);
        i += tokenLength;
    }

    return tokens.slice(0, GRID_DIMENSIONS.TOTAL_PIXELS);
}

function getTokenCount(inputString) {
    let charIndex = 0;
    let tokenCount = 0;

    while (charIndex < inputString.length && tokenCount < GRID_DIMENSIONS.TOTAL_PIXELS) {
        let tokenLength = 1;

        if (inputString.substring(charIndex, charIndex + 1) === '{' && inputString.length >= charIndex + 4) {
            const potentialLiteral = inputString.substring(charIndex, charIndex + 4);
            if (COLOR_LITERALS.includes(potentialLiteral)) {
                tokenLength = 4;
            }
        }

        charIndex += tokenLength;
        tokenCount++;
    }
    return tokenCount;
}

function getCharIndexFromPixelIndex(pixelIndex) {
    const inputString = elements.outputString.value;
    let charIndex = 0;
    let tokenCount = 0;

    while (charIndex < inputString.length && tokenCount < pixelIndex) {
        let tokenLength = 1;

        if (inputString.substring(charIndex, charIndex + 1) === '{' && inputString.length >= charIndex + 4) {
            const potentialLiteral = inputString.substring(charIndex, charIndex + 4);
            if (COLOR_LITERALS.includes(potentialLiteral)) {
                tokenLength = 4;
            }
        }

        charIndex += tokenLength;
        tokenCount++;
    }
    return charIndex;
}

function getCleanChar(rawChar) {
    if (!rawChar || rawChar.length !== 1) return null;

    let char = rawChar[0];

    if (char >= 'a' && char <= 'z') {
        char = char.toUpperCase();
    }

    if (ALLOWED_CHARS_SET.has(char)) {
        return char;
    }

    return null;
}

function updateTypingIndicator() {
    Array.from(elements.pixelGrid.children).forEach(cell => {
        cell.classList.remove('typing-cursor');
    });

    if (isTextModeActive) {
        const currentCell = elements.pixelGrid.children[typingIndex];
        if (currentCell) {
            currentCell.classList.add('typing-cursor');
        }
    }
}

function renderGridFromOutput() {
    if (isRendering) return;
    isRendering = true;

    const inputString = elements.outputString.value;
    const tokens = getAllTokens(inputString);
    const actualTokenCount = getTokenCount(inputString);

    const sequentialSpacePixelIndices = [];
    for (let j = 0; j < actualTokenCount; j++) {
        const token = tokens[j];

        if (token === ' ') {
            const prevToken = j > 0 ? tokens[j - 1] : null;
            const nextToken = j < GRID_DIMENSIONS.TOTAL_PIXELS - 1 ? tokens[j + 1] : null;

            if ((prevToken === ' ' || nextToken === ' ') && j < actualTokenCount) {
                sequentialSpacePixelIndices.push(j);
            }
        }
    }

    for (let j = 0; j < GRID_DIMENSIONS.TOTAL_PIXELS; j++) {
        const cell = elements.pixelGrid.children[j];

        if (!cell) continue;

        cell.classList.remove('sequential-space-highlight');

        if (j < actualTokenCount) {
            const token = tokens[j];
            let color = 'transparent';

            if (token && token.startsWith('{')) {
                color = REVERSE_COLOR_MAP[token] || 'transparent';
                cell.textContent = '';
            } else if (token) {
                color = MODES.DEFAULT_COLOR;
                cell.textContent = token;
            } else {
                color = MODES.DEFAULT_COLOR;
                cell.textContent = '';
            }

            cell.style.backgroundColor = color;

            if (sequentialSpacePixelIndices.includes(j)) {
                cell.classList.add('sequential-space-highlight');
            }

        } else {
            cell.style.backgroundColor = 'transparent';
            cell.textContent = '';
        }
    }

    const currentLength = inputString.length;
    elements.lengthWarning.style.display = currentLength > GRID_DIMENSIONS.MAX_OUTPUT_LENGTH ? 'block' : 'none';
    elements.lengthWarning.textContent = `WARNING: The output string length (${currentLength} characters) exceeds the ${GRID_DIMENSIONS.MAX_OUTPUT_LENGTH} donation character limit.`;

    const hasSequentialSpaces = inputString.includes('  ');

    elements.spaceWarning.style.display = hasSequentialSpaces ? 'block' : 'none';
    elements.spaceWarning.textContent = "WARNING: Sequential spaces will be truncated into a single space in the donation.";

    let needsCenteringWarning = false;

    for (let line = 0; line < GRID_DIMENSIONS.ROWS; line++) {
        const startCharIndex = getCharIndexFromPixelIndex(line * GRID_DIMENSIONS.COLS);
        let endCharIndex = getCharIndexFromPixelIndex((line + 1) * GRID_DIMENSIONS.COLS);

        endCharIndex = Math.min(endCharIndex, inputString.length);

        const lineString = inputString.substring(startCharIndex, endCharIndex);

        let lineTokenCount = 0;
        let i = 0;
        while (i < lineString.length) {
            let tokenLength = 1;
            if (lineString.substring(i, i + 1) === '{' && lineString.length >= i + 4) {
                const potentialLiteral = lineString.substring(i, i + 4);
                if (COLOR_LITERALS.includes(potentialLiteral)) {
                    tokenLength = 4;
                }
            }
            i += tokenLength;
            lineTokenCount++;
        }

        if (lineTokenCount > 0 && lineTokenCount < GRID_DIMENSIONS.COLS) {
            needsCenteringWarning = true;
            break;
        }
    }

    elements.centeringWarning.style.display = needsCenteringWarning ? 'block' : 'none';
    if (needsCenteringWarning) {
        elements.centeringWarning.textContent = "WARNING: One or more lines contain less than 22 tokens (characters/colors) and will be horizontally centered.";
    }

    isRendering = false;
}

function updatePixel(index, newContent) {
    if (index < 0 || index >= GRID_DIMENSIONS.TOTAL_PIXELS) return;

    const value = elements.outputString.value;
    let newLiteral;

    if (newContent === MODES.DOT_MODE_VALUE) {
        newLiteral = '.';
    } else if (newContent.length === 1 && getCleanChar(newContent) !== null) {
        newLiteral = newContent;
    } else {
        newLiteral = COLOR_MAP[newContent] || '.';
    }

    const fillLiteral = '.';

    const currentTokenCount = getTokenCount(value);
    const startCharIndex = getCharIndexFromPixelIndex(index);

    if (index >= currentTokenCount) {
        const tokensToFill = index - currentTokenCount;

        if (tokensToFill > 0) {
            elements.outputString.value += fillLiteral.repeat(tokensToFill);
        }

        elements.outputString.value += newLiteral;

        renderGridFromOutput();
        return;
    }

    let existingTokenLength = 1;
    const currentToken = value.substring(startCharIndex, startCharIndex + 4);

    if (COLOR_LITERALS.includes(currentToken) && currentToken.startsWith('{')) {
        existingTokenLength = 4;
    } else if (value[startCharIndex] !== undefined) {
        existingTokenLength = 1;
    } else {
        existingTokenLength = 0;
    }

    const newValue = value.substring(0, startCharIndex) +
        newLiteral +
        value.substring(startCharIndex + existingTokenLength);

    elements.outputString.value = newValue;

    renderGridFromOutput();
}

function toggleTextMode() {
    isTextModeActive = !isTextModeActive;

    if (isTextModeActive) {
        elements.textModeButton.classList.add('active');
        elements.currentModeDisplay.textContent = 'Text Mode (Direct Typing)';

        selectColor(null);
        elements.dotModeButton.classList.remove('active');

        currentColor = MODES.DEFAULT_COLOR;

    } else {
        elements.textModeButton.classList.remove('active');
        selectColor(MODES.DEFAULT_COLOR);
    }

    updateTypingIndicator();
}

function toggleDotMode() {
    if (currentColor === MODES.DOT_MODE_VALUE) {
        selectColor(MODES.DEFAULT_COLOR);
        return;
    }

    isTextModeActive = false;
    elements.textModeButton.classList.remove('active');

    currentColor = MODES.DOT_MODE_VALUE;

    elements.currentModeDisplay.textContent = `Color Mode (${COLOR_NAMES[currentColor]} - .)`;

    Array.from(elements.colorPalette.children).forEach(el => el.classList.remove('selected'));

    elements.dotModeButton.classList.add('active');

    updateTypingIndicator();
}

function selectColor(color) {
    if (color) {
        currentColor = color;

        const displayColorName = COLOR_NAMES[color];

        elements.currentModeDisplay.textContent = `Color Mode (${displayColorName})`;

        isTextModeActive = false;
        elements.textModeButton.classList.remove('active');
        elements.dotModeButton.classList.remove('active');
    }

    Array.from(elements.colorPalette.children).forEach(el => {
        el.classList.remove('selected');
        if (el.dataset.color === currentColor && !isTextModeActive && currentColor !== MODES.DOT_MODE_VALUE) {
            el.classList.add('selected');
        }
    });

    if (currentColor === MODES.DEFAULT_COLOR && !isTextModeActive) {
        const blackOption = Array.from(elements.colorPalette.children).find(el => el.dataset.color === MODES.DEFAULT_COLOR);
        if (blackOption) blackOption.classList.add('selected');
    }

    if (currentColor === MODES.DOT_MODE_VALUE && !isTextModeActive) {
        elements.dotModeButton.classList.add('active');
    } else {
        elements.dotModeButton.classList.remove('active');
    }

    updateTypingIndicator();
}

function flashMessage(message, isError = false) {
    elements.copyMessage.textContent = message;

    elements.copyMessage.classList.remove('opacity-0', 'text-red-400', 'text-cyan-400', 'text-green-400');

    if (isError) {
        elements.copyMessage.classList.add('opacity-100', 'text-red-400');
    } else {
        elements.copyMessage.classList.add('opacity-100', 'text-green-400');
    }

    setTimeout(() => {
        elements.copyMessage.classList.remove('opacity-100');
        elements.copyMessage.classList.add('opacity-0');
    }, 2500);
}

function handleGlobalKeydown(e) {
    if (!isTextModeActive) return;

    if (e.key === 'Backspace') {
        e.preventDefault();

        let deletePixelIndex = (typingIndex - 1 + GRID_DIMENSIONS.TOTAL_PIXELS) % GRID_DIMENSIONS.TOTAL_PIXELS;

        const value = elements.outputString.value;
        const startCharIndex = getCharIndexFromPixelIndex(deletePixelIndex);

        if (startCharIndex >= value.length) {
            typingIndex = deletePixelIndex;
            updateTypingIndicator();
            return;
        }

        const token = value.substring(startCharIndex, startCharIndex + 4);
        let tokenLength = 1;

        if (COLOR_LITERALS.includes(token) && token.startsWith('{')) {
            tokenLength = 4;
        } else if (value[startCharIndex] === undefined) {
            typingIndex = deletePixelIndex;
            updateTypingIndicator();
            return;
        }

        elements.outputString.value = value.substring(0, startCharIndex) +
            value.substring(startCharIndex + tokenLength);

        typingIndex = deletePixelIndex;

        renderGridFromOutput();
        updateTypingIndicator();
        return;
    }

    if (e.key === 'ArrowLeft') {
        e.preventDefault();
        typingIndex = (typingIndex - 1 + GRID_DIMENSIONS.TOTAL_PIXELS) % GRID_DIMENSIONS.TOTAL_PIXELS;
        updateTypingIndicator();
        return;
    }
    if (e.key === 'ArrowRight') {
        e.preventDefault();
        typingIndex = (typingIndex + 1) % GRID_DIMENSIONS.TOTAL_PIXELS;
        updateTypingIndicator();
        return;
    }

    if (e.key === 'ArrowUp') {
        e.preventDefault();
        typingIndex = (typingIndex - GRID_DIMENSIONS.COLS + GRID_DIMENSIONS.TOTAL_PIXELS) % GRID_DIMENSIONS.TOTAL_PIXELS;
        updateTypingIndicator();
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        typingIndex = (typingIndex + GRID_DIMENSIONS.COLS) % GRID_DIMENSIONS.TOTAL_PIXELS;
        updateTypingIndicator();
        return;
    }

    if (e.metaKey || e.ctrlKey || e.altKey || e.key.length > 1) {
        return;
    }

    const cleanedChar = getCleanChar(e.key);

    if (cleanedChar !== null) {
        e.preventDefault();

        updatePixel(typingIndex, cleanedChar);

        typingIndex = (typingIndex + 1) % GRID_DIMENSIONS.TOTAL_PIXELS;

        updateTypingIndicator();
    }
}

function loadStateFromURL() {
    const params = new URLSearchParams(window.location.search);
    let content = params.get('content');

    if (content) {
        content = content.replace(/-/g, '+').replace(/_/g, '/');

        while (content.length % 4) {
            content += '=';
        }

        try {
            const binaryString = atob(content);
            const ESC = 255;
            const indices = [];

            for (let i = 0; i < binaryString.length; i++) {
                const b = binaryString.charCodeAt(i);
                if (b === ESC) {
                    const val = binaryString.charCodeAt(++i);
                    const count = binaryString.charCodeAt(++i);
                    for (let k = 0; k < count; k++) indices.push(val);
                } else {
                    indices.push(b);
                }
            }

            const indexArray = new Uint8Array(indices);

            let outputString = Array.from(indexArray).slice(0, GRID_DIMENSIONS.TOTAL_PIXELS).map(index => {
                return TOKEN_MAPPING.TO_TOKEN[index] || '.';
            }).join('');

            elements.outputString.value = outputString;
            return true;
        } catch (e) {
            console.error("URL decoding error:", e);
            return false;
        }
    }
    return false;
}

function generateShareableURL() {
    const inputString = elements.outputString.value;
    const tokens = getAllTokens(inputString);

    const indexArray = tokens.map(token => {
        const index = TOKEN_MAPPING.TO_INDEX[token];
        return index !== undefined ? index : TOKEN_MAPPING.TO_INDEX['.'];
    });

    const ESC = 255;
    const outBytes = [];

    for (let i = 0; i < indexArray.length;) {
        const val = indexArray[i];
        let j = i + 1;
        while (j < indexArray.length && indexArray[j] === val && (j - i) < 255) j++;
        const run = j - i;

        if (run >= 4) {
            outBytes.push(ESC, val, run);
        } else {
            for (let k = 0; k < run; k++) outBytes.push(val);
        }

        i = j;
    }

    const byteArray = new Uint8Array(outBytes);

    let binaryString = '';
    for (let i = 0; i < byteArray.byteLength; i++) {
        binaryString += String.fromCharCode(byteArray[i]);
    }

    let encodedContent = btoa(binaryString);
    encodedContent = encodedContent.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?content=${encodedContent}`;

    elements.shareUrlInput.value = shareUrl;

    try {
        elements.shareUrlInput.select();
        document.execCommand('copy');
        flashMessage("Base64 URL generated and copied!");
    } catch (e) {
        flashMessage("Base64 URL generated (copy manually).", true);
    }
}

function clearGrid() {
    elements.outputString.value = "";
    typingIndex = 0;
    isTextModeActive = false;
    renderGridFromOutput();

    flashMessage("Grid cleared to Empty.");
}

function fillGrid() {
    let fillLiteral;
    let colorName;

    if (isTextModeActive) {
        fillLiteral = 'A';
        colorName = 'Character "A"';
    } else if (currentColor === MODES.DOT_MODE_VALUE) {
        fillLiteral = '.';
        colorName = COLOR_NAMES[MODES.DOT_MODE_VALUE];
    } else {
        fillLiteral = COLOR_MAP[currentColor];
        colorName = COLOR_NAMES[currentColor];
    }

    elements.outputString.value = fillLiteral.repeat(GRID_DIMENSIONS.TOTAL_PIXELS);

    typingIndex = 0;
    updateTypingIndicator();
    renderGridFromOutput();

    flashMessage(`Grid filled with ${colorName}.`);
}

function createGrid() {
    for (let i = 0; i < GRID_DIMENSIONS.TOTAL_PIXELS; i++) {
        const cell = document.createElement('div');
        cell.classList.add('pixel-cell');
        cell.dataset.index = i;

        cell.addEventListener('click', () => {
            const index = parseInt(cell.dataset.index);

            if (isTextModeActive) {
                typingIndex = index;
                updateTypingIndicator();
            } else {
                updatePixel(index, currentColor);
            }
        });

        cell.addEventListener('mousedown', (e) => {
            if (e.buttons === 1 && !isTextModeActive) {
                isDrawing = true;
                updatePixel(i, currentColor);
            }
        });

        cell.addEventListener('mouseover', () => {
            if (isDrawing) {
                updatePixel(i, currentColor);
            }
        });

        elements.pixelGrid.appendChild(cell);
    }
}

function createPalette() {
    PALETTE_COLORS.forEach(color => {
        const option = document.createElement('div');
        option.classList.add('color-option');

        if (color === MODES.DEFAULT_COLOR) {
            option.classList.add('mode-selector');
        }

        option.style.backgroundColor = color;
        option.dataset.color = color;

        option.addEventListener('click', () => selectColor(color));

        const literal = COLOR_MAP[color] || 'Character/Dot';
        const name = COLOR_NAMES[color];
        option.title = `${name} | Maps to ${literal}`;

        elements.colorPalette.appendChild(option);
    });

    selectColor(MODES.DEFAULT_COLOR);
}

function copyOutput() {
    try {
        elements.outputString.select();
        navigator.clipboard.writeText(elements.outputString.value);
        flashMessage("String copied to clipboard!");
    } catch (err) {
        console.error('Copy Error:', err);
        flashMessage("Copy failed. Try selecting and copying manually.", true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    createPalette();

    const loadedFromURL = loadStateFromURL();

    if (!loadedFromURL) {
        elements.outputString.value = "";
    }

    renderGridFromOutput();

    document.addEventListener('keydown', handleGlobalKeydown);
    document.addEventListener('mouseup', () => isDrawing = false);

    updateTypingIndicator();
});