<html>

<body>

  <h2>Api gasolineras</h2>




  <form action="" method="post">

    <input type="text" id="ciudad" name="ciudad"></input>
    <input type="submit" id="buscar" name="buscar" value="listar precios"></input>

  </form>




  <?php

  require "BD.php";




  if (isset($_POST["buscar"])) {


    if (!empty($_POST["ciudad"])) {
      $ciudad = $_POST["ciudad"];

      $datos = getRest("https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/");

      $array_EESS  = [];
      $array_historico = [];


      // var_dump($datos);
      // die();



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

        // var_dump($eess);
        // actualzia datos BD

        // echo ($c++ . " id_ss: " . $eess['IDEESS']);



        // $bd->actualizarEESS(
        //   (int)$eess['IDEESS'],
        //   $eess['Rótulo'],
        //   $eess['Horario'],
        //   (float)str_replace(",", ".", $eess['Precio Gasoleo A']),
        //   (float)str_replace(",", ".", $eess['Precio Gasoleo Premium']),
        //   (float)str_replace(",", ".", $eess['Precio Gasolina 95 E5']),
        //   (float)str_replace(",", ".", $eess['Precio Gasolina 98 E5']),
        //   $eess['Dirección'],
        //   $eess['Provincia'],
        //   $eess['Localidad'],
        //   $eess['C.P.'],
        //   date('Y-m-d H:i:s'),
        //   $eess['Longitud (WGS84)'],
        //   $eess['Latitud']
        // );


        // if ($c++ == 2) break;
      }




      // $compressed = gzcompress(json_encode($array_historico), 9);

      $datos_json = json_encode($array_historico);

      var_dump($bd->getDatafromLocalidad('SILLEDA'));

      // if ($bd->addServiceStations($array_EESS)) echo 'añadidas correctamente';

      // if ($bd->addHistorico(date('Y-m-d'), $datos_json)) echo 'histórico añadido correctamente';

      // var_dump($bd->getHistorico('15694'));
      // "C.P." - "02250"  strlen: 5
      // "Dirección" - "AVENIDA CASTILLA LA MANCHA, 26"  strlen: 30
      // "Horario" - "L-D: 07:00-22:00"  strlen: 16
      // "Latitud" - "39,211417"  strlen: 9
      // "Localidad" - "ABENGIBRE"  strlen: 9
      // "Longitud (WGS84)" - "-1,539167"  strlen: 9
      // "Margen" - "D"  strlen: 1
      // "Municipio" - "Abengibre"  strlen: 9
      // "Precio Biodiesel" - ""  strlen: 0
      // "Precio Bioetanol" - ""  strlen: 0
      // "Precio Gas Natural Comprimido" - ""  strlen: 0
      // "Precio Gas Natural Licuado" - ""  strlen: 0
      // "Precio Gases licuados del petróleo" - ""  strlen: 0
      // "Precio Gasoleo A" - "1,939"  strlen: 5
      // "Precio Gasoleo B" - "1,440"  strlen: 5
      // "Precio Gasoleo Premium" - ""  strlen: 0
      // "Precio Gasolina 95 E10" - ""  strlen: 0
      // "Precio Gasolina 95 E5" - "1,739"  strlen: 5
      // "Precio Gasolina 95 E5 Premium" - ""  strlen: 0
      // "Precio Gasolina 98 E10" - ""  strlen: 0
      // "Precio Gasolina 98 E5" - ""  strlen: 0
      // "Precio Hidrogeno" - ""  strlen: 0
      // "Provincia" - "ALBACETE"  strlen: 8
      // "Remisión" - "dm"  strlen: 2
      // "Rótulo" - "Nº 10.935"  strlen: 10
      // "Tipo Venta" - "P"  strlen: 1
      // "% BioEtanol" - "0,0"  strlen: 3
      // "% Éster metílico" - "0,0"  strlen: 3
      // "IDEESS" - "4375"  strlen: 4
      // "IDMunicipio" - "52"  strlen: 2
      // "IDProvincia" - "02"  strlen: 2
      // "IDCCAA" - "07"  strlen: 2
      //     $resultados = filtroResultados($datos,  $ciudad, 'Precio Gasoleo Premium');

      //     foreach ($resultados as $key => $value) {
      //       if (strlen($value) > 0) {
      //         echo $key . " : " . $value . '<hr>';

      //         echo ('<div id="res">
      //                   <div class="container-fluid">
      //                     <section>
      //                       <div class="row">
      //                         <div class="col-xl-3 col-sm-6 col-12 mb-4">
      //                           <div class="card">
      //                             <div class="card-body">
      //                               <div class="d-flex justify-content-between px-md-1">
      //                                 <div>
      //                                   <h3 class="text-danger">278</h3>
      //                                   <p class="mb-0">New Projects</p>
      //                                 </div>
      //                                 <div class="align-self-center">
      //                                   <i class="fas fa-rocket text-danger fa-3x"></i>
      //                                 </div>
      //                               </div>
      //                             </div>
      //                           </div>
      //                         </div> 
      //                     </section>
      //                   </div>
      //                 </div>');
      //       }
      //     }
    }
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


  function filtroResultados($data, $city, $target)
  {
    $resultados = array();

    // tratamos losa datos de output
    foreach ($data as $value) {
      if (is_array($value) || is_object($value)) {
        foreach ($value as $v) {
          if ($v['Municipio'] == ucfirst($city)) {

            // echo $v['Rótulo'] . " " . $v['Dirección'] . " " . $v['Precio Gasoleo Premium'] . '


            $c = $v['Rótulo'] . " " . $v['Dirección'];
            $v = $v[$target];

            $resultados[$c] = $v;
          }
        }
      }
    }
    asort($resultados);
    return $resultados;
  }






  ?>





</body>

</html>