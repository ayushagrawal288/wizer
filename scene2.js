Game.Scene2 = function(game){

}

Game.Scene2.prototype = {
	create: function(game){
		game.scale.setGameSize(levelDimensions.scene2.width, levelDimensions.scene2.height);
		this.world.setBounds(0,0,levelDimensions.scene2.width, levelDimensions.scene2.height)
		sceneImage = this.add.image(this.game.width / 2, this.game.height / 2, 'scene2');
		sceneImage.anchor.set(0.5);
		sceneImage.width = this.game.width;
		sceneImage.height = this.game.height;

		getGame = game;
		thisLevel = this;
		currentLevel = 'scene2';

		levelData = sceneButtons[currentLevel];

		createBasicModal(game);

		createPlayer(80,210);

		controls = this.input.keyboard.createCursorKeys();
		spacebar = this.input.keyboard.addKeys({'space': Phaser.Keyboard.SPACEBAR});

		soundNew.play();

		tunnelReverse = game.add.sprite(0,208,'tunnelReverse');
		enableCollisionNotGravity(game,tunnelReverse);
	
		tunnel = game.add.sprite(levelDimensions.scene.width - 30,208,'tunnel');
		enableCollisionNotGravity(game,tunnel);
		tunnel.body.setSize(80,29,0,3);
		tunnel.next = 'Level2';
		flagNext = true;
	},

	update: function(game){
		this.physics.arcade.collide(player,tunnelReverse);
		this.physics.arcade.collide(player,tunnel,enterTunnel);
  		updateScenePhysics();
	},
}