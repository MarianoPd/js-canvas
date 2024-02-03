<?php

    if (isset($_POST['getData'])) {
        echo $result['result'] = file_get_contents('data.json');
    }

    if (isset($_POST['sendData'])){
        $date = date("d-m-Y-H-i-s");
        $filename = "./forms/" . $date . ".json"; 
        $mydata = $_POST['dataToPost'];
        $txt = "John Doe\n";
        file_put_contents($filename, $mydata);
        echo 'file saved';
    }

?>