const content = document.querySelector('#content');
const links = document.querySelectorAll('.nav__link-list .link');

for (const link of links) {
    link.addEventListener('mouseup', ev => {
        if (ev.button !== 0) {
            return;
        }

        setContent(link.dataset.content);
    });
}

function setContent(page) {
    for (const child of content.children) {
        if (child.dataset.content === page) {
            child.removeAttribute('hidden');
        } else {
            child.setAttribute('hidden', '');
        }
    }
}

