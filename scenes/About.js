import InfoScene from '../entities/InfoScene.js';

export default class About extends InfoScene
{
    constructor()
    {
        super('About');
    }

    create()
    {
        const { cx, cy } = super.create('Об игре');

        this.add.image(cx - 215, cy + 85, 'letter').setDepth(2);

        const buttonPlay = this.add.image(cx + 323, cy + 225, 'button_play')
            .setDepth(10)
            .setScale(0.9)
            .setInteractive()
            .on('pointerdown', () =>
            {
                this.scene.start('LevelMenu');
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
        // КОНСТАНТЫ СТИЛЕЙ И ПОЗИЦИЙ
        // =====================

        const STYLE_TITLE = {
            fontFamily: 'HV',
            fontSize: '18px',
            color: '#1d1d3a',
            align: 'left',
            wordWrap: { width: 650, useAdvancedWrap: true },
            padding: { left: 20, right: 20 }
        };

        const STYLE_BODY = {
            fontFamily: 'HV',
            fontSize: '16px',
            color: '#1d1d3a',
            align: 'left',
            lineSpacing: 10,
            wordWrap: { width: 450, useAdvancedWrap: true },
            padding: { left: 0, right: 20 }
        };

        // Тексты
        const TEXTS = [
            { content: 'Добро пожаловать в мир математических приключений!', x: cx - 300, y: cy - 95, style: STYLE_TITLE },
            { content: 'Знакомься — это Китти. Ей очень нужна твоя помощь.\nЕё любимая заводная мышка пропала. Китти обыскала всё… но безуспешно. В почтовом ящике она нашла таинственное письмо, в котором говорится о 15 математических испытаниях. Только пройдя их и собрав 6 артефактов, можно найти пропажу.', x: cx - 100, y: cy + 30, style: STYLE_BODY },
            { content: 'Отправляйся в путешествие вместе с Китти и проверь свои знания!', x: cx - 100, y: cy + 155, style: STYLE_BODY }
        ];

        // Добавляем тексты
        TEXTS.forEach(text => {
            this.add.text(text.x, text.y, text.content, text.style).setOrigin(0, 0.5);
        });
    }
}