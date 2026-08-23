import MathLevelBaseScene from '../entities/MathLevelBaseScene.js';
export default class Level15 extends MathLevelBaseScene
{
    constructor()
    {
        super('Level15');

        this.levelConfig = {
            requiredTasks: 5, // количество заданий для прохождения уровня

            patterns: [
                '::',
                ':x',
                ':-',
                ':+',
                '-:',
                '+:',
                'x:'
            ],

            nextLevel: 'Warmup6',

            ui: {
                title: 'Уровень 15. Поиск ошибки',
                time: 180,
                background: 'forest',
                instruction: 'Вычисли и выбери направление!'
            }
        };
    }

    createOneExample(pattern, makeWrong)
    {
        let a, b, c, result;

        while (true)
        {
            switch (pattern)
            {
                // =========================
                // УРОВЕНЬ 15
                // =========================

                case '::':
                    c = Phaser.Math.Between(2, 10);
                    b = Phaser.Math.Between(2, 10);
                    a = Phaser.Math.Between(1, 10) * b * c;

                    result = a / b / c;
                    break;

                case ':x':
                    c = Phaser.Math.Between(1, 10);
                    b = Phaser.Math.Between(2, 10);

                    let q1 = Phaser.Math.Between(1, Math.floor(100 / c));

                    a = q1 * b;
                    result = (a / b) * c;
                    break;

                case ':-':
                    b = Phaser.Math.Between(2, 10);
                    let q2 = Phaser.Math.Between(2, 20);

                    a = q2 * b;

                    c = Phaser.Math.Between(1, q2);

                    result = (a / b) - c;
                    break;

                case ':+':
                    b = Phaser.Math.Between(2, 10);
                    let q3 = Phaser.Math.Between(1, 20);

                    a = q3 * b;

                    c = Phaser.Math.Between(1, 100 - q3);

                    result = (a / b) + c;
                    break;

                case '-:':
                    c = Phaser.Math.Between(2, 10);

                    let q4 = Phaser.Math.Between(1, 10);
                    b = q4 * c;

                    a = Phaser.Math.Between(b + 1, 100);

                    result = a - b / c;
                    break;

                case '+:':
                    c = Phaser.Math.Between(2, 10);

                    let q5 = Phaser.Math.Between(1, 10);
                    b = q5 * c;

                    a = Phaser.Math.Between(
                        1,
                        Math.max(1, 100 - q5)
                    );

                    result = a + b / c;
                    break;

                case 'x:':
                    c = Phaser.Math.Between(2, 10);

                    let q6 = Phaser.Math.Between(1, 10);
                    b = q6 * c;

                    let maxA = Math.floor(100 / q6);
                    if (maxA < 1) continue;

                    a = Phaser.Math.Between(1, maxA);

                    result = a * b / c;
                    break;

    // ОБЩАЯ КОНЦОВКА (ОДНА ДЛЯ ВСЕХ)
                default:
                    continue;
            }

            if (result < 0 || result > 100)
                continue;

            break;
        }

        let shown = result;

        if (makeWrong)
        {
            do
            {
                shown = result + Phaser.Math.Between(-5, 5);
            }
            while (
                shown === result ||
                shown < 0 ||
                shown > 100
            );
        }

        return {
            text: `${a} ${pattern[0]} ${b} ${pattern[1]} ${c} = ${shown}`
        };
    }

}