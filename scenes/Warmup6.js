import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Warmup6 extends BaseScene
{
    constructor()
    {
        super('Warmup6');
    }

    create()
    {

        this.targetPlant = null; // цель, которую нужно найти

        this.searchStarted = false; // игра началась

        super.create({
            title: 'Разминка 6. Поиск по образцу',
            time: 40, // время игры
            background: 'park', // локация
            instruction: 'Запомни цветы и их расположение!'
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
        this.platform5 = makePlatform(490, 260, 'platform_mini2');
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
            [70, 350],[490, 350],[770, 350],
            [50, 210], [400, 210],
            [380, 100],
            [730, 70],[90, 70]
        ];

        //МАССИВ КАРТИНОК (РАСТЕНИЙ)
        const allPlants = [
            'plant_1',
            'plant_2',
            'plant_3',
            'plant_4',
            'plant_5',
            'plant_6',
            'plant_7',
            'plant_8',
            'plant_9',
            'plant_10',
            'plant_11',
            'plant_12'
        ];

        // случайно выбираем 8 ШТУК
        this.selectedPlants =
            Phaser.Utils.Array.Shuffle([...allPlants]).slice(0, 8);

        // Создание карточек
        positions.forEach((p, i) =>
        {
            const item = this.items.create(
                p[0],
                p[1],
                this.selectedPlants[i]
            )
            .setScale(0.45);

            item.setTint(0xF6F1E6); // цвет, чтобы было видно

            item.plantType = this.selectedPlants[i];

            this.itemList.push(item);
        });

        this.targetPlant =
            Phaser.Utils.Array.GetRandom(this.selectedPlants);

        // =====================
        // ПРИМЕР объекта (РАСТЕНИЯ)
        // =====================
            this.samplePlant = this.add.image(
            70,
            475,
            this.targetPlant
        )
        //.setScale(0.7);
        this.samplePlant.setVisible(false); // скрываем

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
                    item.setTexture('question').setScale(0.25);
                // обновляем размер объекта под новую текстуру (обеспечивает равномерную коллизию)
                    item.setDisplaySize(
                        item.width * 0.25,
                        item.height * 0.25
                    );

                    item.body.setSize(
                        item.width,
                        item.height,
                        true
                    );
                });

                // возвращаем экран обратно
                this.cameras.main.fadeIn(2000, 138, 209, 240);

                // показываем образец
                this.samplePlant.setVisible(true).setScale(0.7); // размер больше
                this.instructionText.setText('Найди цветок, соответствующий образцу!'); // инструкция. уточнение задания

                const cx = this.scale.width / 2;
                const cy = this.scale.height / 2;

                const arrow = this.add.image(cx - 330, cy + 250, 'arrow')
                    .setDepth(2);

                this.tweens.add({
                    targets: arrow,
                    y: (cy + 250) + 10,   // вниз
                    duration: 400,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
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

        if (this.timeLeft <= 0) // если время закончилось
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

        if (!this.searchStarted) return;

        item.setTexture(item.plantType);

        if (item.plantType === this.targetPlant)
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
        const prevCount = this.countAchievements();
        this.markCompleted('Warmup6');
        const newCount = this.countAchievements();

        const nextScene = newCount >= 6 ? 'MissionRescue_step1' : 'LevelMenu';

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: nextScene,
                restartScene: 'Warmup6',
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
                restartScene: 'Warmup6'
            });
        });
    }
}