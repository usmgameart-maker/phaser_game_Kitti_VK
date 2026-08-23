// step2: импортирт MissionRescueBase вместо BaseScene
import MissionRescueBase from '../entities/MissionRescueBase.js';

export default class MissionRescue_step2 extends MissionRescueBase
{
        constructor()
    {
        super('MissionRescue_step2');
    }

    create()
    {
        super.create(); // всё общее уже внутри
        // далее только уникальное для step2:
        // тексты, platform, benchBack, letter_1 с анимацией, игрок с задержкой, overlap

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // логотип (меняй cx-300 и 40 чтобы двигать)
        this.add.image(cx + 300, 75, 'logo').setScale(0.5).setDepth(10).setAlpha(0.5);

        const arrow = this.add.image(cx - 0, cy + 85, 'arrow').setScale(0.8);

        this.tweens.add({
            targets: arrow,
            y: (cy + 85) + 8,   // вниз
            duration: 500, // продолжительность
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // =====================
        // КОНСТАНТЫ СТИЛЕЙ И ПОЗИЦИЙ
        // =====================

        const STYLE_TITLE = {
            fontFamily: 'HV',
            fontSize: '20px',
            color: '#1d1d3a',
            align: 'left',
            wordWrap: { width: 650, useAdvancedWrap: true },
            padding: { left: 25, right: 10 }
        };

        // Текст
        const TEXTS = [
            { content: 'Запомни все артефакты и начни миссию спасения!', x: cx - 350, y: cy - 210, style: STYLE_TITLE }
        ];

        // Добавляем тексты
        TEXTS.forEach(text => {
            this.add.text(text.x, text.y, text.content, text.style).setOrigin(0, 0.5);
        });

        //---------------------------------------
        // -------- размещение кнопки -----------
        //---------------------------------------
        const offsetY = 30; // отступ кнопки от центра по вертикали

        const button = this.add.image(0, 0, 'button_1'); // картинка кнопки

        const text = this.add.text(0, 0, 'МИССИЯ СПАСЕНИЯ', { // текст на кнопке
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

        // эффект при наведении мышки
        container.on('pointerover', () => {
            text.setStyle({ color: '#FFE100' });
        });

        container.on('pointerout', () => {
            text.setStyle({ color: '#ffffff' });
        });

        // обработка клика по кнопке (по контейнеру, чтобы и картинка, и текст были кликабельными)
        container.on('pointerdown', () => {
                this.scene.start('Loading', {
                nextScene: 'MissionRescue_step3' // куда идти дальше
            });
        });

        // ГРУППА АРТЕФАКТОВ
        this.artifacts_group = this.add.image(405, 180, 'artifacts_group').setScale(1).setDepth(10);

        // позиция ОТКРЫТОГО письма
        this.letter_1 = this.add.image(540, 450, 'letter_2').setScale(0.6).setDepth(10);

    }
}
