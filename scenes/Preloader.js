export default class Preloader extends Phaser.Scene
{
    constructor()
    {
        super('Preloader');
    }

    preload()
    {
        console.log('PRELOADER');

        // =====================
        // ЭКРАН ЗАГРУЗКИ
        // =====================
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        // фон
        this.add.rectangle(cx, cy, this.scale.width, this.scale.height, 0xD5F2FF);

        // логотип (загружен в Boot)
        this.add.image(cx, cy - 90, 'logo_load').setScale(0.5);

        // фон прогресс-бара
        this.add.rectangle(cx, cy + 70, 560, 26, 0xffffff);

        // заливка прогресс-бара
        const bar = this.add.rectangle(cx - 279, cy + 70, 2, 22, 0x6a994e)
            .setOrigin(0, 0.5);

        this.load.on('progress', (value) => {
            this.tweens.killTweensOf(bar);
            this.tweens.add({
                targets: bar,
                width: 556 * value,
                duration: 1200,
                ease: 'Sine.easeOut'
            });
        });

        // =====================
        // ЗАГРУЗКА РЕСУРСОВ
        // =====================

        this.load.image('logo','assets/images/logo.png'); //логотип

        //локации и сцены
        this.load.image('lose','assets/images/lose.png'); //сцена проигрыша
        this.load.image('win', 'assets/images/win.png'); // сцена победы
        this.load.image('load', 'assets/images/load.png'); // сцена загрузки

        this.load.image('FinalScene', 'assets/images/FinalScene.png'); // финальная сцена

        this.load.image('background','assets/images/background.png'); // фон для главного меню
        this.load.image('background_1','assets/images/background_1.png'); // фон ДОП
        this.load.image('background_2','assets/images/background_2.png'); // фон ДОП 2. кат-сцена (миссия спасения)

        this.load.image('lawn', 'assets/images/lawn.png'); // локация поляна
        this.load.image('night', 'assets/images/night.png'); // локация ночь
        this.load.image('forest', 'assets/images/forest.png'); // локация лес
        this.load.image('park', 'assets/images/park.png'); // локация парк
        this.load.image('gorny', 'assets/images/gorny.png'); // локация горы
        this.load.image('garden', 'assets/images/garden.png'); // локация сквер

        //элементы ДОП.локациЙ
        this.load.image('letter', 'assets/images/letter.png'); // письмо

        this.load.image('letter_1', 'assets/images/letter_1.png'); // письмо 1 кат-сцена (миссия спасения)
        this.load.image('letter_2', 'assets/images/letter_2.png'); // письмо 2 кат-сцена (миссия спасения)

        this.load.image('tree', 'assets/images/tree.png'); // ДЕРЕВО
        this.load.image('bush', 'assets/images/bush.png'); // КУСТ
        this.load.image('bench', 'assets/images/bench.png'); // ЛАВКА
        this.load.image('cloud', 'assets/images/cloud.png'); // ОБЛАКО

        this.load.image('achievement_banner', 'assets/images/achievement_banner.png'); // достижение банер

        this.load.image('manual', 'assets/images/manual.png'); // КАРТИНКА - УПРАВЛЕНИЕ
        this.load.image('memory', 'assets/images/memory.png'); // ВОСПОМИНАНИЕ (ОБЛАЧКО)
        this.load.image('cup', 'assets/images/cup.png'); // кубок
        this.load.image('reach', 'assets/images/reach.png'); // достижение
        this.load.image('glare', 'assets/images/glare.png'); // БЛИК

        this.load.image('mouse_jar', 'assets/images/mouse_jar.png'); // мышь в банке

        this.load.image('arrow', 'assets/images/arrow.png'); // стрелка

        //артефакты
        this.load.image('artifact1', 'assets/images/artifact1.png'); // артефакт 1
        this.load.image('artifact2', 'assets/images/artifact2.png'); // артефакт 2
        this.load.image('artifact3', 'assets/images/artifact3.png'); // артефакт 3
        this.load.image('artifact4', 'assets/images/artifact4.png'); // артефакт 4
        this.load.image('artifact5', 'assets/images/artifact5.png'); // артефакт 5
        this.load.image('artifact6', 'assets/images/artifact6.png'); // артефакт 6

        this.load.image('artifacts_group', 'assets/images/artifacts_group.png'); // артефакты (группа)

        // =====================
        //кнопки
        this.load.image('button_restart', 'assets/images/button_restart.png'); // кнопка перезапуска
        this.load.image('button_replay', 'assets/images/button_replay.png'); // кнопка повтора
        this.load.image('button_next', 'assets/images/button_next.png'); // кнопка следующего уровня

        this.load.image('button_1', 'assets/images/button_1.png'); // кнопка перехода
        this.load.image('button_2', 'assets/images/button_2.png'); // кнопка перехода
        this.load.image('button_3', 'assets/images/button_3.png'); // кнопка перехода
        this.load.image('button_4', 'assets/images/button_4.png'); // кнопка перехода
        this.load.image('button_5', 'assets/images/button_5.png'); // кнопка перехода

        this.load.image('button_task1', 'assets/images/button_task1.png'); // кнопка ЗАДАНИЯ 1
        this.load.image('button_task2', 'assets/images/button_task2.png'); // кнопка ЗАДАНИЯ 2
        this.load.image('button_task3', 'assets/images/button_task3.png'); // кнопка ЗАДАНИЯ 3

        this.load.image('button_Warmup1', 'assets/images/button_Warmup1.png'); // кнопка перехода К РАЗМИНКЕ  - 1
        this.load.image('button_Warmup2_5', 'assets/images/button_Warmup2_5.png'); // кнопка перехода К РАЗМИНКЕ  - 2-5
        this.load.image('button_Warmup6', 'assets/images/button_Warmup6.png'); // кнопка перехода К РАЗМИНКЕ  - 6

        this.load.image('button_play', 'assets/images/button_play.png'); // кнопка запуска игры (старт)
        this.load.image('button_awards', 'assets/images/button_awards.png'); // кнопка перехода к достижениям

        // ===================== карточки - миссия спасения =====================
        this.load.image('card_no1', 'assets/images/card_no1.png'); //
        this.load.image('card_no2', 'assets/images/card_no2.png'); //
        this.load.image('card_no3', 'assets/images/card_no3.png'); //
        this.load.image('card_no4', 'assets/images/card_no4.png'); //
        this.load.image('card_no5', 'assets/images/card_no5.png'); //
        this.load.image('card_no6', 'assets/images/card_no6.png'); //

        this.load.image('card_yes1', 'assets/images/card_yes1.png'); //
        this.load.image('card_yes2', 'assets/images/card_yes2.png');
        this.load.image('card_yes3', 'assets/images/card_yes3.png');
        this.load.image('card_yes4', 'assets/images/card_yes4.png');
        this.load.image('card_yes5', 'assets/images/card_yes5.png');
        this.load.image('card_yes6', 'assets/images/card_yes6.png');

        this.load.image('card_question', 'assets/images/card_question.png'); //

        this.load.image('card_empty', 'assets/images/card_empty.png'); //

        // =====================
        //игрок и анимация

        this.load.image('cat1', 'assets/sprites/cat1.png'); // спрайт для анимации движения
        this.load.image('cat2', 'assets/sprites/cat2.png');
        this.load.image('cat3', 'assets/sprites/cat3.png');
        this.load.image('cat4', 'assets/sprites/cat4.png');

        this.load.image('cat_idle1', 'assets/sprites/cat_idle1.png'); // спрайт для состояния покоя
        this.load.image('cat_idle2', 'assets/sprites/cat_idle2.png');
        this.load.image('cat_idle3', 'assets/sprites/cat_idle3.png');

        this.load.image('CatMini_idle1', 'assets/sprites/CatMini_idle1.png'); // спрайт для состояния покоя
        this.load.image('CatMini_idle2', 'assets/sprites/CatMini_idle2.png');
        this.load.image('CatMini_idle3', 'assets/sprites/CatMini_idle3.png');

        // =====================
        // платформы и объекты
        this.load.image('platform','assets/images/platform.png'); // платформа
        this.load.image('platform_mini1','assets/images/platform_mini1.png'); // маленькая платформа для визуала
        this.load.image('platform_mini2','assets/images/platform_mini2.png'); // маленькая платформа для визуала

        this.load.image('log','assets/images/log.png'); // подставка бревнно
        this.load.image('log_mini','assets/images/log_mini.png'); // подставка бревнно

        this.load.image('chest','assets/images/chest.png'); // подставка сундук

        // =====================
        // Эффекты и объекты
        // =====================
        this.load.image('boom','assets/images/boom.png'); // взрыв
        this.load.image('krmstal','assets/images/krmstal.png'); // кристалл (положительный эффект))

        this.load.image('question','assets/images/question.png'); // вопрос

        // =====================
        // Предметы для сбора.
        this.load.image('star','assets/images/star.png'); // звезда
        this.load.image('donut','assets/images/donut.png'); // пончик
        this.load.image('berry','assets/images/berry.png'); // ягода
        this.load.image('candy','assets/images/candy.png'); // конфета
        this.load.image('flower','assets/images/flower.png'); // цветок
        this.load.image('apple','assets/images/apple.png'); // яблоко
        this.load.image('stone','assets/images/stone.png'); // камень
        this.load.image('coin','assets/images/coin.png'); // монетка
        this.load.image('ruby','assets/images/ruby.png'); // рубин

        this.load.image('emoji1','assets/images/emoji1.png'); // эмоция 1
        this.load.image('emoji2','assets/images/emoji2.png'); // эмоция 2
        this.load.image('emoji3','assets/images/emoji3.png'); // эмоция 3
        this.load.image('emoji4','assets/images/emoji4.png'); // эмоция 4
        this.load.image('emoji5','assets/images/emoji5.png'); // эмоция 5

        this.load.image('pattern_1','assets/images/pattern_1.png'); // УЗОР 1
        this.load.image('pattern_2','assets/images/pattern_2.png'); // УЗОР 2
        this.load.image('pattern_3','assets/images/pattern_3.png'); // УЗОР 3
        this.load.image('pattern_4','assets/images/pattern_4.png'); // УЗОР 4
        this.load.image('pattern_5','assets/images/pattern_5.png'); // УЗОР 5
        this.load.image('pattern_6','assets/images/pattern_6.png'); // УЗОР 6
        this.load.image('pattern_7','assets/images/pattern_7.png'); // УЗОР 7
        this.load.image('pattern_8','assets/images/pattern_8.png'); // УЗОР 8
        this.load.image('pattern_9','assets/images/pattern_9.png'); // УЗОР 9
        this.load.image('pattern_10','assets/images/pattern_10.png'); // УЗОР 10

        this.load.image('lap','assets/images/lap.png'); // кружок

        this.load.image('plant_1','assets/images/plant_1.png'); // растение 1
        this.load.image('plant_2','assets/images/plant_2.png'); // растение 2
        this.load.image('plant_3','assets/images/plant_3.png'); // растение 3
        this.load.image('plant_4','assets/images/plant_4.png'); // растение 4
        this.load.image('plant_5','assets/images/plant_5.png'); // растение 5
        this.load.image('plant_6','assets/images/plant_6.png'); // растение 6
        this.load.image('plant_7','assets/images/plant_7.png'); // растение 7
        this.load.image('plant_8','assets/images/plant_8.png'); // растение 8
        this.load.image('plant_9','assets/images/plant_9.png'); // растение 9
        this.load.image('plant_10','assets/images/plant_10.png'); // растение 10
        this.load.image('plant_11','assets/images/plant_11.png'); // растение 11
        this.load.image('plant_12','assets/images/plant_12.png'); // растение 12

        this.load.image('frog','assets/images/frog.png'); // лягушка
        this.load.image('dragonfly','assets/images/dragonfly.png'); // стрекоза
        this.load.image('butterfly','assets/images/butterfly.png'); // бабочка

        this.load.image('cone','assets/images/cone.png'); // шишка
        this.load.image('flower_2','assets/images/flower_2.png'); // цветок 2
        this.load.image('leaf','assets/images/leaf.png'); // лист

        this.load.image('YES','assets/images/YES.png'); // ВЫБОР-ДА
        this.load.image('NO','assets/images/NO.png'); // ВЫБОР-НЕТ

        // =====================
        // 🎵 музыка
        this.load.audio('bg_music', 'assets/audio/bg_music.mp3');

        this.load.audio('bg_main', 'assets/audio/bg_main.mp3');

        this.load.audio('bg_main2', 'assets/audio/bg_main2.mp3');

        this.load.audio('bg_victory', 'assets/audio/bg_victory.mp3');

        this.load.audio('bg_GameOver', 'assets/audio/bg_GameOver.mp3');
    }

    create()
    {
        this.cameras.main.fadeOut(1000, 138, 209, 240);
        this.cameras.main.once('camerafadeoutcomplete', () =>
        {
            this.scene.start('MainMenu');
        });
    }
}