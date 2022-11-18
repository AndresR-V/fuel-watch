<?php

// Constantes de conexión con la BD
define("HOST", "localhost");
define("DBNAME", "carburantes");
define("USER", "root");
define("PASS", "");


class BD
{

  protected $con;



  public function conectarBD()
  {
    try {


      // $this->con = new PDO("mysql:host=" . HOST . ";dbname=" . DBNAME . " , 'root', '' ;charset=utf8");
      $this->con = new PDO('mysql:host=localhost;dbname=carburantes', USER, PASS);

      $this->con->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $e) {
      echo "Error: Error al conectar BD: " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a') . $e->getMessage(), FILE_APPEND);
      exit;
    }
  }

  // desconectarse de la base de datos
  public function desconectarBD()
  {
    $this->con = NULL;
  }

  public function addServiceStations($array_EESS)
  {
    $this->conectarBD();

    // eliminamos registros anterores
    try {

      $this->con->prepare("SET FOREIGN_KEY_CHECKS = 0")->execute();
      $this->con->prepare("TRUNCATE table servicestations")->execute();
      $this->con->prepare("SET FOREIGN_KEY_CHECKS = 1")->execute();
    } catch (PDOException $e) {
      echo "<br> Error: Error al purgar tabla: " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
      return false;
    }

    // insertamos nuevos valores

    try {
      $sql = "INSERT INTO servicestations (id_ss, rotulo, horario, precio_diesel, precio_diesel_extra, precio_gasolina_95, precio_gasolina_98, direccion, provincia, localidad, cp, longitud, latitud, fecha_actualizacion )
            VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?); ";
      $stmt = $this->con->prepare($sql);
      $count = 0;
      foreach ($array_EESS as $eess) {

        $stmt->execute($eess);
        $count++;
      }
      echo "<br> $count lineas <br> ";
    } catch (PDOException $e) {
      echo "<br> Error: Error al añadir datos a la tabla servicestations: " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
      return false;
    }
    $this->desconectarBD();
    return true;
  }

  public function addHistorico($fecha, $datos)
  {
    $this->conectarBD();


    if (count($this->con->query("SELECT * FROM historico WHERE fecha = $fecha")->fetchAll()) == 5) {
      try {
        $sql = "INSERT INTO historico (fecha, datos)
                VALUES ('$fecha','$datos'); ";

        $stmt = $this->con->prepare($sql);
        $stmt->execute();
      } catch (PDOException $e) {
        echo "<br> Error: Error al añadir histórico: " . $e->getMessage();
        file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
        return false;
      }
      $this->desconectarBD();
      return true;
    }
    echo "<br> EL histórico ya tiene informacion de la fecha $fecha <br>";
    $sql = 'SELECT * FROM historico WHERE fecha = ' . date('Y-m-d');
    $res = $this->con->query($sql);
    echo ("count: " . count($res->fetchAll()));
  }

  public function getHistorico($id_ss)
  {
    $this->conectarBD();
    try {
      $i = 0;
      $values = [];

      while ($i < 4) {
        $sql = "SELECT  JSON_VALUE(datos,'$." . $id_ss . "[" . $i++ . "]') FROM historico";
        $resultado = $this->con->query($sql);
        $value = $resultado->fetch();
        array_push($values, (float)$value[0]);
      }
    } catch (PDOException $e) {
      echo "<br> Error: Error al añadir histórico: " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
      return false;
    }
    $this->desconectarBD();
    return $values;
  }

  public function getDatafromLocalidad($localidad)
  {
    $this->conectarBD();
    try {
      $sql = "SELECT * FROM servicestations WHERE `localidad` like '%$localidad%'";
      $resultado = $this->con->query($sql);
      $rows = $resultado->fetchAll();
    } catch (PDOException $e) {
      echo "<br> Error: Error al obtener datos por localidad: " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
      return false;
    }
    $this->desconectarBD();
    return $rows;
  }


  public function getDatafromCp($target)
  {
    $arr = [1, 1, 1];
    return $arr;

    // $cp = substr($target, 0, -1);

    // $this->conectarBD();
    // try {
    //   $sql = "SELECT * FROM servicestations WHERE `cp` like '%$cp%'";
    //   $resultado = $this->con->query($sql);
    //   $rows = $resultado->fetchAll();
    // } catch (PDOException $e) {
    //   echo "<br> Error: Error al obtener datos por cp: " . $e->getMessage();
    //   file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
    //   return false;
    // }
    // $this->desconectarBD();
    // return $rows;
  }

  public function getPriceSum($price, $localidad)
  {
    $this->conectarBD();
    try {
      $sql = "SELECT SUM($price)   FROM servicestations  WHERE localidad LIKE '%$localidad%';";
      $resultado = $this->con->query($sql);
      $row = $resultado->fetch();
    } catch (PDOException $e) {
      echo "<br> Error: Error al obtener la suma del precio de " . $price . " : " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
      return false;
    }
    $this->desconectarBD();
    return $row;
  }

  public function getPriceCount($price, $localidad)
  {
    $this->conectarBD();
    try {
      $sql = "SELECT COUNT($price) FROM servicestations WHERE localidad LIKE '%$localidad%' AND $price>0;) ";;
      $resultado = $this->con->query($sql);
      $row = $resultado->fetch();
    } catch (PDOException $e) {
      echo "<br> Error: Error al contar las ocurrencias de  " . $price . " : " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
      return false;
    }
    $this->desconectarBD();
    return $row;
  }

  public function getPriceLimit($price, $localidad, $limit)
  {
    $this->conectarBD();

    if ($limit == 'MAX') $O = 'DESC';
    if ($limit == 'MIN') $O = 'ASC';

    try {
      $sql = "SELECT $price FROM servicestations  WHERE localidad LIKE '%$localidad%' AND $price>0 ORDER BY $price $O LIMIT 1";
      $resultado = $this->con->query($sql);
      $row = $resultado->fetch();
    } catch (PDOException $e) {
      echo "<br> Error: Error al obtener el valor " . $limit . " de " . $price . " : " . $e->getMessage();
      file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
      return false;
    }
    $this->desconectarBD();
    return $row;
  }
}
