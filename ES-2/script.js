(()=>{
    const app = $('#app');

    const title = $('<h1>');
    title.addClass('app-title');
    title.html('NOTES');
    app.append(title);

    const saveBtn = $('<button>');
    saveBtn.html('SAVE');
    saveBtn.click(createNote);
    app.append(saveBtn);

    const form = document.createElement('form');
    form.classList += 'form';

    const newNote = document.createElement('textarea');
    newNote.classList += 'textarea w-100';
    form.append(newNote);

    app.append(form);
    const noteContainer = document.createElement('div');
    app.append(noteContainer);


    var storage = [] ;
    getData();
    
    const accessKey = 'MarianoWasHere6';

    function getData(){
        $.ajax({
            url: 'server.php',
            type: 'post',
            data: { getData: "1"},
            success: function(response) { 
                storage = [];
                storage= $.parseJSON(response); 
                
                showNotes();
            },
            error: () => {console.log('error getData');}
        });
    }

    function postData(){
        let json = JSON.stringify(storage);
        console.log(json);
        $.ajax({
            url: 'server.php',
            type: 'post',
            data: {postData: '1', dataToPost: json},
            success: () => {getData()},
            error: () => {console.log('error postData');}
        });
    }

    function showNotes(){
        noteContainer.innerHTML= '';
        console.log(storage);
        for(let i=0; i < storage.length; i++) {
            console.log(storage[i]);
            let note = document.createElement('div');
            let text= document.createElement('textarea');
            text.classList += 'textarea';
            text.innerHTML = storage[i].text;
            note.append(text);
                
            let modifyBtn = document.createElement('button');
            modifyBtn.innerHTML = 'MODIFY';
            modifyBtn.addEventListener('click',()=>{
                modifyNote(storage[i].index, text); 
            });
            note.append(modifyBtn);
                
            let deleteBtn = document.createElement('button');
            deleteBtn.innerHTML = 'DELETE';
            deleteBtn.addEventListener('click',()=>{
                deleteNote(storage[i].index, text);
                
            });
            note.append(deleteBtn);
            noteContainer.append(note);   
               
        }
        
    }

    function createNote(){
        let note = newNote.value;
        newNote.value = '';
        let newIndex;

        do{
            newIndex = randomBetween(100, 999);
        }
        while(storage.findIndex(x => x.index === newIndex) !== -1)
        
        let newText = {
             index: newIndex,
             text:  note,
         }
        storage.push(newText);
        postData();
        
    }

    function modifyNote(index, text){
        let note = storage.findIndex(x => x.index === index);
        storage[note].text = text.value;
        postData();
        
    }


    function deleteNote(index){
        let note = storage.findIndex(x => x.index === index);
        console.log(note);
        storage.splice(note,1);
        postData();
        
    }

    function randomBetween(min, max){
        return Math.floor((Math.random() * max) + min);
    }

})()