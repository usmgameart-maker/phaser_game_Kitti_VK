import InfoScene from '../entities/InfoScene.js';

export default class LevelMenu extends InfoScene
{
    constructor ()
    {
        super('LevelMenu');
    }

    create ()
    {
        const { cx, cy } = super.create('УРОВНИ ИГРЫ');

        this.add.image(cx - 235, cy + 25, 'memory').setDepth(2);

        const buttonPlay = this.add.image(cx + 323, cy + 225, 'button_awards')
            .setDepth(10)
            .setScale(0.9)
            .setInteractive()
            .on('pointerdown', () =>
            {
                this.scene.start('Achievements')
            });

        // анимация, мерцание, меняющая прозрачность
        this.tweens.add({
            targets: buttonPlay,
            alpha: 0.75,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // =====================
        // МУЗЫКА
        // =====================
        this.sound.stopAll();

        this.music = this.sound.add('bg_main2', {
            loop: true,
            volume: 0.5
        });

        this.music.play();

        // =====================
        // ВСПОМОГАТЕЛЬНАЯ ФУНКЦИЯ
        // =====================
        const createButtons = (list, offsetX, startY, stepY, fontSize) =>
        {
            list.forEach((btn, i) =>
            {
                const c = window.gameProgress.completed || {}; // ДОБАВИЛИ, ЧТОБЫ ПРОВЕРЯТЬ ПРОГРЕС

                const b = this.add.image(0, 0, btn.image);
                b.setAlpha(0.7); // все кнопки по умолчанию приглушены

                const t = this.add.text(0, 0, btn.text, {
                    fontFamily: 'Chava',
                    fontSize: fontSize + 'px',
                    color: '#fff'
                }).setOrigin(0.5);

                // ДОБАВЛЕНО, ЧТОБЫ МЕНЯТЬ ЦВЕТ КНОПКИ
                if (c[btn.scene])
                {
                    b.setAlpha(1); // кнопка становиться яркой
                }

                const container = this.add.container(
                    cx + offsetX,
                    startY + i * stepY,
                    [b, t]
                );

                container.setSize(b.width, b.height);
                container.setInteractive();

                container.on('pointerdown', () =>
                {

                    this.scene.start('Loading', {
                        nextScene: btn.scene,
                        reset: true // сбрасываем прогресс
                    });

                });

                container.on('pointerover', () => // при наведении
                {
                    t.setColor('#470e68');
                });

                container.on('pointerout', () =>
                {
                    t.setColor('#ffffff');
                });
            });
        };

        // =====================
        // КНОПКИ
        // =====================

        const buttons = [
            { image: 'button_Warmup2_5', text: 'РАЗМИНКА 2', scene: 'Warmup2' },
            { image: 'button_Warmup2_5', text: 'РАЗМИНКА 3', scene: 'Warmup3' },
            { image: 'button_Warmup2_5', text: 'РАЗМИНКА 4', scene: 'Warmup4' },
            { image: 'button_Warmup2_5', text: 'РАЗМИНКА 5', scene: 'Warmup5' },
            { image: 'button_Warmup6', text: 'РАЗМИНКА 6', scene: 'Warmup6' }
        ];

        const buttons_task3 = [
            { image: 'button_task3', text: '3', scene: 'Level3' },
            { image: 'button_task3', text: '6', scene: 'Level6' },
            { image: 'button_task3', text: '9', scene: 'Level9' },
            { image: 'button_task3', text: '12', scene: 'Level12' },
            { image: 'button_task3', text: '15', scene: 'Level15' }
        ];

        const buttons_task2 = [
            { image: 'button_task2', text: '2', scene: 'Level2' },
            { image: 'button_task2', text: '5', scene: 'Level5' },
            { image: 'button_task2', text: '8', scene: 'Level8' },
            { image: 'button_task2', text: '11', scene: 'Level11' },
            { image: 'button_task2', text: '14', scene: 'Level14' }
        ];

        const buttons_task1 = [
            { image: 'button_task1', text: '1', scene: 'Level1' },
            { image: 'button_task1', text: '4', scene: 'Level4' },
            { image: 'button_task1', text: '7', scene: 'Level7' },
            { image: 'button_task1', text: '10', scene: 'Level10' },
            { image: 'button_task1', text: '13', scene: 'Level13' }
        ];

        const buttons_Warmup1 = [
            { image: 'button_Warmup1', text: 'РАЗМИНКА 1', scene: 'Warmup1' }
        ];

        // =====================
        // РЕНДЕР
        // =====================

        createButtons(buttons, 250, cy - 85, 60, 16);
        createButtons(buttons_task3, 100, cy - 85, 60, 24);
        createButtons(buttons_task2, 10, cy - 85, 60, 24);
        createButtons(buttons_task1, -80, cy - 85, 60, 24);
        createButtons(buttons_Warmup1, -230, cy - 85, 60, 16);

        const cat = this.add.sprite(cx - 250, cy + 170, 'cat_idle1');
        cat.setScale(1);
        cat.play('catBlink');

        // // тестовые кнопки
        // this.add.text(cx-340, 100, 'проигрыш', { fontSize: '20px', color: '#7c0606' })
        //     .setOrigin(0.5)
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('GameOverScene'));

        // this.add.text(cx-340, 150, 'победа', { fontSize: '20px', color: '#7c0606' })
        //     .setOrigin(0.5)
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('WinScene'));

        // this.add.text(cx-340, 50, 'спасение1', { fontSize: '20px', color: '#7c0606' })
        //     .setOrigin(0.5)
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('MissionRescue_step1'));

        // this.add.text(cx-340, 100, 'спасение2', { fontSize: '20px', color: '#7c0606' })
        //     .setOrigin(0.5)
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('MissionRescue_step2'));

        // this.add.text(cx-340, 150, 'финал', { fontSize: '20px', color: '#7c0606' })
        //     .setOrigin(0.5)
        //     .setInteractive()
        //     .on('pointerdown', () => this.scene.start('LevelFinal'));

    }
}