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
        // ЗАГРУЗКА СОХРАНЕНИЯ
        // =========================
        const loadProgress = async (vk) => {
            let gameProgressData = null;

            // Пытаемся загрузить из VK Cloud Storage
            if (vk) {
                try {
                    const result = await vk.send('VKWebAppStorageGet', { keys: ['gameProgress'] });
                    if (result && result.keys && result.keys.length > 0) {
                        const key = result.keys[0];
                        // Проверяем что value не пуст перед парсингом
                        if (key.value && key.value.trim() && key.value !== '""') {
                            gameProgressData = JSON.parse(key.value);
                            console.log('Прогресс загружен из VK Cloud Storage');
                        }
                    }
                } catch (e) {
                    console.log('Ошибка загрузки из VK Storage:', e);
                }
            }

            // Если не загрузилось из VK Storage, пытаемся из localStorage
            if (!gameProgressData) {
                const saved = localStorage.getItem('gameProgress');
                if (saved) {
                    try {
                        gameProgressData = JSON.parse(saved);
                        console.log('Прогресс загружен из localStorage');
                    } catch (e) {
                        gameProgressData = null;
                    }
                }
            }

            // Если ничего не загрузилось, создаем новый прогресс
            if (!gameProgressData) {
                gameProgressData = { score: 0, completed: {}, missionCompleted: false };
            } else {
                // Обратная совместимость: добавляем поля если их нет в старом сохранении
                gameProgressData.missionCompleted = gameProgressData.missionCompleted ?? false;
            }

            window.gameProgress = gameProgressData;
            // Сохраняем также в localStorage как резервная копия
            localStorage.setItem('gameProgress', JSON.stringify(gameProgressData));

            return vk;
        };

        // =========================
        // ФИКС ШРИФТА (ВАЖНО)
        // =========================
        Promise.all([
            vkInit.then(loadProgress),
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