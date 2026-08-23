import InfoScene from '../entities/InfoScene.js';

export default class MainMenu extends InfoScene
{
    constructor()
    {
        super('MainMenu');
    }

    create()
    {

        // вызываем метод create() родительского класса
        super.create('', { showLogo: false }); //ЗАГОЛОВОК ТУТ НЕ ПИШЕМ

        // =====================
        // МУЗЫКА
        // =====================
        this.sound.stopAll();

        this.music = this.sound.add('bg_main', {
            loop: true,
            volume: 0.5
        });

        this.music.play();

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.add.image(cx, cy, 'background')
            .setDisplaySize(this.scale.width, this.scale.height);

        const buttons = [
            { image: 'button_1', text: 'ОБ ИГРЕ', scene: 'About' },
            { image: 'button_2', text: 'УПРАВЛЕНИЕ', scene: 'Controls' },
            { image: 'button_3', text: 'УРОВНИ', scene: 'LevelMenu' },
            { image: 'button_4', text: 'ДОСТИЖЕНИЯ', scene: 'Achievements' },
            { image: 'button_5', text: 'ИГРАТЬ', scene: 'Warmup1' }
        ];

        const offsetX = 275;
        const startY = cy - 98;
        const stepY = 70;

        buttons.forEach((btn, i) =>
        {
            const b = this.add.image(0, 0, btn.image);
            const t = this.add.text(0, 0, btn.text, {
                fontFamily: 'Chava',
                fontSize: '16px',
                color: '#fff'
            }).setOrigin(0.5);

            const container = this.add.container(
                cx + offsetX,
                startY + i * stepY,
                [b, t]
            );

            container.setSize(b.width, b.height);
            container.setInteractive();

            container.on('pointerdown', () =>
            {
                if (btn.scene === 'Warmup1')
                {
                    const hasSave = Object.keys(window.gameProgress.completed || {}).length > 0;
                    if (hasSave)
                    {
                        this.showStartPanel(cx, cy);
                    }
                    else
                    {
                        this.scene.start('Loading', { nextScene: 'Warmup1' });
                    }
                }
                else
                {
                    this.scene.start(btn.scene);
                }
            });

            container.on('pointerover', () =>
            {
                t.setColor('#470e68');
            });

            container.on('pointerout', () =>
            {
                t.setColor('#ffffff');
            });
        });

        // логотип справа (меняй x и y чтобы двигать)
        this.add.image(cx + 320, 70, 'logo')
            .setScale(0.5)
            .setDepth(10);

        const cat = this.add.sprite(cx - 250, cy + 170, 'cat_idle1');
        cat.setScale(1);
        cat.play('catBlink');

    }

    showStartPanel(cx, cy)
    {
        // порядок уровней для кнопки "Продолжить"
        const ORDER = [
            'Warmup1',
            'Level1', 'Level2', 'Level3', 'Warmup2',
            'Level4', 'Level5', 'Level6', 'Warmup3',
            'Level7', 'Level8', 'Level9', 'Warmup4',
            'Level10', 'Level11', 'Level12', 'Warmup5',
            'Level13', 'Level14', 'Level15', 'Warmup6'
        ];

        const panel = this.add.container(cx, cy).setDepth(20);

        // затемнение фона (и блокировка кликов под панелью)
        const overlay = this.add.rectangle(0, 0, 800, 600, 0x000000, 0.55);
        overlay.setInteractive();

        // рамка панели
        const bg = this.add.rectangle(0, 0, 370, 265, 0x1a0a2e)
            .setStrokeStyle(2, 0xF22259)
            .setAlpha(0.97);

        // заголовок
        const title = this.add.text(0, -100, 'КАК ПРОДОЛЖИМ?', {
            fontFamily: 'Chava',
            fontSize: '22px',
            color: '#F22259'
        }).setOrigin(0.5);

        // кнопка закрыть ×
        const closeBtn = this.add.text(160, -112, '×', {
            fontFamily: 'Chava',
            fontSize: '28px',
            color: '#888888'
        }).setOrigin(0.5).setInteractive();
        closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
        closeBtn.on('pointerout',  () => closeBtn.setColor('#888888'));
        closeBtn.on('pointerdown', () => panel.destroy());

        const btnStyle = {
            fontFamily: 'Chava',
            fontSize: '17px',
            color: '#ffffff',
            backgroundColor: '#3d1060',
            padding: { x: 20, y: 10 },
            fixedWidth: 230,
            align: 'center'
        };

        // НАЧАТЬ ЗАНОВО
        const btnReset = this.add.text(0, -40, 'НАЧАТЬ ЗАНОВО', btnStyle)
            .setOrigin(0.5).setInteractive();
        btnReset.on('pointerover', () => btnReset.setColor('#FFD700'));
        btnReset.on('pointerout',  () => btnReset.setColor('#ffffff'));
        btnReset.on('pointerdown', () =>
        {
            this.resetProgress();
            this.scene.start('Loading', { nextScene: 'Warmup1' });
        });

        // ПРОДОЛЖИТЬ (находим первый непройденный уровень)
        const c = window.gameProgress.completed || {};
        const nextLevel = ORDER.find(id => !c[id]) || 'LevelMenu';

        const btnContinue = this.add.text(0, 20, 'ПРОДОЛЖИТЬ', btnStyle)
            .setOrigin(0.5).setInteractive();
        btnContinue.on('pointerover', () => btnContinue.setColor('#FFD700'));
        btnContinue.on('pointerout',  () => btnContinue.setColor('#ffffff'));
        btnContinue.on('pointerdown', () =>
        {
            this.scene.start('Loading', { nextScene: nextLevel });
        });

        // ВЫБРАТЬ УРОВЕНЬ
        const btnChoose = this.add.text(0, 80, 'ВЫБРАТЬ УРОВЕНЬ', btnStyle)
            .setOrigin(0.5).setInteractive();
        btnChoose.on('pointerover', () => btnChoose.setColor('#FFD700'));
        btnChoose.on('pointerout',  () => btnChoose.setColor('#ffffff'));
        btnChoose.on('pointerdown', () =>
        {
            this.scene.start('LevelMenu');
        });

        panel.add([overlay, bg, title, closeBtn, btnReset, btnContinue, btnChoose]);
    }
}