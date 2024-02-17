class Alternative {
    constructor(number) {
        if (number < 10) {
            this.Q1 = 0;
            this.Q2 = number;
        } else {
            this.Q1 = Math.floor(number / 10);
            this.Q2 = number % 10;
        }
    }
    compare(other, Pareto = true) {
        if (Pareto) {
            return this.Q1 >= other.Q1 && this.Q2 >= other.Q2;
        } else {
            return this.Q1 > other.Q1 && this.Q2 > other.Q2;
        }
    }
    static get_alternatives = (set) => {
        let alternatives = [];
        for (let number of set) {
            // Додаємо у множину новий об'єкт типу Альтернатива.
            alternatives.push(new Alternative(number));
        }
        return alternatives;
    };

    static solve(alternatives, Pareto = true) {
        let PX = alternatives;

        for (let A1 of PX) {
            for (let A2 of PX) {
                if (!(PX.includes(A1) || !PX.includes(A2)) || A1 === A2) {
                    continue;
                }
                if (A1.compare(A2, Pareto)) {
                    PX = PX.filter((x) => !(x === A2));
                } else if (A2.compare(A1, Pareto)) {
                    PX = PX.filter((x) => !(x === A1));
                    break;
                }
            }
        }
        return PX;
    }

    static show_table = (set, parent) => {
        const table = document.createElement("div");
        table.classList.add("table");
        parent.appendChild(table);

        const header1 = document.createElement("div");
        const header2 = document.createElement("div");
        header1.innerHTML = "Q1";
        header2.innerHTML = "Q2";
        table.appendChild(header1);
        table.appendChild(header2);

        for (let alternative of set) {
            const elementq1 = document.createElement("div");
            const elementq2 = document.createElement("div");
            elementq1.innerHTML = alternative.Q1;
            elementq2.innerHTML = alternative.Q2;
            table.appendChild(elementq1);
            table.appendChild(elementq2);
        }
    };

    static show_graph = (set, solution_set, graphId, parent) => {
        const graph = document.createElement(`div`);
        graph.id = graphId;
        graph.classList.add("graph-wrapper");
        parent.appendChild(graph);

        solution_set.sort((a, b) => {
            if (a.Q1 === b.Q1) {
                return b.Q2 - a.Q2;
            }
            return a.Q1 - b.Q1;
        });

        const main_trace = {
            x: Array.from({ length: set.length }, (_, i) => set[i].Q1),
            y: Array.from({ length: set.length }, (_, i) => set[i].Q2),
            text: Array.from({ length: set.length }, (_, i) => "A" + (i + 1)),
            textposition: "bottom right",
            mode: "markers+text",
            type: "scatter",
            name: "Початкова множина",
        };
        const solution_trace = {
            x: Array.from(
                { length: solution_set.length },
                (_, i) => solution_set[i].Q1,
            ),
            y: Array.from(
                { length: solution_set.length },
                (_, i) => solution_set[i].Q2,
            ),
            mode: "markers+text+lines",
            type: "scatter",
            name: "Границя Парето/Слейтера",
        };
        Plotly.newPlot(`${graphId}`, [main_trace, solution_trace]);
    };

    static show_set_info = (set, solution_set, id, Pareto) => {
        const parent = document.createElement("div");
        if (Pareto) {
            parent.id = `pareto${id}`;
        } else {
            parent.id = `sleyter${id}`;
        }
        parent.classList.add("set-info");
        document.body.appendChild(parent);

        const header = document.createElement("h2");
        if (Pareto) {
            header.innerHTML = `Розв'язок для ${id}-ої множини за Парето`;
        } else {
            header.innerHTML = `Розв'язок для ${id}-ої множини за Слейтером`;
        }
        parent.appendChild(header);
        console.log(header);

        Alternative.show_table(solution_set, parent);
        Alternative.show_graph(set, solution_set, parent.id + "-graph", parent);
    };
}

let set1 = [
    5, 25, 84, 27, 36, 5, 46, 29, 13, 57, 24, 95, 82, 45, 14, 67, 34, 64, 43,
    50,
];

let set2 = [
    87, 8, 76, 78, 88, 84, 3, 51, 54, 99, 32, 60, 76, 68, 39, 12, 26, 86, 94,
    39,
];

let set3 = [
    95, 70, 34, 78, 67, 1, 97, 2, 17, 92, 52, 56, 1, 80, 86, 41, 65, 89, 44, 19,
];

alt1 = Alternative.get_alternatives(set1);
alt2 = Alternative.get_alternatives(set2);
alt3 = Alternative.get_alternatives(set3);

par1 = Alternative.solve(alt1);
par2 = Alternative.solve(alt2);
par3 = Alternative.solve(alt3);
console.log("Вирішення для першої множини за Парето", par1);
console.log("Вирішення для другої множини за Парето", par2);
console.log("Вирішення для третьої множини за Парето", par3);
Alternative.show_set_info(alt1, par1, 1, true);
Alternative.show_set_info(alt2, par2, 2, true);
Alternative.show_set_info(alt3, par3, 3, true);

sley1 = Alternative.solve(alt1, false);
sley2 = Alternative.solve(alt2, false);
sley3 = Alternative.solve(alt3, false);
console.log("Вирішення для першої множини за Слейтером", sley1);
console.log("Вирішення для другої множини за Слейтером", sley2);
console.log("Вирішення для третьої множини за Слейтером", sley3);
Alternative.show_set_info(alt1, sley1, 1, false);
Alternative.show_set_info(alt2, sley2, 2, false);
Alternative.show_set_info(alt3, sley3, 3, false);
