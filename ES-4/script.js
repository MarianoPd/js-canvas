(()=>{
    const app = $('#app');

    const title = $('<h1>');
    title.addClass('app-title');
    title.html('oscilloscope');
    app.append(title);
    
    const canvas = $('<canvas>').get(0);
    canvas.classList +='canvas';
    app.append(canvas);
    canvas.setAttribute('width',700);
    canvas.setAttribute('height',300);
    var ctx = canvas.getContext("2d");


    var delta = 0;
    var started = false;
    var myInterval;
    var orientation = 1;
    const buttons = $('<div>');
    buttons.addClass('button-container');
    app.append(buttons);
    const startBtn = $('<button>');
    startBtn.html('Start/Stop');
    startBtn.addClass('start');
    startBtn.click(() =>{
        if(!started){
            started = true; 
            myInterval = setInterval(() =>(getData()), 1000);
            startBtn.addClass('started')
        }else{
            started = false;
            clearInterval(myInterval);
            startBtn.removeClass('started');
        }
        
    });
    buttons.append(startBtn);
    const invertBtn = $('<button>');
    invertBtn.html('Invert');
    invertBtn.addClass('start');
    invertBtn.click(()=>{
        if(orientation === 1){
            orientation = -1;
        }else{
            orientation = 1;
        }

    });
    buttons.append(invertBtn);



    function drawWave(datas){
        let x = canvas.width;
        let y = canvas.height;
        ctx.clearRect(0, 0, x, y);
        ctx.beginPath();
        ctx.strokeStyle = "red";
        ctx.moveTo(0,y/2);
        ctx.lineTo(x, y/2);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.strokeStyle = "#B2FF66";
        for(i in datas){
            ctx.lineTo(datas[i][0],datas[i][1]);  
            //((y/2) + y/2* Math.sin(((i+-y/2)/90)*Math.PI))
            // y = height/2 + amplitude* Math.sin(x/frequency);
            ctx.stroke();
        }
        
    }

    function getData(){
        $.ajax({
            url: 'server.php',
            type: 'post',
            data: { getData: "1", width: canvas.width, height: canvas.height, delta: delta, orient: orientation},
            success: function(res) { 
                drawWave(JSON.parse(res));
                
                delta-=1;
                delta %= 100;
            },
            error: () => {console.log('error getData');}
        });
    }

})()