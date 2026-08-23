// entities/MissionRescueBase.js
import BaseScene from './BaseScene.js';

export default class MissionRescueBase extends BaseScene
{
    create(config = {})
    {
        super.create({
            background: 'background_2',
            title: '',
            music: 'bg_main',
            score: false,
            instruction: '',
            showInstruction: false,
            ...config
        });

        this.timerEvent.remove();
        this.timerText.setVisible(false);

        const makePlatform = (x, y, key) =>
            this.physics.add.staticImage(x, y, key);
        this.makePlatform = makePlatform; // делаем доступным в дочерних

        // Общие объекты
        // ФИЗИКА
        this.platform = makePlatform(770, 280, 'platform').setScale(0.5).setDepth(0).refreshBody(); // платформа где стоит банка

        // ПРОСТО КАРТИНКИ
        this.mouse_jar = this.add.image(680, 207, 'mouse_jar').setScale(0.7).setDepth(0); // банка с мышью

        this.tree1 = this.add.image(130, 450, 'tree').setScale(1).setDepth(10); // дерево 1

        this.tree2 = this.add.image(630, 360, 'tree').setScale(1).setDepth(-1); // дерево 2

        this.bush  = this.add.image(30, 510, 'bush').setScale(1).setDepth(10); // куст

        this.bench = this.add.image(550, 480, 'bench').setScale(0.7).setDepth(0); // лавка для письма

        this.cloud = this.add.image(700, 540, 'cloud').setScale(1).setDepth(10); // облако


        // Радуга на банке. Пульсация яркости (БАНКА С МЫШЕЙ), плавный цикл через все цвета.
        this.tweens.addCounter({
            from: 0, to: 360, duration: 5000, repeat: -1, ease: 'Linear',
            onUpdate: (tween) => {
                const color = Phaser.Display.Color.HSLToColor(tween.getValue() / 360, 1, 0.9);
                this.mouse_jar.setTint(color.color);
            }
        });

        // Анимация кота
        if (!this.anims.exists('catIdle'))
        {
            this.anims.create({
                key: 'catIdle',
                frames: [
                    { key: 'cat_idle1' }, { key: 'cat_idle2' }, { key: 'cat_idle1' },
                    { key: 'cat_idle1' }, { key: 'cat_idle3' }, { key: 'cat_idle2' },
                    { key: 'cat_idle1' }, { key: 'cat_idle1' }, { key: 'cat_idle3' },
                    { key: 'cat_idle1' },
                ],
                frameRate: 4, repeat: -1
            });
        }

        // Кот-превью (позиция настраивается через config)
        const catX = config.catX ?? 250;
        const catY = config.catY ?? 470;
        this.catPreview = this.add.sprite(catX, catY, 'cat_idle1').setScale(0.78);
        this.catPreview.play('catIdle');
    }
}
