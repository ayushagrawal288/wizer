Game.Level1 = function(game){

};

var getGame;
var enemy1;
var map;
var layer;
var graphics;
var platforms,ground;
var graphicsSprite;
var player;
var box1,box2;
var box;
var controls = {};
var playerSpeed = 150;
var jumpTimer = 0;
var shootTime = 0;
var fallTime = 0;
var nuts;
var text;
var componentText,textGroup;
var textSprite;
var style,style1;
// var score = 0;
var scoreText;
var flagBox = 0;
var flag2 = 0,flag3 = 0;
var flagPlayer = 3;
var coins;
var coin;
var isWrongAnswer = false,isWrongAnswer2 = false;
var dynamiteBox,dynamiteBoxes;
var handles,handle;
var flagHandle = {
	A: 0,
	B: 0,
	C: 0,
	D: 0
};
var optionRepresent = {
	0: "A",
	1: "B",
	2: "C",
	3: "D"
};
var mineEnemy;
var wall,wall1;
// var soundPowerUp,soundJump;
var explosion;
var taskCompleted = false;
var tunnelReverse;
var indexCloud = 0;
var startCloudCreate = {};
var flagCloudStart = {};
var indexHoarding = 0;
var startHoardingCreate = {};
var flagHoardingStart = {};
var indexMines = 0;
var startMinesCreate = {};
var flagMinesStart = {};
var groupWords,indexWord;
var words = [];
var cloudTween;
var startX = 1000;
var completeTime = 0;
var thisLevel;

Game.Level1.prototype = {
	create:function(game){
		game.scale.setGameSize(Game.Params.baseWidth,Game.Params.baseHeight);
		this.stage.backgroundColor = "#3A0900";
		getGame=game;
		thisLevel = this;
		console.log(this,game,thisLevel,game);
		this.physics.arcade.gravity.y = 1000;

		levelData = levelDimensions.level; 
		if(levelData.width % 16 != 0)
		{
			levelData.width = (levelData.width / 16 + 1) * 16;
		}
		if(levelData.height % 16 != 0)
		{
			levelData.height = (Math.floor(levelData.height / 16) + 1) * 16;
		}
		this.world.setBounds(0,0,levelData.width,levelData.height);
		
		ground = game.add.group();

		for(var i =0;i<parseInt(levelData.width) / 16;i++)
		{
			base = createGroupSprite(game, ground, base, 'block', 8 + 16 * i, 8);
			base = createGroupSprite(game, ground, base, 'block', 8 + 16 * i, parseInt(levelData.height) - 8);
		}
		
		for(var i =0;i<parseInt(levelData.height) / 16;i++)
		{
			base = createGroupSprite(game, ground, base, 'block', 8, 8 + 16 * i);
			base = createGroupSprite(game, ground, base, 'block',parseInt(levelData.width) - 8, 8 + 16 * i);
		}

		platforms = game.add.group();

		for (var i=0;i<levelData.platform.length;i++)
		{
			if(parseInt(levelData.platform[i].platformLength) % 16 == 0)
			{
				var l = parseInt(levelData.platform[i].platformLength) / 16;
			}
			else var l = Math.floor(parseInt(levelData.platform[i].platformLength / 16)) + 1;

			for(var j=0;j<l;j++)
			{
				platform = createGroupSprite(game, platforms, platform, 'block',parseInt(levelData.platform[i].startX) + 8 + 16 * j,parseInt(levelData.platform[i].startY));		
			}
		}

		enemyOneGroup = game.add.group();
		this.physics.arcade.enableBody(enemyOneGroup);

	    enemyTwoGroup = game.add.group();
		this.physics.arcade.enableBody(enemyTwoGroup);

		enemyBirdGroup = game.add.group();
		this.physics.arcade.enableBody(enemyBirdGroup);

	    for(var i=0;i<enemyData.level.length;i++)
	    {
	    	var arr = enemyData.level[i];
	    	if(arr.type == "bird")
	    	{
				enemy1 = EnemyBird(game,enemyBirdGroup,enemy1,'bird',parseInt(arr.x), parseInt(arr.y),i.toString());
	    	}
	    	else{
	    		if(arr.type == "one")
	    		{
	    			var enemy = enemyOneGroup.create(parseInt(arr.x),parseInt(arr.y),'enemy1');
	    		}
	    		else{
	    			var enemy = enemyTwoGroup.create(parseInt(arr.x),parseInt(arr.y),'enemy2');
	    		}
	    		this.physics.arcade.enable(enemy);
				enemy.body.collideWorldBounds = true;
				enemy.name = i.toString();
				flagEnemy[i.toString()] = 0;
				enemy.body.velocity.x = parseInt(arr.velocity);
	    	}
	    }

	    enemyOneGroup.callAll('animations.add', 'animations', 'run', [0,1],5,true);
	    enemyOneGroup.callAll('animations.add', 'animations', 'die', [2]);
	    enemyOneGroup.callAll('play', null, 'run');
	    
	    enemyTwoGroup.callAll('animations.add', 'animations', 'run', [0,1],2,true);
	    enemyTwoGroup.callAll('play', null, 'run');

		// soundJump = game.add.sound('jump');
		// soundPowerUp = game.add.sound('powerup');

		// map = this.add.tilemap('map',16,16);
		// map.addTilesetImage('tileset');
		// layer = map.createLayer(0);
		// layer.resizeWorld();

		// map.setCollision([1,2,57]);

		style1 = { font: "6px", fill: "#ffffff", align: "center"};

		player = this.add.sprite(80,210,'player');
		player.anchor.setTo(0.5,0.5);
		player.animations.add('idle',[0,1],1,true);
		player.animations.add('jump',[2],1,true);
		player.animations.add('run',[3,4,5,6,7,8],7,true);
		this.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;

		game.renderer.renderSession.roundPixels = true
		
		tunnelReverse = game.add.sprite(0,192,'tunnelReverse');
		this.physics.arcade.enable(tunnelReverse);
		tunnelReverse.body.allowGravity = false;
		tunnelReverse.body.immovable = true;

		coins = game.add.group();
	    this.physics.arcade.enableBody(coins);

	    for(i=0;i<coinData.level.length;i++)
	    {
		    coin = createGroupSprite(game,coins,coin,coinData.key,parseInt(coinData.preLevel[i].x),parseInt(coinData.preLevel[i].y));	
	    }

		controls = this.input.keyboard.createCursorKeys();

		// index = 0;

		
		indexCloud = 0;
		indexMines = 0;
		indexHoarding = 0;
		startCloudCreate = {};
		startMinesCreate = {};
		startHoardingCreate = {};
		flagHoardingStart = {};
		flagCloudStart = {};
		flagMinesStart = {};
		startCloudCreate[indexCloud] = 1;
		startMinesCreate[indexMines] = 1;
		startHoardingCreate[indexHoarding] = 1;
		flagHoardingStart[indexHoarding] = 0;
		flagCloudStart[indexCloud] = 0;
		flagMinesStart[indexMines] = 0;

		nuts = game.add.group();
		nuts.enableBody = true;
		nuts.physicsBodyType = Phaser.Physics.ARCADE;
		nuts.createMultiple(5,'nut');

		nuts.setAll('anchor.x',0.5);
		nuts.setAll('anchor.y',0.5);

		nuts.setAll('scale.x',0.5);
		nuts.setAll('scale.y',0.5);

		nuts.setAll('outofBoundsKill',true);
		nuts.setAll('checkWorldBounds',true);

		scoreText = game.add.text(24, 24, 'Score:' + score, { fontSize: '32px', fill: '#000' });
		scoreText.fixedToCamera = true;

		soundNew.play();
	},

	update:function(game){
		this.physics.arcade.collide(player,ground);
		this.physics.arcade.collide(player,platforms);
		this.physics.arcade.collide(player,box,checkAnswer);
		this.physics.arcade.collide(player,enemyBirdGroup,resetPlayer);
		this.physics.arcade.overlap(player,coins,getCoin);
		this.physics.arcade.overlap(enemyBirdGroup,nuts,killEnemy);
		this.physics.arcade.collide(player,dynamiteBoxes);
		this.physics.arcade.collide(player,handles,handleTween);
		this.physics.arcade.collide(mineEnemy,ground);
		this.physics.arcade.collide(player,wall);
		this.physics.arcade.collide(player,mineEnemy,reset);
		this.physics.arcade.overlap(player,groupWords,collectWords);
		this.physics.arcade.collide(player,tunnelReverse);
		this.physics.arcade.collide(player,enemyOneGroup,collideEnemyOne);
		this.physics.arcade.collide(enemyOneGroup,ground);
		this.physics.arcade.collide(enemyOneGroup,platforms);
		this.physics.arcade.collide(enemyTwoGroup,ground);
		this.physics.arcade.collide(enemyTwoGroup,platforms);
		this.physics.arcade.collide(player,enemyTwoGroup,resetPlayer);

		player.body.velocity.x = 0;

		game.camera.focusOnXY(player.x + 100,player.y);

		if(indexCloud == 0 || indexMines == 0 || indexHoarding == 0)
		{
			tunnelReverse.bringToTop();
		}

		if(indexCloud < cloudData.length)
		{
			if(startCloudCreate[indexCloud] == 1 && flagCloudStart[indexCloud] == 0)
			{
				flagCloudStart[indexCloud] = 1;
				flagCloudStart[indexCloud + 1] = 0;
				console.log("cloud",indexCloud);
				if(cloudData[indexCloud].level == "Level")
				{
					componentFallingWords(game,indexCloud);				
				}
				else{
					indexCloud++;
					startCloudCreate[indexCloud] = 1;
				}
			}	
		}

		if(indexHoarding < hoardingData.length)
		{
			if(startHoardingCreate[indexHoarding] == 1 && flagHoardingStart[indexHoarding] == 0)
			{
				flagHoardingStart[indexHoarding] = 1;
				flagHoardingStart[indexHoarding + 1] = 0;
				// console.log(indexHoarding,hoardingData,startHoardingCreate,flagHoardingStart);
				console.log("hoarding",indexHoarding);
				if(hoardingData[indexHoarding].level == 'Level')
				{
					componentHoarding(game,indexHoarding);				
				}
				else{
					indexHoarding++;
					startHoardingCreate[indexHoarding] = 1;
				}
			}	
		}

		if(indexMines < minesData.length)
		{
			if(startMinesCreate[indexMines] == 1 && flagMinesStart[indexMines] == 0)
			{
				flagMinesStart[indexMines] = 1;
				flagMinesStart[indexMines + 1] = 0;
				console.log("Mines",indexMines);
				if(minesData[indexMines].level == "Level")
				{
					componentMines(game,indexMines);				
				}
				else{
					indexMines++;
					startMinesCreate[indexMines] = 1;
				}
			}	
		}

		if(player.x >= startX && flagPlayer == 0)
		{
			flagPlayer = 1;
			console.log(player.x,flagPlayer);
			cloudTween.start();
		}

		if(indexWord == words.length)
		{
			cloudTween.stop();
			flagPlayer = 2;
		}
		if(indexWord == words.length && this.time.now > completeTime)
		{		
			startCloudCreate[getCloudI + 1] = 1;
			var componentText = addText(game,questionTextWords.x, this.world.centerY,'Task Completed',styleText);
			soundPowerUp.play();
			indexWord++;
		}

		if(flagPlayer == 1)
		{
			startFallingWords(cloud);
		}

		if(isWrongAnswer == true)
		{
			isWrongAnswer = false;
			componentText = addText(getGame,Math.floor(sprite.x + sprite.width / 2), Math.floor(sprite.y + sprite.height + 29),'Wrong Answer! Try Again',style1,textGroup);
		}

		if(flagBox == 1)
		{
			flagBox = 0;
			hoardingTaskCompleted();
		}

		if(flag2 == 1)
		{
			flag2 = 0;
			mineTaskCompleted();
		}

		if(controls.up.isDown && (player.body.onFloor() || player.body.touching.down) && this.time.now > jumpTimer){
			player.animations.play('jump');
			soundJump.play();
			player.body.velocity.y = -400;
			jumpTimer = this.time.now + 750;
		}
		else if(controls.right.isDown){
			player.animations.play('run');
			player.scale.setTo(1,1);
			player.body.velocity.x += playerSpeed;
		}
		else if(controls.left.isDown){
			player.animations.play('run');
			player.scale.setTo(-1,1);
			player.body.velocity.x -= playerSpeed;
		}
		else if(controls.down.isDown){
    		shootNut();
    	}
		else {
        	player.animations.play('idle');
    	}
	},
}