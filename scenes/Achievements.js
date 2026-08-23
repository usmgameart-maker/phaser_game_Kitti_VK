import InfoScene from '../entities/InfoScene.js';

export default class Achievements extends InfoScene
{
    constructor()
    {
        super('Achievements');
    }

    create()
    {
        const { cx, cy } = super.create('Достижения', {
            catOffsetY: 4
        });

        const buttonPlay = this.add.image(cx + 323, cy + 225, 'button_play')
            .setDepth(10)
            .setScale(0.9)
            .setInteractive()
            .on('pointerdown', () =>
            {
                //this.scene.start('Loading', { nextScene: 'Warmup1' });
                const canMission = this.countAchievements() >= 6 && !window.gameProgress.missionCompleted;
                this.scene.start(canMission ? 'MissionRescue_step1' : 'LevelMenu');
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

        this.add.image(cx - 230, cy + 150, 'cup').setDepth(2);
        const glare = this.add.image(cx - 290, cy - 125, 'glare').setDepth(2);

        // мерцание блика — как живой отблеск света
        this.tweens.add({
            targets: glare,
            alpha: { from: 0.7, to: 1 },
            // scale: { from: 1, to: 1 },
            duration: 1800, // продолжительность анимации в миллисекундах
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        const positions = [
            { x: cx - 60,  y: cy - 40,  artifact: 'artifact1' },
            { x: cx + 100, y: cy - 40,  artifact: 'artifact2' },
            { x: cx + 260, y: cy - 40,  artifact: 'artifact3' },

            { x: cx - 60,  y: cy + 105, artifact: 'artifact4' },
            { x: cx + 100, y: cy + 105, artifact: 'artifact5' },
            { x: cx + 260, y: cy + 105, artifact: 'artifact6' }
        ];

        // positions.forEach(pos =>
        // {
        //     this.add.image(pos.x, pos.y, pos.artifact).setDepth(2);
        //     this.add.image(pos.x, pos.y, 'reach').setDepth(2);
        // });

        //----------------------------
        // ОТОБРАЖЕНИЕ АРТЕФАКТОВ
        //----------------------------

        const c = window.gameProgress.completed || {}; // ДОБАВИЛИ, ЧТОБЫ ПРОВЕРЯТЬ ПРОГРЕС

        const unlocked = [
            c.Warmup1 === true,

            c.Level1 && c.Level2 && c.Level3 && c.Warmup2,

            c.Level4 && c.Level5 && c.Level6 && c.Warmup3,

            c.Level7 && c.Level8 && c.Level9 && c.Warmup4,

            c.Level10 && c.Level11 && c.Level12 && c.Warmup5,

            c.Level13 && c.Level14 && c.Level15 && c.Warmup6
        ];

        positions.forEach((pos, i) =>
        {
            this.add.image(pos.x, pos.y, pos.artifact).setDepth(2); // Добавляем артефакт

            if (!unlocked[i]) // Если достижение не разблокировано
            {
                this.add.image(pos.x, pos.y, 'reach').setDepth(3);
            }
        });

        // =====================
        // НАДПИСЬ: МИССИЯ ДОСТУПНА (только если все 6 артефактов собраны)
        // =====================
        if (this.countAchievements() >= 6 && !window.gameProgress.missionCompleted)
        {
            const missionLabel = this.add.text(cx + 100, cy + 185, 'МИССИЯ СПАСЕНИЯ ДОСТУПНА!', {
                fontFamily: 'Chava',
                fontSize: '20px',
                color: '#FFD700',
                stroke: '#5c0a0a',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(4);

            this.tweens.add({
                targets: missionLabel,
                alpha: { from: 0.4, to: 1 },
                duration: 900,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

}