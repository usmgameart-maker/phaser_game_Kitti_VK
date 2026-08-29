export default class Boot extends Phaser.Scene
{
    constructor()
    {
        super('Boot');
    }

    preload()
    {
        // загружаем лого ДО Preloader — чтобы показать его на экране загрузки
        this.load.image('logo_load', 'assets/images/logo_load.png');
    }

    create()
    {
        console.log('BOOT');

        // =========================
        // ЗАГРУЗКА СОХРАНЕНИЯ ИЗ localStorage
        // =========================
        const saved = localStorage.getItem('gameProgress');
        if (saved)
        {
            try
            {
                window.gameProgress = JSON.parse(saved);
                // обратная совместимость: добавляем поля если их нет в старом сохранении
                window.gameProgress.missionCompleted = window.gameProgress.missionCompleted ?? false;
            }
            catch (e)
            {
                window.gameProgress = { score: 0, completed: {}, missionCompleted: false };
            }
        }
        else
        {
            window.gameProgress = { score: 0, completed: {}, missionCompleted: false };
        }

        // =========================
        // инициализация VK Bridge (если запущено внутри VK)
        // вне клиента VK запрос может зависнуть без ответа, поэтому ограничиваем тайм-аутом
        // =========================
        const vkTimeout = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
        const vkInit = (typeof vkBridge !== 'undefined')
            ? Promise.race([
                vkBridge.send('VKWebAppInit').then(() => vkBridge).catch(() => null),
                vkTimeout
            ])
            : Promise.resolve(null);

        // =========================
        // ФИКС ШРИФТА (ВАЖНО)
        // =========================
        Promise.all([
            vkInit,
            document.fonts.load('16px VCR'),
            document.fonts.load('16px Chava'),
            document.fonts.load('16px HV')
        ]).then(([vk]) => {

            if (vk) {
                window.vkBridge = vk;
            }

            console.log('Fonts loaded');

            this.scene.start('Preloader');
        });
    }
}