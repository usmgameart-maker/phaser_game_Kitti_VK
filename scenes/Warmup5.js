import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Warmup5 extends BaseScene
{
    constructor()
    {
        super('Warmup5');
    }

    create()
    {
        this.lastItem = null;

        this.changedCircle = null; // кружок, в котором число было заменено
        this.searchStarted = false;

        super.create({
            title: 'Разминка 5: Найди замену',
            time: 40,
            background: 'park',
            instruction: 'Запомни числа!'
        });

        // =====================
        // ПЛАТФОРМЫ (ВИЗУАЛ + ФИЗИКА)
        // =====================
        const makePlatform = (x, y, key) =>
        {
            return this.physics.add.staticImage(x, y, key)
                .setScale(0.5)
                .refreshBody(); // важно для нормального размера
        };

        this.platform1 = makePlatform(50, 400, 'platform_mini1');
        this.platform2 = makePlatform(390, 400, 'platform_mini2');
        this.platform3 = makePlatform(770, 400, 'platform_mini2');
        this.platform4 = makePlatform(100, 260, 'platform_mini2');
        this.platform5 = makePlatform(500, 260, 'platform_mini2');
        this.platform6 = makePlatform(380, 150, 'platform_mini1');
        this.platform7 = makePlatform(700, 120, 'platform_mini1');
        this.platform8 = makePlatform(50, 120, 'platform_mini1');

        // =====================
        // СОЗДАНИЕ ПРЕДМЕТОВ
        // =====================
        this.items = this.physics.add.group();
        this.itemList = [];

        //КООРДИНАТЫ
        const positions = [
            [50, 490],[750, 490],
            [50, 350],[500, 350], [770, 350],
            [50, 210], [400, 210],
            [380, 100],
            [730, 70],[50, 70]
        ];

        //Генерация 10 уникальных чисел

        const allNumbers = Phaser.Utils.Array.Shuffle([
            1,2,3,4,5,6,7,8,9,10,
            11,12,13,14,15,16,17,18,19,20,21,22,23,24,25
        ]);

        const numbers = allNumbers.slice(0, 10); // выбираем первые 10

        positions.forEach((p, i) =>
        {
            const circle = this.add.image(0, 0, 'lap');

            const text = this.add.text(
                0,
                0,
                numbers[i],
                {
                    fontFamily: 'Chava',
                    fontSize: '64px',
                    color: '#203A77'
                }
            ).setOrigin(0.5); // центрируем текст

            // создаём контейнер
            const container = this.add.container(
                p[0],
                p[1],
                [circle, text]
            );

            //this.physics.add.existing(container);
            this.physics.world.enable(container);

            const w = circle.displayWidth;
            const h = circle.displayHeight;

            container.body.setSize(w, h);

            // центрируем относительно контейнера
            container.body.setOffset(-w / 2, -h / 2);

            container.numberText = text;
            container.originalNumber = numbers[i];
            container.currentNumber = numbers[i];

            this.items.add(container);

            this.itemList.push(container);
        });

        const randomCircle =
            Phaser.Utils.Array.GetRandom(this.itemList);

        this.changedCircle = randomCircle;

        // =====================
        // PLAYER
        // =====================
        // СОЗДАЁМ ИГРОКА (player)
        this.player = new Player(this); // передаём сцену в систему игрока, чтобы она могла создавать спрайт и управлять им
        this.player.create(400, 485); // создаём игрока и сохраняем его спрайт для коллизий

        // скрываем настоящего игрока
        this.player.player.setVisible(false);
        this.playerLocked = true; // блокируем управление игроком, пока не начнётся поиск

        // =====================
        // КОТ ДЛЯ ЗАСТАВКИ 10 СЕКУНД
        // =====================

        this.createCatAnim(); // создаём анимацию (берет её из BaseScene)

        this.catPreview = this.add.sprite(
            400,
            485,
            'CatMini_idle1'
        );

        this.catPreview.play('catMiniIdle');

        // =====================
        // ЗАПУСК ПОИСКА ЧЕРЕЗ 10 СЕКУНД. Через 10 секунд переключаемся на настоящего игрока
        // =====================
        this.time.delayedCall(10000, () =>
        {
            this.searchStarted = true;

            // СНАЧАЛА затемняем экран
            this.cameras.main.fadeOut(1200, 138, 209, 240);

            // Если менять значение:
            // Значение	Эффект
            // 100	очень быстрый “всплеск” затемнения
            // 200	стандарт, резкий но плавный
            // 500	заметный плавный переход
            // 1000	медленное киношное затемнение
            // 2000	очень медленный драматический эффект

            this.cameras.main.once('camerafadeoutcomplete', () =>
            {
                // скрываем анимированного кота
                this.catPreview.destroy();

                // показываем настоящего игрока
                this.player.player.setVisible(true);

                // разрешаем движение
                this.playerLocked = false;

                // логика чисел
                const usedNumbers =
                    this.itemList.map(item => item.originalNumber);

                const freeNumbers = [];

                for (let i = 1; i <= 20; i++)
                {
                    if (!usedNumbers.includes(i))
                    {
                        freeNumbers.push(i);
                    }
                }

                const newNumber =
                    Phaser.Utils.Array.GetRandom(freeNumbers);

                this.changedCircle.currentNumber = newNumber;
                this.changedCircle.numberText.setText(newNumber);

                // возвращаем экран обратно
                this.cameras.main.fadeIn(2000, 138, 209, 240);
                this.instructionText.setText('Найди число, которое заменили!');
            });
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
                this.platform6,
                this.platform7,
                this.platform8
            ],
            null,
            (player, platform) => {
                return player.body.velocity.y >= 0 &&
                    player.body.bottom <= platform.body.top + 20;
            },
            this
        );

        // 2. КОЛЛИЗИЯ ИГРОКА С ПРЕДМЕТАМИ
        this.physics.add.overlap(
            this.player.player,
            this.items,
            this.checkItem,
            null,
            this
        );

        // =====================
        // 3. PLATFORMS - ЭТО НИЖНЯЯ ПЛАТФОРМА. НА НЕЙ СТОИТ ИГРОК ОНА ЗАДАЕТСЯ В  BaseScene И остается везде, так как они есть на всех уровнях. НА САМОЙ ПЛАТФОРМЕ УЖЕ ЕСТЬ КОЛЛИЗИЯ. не ТРОГАТЬ!!!!!! ДОБАВЛЯЕМ ТОЛЬКО КОЛЛИЗИЮ С ИГРОКОМ, ЧТОБЫ ОН НА НЕЙ СТОЯЛ И НЕ ПРОВАЛИВАЛСЯ ВНИЗ. !!!!!!!!!!!!!!!!!!!!!!!!
        // =====================
        this.physics.add.collider(this.player.player, this.platforms);
    }

    update()
    {
        super.update(); // обрабатываем клавиши (M, F, ESC) из BaseScene
        if (this.gameEnded) return;

        // =====================
        // ОПРЕДЕЛЯЕМ: стоит ли кот на карточке
        // =====================
        let touchingCard = false;

        this.items.children.iterate(item =>
        {
            if (!item.active) return;

            if (this.physics.overlap(this.player.player, item))
            {
                touchingCard = true;
            }
        });

        // если ушёл с карточек → сбрасываем память
        if (!touchingCard)
        {
            this.lastItem = null;
        }

        // =====================
        // ИГРОК
        // =====================
        if (!this.playerLocked)
        {
            this.player.update();
        }
        else
        {
            this.player.player.setVelocityX(0);
        }

        // =====================
        // АНИМАЦИЯ КАРТОЧЕК
        // =====================
        this.items.children.iterate(item =>
        {
            if (!item.active) return;

            if (!this.searchStarted)
            {
                const baseScale = 0.3;

                item.setScale(
                    baseScale + Math.sin(this.time.now * 0.002) * 0.03
                );
            }
        });

        if (this.timeLeft <= 0)
        {
            this.onLose();
        }
    }

    // =====================
    //  ПОЛЬЗОВАТЕЛЬСКИЕ ФУНКЦИИ
    // =====================
    checkItem(player, item)
    {
        if (this.gameEnded) return;

        if (this.lastItem === item)
        {
            return;
        }

        this.lastItem = item;

        if (!this.searchStarted) return;

        if (item === this.changedCircle)
        {
        // эффект (ПОЛОЖИТЕЛЬНО)
        this.scoreText.setText('Собрано: 1');
        const effect = this.add.image(item.x, item.y, 'krmstal').setScale(0.5);

        this.time.delayedCall(200, () =>
        {
            effect.destroy();
        });
            this.onWin();
        }
        else
        {
            this.gameEnded = true; // сразу блокируем, чтобы одновременное касание другого объекта не вызвало двойной реакции

            // эффект взрыв (ОТРИЦАТЕЛЬНО)
            const effect = this.add.image(item.x, item.y, 'boom').setScale(0.7);

            this.time.delayedCall(200, () => effect.destroy());

            this.onLose();
        }
    }

    // =====================
    // ПЕРЕХОДЫ: ПОБЕДА / ПРОИГРЫШ
    // =====================
    onWin()
    {
        const prevCount = this.countAchievements(); // ← добавляем, чтобы узнать предыдущее количество достижений

        this.markCompleted('Warmup5'); // отмечаем, что уровень прошел

        const newCount = this.countAchievements();  // ← добавляем, чтобы узнать новое количество достижений

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: 'Level13',
                restartScene: 'Warmup5',
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
                restartScene: 'Warmup5'
            });
        });
    }
}