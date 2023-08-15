class EmailObfuscator {
    private visible: boolean = false;

    constructor(
        private email: HTMLElement,
    ) { }

    handleClick(ev: MouseEvent): void {
        if (ev.button !== 0) {
            return;
        }

        if (this.visible) {
            window.location.href = `mailto:${this.em()}`;
        } else {
            this.email.innerText = this.em();
            this.visible = true;
        }
    }

    private em(): string {
        return [
            ['m', 'o', 'c', '.'],
            ['l', 'i', 'a', 'm', 'g', '@'],
            ['v', 'e', 'd', '.'],
            ['u', 'o', 's', 'i', 'm', 'a', 'k'],
        ].reverse().map(v => v.reverse().join('')).join('');
    }
}

export default EmailObfuscator;