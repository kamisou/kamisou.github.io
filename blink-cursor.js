const title = document.querySelector('#title');

setInterval(() => {
    if (title.innerText.endsWith('|')) {
        title.innerText = title.innerText.substr(0, title.innerText.length - 1);
    } else {
        title.innerText = `${title.innerText}|`;
    }
}, 500);
