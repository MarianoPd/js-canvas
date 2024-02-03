<?php
    
    $x = rand(25,975);
    $y = rand(25,475);
    $myJSON = [ 'x'=> $x, 'y'=> $y];

    echo json_encode($myJSON);

?>