export default class Loading extends Phaser.Scene
{
    constructor()
    {
        super('Loading');
    }

    init(data)
    {
        this.nextScene = data.nextScene;
    }

    preload()
    {
        // ✅ ЗАЩИТА: очищаем старые таймеры, если сцена загружалась повторно
        this.time.removeAllEvents();

        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // Создаём UI ПЕРЕД загрузкой
        this.add.image(cx, cy, 'load')
        .setDisplaySize(this.scale.width, this.scale.height);

        this.add.text(cx, cy - 40, 'ЗАГРУЗКА...', {
            fontFamily: 'Chava',
            fontSize: '36px',
            color: '#00123F',
        }).setOrigin(0.5);

        this.add.rectangle(cx, cy + 20, 300, 20, 0x333333);
        this.bar = this.add.rectangle(cx - 150, cy + 20, 0, 20, 0x00ff00)
            .setOrigin(0, 0.5);

        // ✅ ИМИТАЦИЯ ЗАГРУЗКИ - плавная полоска
        let progress = 0;
        let finished = false;

        const simulateEvent = this.time.addEvent({
            delay: 30,
            loop: true,
            callback: () =>
            {
                if (finished) return;

                progress += 0.01;
                this.bar.width = 300 * progress;

                if (progress >= 1)
                {
                    finished = true;
                    simulateEvent.remove();

                    // Небольшая задержка для красоты
                    this.time.delayedCall(500, () =>
                    {
                        this.scene.start(this.nextScene, { // Переходим на следующую сцену
                            completedTasks: 0  // Передаем количество выполненных заданий
                        });
                    });
                }
            }
        });

        // ✅ ТУТ МОГУТ БЫТЬ АССЕТЫ ДЛЯ ЗАГРУЗКИ (если нужны)
        // this.load.image('something', 'assets/something.png');
    }

    create()
    {
        // UI уже создан в preload()
        // задаем только музыуц чтобы не наследовалась от предыдущего уровня
        this.sound.stopAll();

        this.music = this.sound.add('bg_main', {
            loop: true,
            volume: 0.5
        });

        this.music.play();
    }
}