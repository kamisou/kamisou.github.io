const currentDate = new Date(Date.now());

const
    contactData = {
        emailAddress: 'kamisou.dev@gmail.com',
        phoneNumber: '+55 (42) 9 9943-8951',
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
                    'Desenvolvimento e manutenção de aplicações móveis para cooperados e convidados'
                ]
            },
            {
                title: 'Desenvolvedor Pleno',
                company: 'MM Tech',
                start: 2022,
                end: 2024,
                tasks: [
                    'Desenvolvimento e manutenção de aplicações móveis internas e para clientes',
                    'Desenvolvimento e manutenção de aplicações web internas e para clientes',
                    'Desenvolvimento de APIs REST para aplicações internas'
                ]
            },
            {
                title: 'Desenvolvedor Junior',
                company: 'Websix',
                start: 2021,
                end: 2022,
                tasks: [
                    'Desenvolvimento e manutenção de aplicações móveis para clientes'
                ]
            },
            {
                title: 'Jovem Aprendiz',
                company: 'Tetra Pak',
                start: 2020,
                end: 2021,
                tasks: [
                    'Elaboração de relatórios de projetos em Excel, Power BI e Power Automate',
                    'Desenvolvimento de aplicação web/móvel com PowerApps para projetos',
                ]
            }
        ],
    };

const
    emailAddressAnchor = document.querySelector('#email-address'),
    experience = document.querySelector('#experience'),
    experienceYears = document.querySelector('.experience-years'),
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

phoneNumberAnchor.href = `tel:${contactData.phoneNumber.replaceAll(/[^0-9\+]/g, '')}`;
phoneNumberAnchor.innerHTML += contactData.phoneNumber;
