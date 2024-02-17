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
