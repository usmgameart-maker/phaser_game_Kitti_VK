import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Warmup3 extends BaseScene
{
    constructor()
    {
        super('Warmup3');
    }

    create()
    {
        this.lastItem = null;

        this.locked = false;
        this.firstPick = null;
        this.foundPairs = 0;
        this.totalPairs = 5;
        this.searchStarted = false;

        super.create({
            title: 'Разминка 3: Найди пары',
            time: 60,
            background: 'park',
            instruction: 'Запомни расположение!'
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

        // КООРДИНАТЫ ДЛЯ ПЛАТФОРМ
        this.platform1 = makePlatform(50, 400, 'platform_mini1');
        this.platform2 = makePlatform(390, 400, 'platform_mini2');
        this.platform3 = makePlatform(770, 400, 'platform_mini2');
        this.platform4 = makePlatform(100, 260, 'platform_mini2');
        this.platform5 = makePlatform(500, 260, 'platform_mini2');
        this.platform6 = makePlatform(380, 150, 'platform_mini1');
        this.platform7 = makePlatform(700, 120, 'platform_mini1');
        this.platform8 = makePlatform(50, 120, 'platform_mini1');

        // =====================
        // СОЗДАНИЕ ПРЕДМЕТОВ (ЭМОДЗИ)
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

        //ЭМОДЗИ
        const emojis = ['emoji1','emoji2','emoji3','emoji4','emoji5'];

        this.memoryItems = Phaser.Utils.Array.Shuffle([...emojis, ...emojis]);

        //СОЗДАНИЕ
        positions.forEach((p, i) =>
        {
            const item = this.items.create(p[0], p[1], this.memoryItems[i])
                .setScale(0.25);

            item.emojiType = this.memoryItems[i];
            item.matched = false;

            this.itemList.push(item);
        });

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

            this.cameras.main.once('camerafadeoutcomplete', () =>

            {
                // скрываем анимированного кота
                this.catPreview.destroy();

                // показываем настоящего игрока
                this.player.player.setVisible(true);

                // разрешаем движение
                this.playerLocked = false;

                // показываем КАРТИНКИ - вопросы
                this.itemList.forEach(item =>
                {
                    item.setTexture('question');
                });

                // возвращаем экран обратно
                this.cameras.main.fadeIn(2000, 138, 209, 240);
                this.instructionText.setText('Найди все пары!');
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

        // =====================
        // ЕСЛИ ЭТО ТА ЖЕ КАРТОЧКА - НИЧЕГО НЕ ДЕЛАЕМ
        // =====================
        if (this.lastItem === item)
        {
            return;
        }

        // запоминаем текущую карточку
        this.lastItem = item;

        // =====================
        // ЗАЩИТЫ
        // =====================
        if (!this.searchStarted) return;
        if (this.locked) return;
        if (item.matched) return;

        // =====================
        // 1-й КЛИК
        // =====================
        if (!this.firstPick)
        {
            this.firstPick = item;
            item.setTexture(item.emojiType);
            return;
        }

        if (this.firstPick === item) return;

        // =====================
        // 2-й КЛИК
        // =====================
        this.locked = true;

        const first = this.firstPick;
        const second = item;

        second.setTexture(second.emojiType);

        this.time.delayedCall(400, () =>
        {
            // =====================
            // ПАРА
            // =====================
            if (first.emojiType === second.emojiType)
            {
                first.matched = true;
                second.matched = true;

                first.disableBody(true, true);
                second.disableBody(true, true);

                this.foundPairs++;
                this.scoreText.setText('Собрано: ' + this.foundPairs);

                this.firstPick = null;
                this.locked = false;

                if (this.foundPairs >= this.totalPairs)
                {
                    this.onWin();
                }

                return;
            }

            // =====================
            // НЕ ПАРА
            // =====================
            this.time.delayedCall(200, () =>
            {
                if (first.active) first.setTexture('question');
                if (second.active) second.setTexture('question');

                this.firstPick = null;
                this.locked = false;
            });
        });
    }

    // =====================
    // ПЕРЕХОДЫ: ПОБЕДА / ПРОИГРЫШ
    // =====================
    onWin()
    {
        const prevCount = this.countAchievements(); // ← добавляем, чтобы узнать предыдущее количество достижений

        this.markCompleted('Warmup3'); // отмечаем, что уровень прошел

        const newCount = this.countAchievements();  // ← добавляем, чтобы узнать новое количество достижений

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: 'Level7',
                restartScene: 'Warmup3',
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
                restartScene: 'Warmup3'
            });
        });
    }
}