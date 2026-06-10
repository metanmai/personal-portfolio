// Login micro-puzzle generator. Picks a random template family and returns
// { prompt, answer } where `answer` is always the stringified numeric answer.
//
// Family selection bands on a single Math.random() call:
//   [0.0, 0.4)  -> arithmetic   (most common)
//   [0.4, 0.8)  -> sequence
//   [0.8, 1.0)  -> binary       (~1 in 5)

const randInt = (min, max) => {
    // Inclusive on both ends.
    const span = max - min + 1;
    return Math.floor(Math.random() * span) + min;
};

const arithmeticPuzzle = () => {
    // op pick: 0 = +, 1 = −, 2 = ×
    const op = Math.floor(Math.random() * 3);

    if (op === 2) {
        // Multiplication: small factors so the answer stays in head-math range.
        const a = randInt(2, 9);
        const b = randInt(2, 9);
        return {
            prompt: `SOLVE: ${a} × ${b}`,
            answer: String(a * b),
        };
    }

    // + or − use the wider 2-19 range. For subtraction we ensure A >= B by
    // swapping after the fact so the answer is never negative.
    let a = randInt(2, 19);
    let b = randInt(2, 19);

    if (op === 1) {
        if (b > a) {
            const tmp = a;
            a = b;
            b = tmp;
        }
        return {
            prompt: `SOLVE: ${a} − ${b}`,
            answer: String(a - b),
        };
    }

    return {
        prompt: `SOLVE: ${a} + ${b}`,
        answer: String(a + b),
    };
};

const sequencePuzzle = () => {
    // sub-type pick: 0 = arithmetic step, 1 = doubling
    const sub = Math.floor(Math.random() * 2);

    if (sub === 0) {
        const start = randInt(1, 9);
        const step = randInt(2, 6);
        const terms = [start, start + step, start + step * 2, start + step * 3];
        const next = start + step * 4;
        return {
            prompt: `NEXT IN SEQUENCE: ${terms.join(', ')}, ?`,
            answer: String(next),
        };
    }

    // Doubling sequence — start picker chooses 2 or 3, then four shown terms.
    const start = randInt(2, 3);
    const terms = [start, start * 2, start * 4, start * 8];
    const next = start * 16;
    return {
        prompt: `NEXT IN SEQUENCE: ${terms.join(', ')}, ?`,
        answer: String(next),
    };
};

const binaryPuzzle = () => {
    // 3 or 4 bit width.
    const width = Math.floor(Math.random() * 2) + 3;
    let bits = '';
    for (let i = 0; i < width; i += 1) {
        bits += Math.floor(Math.random() * 2).toString();
    }
    const value = parseInt(bits, 2);
    return {
        prompt: `BINARY ${bits} IN DECIMAL = ?`,
        answer: String(value),
    };
};

export const generatePuzzle = () => {
    const r = Math.random();
    if (r < 0.4) return arithmeticPuzzle();
    if (r < 0.8) return sequencePuzzle();
    return binaryPuzzle();
};
