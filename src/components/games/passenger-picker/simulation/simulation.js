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
    if(!this.config.minPassengers||typeof this.config.minPassengers!="number"){
        this.config.minPassengers = 10;
    }
    if(!this.config.maxPassengers||typeof this.config.maxPassengers!="number"){
        this.config.maxPassengers = 20;
    }
    if(!this.config.time||typeof this.config.time!="number"){
        this.config.time = 90;
    }
    if(!this.config.speed||typeof this.config.speed!="number"){
        this.config.speed = 0.1;
    }
    if(!this.config.playerSize||typeof this.config.playerSize!="number"){
        this.config.playerSize = 20;
    }
    if(!this.config.passengerSize||typeof this.config.passengerSize!="number"){
        this.config.passengerSize = 20;
    }
    if(!this.config.roadWidth||typeof this.config.roadWidth!="number"){
        this.config.roadWidth = 30;
    }
    if(!this.config.player1StartingPoint||typeof this.config.player1StartingPoint!="object"){
        this.config.player1StartingPoint = {x:10, y:10};
    }
    if(!this.config.player2StartingPoint||typeof this.config.player2StartingPoint!="object"){
        this.config.player2StartingPoint = {x:200, y:10};
    }
    if(!this.config.player1StartingDirection||typeof this.config.player1StartingDirection!="string"){
        this.config.player1StartingDirection = "right";
    }
    if(!this.config.player2StartingDirection||typeof this.config.player2StartingDirection!="string"){
        this.config.player2StartingDirection = "down";
    }
    this.collectives = [[],[]];
    this.bots = [
        [
            {
                x:this.config.player1StartingPoint.x,
                y:this.config.player1StartingPoint.y,
                passenger: null,
                path:[]
            },
            {
                x:this.config.player2StartingPoint.x,
                y:this.config.player2StartingPoint.y,
                passenger: null,
                path:[]
            }
        ],
        [
            {
                x:this.config.player1StartingPoint.x,
                y:this.config.player1StartingPoint.y,
                passenger: null,
                path:[]
            },
            {
                x:this.config.player2StartingPoint.x,
                y:this.config.player2StartingPoint.y,
                passenger: null,
                path:[]
            }
        ]
    ];
    this.score = [0,0];
    this.controlInfo = {keyPressed:["up", "up"], current:[0,0]};
    this.direction = [[{down:true}, {right:true}],[{down:true}, {right:true}]];
    this.directionsArr = [{"up":true},{"down":true},{"left":true},{"right":true}];
    this.mapSchema = [
        [1,1,1,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,1,0,0,0,0],
        [0,0,1,1,1,0,0,0,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0],
        [0,0,0,0,1,1,1,1,1,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,1,1,1,1,1,0,0,1,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,0,1,0,0,1,1,1,1,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0],
        [0,0,1,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0],
        [1,1,1,1,0,0,0,1,1,1,1,0,0,0,0,1,0,0,0,0,1,1,1,1,0,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,0],
        [0,0,0,1,1,0,0,1,0,0,1,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,1,1,1,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0],
        [1,1,1,1,1,0,0,1,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,1,0,0,0,1,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,1,1,1,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,1,1,1,0,0,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,1,0,0,0,1,0,0,1,0,0,1,0,0,0,0],
        [1,0,0,0,0,0,0,0,1,1,1,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,0,1,0,0,0,0,1,1,1,1,1,0,0,1,1,1,1,0,0,0,0],
        [1,1,1,1,1,1,1,1,1,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
        [0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,1,1,1,1,0,0,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,1,0,0,1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,1,1,1,0,0,0,0,1],
        [0,0,0,0,1,0,0,1,1,1,1,0,0,0,1,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,1,0,1,1,1,1,1,1]
    ];
    this.generateMap();
    this.generateCollectives();

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
Simulation.prototype.clearPath = function(){
    var botsQuant = 2;
    var gamesQuant = 2;
    for(var gameId = 0; gameId < gamesQuant; gameId++){
        for(var botId = 0; botId < botsQuant; botId++){
            if(
                this.bots[gameId][botId].path.length>0&&
                this.bots[gameId][botId].x==this.bots[gameId][botId].path[this.bots[gameId][botId].path.length-1].x*this.config.roadWidth&&
                this.bots[gameId][botId].y==this.bots[gameId][botId].path[this.bots[gameId][botId].path.length-1].y*this.config.roadWidth
            ){
                this.bots[gameId][botId].path.pop();
            }
        }
    }
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
Simulation.prototype.simulate            = function(){
    var bot1_1Data = {
        player:this.bots[0][0], collectives:this.collectives[0], direction: this.direction[0][0], index:0, map: this.map[0], config: this.config, controlInfo: this.controlInfo, gameId: 0
    };
    var bot1_2Data = {
        player:this.bots[0][1], collectives:this.collectives[0], direction: this.direction[0][1], index:1, map: this.map[0], config: this.config, controlInfo: this.controlInfo, gameId: 0
    };
    var bot2_1Data = {
        player:this.bots[1][0], collectives:this.collectives[1], direction: this.direction[1][0], index:0, map: this.map[1], config: this.config, controlInfo: this.controlInfo, gameId: 1
    };
    var bot2_2Data = {
        player:this.bots[1][1], collectives:this.collectives[1], direction: this.direction[1][1], index:1, map: this.map[1], config: this.config, controlInfo: this.controlInfo, gameId: 1
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
    this.getTakeOfPassengers();
    this.moveCharacters();
    this.generateCollectives();
    this.clearPath();
    
    return {player1:this.score[0], player2:this.score[1], score:this.score, bots: this.bots, collectives: this.collectives, map: this.map[0], direction: this.direction};
}
Simulation.prototype.generateMap         = function(){
    var mapHeight = Math.ceil(this.config.height/this.config.roadWidth);
    var mapWidth = Math.ceil(this.config.width/this.config.roadWidth);
    this.map = [
        new Array(mapHeight), 
        new Array(mapHeight)
    ];
    for(var i=0;i<mapHeight;i++){
        if(this.map[0][i]===undefined){
            this.map[0][i] = new Array(mapWidth);
            this.map[1][i] = new Array(mapWidth);
        }
        for(var j=0;j<mapWidth;j++){
            if(this.mapSchema[i][j]){
                this.map[0][i][j] = new Cell(j,i);
                this.map[1][i][j] = new Cell(j,i);
            }
        }
    }
    for(var i=0;i<mapHeight;i++){
        for(var j=0;j<mapWidth;j++){
            if(this.map[0][i][j]){
                this.map[0][i][j].addNeighbors(this.map[0]);
                this.map[1][i][j].addNeighbors(this.map[1]);
            }
        }
    }
}
Simulation.prototype.generateCollectives = function(){
    if(this.collectives[0].length>0&&this.collectives[1].length>1)
        return;
    var passengersQuant = Math.floor(Math.random() * (this.config.maxPassengers - this.config.minPassengers + 1) + this.config.minPassengers);
    for (var i = 0; i < passengersQuant; i++) {
        var passenger = new Passenger();
        passenger.setRandomPos(this.map[0], this.config.roadWidth);
        var unique = true;
        this.collectives[0].forEach(collective=>{
            if(collective.x == passenger.x&&collective.y == passenger.y)
                unique = false;
        });
        if(unique){
            this.collectives[0].push(passenger);
            this.collectives[1].push(passenger);
        }
        
    }
}
Simulation.prototype.moveCharacters      = function(){
    var botsQuant = 2;
    var gamesQuant = 2;
    for(var gameId = 0; gameId < gamesQuant; gameId++){
        for(var botId = 0; botId < botsQuant; botId++){
            var direction = this.direction[gameId][botId];
            var bot = this.bots[gameId][botId];
            if(direction.up&&this.isInsideRoad(this.direction[gameId][botId],gameId,botId)){
                bot.y -= this.config.speed;
                if(bot.y < 0)
                    bot.y = 0;
            }
            else if(direction.down&&this.isInsideRoad(this.direction[gameId][botId],gameId,botId)){
                bot.y += this.config.speed;
                if(bot.y + this.config.playerSize > this.config.height)
                    bot.y = this.config.height - this.config.playerSize;
            }
            else if(direction.left&&this.isInsideRoad(this.direction[gameId][botId],gameId,botId)){
                bot.x -= this.config.speed;
                if(bot.x < 0)
                    bot.x = 0;
            }
            else if(direction.right&&this.isInsideRoad(this.direction[gameId][botId],gameId,botId)){
                bot.x += this.config.speed;
                if(bot.x + this.config.playerSize > this.config.width)
                    bot.x = this.config.width - this.config.playerSize;
            }
        }
    }
}
Simulation.prototype.isInsideRoad = function(direction, gameId, botId){
    if(direction.up){
        var row1Id = Math.floor( (this.bots[gameId][botId].y-1)/this.config.roadWidth );
        var col1Id = Math.floor( this.bots[gameId][botId].x/this.config.roadWidth );
    }
    else if(direction.down){
        var row1Id = Math.floor( (this.bots[gameId][botId].y+this.config.playerSize)/this.config.roadWidth );
        var col1Id = Math.floor( this.bots[gameId][botId].x/this.config.roadWidth );
    }
    else if(direction.left){
        var row1Id = Math.floor( this.bots[gameId][botId].y/this.config.roadWidth );
        var col1Id = Math.floor( (this.bots[gameId][botId].x-1)/this.config.roadWidth );
    }
    else if(direction.right){
        var row1Id = Math.floor( this.bots[gameId][botId].y/this.config.roadWidth );
        var col1Id = Math.floor( (this.bots[gameId][botId].x+this.config.playerSize)/this.config.roadWidth );
    }

    if(direction.up){
        var row2Id = Math.floor( (this.bots[gameId][botId].y-1)/this.config.roadWidth );
        var col2Id = Math.floor( (this.bots[gameId][botId].x+this.config.playerSize-1)/this.config.roadWidth );
    }
    else if(direction.down){
        var row2Id = Math.floor( (this.bots[gameId][botId].y+this.config.playerSize)/this.config.roadWidth );
        var col2Id = Math.floor( (this.bots[gameId][botId].x+this.config.playerSize-1)/this.config.roadWidth );
    }
    else if(direction.left){
        var row2Id = Math.floor( (this.bots[gameId][botId].y+this.config.playerSize-1)/this.config.roadWidth );
        var col2Id = Math.floor( (this.bots[gameId][botId].x-1)/this.config.roadWidth );
    }
    else if(direction.right){
        var row2Id = Math.floor( (this.bots[gameId][botId].y+this.config.playerSize-1)/this.config.roadWidth );
        var col2Id = Math.floor( (this.bots[gameId][botId].x+this.config.playerSize)/this.config.roadWidth );
    }

    if(
        this.map[gameId][row1Id]&&this.map[gameId][row1Id][col1Id]&&
        this.map[gameId][row2Id]&&this.map[gameId][row2Id][col2Id]
    )
        return true;
    return false;
}
Simulation.prototype.getTakeOfPassengers = function(){
    var botsQuant = 2;
    var gamesQuant = 2;
    for(var gameId = 0; gameId < gamesQuant; gameId++){
        var collectives = this.collectives[gameId];
        for(var botId = 0; botId < botsQuant; botId++){
            var bot = this.bots[gameId][botId];
            if(bot.passenger==null){
                for(var i=collectives.length-1;i>=0;i--){
                    var collective = collectives[i];
                    if(
                        (collective.x                            < bot.x + this.config.playerSize &&
                        collective.x + this.config.passengerSize > bot.x                        ) &&
                        (collective.y                            < bot.y + this.config.playerSize &&
                        collective.y + this.config.passengerSize > bot.y                        )
                    ){
                        bot.passenger = collective;
                        this.collectives[gameId].splice(i,1);
                    }
                }
            }
            else{
                var takeof = {x:bot.passenger.takeofX, y:bot.passenger.takeofY};
                if(
                    (takeof.x                             < bot.x + this.config.playerSize &&
                    takeof.x + this.config.passengerSize > bot.x                        ) &&
                    (takeof.y                             < bot.y + this.config.playerSize &&
                    takeof.y + this.config.passengerSize > bot.y                        )
                ){
                    this.score[gameId]++;
                    bot.passenger = null;
                }
            }
        }
    }
}
function Cell(x,y){
    this.x=x;
    this.y=y;
    this.f=0;
    this.g=0;
    this.b=0;
    this.neighbors = [];
    this.previous = [undefined,undefined];
}
Cell.prototype.addNeighbors = function(map){
    var x = this.x;
    var y = this.y;
    var rows = map.length;
    var cols = map[0].length;
    if(map[y+1]&&map[y+1][x]){
        this.neighbors.push(map[y+1][x]);
    }
    if(map[y-1]&&map[y-1][x]){
        this.neighbors.push(map[y-1][x]);
    }
    if(map[y]&&map[y][x+1]){
        this.neighbors.push(map[y][x+1]);
    }
    if(map[y]&&map[y][x-1]){
        this.neighbors.push(map[y][x-1]);
    }
}
Simulation.prototype.findShortestPath = function(arr, pointA, pointB, charId){
    var heuristic = function (a,b){
        var x = a.x - b.x;
        var y = a.y - b.y;
        var d = Math.sqrt( x*x + y*y );
        return d;
    };
    var removeFromArray = function(array,elt){
        for(var i = array.length-1; i>=0; i--){
            if(array[i] == elt){
                array.splice(i,1);
            }
        }
    };
    var cellPointA = arr[pointA.y][pointA.x];
    var cellPointB = arr[pointB.y][pointB.x];
    var openSet = [];
    var closeSet = [];
    var path = [];
    var current = cellPointA;
    openSet.push(cellPointA);
    //searching path function started here
    while(openSet.length>0){
        var winner = 0;
        for(var i=0; i < openSet.length; i++){
            if(openSet[i].f < openSet[winner].f){
                winner = i;
            }
        }
        var current = openSet[winner];
        if(current === cellPointB){
            var temp = current;
            path.push(temp);
            while(temp.previous[charId]){
                path.push(temp.previous[charId]);
                temp = temp.previous[charId];
            }
            for(var i=0;i<arr.length;i++){
                for(var j=0;j<arr[0].length;j++){
                    if(arr[i][j]){
                        arr[i][j].previous[charId]=undefined;
                    }
                }
            }
            return path;
        }
        removeFromArray(openSet,current);
        closeSet.push(current);
        var neighbors = current.neighbors;
        for(var i=0; i < neighbors.length; i++){
            var neighbor = neighbors[i];
            if(!closeSet.includes(neighbor) && !neighbor.wall){
                var tempG = current.g+1;
                var newPath = false;
                if(openSet.includes(neighbor)){
                    if(tempG<neighbor.g){
                        neighbor.g = tempG;
                        newPath = true;
                    }
                }
                else{
                    neighbor.g = tempG;
                    newPath = true;
                    openSet.push(neighbor);
                }
                if(newPath){
                    neighbor.h = heuristic(neighbor, cellPointB);
                    neighbor.f = neighbor.g + neighbor.h;
                    neighbor.previous[charId] = current;
                }
            }
        }
    }
}
function Passenger(){
    this.x = 0;
    this.y = 0;
    this.takeofX = 0;
    this.takeofY = 0;
}
Passenger.prototype.setRandomPos = function(arr, width){
    this.x = Math.floor(Math.random()*(arr[0].length-1));
    this.y = Math.floor(Math.random()*(arr.length-1));
    while(!arr[this.y]||!arr[this.y][this.x]){
        this.x = Math.floor(Math.random()*(arr[0].length-1));
        this.y = Math.floor(Math.random()*(arr.length-1));
    }
    this.takeofX = Math.floor(Math.random()*(arr[0].length-1));
    this.takeofY = Math.floor(Math.random()*(arr.length-1));
    while(!arr[this.takeofY]||!arr[this.takeofY][this.takeofX]){
        this.takeofX = Math.floor(Math.random()*(arr[0].length-1));
        this.takeofY = Math.floor(Math.random()*(arr.length-1));
    }
    this.x = this.x*width;
    this.y = this.y*width;
    this.takeofX = this.takeofX*width;
    this.takeofY = this.takeofY*width;
}
module.exports = Simulation;