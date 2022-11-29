<?php

require_once('bd.php');
$bd = new BD();
$response = [];

// lanza la actualizacion


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
