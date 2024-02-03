<?php
   
    if (isset($_POST['getData'])) {
        
        echo json_encode(genSin($_POST['delta'],$_POST['height'],$_POST['width'],$_POST['orient'] ));
    }


    function genSin($delta, $height, $width, $orientation){
        $wave = [];
        
        for($i = 0; $i < $width; $i+=5){
            $xy =[];
            $xy[] = $i;
            $xy[] = ($height/2 ) + $height/3 * (sin($i/20 + $delta) * $orientation);
            $wave[] = $xy;
        }
        
        return $wave;
    }

?>