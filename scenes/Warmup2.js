import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Warmup2 extends BaseScene
{
    constructor()
    {
        super('Warmup2');
    }

    create()
    {
        super.create({ // вызываем метод create() родительского класса

            title: 'Разминка 2: Запомни и найди', // название уровня
            time: 40, // время игры
            background: 'park', // фон УРОВНЯ (ЛОКАЦИЯ)
            instruction: 'Запомни расположение!' // инструкция для игрока. Это задание

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
        // СОЗДАНИЕ ПРЕДМЕТОВ. Создаём 5 яблок и 5 цветов вперемешку.
        // =====================
        this.items = this.physics.add.group();
        this.itemList = [];

        //КООРДИНАТЫ ДЛЯ ПРЕДМЕТОВ (яблок и цветов)
        const positions = [
            [50, 500], [750, 500],
            [50, 360], [500, 360], [780, 360],
            [50, 220], [400, 220],
            [380, 110],
            [730, 80], [50, 80]
        ];

        // 5 яблок + 5 цветов
        const types = [
            'apple','apple','apple','apple','apple',
            'flower','flower','flower','flower','flower'
        ];

        Phaser.Utils.Array.Shuffle(types);

        positions.forEach((p, index) =>
        {
            const type = types[index];

            const item = this.items.create(
                p[0],
                p[1],
                type
            ).setScale(0.25);

            item.itemType = type;

            this.itemList.push(item);
        });

        // =====================
        //  PLAYER
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

        // ИСЧЕЗНОВЕНИЕ ПРЕДМЕТОВ (через 10 секунд превращаются в вопросы)
        this.searchStarted = false; // поиск не начался
        this.foundApples = 0; // собрано яблок
        this.totalApples = 5; // всего яблок

        // ЗАПУСК ПОИСКА ЧЕРЕЗ 10 СЕКУНД. Через 10 секунд переключаемся на настоящего игрока
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
            this.itemList.forEach(item => // проходимся по всем предметам
            {
                if (item.active)
                {
                    item.setTexture('question'); // меняем текстуру
                    item.body.setSize(item.width, item.height, true); // подгоняем тело под новую текстуру
                }
            });
                // возвращаем экран обратно
                this.cameras.main.fadeIn(2000, 138, 209, 240);
                this.instructionText.setText('Найди все яблоки!');
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
        this.physics.add.collider( // добавляем коллизию между игроком и платформами
        this.player.player,
        this.platforms
        );
    }

    update()
    {
        super.update(); // обрабатываем клавиши (M, F, ESC) из BaseScene
        if (this.gameEnded) return; // если игра закончилась, не обновляем игрока

        if (!this.playerLocked)
        {
            this.player.update();
        }
        else
        {
            this.player.player.setVelocityX(0);
        }

        // Анимация объектов (пульсация)
        this.items.children.iterate(item =>
        {
            if (!item.active)
            {
                return;
            }

            if (!this.searchStarted)
            {
                const baseScale = 0.25;

                item.setScale(
                    baseScale +
                    Math.sin(this.time.now * 0.002) * 0.03
                );
            }
        });

        if (this.timeLeft <= 0)
        {
            this.onLose(); // При проигрыше
        }
    }

    // =====================
    // ПОЛЬЗОВАТЕЛЬСКИЕ ФУНКЦИИ
    // =====================

    checkItem(player, item)
    {
        if (this.gameEnded) return;

        // первые 10 секунд трогать нельзя
        if (!this.searchStarted)
        {
            return;
        }

        // яблоко
        if (item.itemType === 'apple')
        {
            item.setTexture('apple');

            item.disableBody(true, false); // убираем предмет

            // эффект (ПОЛОЖИТЕЛЬНО)
            const effect = this.add.image(item.x, item.y, 'krmstal').setScale(0.5);

            this.time.delayedCall(200, () =>
            {
                effect.destroy();
            });

            // увеличиваем счет
            this.foundApples++;

            this.scoreText.setText(
                'Собрано: ' + this.foundApples
            );

            if (this.foundApples >= this.totalApples) // победа
            {
                this.onWin();
            }
        }

        // если выбран цветок
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

    onWin() // При победе
    {
        const prevCount = this.countAchievements(); // ← добавляем, чтобы узнать предыдущее количество достижений

        this.markCompleted('Warmup2'); // отмечаем, что уровень прошел

        const newCount = this.countAchievements();  // ← добавляем, чтобы узнать новое количество достижений

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: 'Level4',
                restartScene: 'Warmup2',
                newAchievement: newCount > prevCount  // ← добавляем, чтобы передать информацию о новом достижении
            });
        });
    }

    onLose() // При проигрыше
    {
        this.gameEnded = true;

        this.time.delayedCall(300, () =>
        {
            this.scene.start('GameOverScene', {
                restartScene: 'Warmup2'
            });
        });
    }
}