import InfoScene from '../entities/InfoScene.js';

export default class Controls extends InfoScene
{
    constructor()
    {
        super('Controls');
    }

    create()
    {
        const { cx, cy } = super.create('Управление');

        this.add.image(cx+45, cy+15, 'manual').setDepth(2);

        const buttonPlay = this.add.image(cx + 323, cy + 225, 'button_play')
            .setDepth(10)
            .setScale(0.9)
            .setInteractive()
            .on('pointerdown', () =>
            {
                //this.scene.start('Loading', { nextScene: 'Warmup1' });
                this.scene.start('LevelMenu')
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

    }
}