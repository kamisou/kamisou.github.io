; (function () {
    const email = document.querySelector('#email');
    let visible = false;

    email.addEventListener('mouseup', handleClick);

    function handleClick(ev) {
        if (ev.button !== 0) {
            return;
        }

        if (visible) {
            window.location.href = `mailto:${e()}`;
        } else {
            email.innerText = e();
            visible = true;
        }
    }

    function e() {
        return [
            'm', 'o', 'c', '.', 'l', 'i', 'a', 'm', 'g',
            '@', 'v', 'e', 'd', '.', 'u', 'o', 's', 'i',
            'm', 'a', 'k'
        ].reverse().join('');
    }
})();