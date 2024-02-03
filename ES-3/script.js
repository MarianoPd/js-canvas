(()=>{
    const app = $('#app');

    const title = $('<h1>');
    title.addClass('app-title');
    title.html('FORM');
    app.append(title);
    const form =  $('<form>');
    //form.attr("action", "submit");
    app.append(form);
    const subButt= $('<button>');
    subButt.html('Submit');
    subButt.attr("type", "submit");
    subButt.attr("value", "submit");
    subButt.attr("name", "submit");
    
    form.append(subButt);
    //form.attr('action', 'POST');
    form.submit( e =>{
        e.preventDefault();
        let formD = new FormData(e.target);
        submit(formD);
        form[0].reset();
    });
    form.attr('method', 'POST');
    let data = [];
    
    getData();
    showForm();

    function submit(data){
        let json = JSON.stringify(Object.fromEntries(data));;
        console.log(json);
        sendData(json);
        form[0].reset();
    }


    function showForm(){
        let inputs = data.inputs;
        for(let el in inputs){
        
            let label = $('<label>');
            label.html(inputs[el].label);
            label.attr('for', inputs[el].name)

            if(inputs[el].type === 'select'){
                let field = $('<select>');
                field.attr('name', inputs[el].name);
                if(inputs[el].required) field.prop("required", true);
                let options = inputs[el].options;
                for(let i in options){
                    let opt = $('<option>');
                    opt.attr("value", options[i]);
                    opt.html(options[i]);
                    field.append(opt);
                }
                form.append(label);
                form.append(field);
                continue;
            }
            let field = $('<input>');
            field.attr("type", inputs[el].type);
            field.attr('name', inputs[el].name);
            if(inputs[el].required) field.prop("required", true);
            if(inputs[el].max > 0 && inputs[el].type !== 'number'){
                field.attr("minlength", inputs[el].min);
                field.attr("maxlength", inputs[el].max);
            }else if(inputs[el].max > 0 && inputs[el].type === 'number'){
                field.attr("min", inputs[el].min);
                field.attr("max", inputs[el].max);
            }
            form.append(label);
            form.append(field);
        }; 
    }

    function getData(){
        $.ajax({
            url: 'server.php',
            type: 'post',
            data: { getData: "1"},
            success: function(response) { 
                data = $.parseJSON(response)[0]; 
                console.log(response, typeof(resonse));
                console.log(data);
                showForm();
            },
            error: () => {console.log('error getData');}
        });
    }

    function sendData(data){
        $.ajax({
            url: 'server.php',
            type: 'post',
            data: { sendData: "1", dataToPost: data},
            success: (e) =>{ console.log(e);},
            error: () => {console.log('error sendData');}
        })
    }
})()