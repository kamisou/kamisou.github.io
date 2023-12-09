class Project {
    public element: HTMLDivElement;

    constructor(
        project: { link: string, icon?: string, name: string, description: string }
    ) {
        const a = document.createElement('a');
        a.classList.add('link');
        a.href = project.link;
        a.target = '_blank';

        if (project.icon) {
            const img = document.createElement('img');
            img.classList.add('projects__app-icon');
            img.src = project.icon;
            img.alt = project.name;
            a.append(img);
        }
        
        a.innerHTML += project.name;

        const p = document.createElement('p');
        p.classList.add('paragraph');
        p.innerHTML = project.description;

        const div = document.createElement('div');
        div.classList.add('projects__item');
        div.append(a, p);

        this.element = div;
    }
}

export default Project;