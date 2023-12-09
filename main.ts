import './assets/styles/app.css';
import competences from './assets/data/competences.json';
import projects from './assets/data/projects.json';

import BlinkingCursor from "./assets/src/BlinkingCursor";
import Competence from "./assets/src/components/Competence";
import ContentSwitcher from "./assets/src/ContentSwitcher";
import EmailObfuscator from "./assets/src/EmailObfuscator";
import Project from "./assets/src/components/Project";
import ThemeModeSwitch from "./assets/src/ThemeModeSwitch";

const root = document.querySelector<HTMLElement>(':root')!;
const toggleButton = document.querySelector<HTMLElement>('#theme-toggle')!;
const title = document.querySelector<HTMLElement>('#title')!;
const links = document.querySelectorAll<HTMLElement>('.nav__link-list .link')!;
const content = document.querySelector<HTMLElement>('#content')!;
const email = document.querySelector<HTMLElement>('#email')!;
const competenceList = document.querySelector<HTMLDivElement>('#competences')!;
const projectList = document.querySelector<HTMLDivElement>('#projects')!;

const cursor = new BlinkingCursor(title);
const emailObfuscator = new EmailObfuscator(email);
const contentSwitcher = new ContentSwitcher(content);
const themeModeSwitch = new ThemeModeSwitch(root, toggleButton);

competences.forEach(competence => competenceList.append(new Competence(competence).element));
projects.forEach(project => projectList.append(new Project(project).element));

links.forEach(link => link.addEventListener('mouseup', ev => contentSwitcher.swapContent(ev, link)));
toggleButton.addEventListener('mouseup', themeModeSwitch.switchMode.bind(themeModeSwitch));
email.addEventListener('mouseup', emailObfuscator.handleClick.bind(emailObfuscator));
cursor.blink();
