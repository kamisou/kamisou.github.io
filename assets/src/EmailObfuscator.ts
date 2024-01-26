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
            window.location.href = `mailto:${this.getEmail()}`;
        } else {
            this.email.innerText = this.getEmail();
            this.visible = true;
        }
    }

    private getEmail(): string {
        return atob(
            't92YuwWah12ZAZXZk5SdvNXatF2a'
            .split('')
            .reverse()
            .join('')
        );
    }
}

export default EmailObfuscator;