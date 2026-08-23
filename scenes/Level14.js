import MathLevelBaseScene from '../entities/MathLevelBaseScene.js';

export default class Level14 extends MathLevelBaseScene
{
    constructor()
    {
        super('Level14');

        this.levelConfig = {
            requiredTasks: 5, // количество заданий для прохождения уровня

            patterns: [
                'xx',
                'x+',
                'x-',
                '+x',
                '-x'
            ],

            nextLevel: 'Level15',

            ui: {
                title: 'Уровень 14. Поиск ошибки',
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
                // УРОВЕНЬ 14
                // =========================

                case 'xx':
                    a = Phaser.Math.Between(1, 10);
                    b = Phaser.Math.Between(1, 10);

                    let maxC1 = Math.floor(100 / (a * b));
                    if (maxC1 < 1) continue;

                    c = Phaser.Math.Between(1, maxC1);
                    result = a * b * c;
                    break;

                case 'x+':
                    a = Phaser.Math.Between(1, 10);
                    b = Phaser.Math.Between(1, 10);

                    let temp3 = a * b;
                    if (temp3 > 99) continue;

                    c = Phaser.Math.Between(1, 100 - temp3);
                    result = temp3 + c;
                    break;

                case 'x-':
                    a = Phaser.Math.Between(1, 10);
                    b = Phaser.Math.Between(1, 10);

                    let temp4 = a * b;
                    if (temp4 < 2) continue;

                    c = Phaser.Math.Between(1, temp4);
                    result = temp4 - c;
                    break;

                case '+x':
                    a = Phaser.Math.Between(1, 50);

                    b = Phaser.Math.Between(1, 10);
                    c = Phaser.Math.Between(
                        1,
                        Math.max(1, Math.floor((100 - a) / b))
                    );

                    result = a + b * c;
                    break;

                case '-x':
                    a = Phaser.Math.Between(20, 100);

                    b = Phaser.Math.Between(1, 10);

                    let maxC2 = Math.floor(a / b);
                    if (maxC2 < 1) continue;

                    c = Phaser.Math.Between(1, maxC2);

                    result = a - b * c;
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