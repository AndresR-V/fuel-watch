<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require "BD.php";

$bd = new BD();



if (isset($_GET["buscar"])) {

    $target = $_GET['target'];

    if (is_int($target)) {
        $respuesta = $bd->getDatafromCp($target);
    } else {
        $respuesta = $bd->getDatafromLocalidad($target);
    }

    // var_dump($respuesta);


    echo json_encode($respuesta, JSON_FORCE_OBJECT);
}

if (isset($_GET["actualizar"])) {


    $datos = getRest("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/");

    $array_EESS  = [];
    $array_historico = [];



    $ListaEESSPrecio        = $datos['ListaEESSPrecio'];
    $bd  = new BD();

    $c = 0;
    foreach ($ListaEESSPrecio as $eess) {
        array_push($array_EESS, [
            (int)$eess['IDEESS'],
            $eess['Rótulo'],
            $eess['Horario'],
            (float)str_replace(",", ".", $eess['Precio Gasoleo A']),
            (float)str_replace(",", ".", $eess['Precio Gasoleo Premium']),
            (float)str_replace(",", ".", $eess['Precio Gasolina 95 E5']),
            (float)str_replace(",", ".", $eess['Precio Gasolina 98 E5']),
            $eess['Dirección'],
            $eess['Provincia'],
            $eess['Localidad'],
            $eess['C.P.'],
            $eess['Longitud (WGS84)'],
            $eess['Latitud'],
            date('Y-m-d H:i:s')
        ]);


        $array_historico[(int)$eess['IDEESS']] = [
            (float)str_replace(",", ".", $eess['Precio Gasoleo A']),
            (float)str_replace(",", ".", $eess['Precio Gasoleo Premium']),
            (float)str_replace(",", ".", $eess['Precio Gasolina 95 E5']),
            (float)str_replace(",", ".", $eess['Precio Gasolina 98 E5']),
        ];
    }

    if ($bd->addServiceStations($array_EESS)) echo 'añadidas correctamente';

    if ($bd->addHistorico(date('Y-m-d'), $datos_json)) echo 'histórico añadido correctamente';
}

if (isset($_GET["estadisticas"])) {
    $target = $_GET['target'];

    $sum_diesel         =  ($bd->getPriceSum('precio_diesel', $target))[0];
    $sum_diesel_extra   =  ($bd->getPriceSum('precio_diesel_extra', $target))[0];
    $sum_gasolina_95    =  ($bd->getPriceSum('precio_gasolina_95', $target))[0];
    $sum_gasolina_98    =  ($bd->getPriceSum('precio_gasolina_98', $target))[0];


    $avg_diesel       =  round($sum_diesel[0]        / ($bd->getPriceCount('precio_diesel', $target))[0], 2);
    $avg_diesel_extra =  round($sum_diesel_extra[0]  / ($bd->getPriceCount('precio_diesel_extra', $target))[0], 2);
    $avg_gasolina_95  =  round($sum_gasolina_95[0]   / ($bd->getPriceCount('precio_gasolina_95', $target))[0], 2);
    $avg_gasolina_98  =  round($sum_gasolina_98[0]   / ($bd->getPriceCount('precio_gasolina_98', $target))[0], 2);

    $max_diesel         =  round(($bd->getPriceLimit('precio_diesel', $target, 'MAX'))[0], 2);
    $max_diesel_extra   =  round(($bd->getPriceLimit('precio_diesel_extra', $target, 'MAX'))[0], 2);
    $max_gasolina_95    =  round(($bd->getPriceLimit('precio_gasolina_95', $target, 'MAX'))[0], 2);
    $max_gasolina_98    =  round(($bd->getPriceLimit('precio_gasolina_98', $target, 'MAX'))[0], 2);

    $min_diesel         =  round(($bd->getPriceLimit('precio_diesel', $target, 'MIN'))[0], 2);
    $min_diesel_extra   =  round(($bd->getPriceLimit('precio_diesel_extra', $target, 'MIN'))[0], 2);
    $min_gasolina_95    =  round(($bd->getPriceLimit('precio_gasolina_95', $target, 'MIN'))[0], 2);
    $min_gasolina_98    =  round(($bd->getPriceLimit('precio_gasolina_98', $target, 'MIN'))[0], 2);

    // echo ("precio máximo diesel en  $target :  $max_diesel € <br>");
    // echo ("precio mínimo diesel en  $target :  $min_diesel € <br>");
    // echo ("precio medio  diesel en  $target :  $avg_diesel € <br>");

    // echo ("precio máximo diesel en  $target :  $max_diesel_extra € <br>");
    // echo ("precio mínimo diesel en  $target :  $min_diesel_extra € <br>");
    // echo ("precio medio  diesel en  $target :  $avg_diesel_extra € <br>");

    // echo ("precio máximo diesel en  $target :  $max_gasolina_95 € <br>");
    // echo ("precio mínimo diesel en  $target :  $min_gasolina_95 € <br>");
    // echo ("precio medio  diesel en  $target :  $avg_gasolina_95 € <br>");

    // echo ("precio máximo diesel en  $target :  $max_gasolina_98 € <br>");
    // echo ("precio mínimo diesel en  $target :  $min_gasolina_98 € <br>");
    // echo ("precio medio  diesel en  $target :  $avg_gasolina_98 € <br>");

    echo json_encode(' "estadisticas":{
    ' . $target . ':{
        "diesel"{
            "min": ' . $min_diesel . ',
            "max": ' . $max_diesel . ',
            "avg": ' . $avg_diesel . '
        },    
        "diesel_extra"{
            "min": ' . $min_diesel_extra . ',
            "max": ' . $max_diesel_extra . ',
            "avg": ' . $avg_diesel_extra . '
        },
        "gasolina_95" {
            "min": ' . $min_gasolina_95 . ',
            "max": ' . $max_gasolina_95 . ',
            "avg": ' . $avg_gasolina_95 . '
        },
        "gasolina_98" {
            "min": ' . $min_gasolina_98 . ',
            "max": ' . $max_gasolina_98 . ',
            "avg": ' . $avg_gasolina_98 . '
        },
    },
}', JSON_FORCE_OBJECT);
}

function getRest($url)
{
    // create & initialize a curl session
    $curl = curl_init();

    // set our url with curl_setopt()
    curl_setopt($curl, CURLOPT_URL, $url);

    // return the transfer as a  , also with setopt()
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);

    // curl_exec() executes the started curl session
    // $output contains the output  
    $output = curl_exec($curl);

    // close curl resource to free up system resources
    // (deletes the variable made by curl_init)
    curl_close($curl);


    return json_decode($output, true);
}
