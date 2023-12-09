enum ThemeMode {
    dark,
    light,
};

class ThemeModeSwitch {
    constructor(
        private htmlRoot: HTMLElement,
        private toggleButton: HTMLElement,
        private _mode: ThemeMode = ThemeMode.dark,
    ) { }

    get mode(): ThemeMode {
        return this._mode;
    }

    switchMode(): void {
        switch (this.mode) {
            case ThemeMode.dark:
                this.htmlRoot.classList.add('light-mode');
                this.toggleButton.innerText = 'dark_mode';
                this._mode = ThemeMode.light;
                break;
            case ThemeMode.light:
                this.htmlRoot.classList.remove('light-mode');
                this.toggleButton.innerText = 'light_mode';
                this._mode = ThemeMode.dark;
                break;
        }
    }
};

export default ThemeModeSwitch;
