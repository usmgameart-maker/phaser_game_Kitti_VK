import BaseScene from '../entities/BaseScene.js';

export default class GameOverScene extends BaseScene
{
    constructor()
    {
        super('GameOverScene');
    }

    init(data)
    {
        this.restartScene = data?.restartScene || 'Warmup1'; // откуда пришёл игрок, чтобы знать, куда отправить его после рестарта
    }

    create()
    {
        // =====================
        // МУЗЫКА
        // =====================
        this.sound.stopAll();

        this.music = this.sound.add('bg_GameOver', {
            loop: true,
            volume: 0.5
        });

        this.music.play();

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // фон
        this.add.image(cx, cy, 'lose')
        .setDisplaySize(this.scale.width, this.scale.height);

        //---------------------------------------
        // -------- размещение кнопки -----------
        //---------------------------------------
        const offsetY = 60; // отступ кнопки от центра по вертикали

        const button = this.add.image(0, 0, 'button_restart'); // картинка кнопки

        const text = this.add.text(0, 0, 'Играть ещё раз', { // текст на кнопке
            fontFamily: 'Chava',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // контейнер для кнопки и текста, чтобы они были вместе и по центру
        const container = this.add.container(cx, cy + offsetY, [button, text])

        // явная зона клика
        container.setInteractive(
            new Phaser.Geom.Rectangle(
                -button.width / 2,
                -button.height / 2,
                button.width,
                button.height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // обработка клика по кнопке (по контейнеру, чтобы и картинка, и текст были кликабельными)
        container.on('pointerdown', () => {
            // this.scene.start(this.restartScene); // запускаем сцену, откуда пришёл игрок
            this.scene.start(this.restartScene, {
                completedTasks: 0
            });

        });

        // эффект при наведении мышки
        container.on('pointerover', () => {
            text.setStyle({ color: '#FFE100' });
        });

        container.on('pointerout', () => {
            text.setStyle({ color: '#ffffff' });
        });

    }

    update()
    {
        super.update(); // используем логику клавиш из BaseScene
    }
}