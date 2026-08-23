import InfoScene from '../entities/InfoScene.js';

export default class LevelFinal extends InfoScene
{
    constructor()
    {
        super('LevelFinal');
    }

    create()
    {
        // вызываем родительский метод — он даёт музыку, анимацию catBlink и кота
        const { cx, cy } = super.create('', {
            catOffsetX: -200, // сдвиг по X: -250 стандарт, больше = правее
            catOffsetY: 160,  // сдвиг по Y: 170 стандарт, меньше = выше
            catScale: 1,      // масштаб кота: 1 стандарт, например 0.8 = меньше
            showLogo: false   // отключаем общий логотип — ставим свой ниже
        }); // ЗАГОЛОВОК ТУТ НЕ ПИШЕМ

        // логотип сверху по центру (меняй cx+0 и 40 чтобы двигать)
        this.add.image(cx + 300, 75, 'logo')
            .setScale(0.5)
            .setAlpha(0.5)
            .setDepth(5);

        // миссия выполнена — сохраняем флаг (один раз за сохранение)
        if (!window.gameProgress.missionCompleted)
        {
            window.gameProgress.missionCompleted = true;
            this.saveProgress();
        }

        // наш фон поверх стандартного background_1, но под котом (кот у InfoScene на depth 5)
        this.add.image(cx, cy, 'FinalScene')
            .setDisplaySize(this.scale.width, this.scale.height)
            .setDepth(2);

        // =====================
        // КНОПКА (как в About.js)
        // =====================
        const buttonPlay = this.add.image(cx + 323, cy + 225, 'button_play')
            .setDepth(10)
            .setScale(0.9)
            .setInteractive()
            .on('pointerdown', () =>
            {
                this.scene.start('LevelMenu');
            });

        this.tweens.add({
            targets: buttonPlay,
            alpha: 0.75,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // =====================
        // АНИМИРОВАННЫЕ БАБОЧКИ (вместо статичных на фоне)
        // =====================
        const butterflyPositions = [
            { x: 110,  y: 110, startFlip: false }, // верхний левый угол
            { x: 700, y: 80, startFlip: true  }  // верхний правый угол (зеркально)
        ];

        butterflyPositions.forEach((pos, i) =>
        {
            const b = this.add.image(pos.x, pos.y, 'butterfly')
                .setScale(0.25)
                .setDepth(10)
                .setFlipX(pos.startFlip);

            // пульсация масштаба (как в Level9)
            this.tweens.add({
                targets: b,
                scaleX: 0.27,
                scaleY: 0.27,
                duration: 500 + i * 80, // чуть разный ритм у каждой
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });

            // смена направления (взмах крыльев)
            this.time.addEvent({
                delay: 150 + i * 60,
                callback: () => { b.flipX = !b.flipX; },
                loop: true
            });
        });
    }
}