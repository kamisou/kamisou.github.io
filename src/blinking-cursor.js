export default class BlinkingCursor {
    #visible = false;
    #title;

    constructor(interval = 500) {
        this.#title = document.querySelector('#title');

        setInterval(() => {
            const oldText = this.#title.innerText;

            if (this.#visible) {
                this.#title.innerText = oldText.substr(0, oldText.length - 1);
            } else {
                title.innerText = `${oldText}|`;
            }

            this.#visible = !this.#visible;
        }, interval);
    }
}