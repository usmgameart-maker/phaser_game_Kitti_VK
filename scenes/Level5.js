import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Level5 extends BaseScene
{
    constructor()
    {
        super('Level5');
    }

    create(data)
    {
        super.create({
            title: 'Уровень: 5. Вычитание',
            time: 40,
            background: 'night',
            instruction: 'Реши пример и собери все монеты с правильным ответом!'
        });

        // =====================
        // ПЕРЕМЕННЫЕ
        // =====================
        this.completedTasks = data?.completedTasks || 0; // количество выполненных заданий

        this.requiredTasks = 3; // количество заданий для прохождения уровня

        // =====================
        // ПЛАТФОРМЫ (ФИЗИКА + ВИЗУАЛ В ОДНОМ)
        // =====================

         const makePlatform = (x, y, key) =>
        {
            return this.physics.add.staticImage(x, y, key)
                .setScale(0.5)
                .refreshBody(); // важно для нормального размера
        };

        // КООРДИНАТЫ ДЛЯ ПЛАТФОРМ
        this.platform1 = makePlatform(730, 380, 'platform_mini1');

        this.platform2 = makePlatform(400, 420, 'platform_mini2');
        this.platform3 = makePlatform(80, 420, 'platform_mini1');

        this.platform4 = makePlatform(620, 200, 'platform_mini2');

        this.platform5 = makePlatform(250, 280, 'platform_mini2');

        this.platform6 = makePlatform(170, 150, 'platform_mini1');

        // =====================
        // ГЕНЕРАЦИЯ ПРИМЕРА (вычитание)
        // ответ всегда 2-значный (10–49)
        // =====================

        // уменьшаемое
        this.a = Phaser.Math.Between(25, 50); // диапазон

        // вычитаемое подбираем так, чтобы:
        // a - b был от 10 до 49
        const minB = Math.max(10, this.a - 49); // чтобы результат был не меньше 10
        const maxB = this.a - 10; // чтобы результат был не больше 49

        this.b = Phaser.Math.Between(minB, maxB); // так мы гарантируем, что a - b будет от 10 до 49

        // итоговый ответ
        this.correctAnswer = this.a - this.b;

        // Текст примера сохранить в переменную
        this.exampleText = this.add.text(400, 80, `${this.a} - ${this.b} =❓`, {
            fontFamily: 'VCR',
            fontSize: '32px',
            color: '#720860',
            backgroundColor: '#f8f8e3d0',
            padding: { x: 25, y: 10 }
        }).setOrigin(0.5);

        // ТЕКСТ - Счётчик примеров
        this.taskText = this.add.text(
            400,
            120,
            `Пример ${this.completedTasks + 1} из ${this.requiredTasks}`,
            {
                fontFamily: 'VCR',
                fontSize: '10px',
                color: '#ffffff'
            }
        ).setOrigin(0.5);

        // =====================
        // ОТВЕТЫ
        // =====================
        this.answers = [];

        this.answers.push(this.correctAnswer);
        this.answers.push(this.correctAnswer);

        const wrongAnswers = new Set();

        // отклонение
        while (wrongAnswers.size < 2)
        {
            const offset = Phaser.Math.Between(-5, 5);

            if (offset === 0) continue;

            const wrong = this.correctAnswer + offset;

            if (wrong > 0)
            {
                wrongAnswers.add(wrong);
            }
        }

        wrongAnswers.forEach(w =>
        {
            this.answers.push(w);
            this.answers.push(w);
        });

        Phaser.Utils.Array.Shuffle(this.answers);

        this.answerPositions = [
            [710, 340],
            [340, 380],
            [80, 380],
            [640, 160],
            [160, 240],
            [130, 90]
        ];

        // =====================
        // СОБРАНО / ВСЕ СОБРАНО
        // =====================

        this.collectedCorrect = 0;
        this.totalCorrect = 2;

        // =====================
        // PLAYER - остается везде, так как он есть на всех уровнях
        // =====================
        this.player = new Player(this);
        this.player.create(400, 485);

        // Создаём answers.
        this.answerGroup = this.physics.add.group(); // создаем группу

        // СПАВН ОБЪЕКТОВ (создаём объекты ответов на сцене)
        this.answerPositions.forEach((pos, index) =>
        {
            const value = this.answers[index];

            const item = this.answerGroup.create(pos[0], pos[1], 'coin')
                .setScale(0.25);

            // ===== СВЕЧЕНИЕ (фейковый glow) =====
            item.glow = this.add.image(pos[0], pos[1], 'coin')
                .setScale(0.35)
                .setAlpha(0.25)
                .setTint(0xffff99); // жёлтое свечение

            item.glow.setDepth(item.depth - 1);

            item.answerValue = value;

            item.answerText = this.add.text(pos[0], pos[1] - 40, value, {
                fontFamily: 'VCR',
                fontSize: '24px',
                color: '#cf1818'
            }).setOrigin(0.5);
        });

        // =====================
        // КОЛЛИЗИЯ
        // =====================
        // 1. КОЛЛИЗИИ С ПЛАТФОРМАМИ ПО КОТОРЫМ ПРЫГАЕМ
        this.physics.add.collider(
        this.player.player,
        [
            this.platform1,
            this.platform2,
            this.platform3,
            this.platform4,
            this.platform5,
            this.platform6
        ],
        null,
        (player, platform) => {
            return player.body.velocity.y >= 0 &&
                player.body.bottom <= platform.body.top + 20;
        },
        this
    );

        // OVERLAP (проверяем столкновение игрока с ответами)
        this.physics.add.overlap(
        this.player.player,
        this.answerGroup,
        this.collectAnswer,
        null,
        this
        );

        // =====================
        // PLATFORMS - остается везде, так как они есть на всех уровнях
        // =====================
        this.physics.add.collider( // добавляем коллизию между игроком и платформами
        this.player.player,
        this.platforms
        );
    }

    update()
    {
        super.update(); // обрабатываем клавиши (M, F, ESC) из BaseScene
        if (this.gameEnded) return;

        this.player.update();

        const offset = Math.sin(this.time.now * 0.002) * 20;

        this.platform1.y = 400 + offset;
        this.platform3.y = 440 + offset;
        this.platform5.y = 300 + offset;

        this.platform2.x = 400 + offset;
        this.platform4.x = 620 + offset;
        this.platform6.x = 150 + offset;

        this.platform1.refreshBody();
        this.platform2.refreshBody();
        this.platform3.refreshBody();
        this.platform4.refreshBody();
        this.platform5.refreshBody();
        this.platform6.refreshBody();

        this.answerGroup.children.iterate(item =>
        {
            // Пульсация монет
            const baseScale = 0.25; // базовый размер
            item.setScale(baseScale + Math.sin(this.time.now * 0.002) * 0.03); // пульсация

            const scale = item.scale;

            // синхронизируем свечение
            if (item.glow)
            {
                item.glow.setPosition(item.x, item.y);
                item.glow.setScale(scale * 1.4);
                item.glow.setAlpha(0.15 + Math.sin(this.time.now * 0.002) * 0.05);
            }
        });
    }

    collectAnswer(player, item)
    {
        if (this.gameEnded) return;

        if (!item.active) return;

        const value = item.answerValue;
        const { x, y } = item; // сохраняем координаты до удаления объекта

        // удаляем МОНЕТУ
        item.destroy();
        if (item.glow) item.glow.destroy();
        if (item.answerText) item.answerText.destroy();

        // =====================
        // ПРАВИЛЬНЫЙ ОТВЕТ
        // =====================

        if (value === this.correctAnswer)
        {
            // красивый эффект (ПОЛОЖИТЕЛЬНО)
            const effect = this.add.image(x, y, 'krmstal').setScale(0.5);

            this.time.delayedCall(200, () =>
            {
                effect.destroy();
            });

            this.collectedCorrect++;

            if (this.scoreText)
            {
                this.scoreText.setText(
                    `Собрано: ${this.collectedCorrect}`
                );
            }

            // Вместо победы проверяем сколько примеров уже решено
            if (this.collectedCorrect >= this.totalCorrect)
            {
                this.completedTasks++;

                if (this.completedTasks >= this.requiredTasks)
                {
                    this.onWin();
                }
                else
                {
                    this.nextTask();
                }
            }
        }

        // =====================
        // НЕПРАВИЛЬНЫЙ ОТВЕТ
        // =====================
        else
        {
            this.gameEnded = true; // сразу блокируем, чтобы одновременное касание другого объекта не вызвало двойной реакции

            // эффект взрыв (ОТРИЦАТЕЛЬНО)
            const effect = this.add.image(x, y, 'boom').setScale(0.7);

            this.time.delayedCall(200, () => effect.destroy());

            this.onLose();
        }
    }

    //Добавляем метод для управления переходами между заданиями на уровне
    nextTask()
    {
        // затемнение
        this.cameras.main.fadeOut(600, 148, 153, 201); // время, цвет

        // значение	что это
        // 0,0,0	чёрный
        // 255,255,255	белый
        // 255,0,0	красный
        // 0,255,0	зелёный
        // 0,0,255	синий

        this.cameras.main.once('camerafadeoutcomplete', () =>
        {
            // просто перезапускаем эту же сцену
            this.scene.restart({
                completedTasks: this.completedTasks
            });
        });
    }

    // =====================
    // ПЕРЕХОДЫ: ПОБЕДА / ПРОИГРЫШ
    // =====================
    onWin()
    {

        const prevCount = this.countAchievements(); // ← добавляем, чтобы узнать предыдущее количество достижений

        this.markCompleted('Level5'); // отмечаем, что уровень прошел

        const newCount = this.countAchievements();  // ← добавляем, чтобы узнать новое количество достижений

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: 'Level6',
                restartScene: 'Level5',
                newAchievement: newCount > prevCount  // ← добавляем, чтобы передать информацию о новом достижении
            });
        });
    }

    onLose()
    {
        this.gameEnded = true;

        this.time.delayedCall(300, () =>
        {
            this.scene.start('GameOverScene', {
                restartScene: 'Level5'
            });
        });
    }
}