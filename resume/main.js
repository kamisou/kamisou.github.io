const currentDate = new Date(Date.now());

const
    contactData = {
        emailAddress: 'kamisou.dev@gmail.com',
        phoneNumber: '+55 (42) 9 9943-8951',
        linkedin: 'https://linkedin.com/in/kamisou/'
    },
    experienceData = {
        start: 2020,
        jobs: [
            {
                title: 'Desenvolvedor Pleno',
                company: 'Castrolanda Cooperativa Agroindustrial',
                start: 2024,
                end: null,
                tasks: [
                    'Desenvolvi e mantive aplicações de celular utilizadas por milhares de cooperados e colaboradores.',
                    'Contribuí para o evento Agroleite desenvolvendo aplicativo para votação no concurso e com informações pertinentes ao evento.',
                    'Desenvolvi uma biblioteca interna para reutilização de código nos projetos de aplicativos móveis.'
                ]
            },
            {
                title: 'Desenvolvedor Pleno',
                company: 'MM Tech',
                start: 2022,
                end: 2024,
                tasks: [
                    'Desenvolvi um componente Adaptor em NodeJS para transformar requisições e respostas de API SOAP em API REST utilizadas por sistemas internos.',
                    'Atendi diversos clientes com desenvolvimento e manutenção de aplicativos web com Laravel e PHP.'
                ]
            },
            {
                title: 'Desenvolvedor Junior',
                company: 'Websix',
                start: 2021,
                end: 2022,
                tasks: [
                    'Atendi diversos clientes com desenvolvimento e manutenção de aplicativos de celular em Flutter com dart.',
                    'Incorporei os padrões de design BLoC pattern e bibliotecas de gerência de estado nos aplicativos (Riverpod, Provider).'
                ]
            },
            {
                title: 'Jovem Aprendiz',
                company: 'Tetra Pak',
                start: 2020,
                end: 2021,
                tasks: [
                    'Elaborei dashboards com Excel, Power BI e Power Automate.',
                    'Desenvolvi uma aplicação web/móvel com PowerApps para gerência de projetos.',
                ]
            }
        ],
    };

const
    emailAddressAnchor = document.querySelector('#email-address'),
    experience = document.querySelector('#experience'),
    experienceYears = document.querySelector('.experience-years'),
    linkedinAnchor = document.querySelector('#linkedin'),
    phoneNumberAnchor = document.querySelector('#phone-number');

emailAddressAnchor.href = `mailto:${contactData.emailAddress}`;
emailAddressAnchor.innerHTML += contactData.emailAddress;

for (const job of experienceData.jobs) {
    const div = document.createElement('div');
    const title = document.createElement('h4');
    const company = document.createElement('h5');
    const range = document.createElement('span');
    const description = document.createElement('ul');
    const divider = document.createElement('hr');

    div.classList.add('experience');
    title.innerText = job.title;
    company.innerText = job.company;
    range.classList.add('date-range');
    range.innerText = `${job.start} - ${job.end ? job.end : 'Atual'}`;

    for (const task of job.tasks) {
        const item = document.createElement('li');
        item.innerText = task;
        description.appendChild(item);
    }

    div.appendChild(title);
    div.appendChild(company);
    div.appendChild(range);
    div.appendChild(description);
    div.appendChild(divider);
    experience.appendChild(div);
}

experienceYears.innerHTML = `${currentDate.getFullYear() - experienceData.start} anos`;

linkedinAnchor.href = contactData.linkedin;
linkedinAnchor.innerHTML += contactData.linkedin.substring(8);

phoneNumberAnchor.href = `tel:${contactData.phoneNumber.replaceAll(/[^0-9\+]/g, '')}`;
phoneNumberAnchor.innerHTML += contactData.phoneNumber;
