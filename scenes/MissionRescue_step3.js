// step3: импорт BaseScene вместо MissionRescueBase
import BaseScene from '../entities/BaseScene.js';

export default class MissionRescue_step3 extends BaseScene
{

    constructor()
    {
        super('MissionRescue_step3');
    }

    create()
    {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        super.create({ // всё общее уже внутри

        // только уникальное для step3:

        background:'background_2', // фон УРОВНЯ (ЛОКАЦИЯ)
        time: 90, // время игры

        score: false, // не показывать счет

        title:'МИССИЯ СПАСЕНИЯ',// название уровня
        instruction:'Запомни расположение!' // задача 1
        });

        // логотип (меняй cx-300 и 40 чтобы двигать)
        this.add.image(cx + 300, 75, 'logo').setScale(0.5).setDepth(-1).setAlpha(0.5);

        //декорации
        this.tree1 = this.add.image(110, 365, 'tree').setScale(1).setDepth(0); // дерево 1

        this.bush1  = this.add.image(20, 490, 'bush').setScale(1).setDepth(10); // куст
        this.bush2  = this.add.image(640, 490, 'bush').setScale(1).setDepth(10); // куст

        // =====================
        // КОТ ДЛЯ ЗАСТАВКИ - без взаимодействия только анимация
        // =====================

        this.createCatAnimBig(); // создаём анимацию (берет её из BaseScene)

        this.catPreview = this.add.sprite(
            150,
            465,
            'cat_idle1'
        );

        this.catPreview.play('cat_Idle').setScale(0.8).setDepth(10);

        // ===================== размещение карточек =====================

        const cols = 4;
        const rows = 3;
        const gapX = 118;
        const gapY = 110;

        // стартовая точка — верхний левый угол сетки, идеально отцентрированной
        const startX = cx - (cols - 1) * gapX / 2; // cx - 165
        const startY = cy - 180;

        const cardKeys = [
            'card_no1', 'card_no2', 'card_no3', 'card_no4', 'card_no5', 'card_no6',
            'card_yes1', 'card_yes2', 'card_yes3', 'card_yes4', 'card_yes5', 'card_yes6'
        ];

        Phaser.Utils.Array.Shuffle(cardKeys);

        // рандомное слово-пароль из списка (только 6-буквенные)
        const WORDS = [
            'РАКЕТА', 'СЛУЧАЙ', 'ПОМОЩЬ', 'МОМЕНТ', 'ГАЗЕТА',
            'КРАТЕР', 'НИКЕЛЬ', 'КОЛЕСО', 'СПОСОБ', 'КАМЕНЬ',
            'СТЕКЛО', 'ОСТРОВ', 'ЦВЕТОК', 'ЗВОНОК', 'ПОЛОСА'
        ];
        this.password = Phaser.Utils.Array.GetRandom(WORDS);

        // буквы пароля перемешиваем и раздаём по yes-карточкам
        const letters = Phaser.Utils.Array.Shuffle([...this.password]);
        let letterIdx = 0;

        this.cards = [];
        let idx = 0;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = startX + col * gapX;
                const y = startY + row * gapY;
                const card = this.add.image(x, y, cardKeys[idx]).setScale(0.7).setDepth(10);
                card.cardKey = cardKeys[idx];
                card.revealed = false;
                if (card.cardKey.startsWith('card_yes')) {
                    card.letter = letters[letterIdx++];
                }
                this.cards.push(card);
                idx++;
            }
        }

        // клики заблокированы во время фазы запоминания
        this.cardsFlipped = false;
        this.foundCount = 0;

        // ===================== переворот карточек через 10 сек =====================

        this.time.delayedCall(10000, () => {
            this.cards.forEach((card, i) => {
                this.time.delayedCall(i * 40, () => {
                    this.tweens.add({
                        targets: card,
                        scaleX: 0,
                        duration: 150,
                        ease: 'Linear',
                        onComplete: () => {
                            card.setTexture('card_question');
                            this.tweens.add({
                                targets: card,
                                scaleX: card.scaleY,
                                duration: 150,
                                ease: 'Linear'
                            });
                        }
                    });
                });
            });

            // после завершения всех переворотов — включаем клики
            const totalFlipTime = (this.cards.length - 1) * 40 + 300 + 100;
            this.time.delayedCall(totalFlipTime, () => {
                this.cardsFlipped = true;
                this.enableCardClicks();
                if (this.instructionText) {
                    this.instructionText.setText('Выбери верные артефакты, чтобы составить пароль.');
                }
            });
        });

    }

    enableCardClicks()
    {
        this.cards.forEach(card => {
            card.setInteractive({ useHandCursor: true });
            card.on('pointerdown', () => this.onCardClick(card));
        });
    }

    onCardClick(card)
    {
        if (this.gameEnded) return;
        if (!this.cardsFlipped || card.revealed) return;

        card.revealed = true;
        card.disableInteractive();

        if (card.cardKey.startsWith('card_yes')) {
            // верная карточка — переворачиваем и показываем букву
            this.tweens.add({
                targets: card,
                scaleX: 0,
                duration: 150,
                ease: 'Linear',
                onComplete: () => {
                    card.setTexture('card_empty');
                    this.add.text(card.x, card.y, card.letter, {
                        fontFamily: 'HV',
                        fontSize: '40px',
                        color: '#1d1d3a'
                    }).setOrigin(0.5).setDepth(11);

                    this.tweens.add({
                        targets: card,
                        scaleX: card.scaleY,
                        duration: 150,
                        ease: 'Linear',
                        onComplete: () => {
                            this.foundCount++;
                            if (this.foundCount === 6) {
                                this.cards.forEach(c => c.disableInteractive());
                                this.showPasswordInput();
                            }
                        }
                    });
                }
            });
        } else {
            // неверная карточка — уходим в поражение
            this.onLose();
        }
    }

    showPasswordInput()
    {
        const cx = this.scale.width / 2;

        if (this.instructionText) {
            this.instructionText.setText('СОСТАВЬ И ВВЕДИ СЛОВО-ПАРОЛЬ И НАЖМИ ENTER.');
        }

        this.typedWord = '';

        // фон поля ввода
        this.add.rectangle(cx, 430, 300, 44, 0xffffff, 0.92)
            .setDepth(20)
            .setStrokeStyle(2, 0x1d1d3a);

        // текст внутри поля
        this.inputText = this.add.text(cx, 430, '|', {
            fontFamily: 'VCR',
            fontSize: '22px',
            color: '#1d1d3a'
        }).setOrigin(0.5).setDepth(21);

        // подсказка
        this.add.text(cx, 462, 'ENTER — проверить  |  BACKSPACE — стереть', {
            fontFamily: 'VCR',
            fontSize: '10px',
            color: '#1d1d3a'
        }).setOrigin(0.5).setDepth(21);

        // мигающий курсор
        this.cursorVisible = true;
        this.cursorTimer = this.time.addEvent({
            delay: 500,
            loop: true,
            callback: () => {
                this.cursorVisible = !this.cursorVisible;
                this.updateInputDisplay();
            }
        });

        // блокируем горячие клавиши BaseScene пока активен ввод
        this.inputActive = true;

        // слушаем клавиатуру
        this.input.keyboard.on('keydown', this.onKeyDown, this);

        // чистим слушатель при выходе из сцены
        this.events.once('shutdown', () => {
            this.input.keyboard.off('keydown', this.onKeyDown, this);
        });
    }

    updateInputDisplay()
    {
        const cursor = this.cursorVisible ? '|' : ' ';
        this.inputText.setText(this.typedWord + cursor);
    }

    onKeyDown(event)
    {
        if (this.gameEnded) return;

        if (event.key === 'Enter') {
            this.checkPassword();
        } else if (event.key === 'Backspace') {
            this.typedWord = this.typedWord.slice(0, -1);
            this.updateInputDisplay();
        } else if (event.key.length === 1) {
            this.typedWord += event.key;
            this.updateInputDisplay();
        }
    }

    checkPassword()
    {
        const input = this.typedWord.trim().toUpperCase();

        if (input === this.password) {
            this.gameEnded = true;
            if (this.cursorTimer) this.cursorTimer.remove();
            this.scene.start('WinScene', {
                restartScene: 'MissionRescue_step3',
                nextScene: 'LevelFinal'
            });
        } else {
            this.onLose();
        }
    }

    update()
    {
        // пока игрок вводит пароль — горячие клавиши BaseScene (F, R, ESC) не срабатывают,
        // иначе А→F (полноэкран) и К→R (рестарт) ломают ввод русских букв
        if (this.inputActive) return;
        super.update();
    }

    onLose()
    {
        this.gameEnded = true;
        if (this.cursorTimer) this.cursorTimer.remove();

        this.time.delayedCall(300, () =>
        {
            this.scene.start('GameOverScene', {
                restartScene: 'MissionRescue_step3'
            });
        });
    }

}
