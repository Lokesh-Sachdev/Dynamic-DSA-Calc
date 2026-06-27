function fmt(n) {
    return '$' + Math.round(n).toLocaleString();
}

function clampWeeks(changed) {
    const ids = ['w1', 'w2', 'w3', 'w4'];
    const MAX = 26;
    let vals = ids.map(id => parseInt(document.getElementById(id).value));
    const sum = vals.reduce((a, b) => a + b, 0);
    if (sum > MAX) {
        const excess = sum - MAX;
        const others = ids.filter(id => id !== changed);
        let remaining = excess;
        for (const id of others) {
            if (remaining <= 0) break;
            const i = ids.indexOf(id);
            const reduce = Math.min(vals[i], remaining);
            vals[i] = Math.max(0, vals[i] - reduce);
            document.getElementById(id).value = vals[i];
            remaining -= reduce;
        }
    }
}