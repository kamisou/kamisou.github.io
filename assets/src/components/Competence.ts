class Competence {
    public element: HTMLDivElement;

    constructor(
        competence: { name: string, value: number }
    ) {
        const span = document.createElement('span');
        span.classList.add('competence__label');
        span.innerHTML = competence.name;

        const meterFill = document.createElement('div');
        meterFill.classList.add('meter__fill');
        meterFill.style.width = `${(competence.value * 100).toFixed(0)}%`;

        const meter = document.createElement('div');
        meter.classList.add('meter');
        meter.append(meterFill);

        const div = document.createElement('div');
        div.classList.add('competence');
        div.append(span, meter);

        this.element = div;
    }
}

export default Competence;