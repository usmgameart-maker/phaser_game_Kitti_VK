import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Level6 extends BaseScene
{
    constructor()
    {
        super('Level6');
    }

    create(data)
    {
        super.create({ // вызываем метод create() родительского класса

            title: 'Уровень: 6. Вычитание', // название уровня
            time: 40, // время игры
            background: 'night',
            instruction: 'Реши пример и собери рубины с правильным ответом, пока они не исчезли!' // инструкция для игрока. Это задание

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

        this.platform1 = makePlatform(80, 380, 'platform_mini1');

        this.platform2 = makePlatform(400, 420, 'platform_mini2');
        this.platform3 = makePlatform(720, 420, 'platform_mini1');

        this.platform4 = makePlatform(180, 200, 'platform_mini2');

        this.platform5 = makePlatform(550, 280, 'platform_mini2');

        this.platform6 = makePlatform(650, 150, 'platform_mini1');

        // =====================
        // ГЕНЕРАЦИЯ ПРИМЕРА (вычитание)
        // ответ всегда 2-значный (10–99)
        // =====================

        // уменьшаемое
        this.a = Phaser.Math.Between(50, 100); // 50–100

        // вычитаемое подбираем так, чтобы:
        // a - b был от 10 до 90
        const minB = Math.max(10, this.a - 99);// так мы гарантируем, что b не меньше 10 И результат не больше 99
        const maxB = this.a - 10; // так мы гарантируем, что b не больше a-10, чтобы результат был минимум 10

        this.b = Phaser.Math.Between(minB, maxB); // так мы гарантируем, что a - b будет в определённом диапазоне — не слишком маленьким и не отрицательным.

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
            [90, 340],
            [470, 380],
            [750, 380],
            [180, 160],
            [650, 240],
            [650, 90]
        ];

        // =====================
        // СОБРАНО / ВСЕ СОБРАНО
        // =====================
        this.collectedCorrect = 0; // сколько правильных собрано
        this.totalCorrect = 2; // всего нужно собрать

        // =====================
        //  PLAYER
        // =====================

        this.player = new Player(this); // создаём игрока, передавая ему сцену для доступа к её методам и свойствам
        this.player.create(400, 485); // создаём игрока на сцене по координатам (400, 485)

        // Создаём answers.
        this.answerGroup = this.physics.add.group(); // создаем группу

        // СПАВН ОБЪЕКТОВ (создаём объекты ответов на сцене)
        this.answerPositions.forEach((pos, index) =>
        {
            const value = this.answers[index];

            const item = this.answerGroup.create(pos[0], pos[1], 'ruby')
                .setScale(0.25);

            // ===== СВЕЧЕНИЕ (фейковый glow) =====
            item.glow = this.add.image(pos[0], pos[1], 'ruby')
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
        // ИСЧЕЗНОВЕНИЕ РУБИНОВ
        // =====================

        this.answerGroup.children.each((ruby, index) =>
        {
            this.time.delayedCall(15000 + index * 5000, () =>
            {
                if (ruby.active)
                {
                    ruby.disableBody(true, true);

                    if (ruby.answerText) ruby.answerText.destroy();
                    if (ruby.glow) ruby.glow.destroy();

                    this.checkRemainingCorrectAnswers();
                }
            });
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

    checkRemainingCorrectAnswers()
    {
        let remainingCorrect = 0;

        this.answerGroup.children.each(item =>
        {
            if (item.active && item.answerValue === this.correctAnswer)
            {
                remainingCorrect++;
            }
        });

        // ❗ ВАЖНО:
        // если правильных НЕТ и игрок НЕ добрал нужное количество → проигрыш
        if (remainingCorrect === 0 && this.collectedCorrect < this.totalCorrect)
        {
            this.onLose();
        }
    }

    update()
    {
        super.update(); // обрабатываем клавиши (M, F, ESC) из BaseScene
        if (this.gameEnded) return;

        this.player.update();

        const offset = Math.sin(this.time.now * 0.002) * 20; // смещение

        this.platform1.y = 400 + offset;
        this.platform3.y = 440 + offset;
        this.platform5.y = 300 + offset;

        this.platform2.x = 420 + offset;
        this.platform4.x = 170 + offset;
        this.platform6.x = 650 + offset;

        this.platform1.refreshBody();
        this.platform2.refreshBody();
        this.platform3.refreshBody();
        this.platform4.refreshBody();
        this.platform5.refreshBody();
        this.platform6.refreshBody();

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
                item.glow.setPosition(item.x, item.y); // чтобы свечение всегда было на фоне рубина
                item.glow.setScale(scale * 1.4); // свечение чуть больше самого рубина
                item.glow.setAlpha(0.1 + Math.sin(this.time.now * 0.002) * 0.05);
            }

        });
    }

    collectAnswer(player, item)
    {
        if (this.gameEnded) return;

        if (!item.active) return;

        const value = item.answerValue;
        const { x, y } = item; // сохраняем координаты до удаления объекта

        // удаляем рубин и текст
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

        this.markCompleted('Level6'); // отмечаем, что уровень прошел

        const newCount = this.countAchievements();  // ← добавляем, чтобы узнать новое количество достижений

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: 'Warmup3',
                restartScene: 'Level6',
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
                restartScene: 'Level6'
            });
        });
    }
}