export default class ThemeModeSwitch {
    #root;
    #toggle;

    constructor() {
        this.#root = document.querySelector(':root');
        this.#toggle = document.querySelector('#theme-toggle');
        this.#toggle.addEventListener('mouseup', this.#switch.bind(this));
    }

    get isLightMode() {
        return this.#root.classList.contains('light-mode');
    }

    #switch() {
        if (this.isLightMode) {
            this.#root.classList.remove('light-mode');
            this.#toggle.innerText = 'light_mode';
        } else {
            this.#root.classList.add('light-mode');
            this.#toggle.innerText = 'dark_mode';
        }
    }
};