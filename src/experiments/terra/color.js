export const create = (r, g, b) => {
    return {
        r: typeof r === 'number' ? r : 0.0,
        g: typeof g === 'number' ? g : 0.0,
        b: typeof b === 'number' ? b : 0.0
    };
};

export const toArray = c => {
    return [c.r, c.g, c.b];
};

export const to24bit = c => {
    return ((c.r * 255) << 16) ^ ((c.g * 255) << 8) ^ ((c.b * 255) << 0);
};
