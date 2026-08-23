import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class MathLevelBaseScene extends BaseScene
{
    constructor(key)
    {
        super(key);
    }

    init(data)
    {
        this.completedTasks = data?.completedTasks || 0;
        this.requiredTasks = this.levelConfig.requiredTasks || 5;

        this.allowNegativeSteps = this.levelConfig.allowNegativeSteps || false;
        this.patterns = this.levelConfig.patterns || [];

        this.searchStarted = false;
        this.gameEnded = false;
        this.lastItem = null;
    }

    create()
    {
        super.create(this.levelConfig.ui);

        this.scoreText.setVisible(false); // скрываем счет

        // ТЕКСТ - Счётчик примеров
        this.taskText = this.add.text(
            400,
            90,
            `Задание ${this.completedTasks + 1} из ${this.requiredTasks}`,
            {
                fontFamily: 'VCR',
                fontSize: '10px',
                color: '#1f3285'
            }
        ).setOrigin(0.5);

        // ================= PLAYER =================
        this.player = new Player(this);
        this.player.create(400, 485);
        this.player.player.setVisible(false);
        this.playerLocked = true;

        // ================= ITEMS =================
        this.items = this.physics.add.group();

        const positions = [[75, 500], [725, 500]];
        const types = Phaser.Utils.Array.Shuffle(['NO', 'YES']);

        positions.forEach((p, i) =>
        {
            const item = this.items.create(p[0], p[1], types[i])
                .setScale(0.3);

            item.itemType = types[i];
        });

        // ================= CAT =================

        this.createCatAnim(); // создаём анимацию (берет её из BaseScene)

        this.catPreview = this.add.sprite(
            400,
            485,
            'CatMini_idle1'
        );

        this.catPreview.play('catMiniIdle');

        // ================= смена персонажа ===========

        this.time.delayedCall(5000, () =>
        {
            this.catPreview.destroy(); // удаляем кота
            this.player.player.setVisible(true);
            this.playerLocked = false;
            this.startHint.destroy();
        });

        // ================= HINT =================
        this.startHint = this.add.text(450, 440,
            '✅ — если все верно, ❌ — если есть ошибка',
        {
            fontFamily: 'VCR',
            fontSize: '10px',
            color: '#fff',
            backgroundColor: '#000000aa',
            padding: { x: 10, y: 8 }
        }).setOrigin(0.5);

        // ================= COLLISION =================
        this.physics.add.overlap(this.player.player, this.items, this.checkItem, null, this);
        this.physics.add.collider(this.player.player, this.platforms);

        // ================= TASKS =================
        this.exampleTexts = [];
        this.allExamplesCorrect = true;

        this.createExamples();
    }

    update()
    {
        super.update();
        if (this.gameEnded) return;

        this.physics.overlap(this.player.player, this.items, () =>
        {
            this.lastItemTouched = true;
        });

        if (!this.playerLocked)
            this.player.update();
        else
            this.player.player.setVelocityX(0);
    }

    // ================= CHECK =================

    checkItem(player, item)
    {
        if (this.gameEnded) return;
        if (this.lastItem === item) return;
        this.lastItem = item;

        const choseYes = item.itemType === 'YES';
        const correct = choseYes === this.allExamplesCorrect;

        // =======================
        // ❌ НЕПРАВИЛЬНО
        // =======================
        if (!correct)
        {
            this.gameEnded = true; // сразу блокируем повторные срабатывания

            this.add.image(item.x, item.y, 'boom')
                .setScale(1.1);

            this.onLose();
            return;
        }

        // =======================
        // ✔️ ПРАВИЛЬНО
        // =======================
        this.add.image(item.x, item.y, 'krmstal')
            .setScale(0.5);

        this.completedTasks++;

        if (this.completedTasks >= this.requiredTasks)
            this.onWin();
        else
            this.nextTask();
    }
    // ================= GENERATOR =================
    createExamples()
    {
        const startY = 150;
        const gap = 80;

        for (let i = 0; i < 4; i++)
        {
            const y = startY + i * gap;

            this.add.rectangle(450, y, 500, 55, 0xf8f8e3, 0.82); // фон

            const txt = this.add.text(450, y, '', {
                fontFamily: 'VCR',
                fontSize: '32px',
                color: '#720860'
            }).setOrigin(0.5);

            this.exampleTexts.push(txt);
        }

        this.generateExamples();
    }

    generateExamples()
    {
        const patterns = Phaser.Utils.Array.Shuffle([...this.patterns]).slice(0, 4);

        this.allExamplesCorrect = Phaser.Math.Between(0, 1) === 1;

        let wrongIndex = this.allExamplesCorrect ? -1 : Phaser.Math.Between(0, 3);

        patterns.forEach((p, i) =>
        {
            const data = this.createOneExample(p, i === wrongIndex);
            this.exampleTexts[i].setText(data.text);
        });
    }

    createOneExample()
    {
        throw new Error(
            `${this.scene.key}: createOneExample не реализован`
        );
    }

    nextTask()
    {
        this.cameras.main.fadeOut(400, 138, 209, 240);

        this.cameras.main.once('camerafadeoutcomplete', () =>
        {
            this.scene.restart({ completedTasks: this.completedTasks });
        });
    }

    onWin()
    {
        const prevCount = this.countAchievements();
        this.gameEnded = true;
        this.markCompleted(this.scene.key);
        const newCount = this.countAchievements();

        this.time.delayedCall(300, () =>
        {
            this.scene.start('WinScene', {
                nextScene: this.levelConfig.nextLevel,
                restartScene: this.scene.key,
                newAchievement: newCount > prevCount
            });
        });
    }

    onLose()
    {
        this.gameEnded = true;

        this.time.delayedCall(300, () =>
        {
            this.scene.start('GameOverScene', {
                restartScene: this.scene.key
            });
        });
    }
}