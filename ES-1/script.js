
(()=>{

    var position ;

    let circle = $('<div>');
    circle.addClass('circle');
    $('#app').append(circle);

    setInterval(()=>{
        getData();
        //console.log(position);
        circle.css("left", position.x);
        circle.css("top",position.y);
    },1000);
    
    
    
    function getData(){
        $.ajax({
            'url' : 'server.php',
            'type' : 'GET',
            'dataType' : 'JSON',
            'success' : function(data) {      
                
                position = data;

            },
            'error' : function(request,error)
            {
                alert("Request: "+JSON.stringify(request));
                console.log(error);
            }
        });
    }
    
})()    
    


