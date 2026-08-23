import MathLevelBaseScene from '../entities/MathLevelBaseScene.js';

export default class Level13 extends MathLevelBaseScene
{
    constructor()
    {
        super('Level13');

        this.levelConfig = {
            requiredTasks: 5,

            patterns: [
                '++',
                '-+',
                '+-',
                '--'
            ],

            nextLevel: 'Level14',

            ui: {
                title: 'Уровень 13. Поиск ошибки',
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
            // УРОВЕНЬ 13
            // =========================

            case '++':
                a = Phaser.Math.Between(1, 50);
                b = Phaser.Math.Between(1, 50);
                c = Phaser.Math.Between(1, 100 - a - b);
                result = a + b + c;
                break;

            case '-+':
                a = Phaser.Math.Between(20, 100);
                b = Phaser.Math.Between(1, a - 1);
                c = Phaser.Math.Between(1, 100 - (a - b));
                result = a - b + c;
                break;

            case '+-':
                a = Phaser.Math.Between(1, 50);
                b = Phaser.Math.Between(1, 50);

                let temp1 = a + b;

                c = Phaser.Math.Between(1, temp1);
                result = temp1 - c;
                break;

            case '--':
                a = Phaser.Math.Between(20, 100);
                b = Phaser.Math.Between(1, a - 1);

                let temp2 = a - b;

                c = Phaser.Math.Between(1, temp2);
                result = temp2 - c;
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