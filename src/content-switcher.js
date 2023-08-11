export default class ContentSwitcher {
    #content;
    #links;

    constructor() {
        this.#content = document.querySelector('#content');
        this.#links = document.querySelectorAll('.nav__link-list .link');

        for (const link of this.#links) {
            link.addEventListener('mouseup', (ev => this.#swapContent(ev, link)).bind(this));
        }
    }

    #swapContent(ev, link) {
        if (ev.button !== 0) {
            return;
        }

        for (const child of this.#content.children) {
            if (child.dataset.content === link.dataset.content) {
                child.removeAttribute('hidden');
            } else {
                child.setAttribute('hidden', '');
            }
        }
    }
}