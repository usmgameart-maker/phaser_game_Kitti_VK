export default class BaseScene extends Phaser.Scene
{
    constructor(key)
    {
        super(key);

        this.ITEM_SCALE = 0.25;
        this.PLAYER_SCALE = 1;

        this.TITLE_STYLE = {
            fontFamily: 'Chava',
            fontSize: '64px',
            stroke: '#ffffff',
            strokeThickness: 2,
            color: '#F22259'
        };

        // =====================
        // ГЛОБАЛЬНЫЙ ПРОГРЕСС
        // =====================
        if (window.gameProgress === undefined)
        {
            window.gameProgress = { score: 0, completed: {}, missionCompleted: false };
        }
    }

    // =====================
    // МЕТОД КЛАССА, чтобы получить доступ к глобальному прогрессу
    // =====================

    markCompleted(id)
    {
        window.gameProgress.completed[id] = true;
        this.saveProgress();
    }

    saveProgress()
    {
        try { localStorage.setItem('gameProgress', JSON.stringify(window.gameProgress)); }
        catch (e) {}
    }

    resetProgress()
    {
        window.gameProgress = { score: 0, completed: {}, missionCompleted: false };
        localStorage.removeItem('gameProgress');
    }

    countAchievements()
    {
        const c = window.gameProgress.completed || {};
        let count = 0;
        if (c.Warmup1) count++;
        if (c.Level1  && c.Level2  && c.Level3  && c.Warmup2) count++;
        if (c.Level4  && c.Level5  && c.Level6  && c.Warmup3) count++;
        if (c.Level7  && c.Level8  && c.Level9  && c.Warmup4) count++;
        if (c.Level10 && c.Level11 && c.Level12 && c.Warmup5) count++;
        if (c.Level13 && c.Level14 && c.Level15 && c.Warmup6) count++;
        return count;
    }

    // =====================
    //  метод-помощник в BaseScene (для анимированного кота который сидит)
    // =====================
    createCatAnim()
    {
        if (!this.anims.exists('catMiniIdle'))
        {
            this.anims.create({
                key: 'catMiniIdle',
                frames: [
                    { key: 'CatMini_idle1' },
                    { key: 'CatMini_idle2' },
                    { key: 'CatMini_idle1' },
                    { key: 'CatMini_idle1' },
                    { key: 'CatMini_idle3' },
                    { key: 'CatMini_idle2' },
                    { key: 'CatMini_idle1' },
                    { key: 'CatMini_idle1' },
                    { key: 'CatMini_idle3' },
                    { key: 'CatMini_idle1' },
                ],
                frameRate: 4,
                repeat: -1
            });
        }
    }

    createCatAnimBig()
    {
        if (!this.anims.exists('cat_Idle'))
        {
            this.anims.create({
                key: 'cat_Idle',
                frames: [
                    { key: 'cat_idle1' },
                    { key: 'cat_idle2' },
                    { key: 'cat_idle1' },
                    { key: 'cat_idle1' },
                    { key: 'cat_idle3' },
                    { key: 'cat_idle2' },
                    { key: 'cat_idle1' },
                    { key: 'cat_idle1' },
                    { key: 'cat_idle3' },
                    { key: 'cat_idle2' },
                ],
                frameRate: 4,
                repeat: -1
            });
        }
    }

    // =====================
    // определяем КОНФИГ, ПОЛЬЗОВАТЕЛЬСКИЕ ПАРАМЕТРЫ, НАСТРОЙКИ
    // =====================

    create(config = {})
    {
        // =====================
        // определяем ПЕРЕМЕННЫЕ
        // =====================
        this.config = {
            title: 'Level', // название уровня
            instruction: '', // инструкция (задание игроку)
            score: true, // показывать счет
            background: 'background', // фон
            music: 'bg_music', // фоновая музыка
            time: 60, // время игры, если на уровне не определено то будет 60 секунд
            ...config
        };

        // =====================
        // СОСТОЯНИЕ ИГРЫ
        // =====================
        this.gameEnded = false; // игра закончилась
        this.timeLeft = this.config.time; // оставшееся время
        this.score = 0; // счет

        this.sound.stopAll(); // Останавливаем всю музыку и звуки при загрузке новой сцены

        // =====================
        // ГРАФИКА
        // =====================
        const cx = this.cameras.main.width / 2;
        const cy = this.cameras.main.height / 2;

        // фон
        this.add.image(cx, cy, this.config.background)
            .setDisplaySize(this.cameras.main.width, this.cameras.main.height) // устанавливаем размер фона
            .setDepth(-1); // фон всегда ниже игрока

        // =====================
        // МУЗЫКА (ВЫБОР)
        // =====================
        this.music = this.sound.add(this.config.music, {
            loop: true,
            volume: 0.5
        });

        this.music.play(); // воспроизводим музыку

        // =====================
        // ТЕКСТ (вверху: счётчик, время, название уровня)
        // =====================
        if (this.config.score) // если нужно показывать счет
        {
            this.scoreText = this.add.text(15, 15, 'Собрано: 0', {
                fontFamily: 'VCR',
                fontSize: '14px',
                color: '#ffffff'
            });
        }

        this.timerText = this.add.text(670, 15, `Время: ${this.timeLeft}`, { // время
            fontFamily: 'VCR',
            fontSize: '14px',
            color: '#ffffff'
        });

        this.titleText = this.add.text(400, 15, this.config.title, {
            fontFamily: 'VCR',
            fontSize: '16px',
            color: '#1d1d3a'
        }).setOrigin(0.5, 0);

        this.fpsText = this.add.text(17, 40, '', {
            fontFamily: 'VCR',
            fontSize: '10px',
            color: '#ffffff'
        });

        // =====================
        // НИЖНЯЯ ПЛАТФОРМА
        // =====================

        this.add.image(400, 560, 'platform')
            .setScale(1.1);

        this.platforms = this.physics.add.staticGroup();

        this.platforms.create(400, 560)
            .setSize(800, 70)
            .setVisible(false);

        // // =====================
        // // ИНСТРУКЦИЯ
        // // =====================

        // this.add.rectangle(
        //     400,
        //     558,
        //     750,
        //     40,
        //     0x000000,
        //     0.4
        // );

        // this.instructionText = this.add.text(
        //     400,
        //     565,
        //     this.config.instruction,
        //     {
        //         fontFamily: 'VCR',
        //         fontSize: '14px',
        //         color: '#f8f8e3'
        //     }
        // ).setOrigin(0.5, 1);

        // =====================
        // ИНСТРУКЦИЯ
        // =====================
        if (this.config.showInstruction !== false)
        {
            this.add.rectangle(400, 558, 750, 40, 0x000000, 0.4);

            this.instructionText = this.add.text(
                400, 565, this.config.instruction,
                { fontFamily: 'VCR', fontSize: '14px', color: '#f8f8e3' }
            ).setOrigin(0.5, 1);
        }

        // =====================
        // ТАЙМЕР
        // =====================

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            loop: true,
            callback: () =>
            {
                if (this.gameEnded) return;

                this.timeLeft--;

                this.timerText.setText(
                    `Время: ${this.timeLeft}`
                );

                if (this.timeLeft <= 0)
                {
                    this.onLose();
                }
            }
        });

    }

    update()
    {
        if (this.gameEnded) return; // если игра закончилась, не обновляем игрока

        // =====================
        // M (mute/ остановить - включить звук)
        // =====================
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('M'))) // если нажата клавиша M
        {
            this.sound.mute = !this.sound.mute; // включаем / выключаем звук
        }

        // =====================
        // F (fullscreen/полноэкранный режим)
        // =====================
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('F')))
        {
            if (this.scale.isFullscreen) // если мы в полноэкранном режиме
                this.scale.stopFullscreen(); // выходим из полноэкранного режима
            else
                this.scale.startFullscreen(); // входим в полноэкранный режим
        }

        // =====================
        // ESC (возврат в menu)
        // =====================
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('ESC')))
        {
            this.scene.start('MainMenu');
        }

        // =====================
        // R (restart)
        // =====================
        if (Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('R'))) // если нажата клавиша R
        {
            this.cameras.main.fadeOut(300, 0, 0, 0);

            this.time.delayedCall(300, () =>
            {
                this.scene.restart();
            });
        }

        if (this.fpsText)
        {
            this.fpsText.setText('FPS: ' + Math.floor(this.game.loop.actualFps));
        }
    }
}