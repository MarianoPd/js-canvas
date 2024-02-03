<?php
    // $array = [
    //     'ciao' => 22,
    // ];

    // $json = json_encode($array);

    // if(file_put_contents("data.json", $json)){
    //    // echo 'totto apposto';
    // }else{
    //     echo 'staminchia';
    // }

    if (isset($_POST['getData'])) {
        echo $result['result'] = file_get_contents('data.json');
    }

    if (isset($_POST['postData'])){
        file_put_contents("data.json", $_POST['dataToPost']);
    }

?>