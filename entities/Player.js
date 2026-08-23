export default class Player
{
    constructor(scene)
    {
        this.scene = scene;
    }

    create(x, y)
    {
        this.player = this.scene.physics.add.sprite(x, y, 'cat1'); // создаём спрайт игрока

        this.player.setScale(0.4); // уменьшаем размер спрайта, так как он слишком большой
        this.player.setGravityY(2000);
        this.player.setCollideWorldBounds(true);

        // анимация кота (создаётся один раз)
        if (!this.scene.anims.exists('catWalk')) // проверяем, есть ли уже анимация с таким ключом, чтобы не создавать её заново при каждом уровне
        {
            this.scene.anims.create({
                key: 'catWalk',
                frames: [
                    { key: 'cat1' },
                    { key: 'cat2' },
                    { key: 'cat3' },
                    { key: 'cat4' }
                ],
                frameRate: 8, // скорость анимации
                repeat: -1 // повторять бесконечно
            });
        }

        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.keys = this.scene.input.keyboard.addKeys({
            A: 'A',
            D: 'D',
            W: 'W'
        });

        return this.player; // возвращаем игрока, чтобы его можно было использовать для коллизий и других взаимодействий в сцене
    }

    update()
    {
        if (!this.player) return;

        this.player.setVelocityX(0);

        const onGround = this.player.body.blocked.down;

        // =====================
        // ДВИЖЕНИЕ ВЛЕВО/ВПРАВО
        // =====================
        const leftPressed =
            this.cursors.left.isDown ||
            this.keys.A.isDown;

        const rightPressed =
            this.cursors.right.isDown ||
            this.keys.D.isDown;

        if (leftPressed)
        {
            this.player.setVelocityX(-200);
            this.player.setFlipX(true);
            this.player.play('catWalk', true);
        }
        else if (rightPressed)
        {
            this.player.setVelocityX(200);
            this.player.setFlipX(false);
            this.player.play('catWalk', true);
        }
        else
        {
            this.player.stop();
            this.player.setTexture('cat1');
        }

        // =====================
        // ПРЫЖОК
        // =====================
        const jumpPressed =
            this.cursors.up.isDown ||
            this.cursors.space.isDown ||
            this.keys.W.isDown;

        if (jumpPressed && onGround)
        {
            this.player.setVelocityY(-800);
        }
    }
}