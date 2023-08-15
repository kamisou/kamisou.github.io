class BlinkingCursor {
    private intervalId: number;
    private visible: boolean = false;

    constructor(
        public title: HTMLElement,
        private interval: number = 500,
    ) { }

    blink(): void {
        if (this.intervalId) {
            return;
        }

        this.intervalId = setInterval(() => {
            const oldText = this.title.innerText;

            if (this.visible) {
                this.title.innerText = oldText.substring(0, oldText.length - 1);
            } else {
                this.title.innerText = `${oldText}|`;
            }

            this.visible = !this.visible;
        }, this.interval);
    }

    stop(): void {
        clearInterval(this.intervalId);
    }
}

export default BlinkingCursor;