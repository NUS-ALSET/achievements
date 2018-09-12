function Simulation(config, bot1clb, bot2clb){
    this.config = config;
    this.bot1clb = bot1clb;
    this.bot2clb = bot2clb;
    if(!this.config.width||typeof this.config.width!="number"){
        this.config.width = 800;
    }
    if(!this.config.height||typeof this.config.height!="number"){
        this.config.height = 800;
    }
    if(!this.config.minGems||typeof this.config.minGems!="number"){
        this.config.minGems = 10;
    }
    if(!this.config.maxGems||typeof this.config.maxGems!="number"){
        this.config.maxGems = 20;
    }
    if(!this.config.time||typeof this.config.time!="number"){
        this.config.time = 90;
    }
    if(!this.config.speed||typeof this.config.speed!="number"){
        this.config.speed = 0.5;
    }
    if(!this.config.playerSize||typeof this.config.playerSize!="number"){
        this.config.playerSize = 30;
    }
    if(!this.config.collectiveSize||typeof this.config.collectiveSize!="number"){
        this.config.collectiveSize = 30;
    }
    if(!this.config.player1StartingPoint||typeof this.config.player1StartingPoint!="object"){
        this.config.player1StartingPoint = {x:10, y:10};
    }
    if(!this.config.player2StartingPoint||typeof this.config.player2StartingPoint!="object"){
        this.config.player2StartingPoint = {x:200, y:10};
    }
    if(!this.config.player2StartingDirection||typeof this.config.player2StartingDirection!="string"){
        this.config.player2StartingDirection = "right";
    }
    if(!this.config.player2StartingDirection||typeof this.config.player2StartingDirection!="string"){
        this.config.player2StartingDirection = "down";
    }

    this.collectives = [[],[]];
    this.generateCollectives();
    this.bots = [
        [
            {
                x:this.config.player1StartingPoint.x,
                y:this.config.player1StartingPoint.y
            },
            {
                x:this.config.player2StartingPoint.x,
                y:this.config.player2StartingPoint.y,
            }
        ],
        [
            {
                x:this.config.player1StartingPoint.x,
                y:this.config.player1StartingPoint.y
            },
            {
                x:this.config.player2StartingPoint.x,
                y:this.config.player2StartingPoint.y,
            }
        ]
    ];
    this.score = [0,0];
    this.controlInfo = {keyPressed:["up", "up"], current:[0,0]};
    this.direction = [[{down:true}, {right:true}],[{down:true}, {right:true}]];
    this.directionsArr = [{"up":true},{"down":true},{"left":true},{"right":true}];

    document.addEventListener('keydown', (e) => {
        var gamesQuant = 2;
        for(var gameId = 0; gameId < gamesQuant; gameId++){
            if(e.key==this.config['player'+(gameId+1)+'Keys'].up){
                this.controlInfo.keyPressed[gameId] = "up";
            }
            else if(e.key==this.config['player'+(gameId+1)+'Keys'].down){
                this.controlInfo.keyPressed[gameId] = "down";
            }
            else if(e.key==this.config['player'+(gameId+1)+'Keys'].left){
                this.controlInfo.keyPressed[gameId] = "left";
            }
            else if(e.key==this.config['player'+(gameId+1)+'Keys'].right){
                this.controlInfo.keyPressed[gameId] = "right";
            }
            else if(e.key==this.config['player'+(gameId+1)+'Keys'].switch){
                this.controlInfo.current[gameId]=(this.controlInfo.current[gameId]==0?1:0);
            }
        }
    });
}
Simulation.prototype.getDirections       = function(direction){
    var botsQuant = 2;
    var gamesQuant = 2;
    for(var gameId = 0; gameId < gamesQuant; gameId++){
        for(var botId = 0; botId < botsQuant; botId++){
            if(typeof direction[gameId][botId] === 'string'){
                switch(direction[gameId][botId].toUpperCase()){
                    case 'LEFT':
                        direction[gameId][botId] = {left:true};
                        break;
                    case 'RIGHT':
                        direction[gameId][botId] = {right:true};
                        break;
                    case 'UP':
                        direction[gameId][botId] = {up:true};
                        break;
                    case 'DOWN':
                        direction[gameId][botId] = {down:true};
                        break;
                }
            }
        }
    }
    return direction;
}
Simulation.prototype.simulate = function(){
    var bot1_1Data = {
        player:this.bots[0][0], collectives:this.collectives[0], direction: this.direction[0][0], index:0, config: this.config, gameId: 0, controlInfo: this.controlInfo
    };
    var bot1_2Data = {
        player:this.bots[0][1], collectives:this.collectives[0], direction: this.direction[0][1], index:1, config: this.config, gameId: 0, controlInfo: this.controlInfo
    };
    var bot2_1Data = {
        player:this.bots[1][0], collectives:this.collectives[1], direction: this.direction[1][0], index:0, config: this.config, gameId: 1, controlInfo: this.controlInfo
    };
    var bot2_2Data = {
        player:this.bots[1][1], collectives:this.collectives[1], direction: this.direction[1][1], index:1, config: this.config, gameId: 1, controlInfo: this.controlInfo
    };
    this.direction[0][0]=this.bot1clb(bot1_1Data);
    this.direction[0][1]=this.bot1clb(bot1_2Data);
    this.direction[1][0]=this.bot2clb(bot2_1Data);
    this.direction[1][1]=this.bot2clb(bot2_2Data);
    this.direction = this.getDirections(this.direction);
    var botsQuant = 2;
    var gamesQuant = 2;
    for(var gameId = 0; gameId < gamesQuant; gameId++){
        for(var botId = 0; botId < botsQuant; botId++){
            if(this.direction[gameId][botId]==undefined)
                this.direction[gameId][botId] = this.directionsArr[Math.floor(Math.random()*this.directionsArr.length)];
        }
    }
    this.collectCollectives();
    this.moveCharacters();
    this.generateCollectives();
    return {player1:this.score[0],player2:this.score[1], score:this.score, bots: this.bots, collectives: this.collectives, direction: this.direction};
}

Simulation.prototype.generateCollectives = function(){
    if(this.collectives[0].length > 0&&this.collectives[1].length > 0)
        return;
    this.collectives[0].forEach((item, index, self)=>{
        self[index] = JSON.stringify(item);
    });
    this.collectives[1].forEach((item, index, self)=>{
        self[index] = JSON.stringify(item);
    });
    var max = this.config.maxGems;
    var min = this.config.minGems;
    var gameWidth = this.config.width;
    var gameHeight = this.config.height;
    var size = this.config.collectiveSize;
    var playerSize = this.config.playerSize;
    var stonesQuant = Math.floor(Math.random() * (max - min + 1) + min);
    for (var i = 0; i < stonesQuant; i++) {
        var stoneObj = { x: 0, y: 0 };
        stoneObj.x =
            Math.floor(Math.random() * (gameWidth / playerSize -  - 0) + 0) * playerSize;
        stoneObj.y =
            Math.floor(Math.random() * (gameHeight / playerSize - 0) + 0) * playerSize;
        stoneObj.size = size;
        stoneObj = JSON.stringify(stoneObj);
        if(this.collectives[0].indexOf(stoneObj)==-1)
            this.collectives[0].push(stoneObj);
        if(this.collectives[1].indexOf(stoneObj)==-1)
            this.collectives[1].push(stoneObj);
    }
    this.collectives[0].forEach((item, index, self)=>{
        self[index] = JSON.parse(item);
    });
    this.collectives[1].forEach((item, index, self)=>{
        self[index] = JSON.parse(item);
    });
}
Simulation.prototype.moveCharacters = function(){
    var botsQuant = 2;
    var gamesQuant = 2;
    for(var gameId = 0; gameId < gamesQuant; gameId++){
        for(var botId = 0; botId < botsQuant; botId++){
            var direction = this.direction[gameId][botId];
            var bot = this.bots[gameId][botId];
            if(direction.up){
                bot.y -= this.config.speed;
                if(bot.y < 0)
                    bot.y = 0;
            }
            else if(direction.down){
                bot.y += this.config.speed;
                if(bot.y + this.config.playerSize > this.config.height)
                    bot.y = this.config.height - this.config.playerSize;
            }
            else if(direction.left){
                bot.x -= this.config.speed;
                if(bot.x < 0)
                    bot.x = 0;
            }
            else if(direction.right){
                bot.x += this.config.speed;
                if(bot.x + this.config.playerSize > this.config.width)
                    bot.x = this.config.width - this.config.playerSize;
            }
        }
    }
    if(this.bots[0][0].x==this.bots[0][1].x&&this.bots[0][0].y==this.bots[0][1].y){
        this.bots[0][0].x+=this.config.playerSize;
        this.bots[0][1].x-=this.config.playerSize;
        this.bots[0][0].y+=this.config.playerSize;
        this.bots[0][1].y-=this.config.playerSize;
    }
    if(this.bots[1][0].x==this.bots[1][1].x&&this.bots[1][0].y==this.bots[1][1].y){
        this.bots[1][0].x+=this.config.playerSize;
        this.bots[1][1].x-=this.config.playerSize;
        this.bots[1][0].y+=this.config.playerSize;
        this.bots[1][1].y-=this.config.playerSize;
    }
}
Simulation.prototype.collectCollectives = function(){
    var botsQuant = 2;
    var gamesQuant = 2;
    for(var gameId = 0; gameId < gamesQuant; gameId++){
        for(var botId = 0; botId < botsQuant; botId++){
            var bot = this.bots[gameId][botId];
            this.collectives[gameId] = this.collectives[gameId].filter((collective)=>{
                //this.score[gameId]++;
                if(
                    (collective.x < bot.x + this.config.playerSize &&
                    collective.x + this.config.playerSize > bot.x)&&
                    (collective.y < bot.y + this.config.playerSize &&
                    collective.y + this.config.playerSize > bot.y)
                ){
                    this.score[gameId]++;
                    return false;
                }
                return true;
            });
        }
    }
}

module.exports = Simulation;