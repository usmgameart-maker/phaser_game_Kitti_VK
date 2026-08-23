import BaseScene from '../entities/BaseScene.js';
import Player from '../entities/Player.js';

export default class Warmup1 extends BaseScene
{
    constructor()
    {
        super('Warmup1');
    }

    create()
    {
        super.create({ // вызываем метод create() родительского класса

            title: 'Разминка 1: Сбор предметов', // название уровня
            time: 50, // время игры
            background: 'park', // фон УРОВНЯ (ЛОКАЦИЯ)
            instruction: 'Собери все звёзды, пока они не исчезли!' // инструкция для игрока. Это задание

        });

        // =====================
        // ПЛАТФОРМЫ (ВИЗУАЛ + ФИЗИКА)
        // =====================
        const makePlatform = (x, y, key) =>
        {
            return this.physics.add.staticImage(x, y, key)
                .setScale(0.5)
                .setDepth(0)
                .refreshBody(); // важно для нормального размера
        };

        // КООРДИНАТЫ ДЛЯ ПЛАТФОРМ
        this.platform1 = makePlatform(20, 410, 'platform');
        this.platform2 = makePlatform(780, 420, 'platform');
        this.platform3 = makePlatform(400, 280, 'platform');
        this.platform4 = makePlatform(60, 160, 'platform');
        this.platform5 = makePlatform(700, 130, 'platform');

        // =====================
        // ЗВЁЗДЫ
        // =====================
        this.stars = this.physics.add.group();// группа для звёзд, чтобы управлять ими и коллизиями

        this.starList = [];

        // позиции звёзд
        const positions = [
            [200, 500], [600, 500], [100, 500],
            [60, 350], [120, 350], [680, 350],
            [400, 210], [300, 210],
            [60, 100],
            [700, 70]
        ];

        // создаём звёзды в указанных позициях и сохраняем их в массив для управления ими
        positions.forEach(p =>
        {
            const star = this.stars.create(p[0], p[1], 'star')
                .setScale(this.ITEM_SCALE) // масштаб, ЧЕРЕЗ ПЕРЕМЕННУЮ ИЗ BaseScene
                .refreshBody();
            this.starList.push(star);
        });

        // ИСЧЕЗНОВЕНИЕ ЗВЁЗД
        this.starList.forEach((star, index) =>
        {
            this.time.delayedCall(5000 + index * 5000, () =>
            {
                if (star.active)
                {
                    star.disableBody(true, true);
                }
            });
        });

        // =====================
        //  PLAYER
        // =====================
        // СОЗДАЁМ ИГРОКА (player)
        this.player = new Player(this); // передаём сцену в систему игрока, чтобы она могла создавать спрайт и управлять им
        this.player.create(400, 485); // создаём игрока и сохраняем его спрайт для коллизий

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
                this.platform5
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
            this.stars,
            this.collectStar,
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

        this.player.update(); // обновляем игрока

        // Анимация звёзд
        this.stars.children.iterate(star =>
        {
            star.angle += 1;
            star.setScale(0.2 + Math.sin(this.time.now * 0.005) * 0.05);
        });
    }

    // =====================
    // ПОЛЬЗОВАТЕЛЬСКИЕ ФУНКЦИИ
    // =====================

        collectStar(player, star) // функция, которая вызывается при столкновении игрока со звездой
    {
        if (this.gameEnded) return;

        star.disableBody(true, true);

        this.score++;
        this.scoreText.setText('Собрано: ' + this.score);

        this.checkGameEnd();
    }

    checkGameEnd() // Проверка окончания игры
    {
        if (this.gameEnded) return;

        const remaining = this.starList.filter(s => s.active).length;

        if (this.score >= 10)
        {
            this.onWin();
            return; // Победа, если собрали 10 звёзд
        }

        if (remaining === 0 && this.score < 10)
        {
            this.onLose();
        }
    }

    // =====================
    // ПЕРЕХОДЫ: ПОБЕДА / ПРОИГРЫШ
    // =====================

    onWin() // При победе
    {
        const prevCount = this.countAchievements(); // ← добавляем, чтобы узнать предыдущее количество достижений

        this.markCompleted('Warmup1'); // отмечаем, что уровень прошел

        const newCount = this.countAchievements();  // ← добавляем, чтобы узнать новое количество достижений

        this.gameEnded = true;

        this.time.delayedCall(500, () =>
        {
            this.scene.start('WinScene', {
                nextScene: 'Level1',
                restartScene: 'Warmup1',
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
                restartScene: 'Warmup1'
            });
        });
    }
}