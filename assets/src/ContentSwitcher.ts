class ContentSwitcher {
    constructor(
        private content: HTMLElement,
    ) { }

    swapContent(ev: MouseEvent, link: HTMLElement): void {
        if (ev.button !== 0) {
            return;
        }

        for (const child of this.content.children) {
            if (child instanceof HTMLElement) {
                if (child.dataset.content === link.dataset.content) {
                    child.removeAttribute('hidden');
                } else {
                    child.setAttribute('hidden', '');
                }
            }
        }
    }
}

export default ContentSwitcher;