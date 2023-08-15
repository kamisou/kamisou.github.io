import ThemeModeSwitch from "./ThemeModeSwitch";
import BlinkingCursor from "./BlinkingCursor";
import ContentSwitcher from "./ContentSwitcher";
import EmailObfuscator from "./EmailObfuscator";

const root = document.querySelector<HTMLElement>(':root')!;
const toggleButton = document.querySelector<HTMLElement>('#theme-toggle')!;
const title = document.querySelector<HTMLElement>('#title')!;
const links = document.querySelectorAll<HTMLElement>('.nav__link-list .link')!;
const content = document.querySelector<HTMLElement>('#content')!;
const email = document.querySelector<HTMLElement>('#email')!;

const cursor = new BlinkingCursor(title);
const emailObfuscator = new EmailObfuscator(email);
const contentSwitcher = new ContentSwitcher(content);
const themeModeSwitch = new ThemeModeSwitch(root, toggleButton);

links.forEach(link => link.addEventListener('mouseup', ev => contentSwitcher.swapContent(ev, link)));
toggleButton.addEventListener('mouseup', themeModeSwitch.switchMode.bind(themeModeSwitch));
email.addEventListener('mouseup', emailObfuscator.handleClick.bind(emailObfuscator));
cursor.blink();
