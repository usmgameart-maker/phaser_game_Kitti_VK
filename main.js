import Boot from './scenes/Boot.js';
import Preloader from './scenes/Preloader.js';
import MainMenu from './scenes/MainMenu.js';
import About from './scenes/About.js';
import Controls from './scenes/Controls.js';
import LevelMenu from './scenes/LevelMenu.js';
import Achievements from './scenes/Achievements.js';
import Loading from './scenes/Loading.js';
import WinScene from './scenes/WinScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import Warmup1 from './scenes/Warmup1.js';
import Warmup2 from './scenes/Warmup2.js';
import Warmup3 from './scenes/Warmup3.js';
import Warmup4 from './scenes/Warmup4.js';
import Warmup5 from './scenes/Warmup5.js';
import Warmup6 from './scenes/Warmup6.js';
import Level1 from './scenes/Level1.js';
import Level2 from './scenes/Level2.js';
import Level3 from './scenes/Level3.js';
import Level4 from './scenes/Level4.js';
import Level5 from './scenes/Level5.js';
import Level6 from './scenes/Level6.js';
import Level7 from './scenes/Level7.js';
import Level8 from './scenes/Level8.js';
import Level9 from './scenes/Level9.js';
import Level10 from './scenes/Level10.js';
import Level11 from './scenes/Level11.js';
import Level12 from './scenes/Level12.js';
import Level13 from './scenes/Level13.js';
import Level14 from './scenes/Level14.js';
import Level15 from './scenes/Level15.js';
import LevelFinal from './scenes/LevelFinal.js';
import MissionRescue_step1 from './scenes/MissionRescue_step1.js';
import MissionRescue_step2 from './scenes/MissionRescue_step2.js';
import MissionRescue_step3 from './scenes/MissionRescue_step3.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#87CEEB',

    parent: 'game-container',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true
    },


    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false // отображение коллайдеров (для отладки)
        }
    },

    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: true
    },

    scene: [
        Boot, // Boot
        Preloader, // Preloader
        MainMenu, // Главное меню
        About, // об игре
        Controls, // управление
        LevelMenu, // меню уровней
        Achievements, // достижения
        Loading, // сцена загрузки (экран загрузки)
        Warmup1, //разминка 1
        Warmup2, //разминка 2
        Warmup3, //разминка 3
        Warmup4, //разминка 4
        Warmup5, //разминка 5
        Warmup6, //разминка 6
        Level1, // уровень 1
        Level2, // уровень 2
        Level3, // уровень 3
        Level4, // уровень 4
        Level5, // уровень 5
        Level6, // уровень 6
        Level7, // уровень 7
        Level8, // уровень 8
        Level9, // уровень 9
        Level10, // уровень 10
        Level11, // уровень 11
        Level12, // уровень 12
        Level13, // уровень 13
        Level14, // уровень 14
        Level15, // уровень 15
        LevelFinal, // финальная сцена
        MissionRescue_step1, // миссия спасения
        MissionRescue_step2, // миссия спасения
        MissionRescue_step3, // миссия спасения
        WinScene, // При победе
        GameOverScene // При проигрыше
    ]
};

new Phaser.Game(config);