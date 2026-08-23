import BaseScene from './BaseScene.js'; // базовая сцена

export default class InfoScene extends BaseScene
{
    constructor(key)
    {
        super(key);
    }

    create(title, config = {})
    {
        // =====================
        // МУЗЫКА
        // =====================
        this.sound.stopAll();

        this.music = this.sound.add('bg_main2', {
            loop: true,
            volume: 0.5
        });

        this.music.play();

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // фон
        this.add.image(cx, cy, 'background_1')
            .setDisplaySize(this.scale.width, this.scale.height);

        // логотип (showLogo: false — отключить; logoX/logoY — позиция)
        if (config.showLogo !== false)
        {
            this.add.image(config.logoX ?? 85, config.logoY ?? 70, 'logo')
                .setScale(0.5)
                .setAlpha(0.5)
                .setDepth(10);
        }

        // заголовок
        if (title)
        {
            this.add.text(
                cx,
                cy - 200,
                title,
                this.TITLE_STYLE
            ).setOrigin(0.5);
        }

        // анимация создаётся один раз
        if (!this.anims.exists('catBlink'))
        {
            this.anims.create({
                key: 'catBlink',
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
                    { key: 'cat_idle1' },
                    { key: 'cat_idle1' },
                    { key: 'cat_idle2' },
                    { key: 'cat_idle2' },
                    { key: 'cat_idle3' },
                    { key: 'cat_idle2' },
                    { key: 'cat_idle2' },
                    { key: 'cat_idle1' }
                ],
                frameRate: 2,
                repeat: -1
            });
        }

        const cat = this.add.sprite(
            cx + (config.catOffsetX ?? -250),
            cy + (config.catOffsetY ?? 170),
            'cat_idle1'
        );

        cat.setScale(config.catScale ?? this.PLAYER_SCALE);
        cat.setDepth(5);
        cat.play('catBlink');

            return { cx, cy };

    }
}