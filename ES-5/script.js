(()=>{
    const app = $('#app');

    const title = $('<h1>');
    title.addClass('app-title');
    title.html('BiscuitCrash');
    app.append(title);
    const gameSize = 14;

    const password = 'myGameData';
    

    



    var gameData = {
        squares : new Array(gameSize).fill(0).map(() => new Array(gameSize).fill(0)),
        points: 0,
    }

    var myGameArea = {
        canvas : document.createElement("canvas"),
        colors : ['red', 'lime', 'blue', 'yellow'],
        interval : '',
        pause : false,
        begin : function(){
            this.canvas.width = 500;
            this.canvas.height = 500;
            this.canvas.classList += 'canvas';
            this.ctx = this.canvas.getContext("2d");
            app.append(this.canvas);
            let resetBtn = $('<button>');
            resetBtn.html('reset');
            resetBtn.addClass('reset');
            resetBtn.click(newGame);
            app.append(resetBtn);
        },

        start : function(){
            
            this.interval = setInterval(updateGameArea, 200);
            this.canvas.addEventListener('click', (e)=>{
                if(this.pause) return;
                let posX = this.findIndexes(e.offsetX);
                let posY = this.findIndexes(e.offsetY);
                if(gameData.squares[posX][posY].color === 'black'){
                    gameData.points += megaExplode(posX, posY);
                    //console.log(gameData.points);
                }else{
                    let tmp = checkPoints(posX, posY, 0);
                
                    if(tmp >= 3){
                        gameData.points += tmp;
                        explode(posX, posY);
                        drop();
                    }else{
                        defuse(posX, posY);
                    }
                    //console.log(gameData.points, tmp);
                }
                if(checkEnd()){
                    clearInterval(this.interval);
                    //console.log('interval cleared');
                    setEnd();
                    this.pause = true;
                    gameOver();
                }else{
                    setData();
                    
                }
                //console.log(gameData.squares);
            });
        },
        clear : function(){
            this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
        },

        findIndexes : function(pos){
            return Math.floor(pos / (this.canvas.width/ gameSize));
        },
    }

    

    function square(x, y, color = '') {
        if(color === ''){
            let prob = random(0,30);
            if(prob === 0){
                this.color = 'black';
            }else{
                this.color = myGameArea.colors[random(0,3)];
            }
        }else{
            this.color = color;
        }
        
        this.width = myGameArea.canvas.width/gameSize;
        this.height = this.width;
        
        this.update = function(){
            ctx = myGameArea.ctx;
            this.body = new Path2D();
            this.body.rect(this.x, this.y, this.width, this.height)
            ctx.fillStyle = this.color;
            ctx.fill(this.body);
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        };
        this.exploding = false;
        this.setPosX = (pos) =>{
            this.x = pos * this.width;
        }
        this.setPosY = (pos) =>{
            this.y = pos * this.width;
        }
        this.setPosX(x);
        this.setPosY(y);

    }
    
    function rebuildSquares(array){
        //console.log('rebuild');
        for(let i= 0; i<gameSize; i++){
            for(let j=0; j<gameSize; j++){
                let el = array[i][j]; 
                let x = Math.floor(el.x / (myGameArea.canvas.width/ gameSize));
                let y = Math.floor(el.y / (myGameArea.canvas.width/ gameSize));
                gameData.squares[i][j] = new square(x, y, el.color);
            }
        }
    }
    
    function setSquares(){
        //console.log('setsquares');
        for(let i= 0; i<gameSize; i++){
            for(let j=0; j<gameSize; j++){
                gameData.squares[i][j] = new square(i, j);
            }
        }
    }

    function checkPoints(X, Y, tmp){
        let posX = X;
        let posY = Y;
        let count = ++tmp;
        //console.log(posX, posY);
        let squares = gameData.squares;
        first = squares[posX][posY];
        color = first.color;
        if(color === "black") return (gameSize * 2) -1;
        squares[posX][posY].exploding = true;
        
        if(posX > 0){
             newPosX = posX-1;
             newPosY = posY;
            if(squares[newPosX][newPosY] !== null  &&
                squares[newPosX][newPosY].exploding !== true && 
                squares[newPosX][newPosY].color === color){
                    count = checkPoints(newPosX, newPosY, count);
            }  
        }
        if(posY > 0){
             newPosX = posX;
             newPosY = posY-1;
            if(squares[newPosX][newPosY] !== null &&
                squares[newPosX][newPosY].exploding !== true &&
                squares[newPosX][newPosY].color === color){
                   count = checkPoints(newPosX, newPosY, count);
            }  
        }
        if(posX < gameSize-1){
             newPosX = posX+1;
             newPosY = posY;
            if(squares[newPosX][newPosY] !== null && 
                squares[newPosX][newPosY].exploding !== true &&
                squares[newPosX][newPosY].color === color){
                   count = checkPoints(newPosX, newPosY, count);
            }  
        }
        if(posY < gameSize-1){
             newPosX = posX;
             newPosY = posY+1;
            if(squares[newPosX][newPosY] !== null &&
                squares[newPosX][newPosY].exploding !== true &&
                squares[newPosX][newPosY].color === color){
                   count = checkPoints(newPosX, newPosY, count);
            }  
        }
        
        return count;
         
        
    }

    function explode(X, Y){
        let posX = X;
        let posY = Y;
        let squares = gameData.squares;
        //console.log('explode');
        first = squares[posX][posY];
        color = first.color;
        squares[posX][posY] = null;
        
        if(posX > 0){
             newPosX = posX-1;
             newPosY = posY;
            if(squares[newPosX][newPosY] !== null  &&
                squares[newPosX][newPosY].exploding === true && 
                squares[newPosX][newPosY].color === color){
                    explode(newPosX, newPosY);
            }  
        }
        if(posY > 0){
             newPosX = posX;
             newPosY = posY-1;
            if(squares[newPosX][newPosY] !== null &&
                squares[newPosX][newPosY].exploding === true &&
                squares[newPosX][newPosY].color === color){
                   explode(newPosX, newPosY);
            }  
        }
        if(posX < gameSize-1){
             newPosX = posX+1;
             newPosY = posY;
            if(squares[newPosX][newPosY] !== null && 
                squares[newPosX][newPosY].exploding === true &&
                squares[newPosX][newPosY].color === color){
                   explode(newPosX, newPosY);
            }  
        }
        if(posY < gameSize-1){
             newPosX = posX;
             newPosY = posY+1;
            if(squares[newPosX][newPosY] !== null &&
                squares[newPosX][newPosY].exploding === true &&
                squares[newPosX][newPosY].color === color){
                   explode(newPosX, newPosY);
            }  
        }  
        
    }

    function defuse(X, Y){
        //console.log('defuse');
        let posX = X;
        let posY = Y;
        let squares = gameData.squares;
        first = squares[posX][posY];
        color = first.color;
        squares[posX][posY].exploding = false;
        
        if(posX > 0){
             newPosX = posX-1;
             newPosY = posY;
            if(squares[newPosX][newPosY] !== null  &&
                squares[newPosX][newPosY].exploding === true && 
                squares[newPosX][newPosY].color === color){
                    defuse(newPosX, newPosY);
            }  
        }
        if(posY > 0){
             newPosX = posX;
             newPosY = posY-1;
            if(squares[newPosX][newPosY] !== null &&
                squares[newPosX][newPosY].exploding === true &&
                squares[newPosX][newPosY].color === color){
                    defuse(newPosX, newPosY);
            }  
        }
        if(posX < gameSize-1){
             newPosX = posX+1;
             newPosY = posY;
            if(squares[newPosX][newPosY] !== null && 
                squares[newPosX][newPosY].exploding === true &&
                squares[newPosX][newPosY].color === color){
                    defuse(newPosX, newPosY);
            }  
        }
        if(posY < gameSize-1){
             newPosX = posX;
             newPosY = posY+1;
            if(squares[newPosX][newPosY] !== null &&
                squares[newPosX][newPosY].exploding === true &&
                squares[newPosX][newPosY].color === color){
                    defuse(newPosX, newPosY);
            }  
        }
        
    }


    function drop(){
        //console.log('drop');
        let squares = gameData.squares;
        for(let i = 0; i< gameSize; i++){
            for(let j = gameSize -1; j >=0; j--){
                if(squares[i][j] === null){
                    for(let k = j-1; k>=0; k--){
                        if(squares[i][k] !== null){
                            squares[i][j] = squares[i][k];
                            squares[i][j].setPosY(j); 
                            squares[i][k] = null;
                            break;
                        }
                    }
                }
            }
        }
        newDrop();
    }

    function newDrop(){
        //console.log('newDrop');
        for(let i = 0; i<gameSize ; i++){
            for(let j = gameSize-1; j >= 0; j--){
                if(gameData.squares[i][j] === null){
                    gameData.squares[i][j] = new square(i, j)
                }
            }
        }
    }

    function megaExplode(x,y){
        for(let i = 0; i<gameSize; i++){
            gameData.squares[x][i] = null;
            gameData.squares[i][y] = null;
        }
        drop();
        return (gameSize * 2) -1;
    }

    function updateGameArea(){
        myGameArea.clear();
        
        for(let i= 0; i<gameSize; i++){
            for(let j=0; j<gameSize; j++){
                if(gameData.squares[i][j]) gameData.squares[i][j].update();
            }
        }
        myGameArea.ctx.fillStyle = "black";
        myGameArea.ctx.font = "30px Arial";
        myGameArea.ctx.fillText(gameData.points.toString(), myGameArea.canvas.width - 70, 50);
    }

    function random(min, max){
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getData(){
        data = JSON.parse(localStorage.getItem(password));    
        //console.log(data);    
        if(data === null || data.squares.length !== gameData.squares.length ) return 0;
        
        gameData.points = data.points;
        rebuildSquares(data.squares);
        return 1;       
        
    }

    function setData(){
        localStorage.setItem(password, JSON.stringify(gameData));
        //data = localStorage.getItem(password)
        //console.log(JSON.parse(data), 'setdata');
    }

    function setEnd(){
        localStorage.setItem(password, null);
    }

    function checkEnd(){        
        for(let i = 0; i< gameSize; i++){
            for(let j = gameSize -1; j >=0; j--){
                if(checkPoints(i,j,0) >= 3){
                    defuse(i,j);
                    return false;
                }
                defuse(i,j);
            }
        }
        console.log('end');
        return true;        
    }

    function gameOver(){
        let canvas = myGameArea.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var overScreen = new Path2D(); 
        overScreen.rect(0,0,canvas.width,canvas.width);
        ctx.stroke(overScreen);
        ctx.fillStyle = "#292727";
        ctx.fill(overScreen);
        ctx.fillStyle = "#cc0000";
        ctx.font = "30px Arial";
        ctx.fillText("Game Over, retry! ", canvas.width/2 - 120, canvas.width/2 + 10);
        ctx.fillText(gameData.points.toString() + " Points", canvas.width/2 - 80, canvas.width/2 + 60);
        canvas.addEventListener('click',function handler(){
            newGame();
        }, {once: true});
        return;
    }

    function newGame(){
        gameData = {
            squares : new Array(gameSize).fill(0).map(() => new Array(gameSize).fill(0)),
            points: 0,
        }
        setSquares();
        setData();
        clearInterval(myGameArea.interval);
        myGameArea.interval = setInterval(updateGameArea, 5);
        
        myGameArea.pause = false;
        return;
    }
    run();
    
    function run(){
        
        startScreen();

        function startGame(){
            myGameArea.start();
            if(getData() === 0 ){
                setSquares() ; 
            }
        }

        
    
        function startScreen(){
            myGameArea.begin();
            let ctx = myGameArea.ctx;
            let canvas = myGameArea.canvas;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var startScreen = new Path2D(); 
            startScreen.rect(0,0,canvas.width,canvas.width);
            ctx.stroke(startScreen);
            ctx.fillStyle = "#66ccff";
            ctx.fill(startScreen);
    
            var startButton = new Path2D();
            btnW = 200;
            btnH = 100;
            startButton.rect(canvas.width/2-(btnW/2),canvas.width/2-(btnH/2),btnW,btnH);
            ctx.stroke(startButton);
            ctx.fillStyle = "#ffffcc";
            ctx.fill(startButton);
            ctx.fillStyle = "gray";
            ctx.font = "30px Arial";
            ctx.fillText("Start Game", canvas.width/2 - 80, canvas.width/2 + 10);
            
            canvas.addEventListener('click', (e) => {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                startGame();
            }, {once: true});
            
    
        }



    }
})()