; (function () {
    const root = document.querySelector(':root');
    const themeToggle = document.querySelector('#theme-toggle');

    themeToggle.addEventListener('mouseup', toggleTheme);

    function toggleTheme() {
        if (root.classList.contains('light-mode')) {
            root.classList.remove('light-mode');
            themeToggle.innerText = 'light_mode';
        } else {
            root.classList.add('light-mode');
            themeToggle.innerText = 'dark_mode';
        }
    }
})();