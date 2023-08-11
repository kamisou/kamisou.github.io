export default class EmailObfuscator {
    #visible = false;
    #email;

    constructor() {
        this.#email = document.querySelector('#email');
        this.#email.addEventListener('mouseup', this.#handleClick.bind(this));
    }

    #handleClick(ev) {
        if (ev.button !== 0) {
            return;
        }

        if (this.#visible) {
            window.location.href = `mailto:${this.#em()}`;
        } else {
            this.#email.innerText = this.#em();
            this.#visible = true;
        }
    }

    #em() {
        return [
            'm', 'o', 'c', '.', 'l', 'i', 'a', 'm', 'g',
            '@', 'v', 'e', 'd', '.', 'u', 'o', 's', 'i',
            'm', 'a', 'k'
        ].reverse().join('');
    }
}