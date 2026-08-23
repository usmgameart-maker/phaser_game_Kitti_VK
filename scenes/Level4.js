import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Level4 extends BaseScene
{
    constructor()
    {
        super('Level4');
    }

    create(data)
    {
        super.create({ // вызываем метод create() родительского класса

            title: 'Уровень: 4. Вычитание', // название уровня
            time: 40, // время игры
            background: 'night',
            instruction: 'Реши пример и собери все кристаллы с правильным ответом!' // инструкция для игрока. Это задание

        });

        // =====================
        // ПЕРЕМЕННЫЕ
        // =====================
        this.completedTasks = data?.completedTasks || 0; // количество выполненных заданий

        this.requiredTasks = 3; // количество заданий для прохождения уровня

        // =====================
        // ПЛАТФОРМЫ (ВИЗУАЛ + ФИЗИКА)
        // =====================

        const makePlatform = (x, y, key) =>
        {
            return this.physics.add.staticImage(x, y, key)
                .setScale(0.5)
                .refreshBody(); // важно для нормального размера
        };

        // КООРДИНАТЫ ДЛЯ ПЛАТФОРМ
        this.platform1 = makePlatform(50, 420, 'platform_mini1');
        this.platform2 = makePlatform(400, 420, 'platform_mini2');
        this.platform3 = makePlatform(750, 420, 'platform_mini1');

        this.platform4 = makePlatform(160, 200, 'platform_mini2');

        this.platform5 = makePlatform(550, 280, 'platform_mini2');

        this.platform6 = makePlatform(670, 130, 'platform_mini1');

        // =====================
        // ГЕНЕРАЦИЯ ПРИМЕРА (вычитание двух чисел от 10)
        // =====================
        this.a = Phaser.Math.Between(10, 25); // начинаем с 10, чтобы гарантировать, что a > b
        this.b = Phaser.Math.Between(1, this.a - 1); // гарантируем b <= a

        this.correctAnswer = this.a - this.b;

        // Текст примера сохранить в переменную
        this.exampleText = this.add.text(400, 80, `${this.a} - ${this.b} =❓`, {
                fontFamily: 'VCR',
                fontSize: '32px',
                color: '#720860',
                backgroundColor: '#f8f8e3d0',
                padding: { x: 25, y: 10 }
            }
        ).setOrigin(0.5);

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

        // 2 правильных
        this.answers.push(this.correctAnswer);
        this.answers.push(this.correctAnswer);

        // 2 НЕПРАВИЛЬНЫХ значения (по 2 раза каждое)
        const wrongAnswers = new Set();

        // отклонение
        while (wrongAnswers.size < 2)
        {
            const offset = Phaser.Math.Between(-3, 3);

            if (offset === 0) continue;

            const wrong = this.correctAnswer + offset;

            if (wrong > 0)
            {
                wrongAnswers.add(wrong);
            }
        }

        // добавляем каждый неправильный ДВА раза
        wrongAnswers.forEach(w =>
        {
            this.answers.push(w);
            this.answers.push(w);
        });

        Phaser.Utils.Array.Shuffle(this.answers);// перемешиваем ответы, чтобы правильные не были всегда на одних и тех же местах

        // Позиции для ответов
        this.answerPositions = [
            [90, 380],
            [480, 380],
            [720, 380],
            [160, 160],
            [620, 240],
            [670, 90]
        ];

        // =====================
        // СОБРАНО / ВСЕ СОБРАНО
        // =====================
        this.collectedCorrect = 0; // сколько правильных собрано
        this.totalCorrect = 2; // всего нужно собрать

        // =====================
        // PLAYER - остается везде, так как он есть на всех уровнях
        // =====================

        // 1. СОЗДАЁМ ИГРОКА (player)
        this.player = new Player(this); // создаём игрока, передавая ему сцену для доступа к её методам и свойствам
        this.player.create(400, 485); // создаём игрока на сцене по координатам (400, 485)

        // 2. создаём answers.
        this.answerGroup = this.physics.add.group(); // группа для ответов, чтобы потом проверять столкновения с игроком

        // 3. СПАВН ОБЪЕКТОВ (создаём объекты ответов на сцене)
        this.answerPositions.forEach((pos, index) =>
        {
            const value = this.answers[index];

            const item = this.answerGroup.create(pos[0], pos[1], 'stone'); // создаём элемент ответа в виде изображения answerPositions
            item.setScale(0.25);

            // ===== СВЕЧЕНИЕ (фейковый glow) =====
            item.glow = this.add.image(pos[0], pos[1], 'stone')
                .setScale(0.35)
                .setAlpha(0.25)
                .setTint(0xffff99); // жёлтое свечение

            item.glow.setDepth(item.depth - 1);

            item.answerValue = value;

            item.answerText = this.add.text(
                pos[0],
                pos[1] - 40,
                value,
                {
                    fontFamily: 'VCR',
                    fontSize: '24px',
                    color: '#cf1818'
                }
            ).setOrigin(0.5);
        });

        // =====================
        // КОЛЛИЗИИ
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

        // 2. КОЛЛИЗИЯ ИГРОКА С ПРЕДМЕТАМИ (проверяем столкновение игрока с ответами)
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

    // =====================
    // ОБНОВЛЕНИЕ СЦЕНЫ - остается везде, так как он есть на всех уровнях !!!!!!!!!!!!МЕНЯЕМ ТОЛЬКО УРОВНИ!!!!!!!!!!!
    // =====================

    update()
    {
        super.update(); // обрабатываем клавиши (M, F, ESC) из BaseScene
        if (this.gameEnded) return; // если игра закончилась, не обновляем игрока

        this.player.update(); // обновляем игрока

        // Анимация объектов (пульсация)
        this.answerGroup.children.iterate(item =>
        {
            // Пульсация
            const baseScale = 0.25; // базовый размер
            item.setScale(baseScale + Math.sin(this.time.now * 0.002) * 0.03);

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

    // =====================
    // ОБРАТНАЯ СВЯЗЬ И ЗАВЕРШЕНИЕ УРОВНЯ
    // =====================
    collectAnswer(player, item)
    {
        if (this.gameEnded) return;

        if (!item.active) return;

        const value = item.answerValue;
        const { x, y } = item; // сохраняем координаты до удаления объекта

        // удаляем камень
        item.destroy();

        if (item.glow) item.glow.destroy();
        if (item.answerText)
        {
            item.answerText.destroy();
        }

        // =====================
        // ПРАВИЛЬНЫЙ ОТВЕТ
        // =====================

        if (value === this.correctAnswer)
        {
            // красивый эффект (ПОЛОЖИТЕЛЬНО)
            const effect = this.add.image(x, y, 'krmstal')
                .setScale(0.5);

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

            // взрыв
            const effect = this.add.image(x, y, 'boom')
                .setScale(0.7);

            this.time.delayedCall(200, () =>
            {
                effect.destroy();
            });

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

        this.markCompleted('Level4'); // отмечаем, что уровень прошел

        const newCount = this.countAchievements();  // ← добавляем, чтобы узнать новое количество достижений

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: 'Level5',
                restartScene: 'Level4',
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
                restartScene: 'Level4'
            });
        });
    }
}