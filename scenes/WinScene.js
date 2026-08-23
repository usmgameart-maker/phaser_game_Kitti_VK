import BaseScene from '../entities/BaseScene.js';

export default class WinScene extends BaseScene
{
    constructor()
    {
        super('WinScene');
    }

    init(data)
    {
        this.nextScene = data.nextScene;
        this.restartScene = data.restartScene;
        this.newAchievement = data.newAchievement || false;
    }

    create()
    {

        // =====================
        // МУЗЫКА
        // =====================
        this.sound.stopAll();

        this.music = this.sound.add('bg_victory', {
            loop: true,
            volume: 0.5
        });

        this.music.play();

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // фон
        this.add.image(cx, cy, 'win')
        .setDisplaySize(this.scale.width, this.scale.height);

        // подзаголовок
        this.add.text(cx, cy + 20, 'Уровень пройден', {
            fontFamily: 'VCR',
            fontSize: '14px',
            color: '#1d1d3a'
        }).setOrigin(0.5);

        //---------------------------------------
        // -------- размещение кнопок -----------
        //---------------------------------------

        const offsetY = 100; // отступ кнопки от центра по вертикали
        const offsetX = 140; // отступ кнопки от центра по горизонтали

        // =========================
        // КНОПКА 1 — ИГРАТЬ СНОВА
        // =========================
        const button1 = this.add.image(0, 0, 'button_replay'); // картинка кнопки

        const text1 = this.add.text(0, 0, 'Повторить игру', { // текст на кнопке
            fontFamily: 'Chava',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // контейнер для кнопки и текста, чтобы они были вместе и по центру
        const container1 = this.add.container(cx - offsetX, cy + offsetY, [button1, text1])

        // явная зона клика
        container1.setInteractive(
            new Phaser.Geom.Rectangle(
                -button1.width / 2,
                -button1.height / 2,
                button1.width,
                button1.height
            ),
            Phaser.Geom.Rectangle.Contains
        );

        // обработка клика по кнопке (по контейнеру, чтобы и картинка, и текст были кликабельными)
        container1.on('pointerdown', () => {
            //this.scene.start(this.restartScene); // запускаем сцену, откуда пришёл игрок
            this.scene.start(this.restartScene, {
                completedTasks: 0
            });

        });

        // эффект при наведении мышки
        container1.on('pointerover', () => {
            text1.setStyle({ color: '#1d1d3a' });
        });

        container1.on('pointerout', () => {
            text1.setStyle({ color: '#ffffff' });
        });

        // =========================
        // КНОПКА 2 — СЛЕДУЮЩИЙ УРОВЕНЬ
        // =========================
        const button2 = this.add.image(0, 0, 'button_next'); // картинка кнопки

        const text2 = this.add.text(0, 0, 'Идём дальше', { // текст на кнопке
            fontFamily: 'Chava',
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // контейнер для кнопки и текста, чтобы они были вместе и по центру
        const container2 = this.add.container(cx + offsetX, cy + offsetY, [button2, text2])

        // явная зона клика
        container2.setInteractive(
            new Phaser.Geom.Rectangle(
                -button2.width / 2,
                -button2.height / 2,
                button2.width,
                button2.height
            ),
            Phaser.Geom.Rectangle.Contains
        );

         // обработка клика по кнопке (по контейнеру, чтобы и картинка, и текст были кликабельными)
        container2.on('pointerdown', () => {
                this.scene.start('Loading', {
                nextScene: this.nextScene // куда идти дальше
            });
        });

        // эффект при наведении мышки
        container2.on('pointerover', () => {
            text2.setStyle({ color: '#FFF261' });
        });

        container2.on('pointerout', () => {
            text2.setStyle({ color: '#ffffff' });
        });

        // =========================
        // БАННЕР НОВОГО ДОСТИЖЕНИЯ
        // =========================
        if (this.newAchievement)
        {
            const banner = this.add.image(cx, cy + 210, 'achievement_banner')
                .setDepth(10)
                .setInteractive();

            // this.add.text(cx, cy - 70, 'Получено новое достижение! Нажми!', {
            //     fontFamily: 'VCR',
            //     fontSize: '13px',
            //     color: '#1d1d3a'
            // }).setOrigin(0.5).setDepth(11);

            banner.on('pointerdown', () =>
            {
                this.scene.start('Achievements');
            });

            this.tweens.add({
                targets: banner,
                y: cy + 205,
                duration: 400, // продолжительность
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    update()
    {
        super.update(); // используем логику клавиш из BaseScene
    }
}