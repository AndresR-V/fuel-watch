<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

require "BD.php";

$bd = new BD();

$response = [];

if (isset($_GET["buscar"])) {

    $target = $_GET['target'];


    // array_localidades = $bd->getLocalidades();



    if ($target != '') {

        if (is_int($target) && strlen($target) == 5) {
            // echo "es un CP";
            $respuesta = $bd->getDatafromCp($target);
        } else {
            // echo "es una localidad";
            $respuesta = $bd->getDatafromLocalidad($target);
        }
    }

    $response['eess'] = $respuesta;
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

    if ($bd->addServiceStations($array_EESS)) echo ' añadidas correctamente <hr>';

    if ($bd->addHistorico(date('Y-m-d'), json_encode($array_historico))) echo ' histórico añadido correctamente <hr>';
}

if (isset($_GET["estadisticas"])) {
    $input = $_GET['target'];

    if (is_int($input) && strlen($input) == 5) {
        $target = $bd->getLocalidadfromCp($input)[0];
    } else {
        $target = $input;
    }



    $estadisticas[$target] = [];

    $sum_diesel         =  ($bd->getPriceSum('precio_diesel', $target))[0];
    $sum_diesel_extra   =  ($bd->getPriceSum('precio_diesel_extra', $target))[0];
    $sum_gasolina_95    =  ($bd->getPriceSum('precio_gasolina_95', $target))[0];
    $sum_gasolina_98    =  ($bd->getPriceSum('precio_gasolina_98', $target))[0];



    $diesel["min"]         =  round(($bd->getPriceLimit('precio_diesel', $target, 'MIN'))[0], 2);
    $diesel["max"]         =  round(($bd->getPriceLimit('precio_diesel', $target, 'MAX'))[0], 2);
    $diesel["avg"]         =  round($sum_diesel / ($bd->getPriceCount('precio_diesel', $target))[0], 2);


    $diesel_extra["min"]   =  round(($bd->getPriceLimit('precio_diesel_extra', $target, 'MIN'))[0], 2);
    $diesel_extra["max"]   =  round(($bd->getPriceLimit('precio_diesel_extra', $target, 'MAX'))[0], 2);
    $diesel_extra["avg"]   =  round($sum_diesel_extra / ($bd->getPriceCount('precio_diesel_extra', $target))[0], 2);

    $gasolina_95["min"]    =  round(($bd->getPriceLimit('precio_gasolina_95', $target, 'MIN'))[0], 2);
    $gasolina_95["max"]    =  round(($bd->getPriceLimit('precio_gasolina_95', $target, 'MAX'))[0], 2);
    $gasolina_95["avg"]    =  round($sum_gasolina_95   / ($bd->getPriceCount('precio_gasolina_95', $target))[0], 2);

    $gasolina_98["min"]    =  round(($bd->getPriceLimit('precio_gasolina_98', $target, 'MIN'))[0], 2);
    $gasolina_98["max"]    =  round(($bd->getPriceLimit('precio_gasolina_98', $target, 'MAX'))[0], 2);
    $gasolina_98["avg"]    =  round($sum_gasolina_98  / ($bd->getPriceCount('precio_gasolina_98', $target))[0], 2);


    $general["min"]   =  min(array($diesel["min"], $diesel_extra["min"], $gasolina_95["min"],  $gasolina_98["min"]));
    $general["max"]   =  max(array($diesel["max"], $diesel_extra["max"], $gasolina_95["max"],  $gasolina_98["max"]));


    $estadisticas[$target]['diesel']        =  $diesel;
    $estadisticas[$target]['diesel_extra']  =  $diesel_extra;
    $estadisticas[$target]['gasolina_95']   =  $gasolina_95;
    $estadisticas[$target]['gasolina_98']   =  $gasolina_98;
    $estadisticas[$target]['general']       =  $general;


    // echo json_encode($estadisticas, JSON_FORCE_OBJECT);



    $response['estadisticas'] = $estadisticas;
    echo json_encode($response, JSON_FORCE_OBJECT);
}

if (isset($_GET["historico"])) {
    $response = $bd->getHistorico($_GET["id_ss"]);
    echo json_encode($response, JSON_FORCE_OBJECT);
}



if (isset($_GET["coord"])) {

    $response = $bd->getLocationByCoords($_GET["lon"], $_GET["lat"]);
    echo json_encode($response, JSON_FORCE_OBJECT);
}


if (isset($_GET["favoritos"])) {
    $response = $bd->getFavoritos(json_decode($_GET["listado"]));
    echo json_encode($response, JSON_FORCE_OBJECT);
}

if (isset($_GET["localidades"])) {
    $response = $bd->getListadoLocaliddes();
    echo json_encode($response, JSON_FORCE_OBJECT);
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
