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

    // create()
    // {
    //     console.log('BOOT');

    //     // =========================
    //     // ЗАГРУЗКА СОХРАНЕНИЯ ИЗ localStorage
    //     // =========================
    //     const saved = localStorage.getItem('gameProgress');
    //     if (saved)
    //     {
    //         try
    //         {
    //             window.gameProgress = JSON.parse(saved);
    //             // обратная совместимость: добавляем поля если их нет в старом сохранении
    //             window.gameProgress.missionCompleted = window.gameProgress.missionCompleted ?? false;
    //         }
    //         catch (e)
    //         {
    //             window.gameProgress = { score: 0, completed: {}, missionCompleted: false };
    //         }
    //     }
    //     else
    //     {
    //         window.gameProgress = { score: 0, completed: {}, missionCompleted: false };
    //     }

    //     // =========================
    //     // инициализация VK Bridge (если запущено внутри VK)
    //     // вне клиента VK запрос может зависнуть без ответа, поэтому ограничиваем тайм-аутом
    //     // =========================
    //     const vkTimeout = new Promise((resolve) => setTimeout(() => resolve(null), 1500));
    //     const vkInit = (typeof vkBridge !== 'undefined')
    //         ? Promise.race([
    //             vkBridge.send('VKWebAppInit').then(() => vkBridge).catch(() => null),
    //             vkTimeout
    //         ])
    //         : Promise.resolve(null);

    //     // =========================
    //     // ФИКС ШРИФТА (ВАЖНО)
    //     // =========================
    //     Promise.all([
    //         vkInit,
    //         document.fonts.load('16px VCR'),
    //         document.fonts.load('16px Chava'),
    //         document.fonts.load('16px HV')
    //     ]).then(([vk]) => {

    //         if (vk) {
    //             window.vkBridge = vk;
    //         }

    //         console.log('Fonts loaded');

    //         this.scene.start('Preloader');
    //     });
    // }
    create()
    {
        console.log('BOOT');

        // =========================
        // ЗАГРУЗКА СОХРАНЕНИЯ ИЗ localStorage (быстрый запасной вариант,
        // пока не пришёл ответ от VK Storage — см. ниже)
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
        ]).then(async ([vk]) => {

            if (vk) {
                window.vkBridge = vk;

                // =========================
                // ЗАГРУЗКА ПРОГРЕССА ИЗ VK STORAGE
                // (общий для всех платформ — телефон, ПК, разные браузеры)
                // если там есть сохранение — оно приоритетнее локального
                // =========================
                try
                {
                    const result = await vk.send('VKWebAppStorageGet', { keys: ['gameProgress'] });
                    const raw = result?.keys?.[0]?.value;

                    if (raw)
                    {
                        window.gameProgress = JSON.parse(raw);
                        window.gameProgress.missionCompleted = window.gameProgress.missionCompleted ?? false;

                        // синхронизируем локальную копию — чтобы офлайн-режим тоже был актуален
                        localStorage.setItem('gameProgress', raw);
                    }
                }
                catch (e)
                {
                    console.warn('Не удалось загрузить прогресс из VK Storage, используем локальный', e);
                }
            }

            console.log('Fonts loaded');

            this.scene.start('Preloader');
        });
    }
}