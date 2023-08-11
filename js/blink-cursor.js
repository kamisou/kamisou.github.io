; (function () {
    const title = document.querySelector('#title');
    let visible = false;

    setInterval(() => {
        if (visible) {
            title.innerText = title.innerText.substr(0, title.innerText.length - 1);
        } else {
            title.innerText = `${title.innerText}|`;
        }

        visible = !visible;
    }, 500);
})()