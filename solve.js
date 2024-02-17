// Клас Альтернатива, представляє альтернативу числа з множини.
// Містить значення Q1 та Q2, що представляють першу та другу його цифри.
class Alternative {
    // ========================================================================
    // Конструктор.
    constructor(number) {
        // Якщо в числі одна цифра, то як першу беремо 0, як другу саме  число.
        if (number < 10) {
            this.Q1 = 0;
            this.Q2 = number;
        } else {
            // Округлення від ділення на 10 дає другий розряд, остача - перший.
            this.Q1 = Math.floor(number / 10);
            this.Q2 = number % 10;
        }
    }

    // ========================================================================
    // Чи домінує дана альтернатива. За замовчуванням
    // використовується умова Парето, щоб використати умову Слейтера
    // задаємо параметр Pareto = false.
    compare(other, Pareto = true) {
        if (Pareto) {
            return this.Q1 >= other.Q1 && this.Q2 >= other.Q2;
        } else {
            return this.Q1 > other.Q1 && this.Q2 > other.Q2;
        }
    }

    // ========================================================================
    // Для множини чисел створюємо множину альтернатив.
    static get_alternatives = (set) => {
        let alternatives = [];
        for (let number of set) {
            // Додаємо у множину новий об'єкт типу Альтернатива.
            alternatives.push(new Alternative(number));
        }
        return alternatives;
    };

    // ========================================================================
    // Головна функція програми, яка обраховує оптимальні рішення.
    static solve(alternatives, Pareto = true) {
        let PX = alternatives;

        for (let A1 of PX) {
            for (let A2 of PX) {
                // Якщо елементи відсутні або рівні, пропускаємо
                // (елементи можуть бути відсутні, тому що ми їх видаляємо
                // в процесі, але цикл йде по старому списку).
                if (!(PX.includes(A1) || !PX.includes(A2)) || A1 === A2) {
                    continue;
                }
                // Якщо А1 домінує А2, то видаляємо А2.
                if (A1.compare(A2, Pareto)) {
                    PX = PX.filter((x) => !(x === A2));
                }
                // Якщо А2 домінує А1, то видаляємо А1.
                // і ітеруємо зовнішній цикл.
                else if (A2.compare(A1, Pareto)) {
                    PX = PX.filter((x) => !(x === A1));
                    break;
                }
            }
        }
        return PX;
    }

    // ========================================================================
    // Показуємо множину альтернатив у вигляді таблиці на HTML-сторінці.
    static show_table = (set, parent) => {
        // Створюємо елемент таблиці та надаємо йому клас "table".
        const table = document.createElement("div");
        table.classList.add("table");
        parent.appendChild(table);

        // Заголовки таблиці. Задаємо їм текст та додаємо їх до таблиці.
        const header1 = document.createElement("div");
        const header2 = document.createElement("div");
        header1.innerHTML = "Q1";
        header2.innerHTML = "Q2";
        table.appendChild(header1);
        table.appendChild(header2);

        // Додаємо кожну альтернативу до таблиці у вигляді двох елементів div,
        // один відповідає Q1, другий - Q2.
        for (let alternative of set) {
            const elementq1 = document.createElement("div");
            const elementq2 = document.createElement("div");
            elementq1.innerHTML = alternative.Q1;
            elementq2.innerHTML = alternative.Q2;
            table.appendChild(elementq1);
            table.appendChild(elementq2);
        }
    };

    // ========================================================================
    // Показуємо множину альтернатив і границю Парето/Слейтера
    // у вигляді графіка на HTML-сторінці.
    static show_graph = (set, solution_set, graphId, parent) => {
        // Елемент-обгортка для графіка. Так працює бібліотека Plotly.
        // Надаємо обгортці ідентифікатор і клас.
        const graph = document.createElement(`div`);
        graph.id = graphId;
        graph.classList.add("graph-wrapper");
        parent.appendChild(graph);

        // Сортуємо множину рішень, щоб її графік відображався нормально.
        // Спочатку пробуємо сортувати за зростанням по x,
        // потім за спаданням по y.
        solution_set.sort((a, b) => {
            if (a.Q1 === b.Q1) {
                return b.Q2 - a.Q2;
            }
            return a.Q1 - b.Q1;
        });

        // Точки початкової множини. Такий вигляд задається бібліотекою Plotly.
        const main_trace = {
            // Осі абсиц та ординат.
            x: Array.from({ length: set.length }, (_, i) => set[i].Q1),
            y: Array.from({ length: set.length }, (_, i) => set[i].Q2),
            // Підписи точок та їх позиція відносно точки (справа знизу).
            // Це створення масиву довжиною як сама множина,
            // де кожен елемент буде "А" і його індекс.
            text: Array.from({ length: set.length }, (_, i) => "A" + (i + 1)),
            textposition: "bottom right",
            // Виводимо самі точки (не з'єднюємо) і їх підписи.
            mode: "markers+text",
            type: "scatter",
            name: "Початкова множина",
        };
        // Границя Парето/Слейтера.
        const solution_trace = {
            x: Array.from(
                { length: solution_set.length },
                (_, i) => solution_set[i].Q1,
            ),
            y: Array.from(
                { length: solution_set.length },
                (_, i) => solution_set[i].Q2,
            ),
            // Тепер з'єднюємо точки лінією.
            mode: "markers+text+lines",
            type: "scatter",
            name: "Границя Парето/Слейтера",
        };
        Plotly.newPlot(`${graphId}`, [main_trace, solution_trace]);
    };

    // ========================================================================
    // Ця функція виводить і таблицю, і заголовок, і графік.
    static show_set_info = (set, solution_set, id, Pareto) => {
        // Створюємо батьківський елемент-коробку,
        // куди будемо додавати інформацію.
        const parent = document.createElement("div");
        if (Pareto) {
            parent.id = `pareto${id}`;
        } else {
            parent.id = `sleyter${id}`;
        }
        parent.classList.add("set-info");
        document.body.appendChild(parent);

        // СТворюємо заголовок.
        const header = document.createElement("h2");
        if (Pareto) {
            header.innerHTML = `Розв'язок для ${id}-ої множини за Парето`;
        } else {
            header.innerHTML = `Розв'язок для ${id}-ої множини за Слейтером`;
        }
        parent.appendChild(header);
        console.log(header);

        // Показуємо таблицю і графік.
        Alternative.show_table(solution_set, parent);
        Alternative.show_graph(set, solution_set, parent.id + "-graph", parent);
    };
}

// Початкові множини.
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

// Альтренативи для множин.
alt1 = Alternative.get_alternatives(set1);
alt2 = Alternative.get_alternatives(set2);
alt3 = Alternative.get_alternatives(set3);

// ==== РОЗВ'ЯЗАННЯ І ВИВІД ===================================================

// ==== Парето

// Розв'язки за Парето.
par1 = Alternative.solve(alt1);
par2 = Alternative.solve(alt2);
par3 = Alternative.solve(alt3);
// Виводимо ці розв'язки в консоль.
console.log("Вирішення для першої множини за Парето", par1);
console.log("Вирішення для другої множини за Парето", par2);
console.log("Вирішення для третьої множини за Парето", par3);
// Показуємо ці розв'язки на HTML-сторінці.
Alternative.show_set_info(alt1, par1, 1, true);
Alternative.show_set_info(alt2, par2, 2, true);
Alternative.show_set_info(alt3, par3, 3, true);

// ==== Слейтер

// Розв'язки за Слейтером.
sley1 = Alternative.solve(alt1, false);
sley2 = Alternative.solve(alt2, false);
sley3 = Alternative.solve(alt3, false);
// Виводимо ці розв'язки в консоль.
console.log("Вирішення для першої множини за Слейтером", sley1);
console.log("Вирішення для другої множини за Слейтером", sley2);
console.log("Вирішення для третьої множини за Слейтером", sley3);
// Показуємо ці розв'язки на HTML-сторінці.
Alternative.show_set_info(alt1, sley1, 1, false);
Alternative.show_set_info(alt2, sley2, 2, false);
Alternative.show_set_info(alt3, sley3, 3, false);
