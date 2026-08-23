// step1: импортирт MissionRescueBase вместо BaseScene
import MissionRescueBase from '../entities/MissionRescueBase.js';
import Player from '../entities/Player.js';

export default class MissionRescue_step1 extends MissionRescueBase
{

    constructor()
    {
        super('MissionRescue_step1');
    }

    create()
    {
        super.create(); // всё общее уже внутри

        // далее только уникальное для step1:
        // тексты, platform, benchBack, letter_1 с анимацией, игрок с задержкой, overlap

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // логотип (меняй cx-300 и 40 чтобы двигать)
        this.add.image(cx + 300, 75, 'logo').setScale(0.5).setDepth(10).setAlpha(0.5);

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

        const STYLE_BODY = {
            fontFamily: 'HV',
            fontSize: '18px',
            color: '#1d1d3a',
            align: 'left',
            lineSpacing: 15,
            wordWrap: { width: 650, useAdvancedWrap: true },
            padding: { left: 25, right: 10 }
        };

        // Тексты
        const TEXTS = [
            { content: 'А вот и моя мышка!', x: cx - 350, y: cy - 210, style: STYLE_TITLE },
            { content: 'И, похоже, она в беде: кто-то запер её в банке.\nНо чтобы открыть замок, нам нужен код...', x: cx - 350, y: cy - 150, style: STYLE_BODY },
            { content: 'Возможно, в письме есть подсказка.\nДавай прочтём!', x: cx - 350, y: cy - 75, style: STYLE_BODY }
        ];

        // Добавляем тексты
        TEXTS.forEach(text => {
            this.add.text(text.x, text.y, text.content, text.style).setOrigin(0, 0.5);
        });

        // невидимая платформа на спинке лавки (для отталкивания)
        this.benchBack = this.add.rectangle(550, 440, 170, 5);
        this.physics.add.existing(this.benchBack, true); // true = статичная

        // позиция письма
        this.letter_1 = this.physics.add.staticImage(550, 460, 'letter_1').setScale(0.6).setDepth(0).refreshBody();

        this.tweens.add({
            targets: this.letter_1,
            scaleX: 0.55, // ИЗМЕНЯЕМ масштаб
            scaleY: 0.55, // ИЗМЕНЯЕМ масштаб
            duration: 1000, // ИЗМЕНЯЕМ время
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // =====================
        //  PLAYER
        // =====================

        this.player = new Player(this); // создаём игрока, передавая ему сцену для доступа к её методам и свойствам

        this.player.create(250, 470); // создаём игрока на сцене по координатам

        this.player.player.setScale(0.6); // Масштабируем спрайт

        // скрываем настоящего игрока
        this.player.player.setVisible(false);

        this.player.player.body.moves = false; // тело не двигается пока скрыто

        this.playerLocked = true; // блокируем управление игроком

        // Смена персонажа. Через 5 секунд переключаемся на настоящего игрока
        this.time.delayedCall(5000, () =>
        {
            this.searchStarted = true;

            // скрываем временного кота
            this.catPreview.destroy();

            // показываем настоящего игрока
            this.player.player.setVisible(true);

            // разрешаем движение
            this.playerLocked = false;

            this.player.player.body.moves = true; // тело начинает двигаться

        });

        // =====================
        // КОЛЛИЗИИ
        // =====================
        // 1. КОЛЛИЗИИ С ПЛАТФОРМАМИ

        this.physics.add.collider(
        this.player.player,
        [
            this.platform,
            this.benchBack
        ],
        null,
        (player, platform) => {
            return player.body.velocity.y >= 0 &&
                player.body.bottom <= platform.body.top + 20;
        },
        this
    );

        // 2. КОЛЛИЗИЯ ИГРОКА С ПРЕДМЕТАМИ (проверяем столкновение игрока с ПИСЬМОМ)
        // Касание письма сбоку → переход на следующую сцену
        this.physics.add.overlap(
            this.player.player,
            this.letter_1,
            () => {
                if (this.gameEnded) return;
                this.gameEnded = true;
                this.cameras.main.fadeOut(400, 138, 209, 240);
                this.cameras.main.once('camerafadeoutcomplete', () => {
                    this.scene.start('MissionRescue_step2');
                });
            },
            (player, letter) => {
                // true = реагируем, но только если низ игрока НИЖЕ верха письма (боковой контакт)
                return player.body.bottom > letter.body.top + 10;
            },
            this
        );

        // =====================
        // 3. PLATFORMS - остается везде, так как они есть на всех уровнях
        // =====================
        this.physics.add.collider( // добавляем коллизию между игроком и платформами
        this.player.player,
        this.platforms
        );

    }
    update()
    {
        super.update(); // обрабатываем клавиши (M, F, ESC) из BaseScene
        if (this.gameEnded) return; // если игра закончилась, не обновляем игрока

        this.player.update(); // обновляем игрока
    }
}