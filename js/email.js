const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.addEventListener('mouseup', (ev) => {
    if (ev.button !== 0) {
        return;
    }

    window.location.href = `mailto:${m()}`;
});

ctx.fillStyle = 'white';
ctx.font = '16px monospace';
ctx.textBaseline = 'top';

const metrics = ctx.measureText(m());
canvas.setAttribute('width', `${metrics.width}`);

ctx.fillStyle = 'white';
ctx.font = '16px monospace';
ctx.textBaseline = 'top';
ctx.fillText(m(), 0, 0);

function m() {
    const arr = [
        'm', 'o', 'c', '.', 'l', 'i', 'a', 'm', 'g',
        '@', 'v', 'e', 'd', '.', 'u', 'o', 's', 'i',
        'm', 'a', 'k'
    ];

    return arr.reverse().join('');
}
