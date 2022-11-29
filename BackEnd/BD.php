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


        if (count($this->con->query("SELECT * FROM historico WHERE fecha like '$fecha'")->fetchAll()) == 0) {
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
    }

    public function getHistorico($id_ss)
    {
        $this->conectarBD();
        try {

            $sql = "SELECT fecha, JSON_QUERY(datos, '$." . $id_ss . "')  AS precios FROM historico ORDER BY fecha ASC LIMIT 30;";
            $resultado = $this->con->query($sql);
            $rows = $resultado->fetchAll();
        } catch (PDOException $e) {
            echo "<br> Error: Error al obtener datos del histórico: " . $e->getMessage();
            file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
            return false;
        }
        $this->desconectarBD();
        return $rows;
    }

    public function getDatafromLocalidad($localidad)
    {
        $this->conectarBD();
        try {
            $sql = "SELECT * FROM servicestations WHERE `localidad` like '%$localidad%' ORDER BY cp ASC";
            $resultado = $this->con->query($sql);
            $rows = $resultado->fetchAll();
        } catch (PDOException $e) {
            echo "<br> Error: Error al obtener datos por localidad: " . $e->getMessage();
            file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
            return false;
        }
        $this->desconectarBD();


        return $this->formatData($rows);
    }


    public function getDatafromCp($target)
    {
        $cp = substr($target, 0, -1);

        $this->conectarBD();
        try {
            $sql = "SELECT * FROM servicestations WHERE `cp` like '%$cp%' ORDER BY cp ASC";
            $resultado = $this->con->query($sql);
            $rows = $resultado->fetchAll();
        } catch (PDOException $e) {
            echo "<br> Error: Error al obtener datos por localidad: " . $e->getMessage();
            file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
            return false;
        }
        $this->desconectarBD();

        return $this->formatData($rows);
    }

    public function getLocalidadfromCp($target)
    {
        $cp = substr($target, 0, -1);
        $this->conectarBD();
        try {
            $sql = "SELECT localidad FROM servicestations WHERE `cp` LIKE '%$cp%' LIMIT 1";
            $resultado = $this->con->query($sql);
            $r = $resultado->fetch();
        } catch (PDOException $e) {
            echo "<br> Error: Error al obtener datos por localidad: " . $e->getMessage();
            file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
            return false;
        }
        $this->desconectarBD();
        return $r;
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

    public function getLocationByCoords($lon, $lat)
    {
        $longitude = substr(str_replace('.', ',', $lon), 0, -6);
        $latitude =  substr(str_replace('.', ',', $lat), 0, -6);

        $this->conectarBD();
        try {
            $sql = "SELECT localidad FROM servicestations WHERE longitud LIKE '%$longitude%' AND latitud LIKE '%$latitude%' LIMIT 1";
            $resultado = $this->con->query($sql);
            $r = $resultado->fetch();
        } catch (PDOException $e) {
            echo "<br> Error: Error al obtener la localidad : " . $e->getMessage();
            file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
            return false;
        }
        $this->desconectarBD();
        return $r;
    }

    public function getFavoritos($favoritos)
    {

        $this->conectarBD();

        try {
            $sql = "SELECT * FROM servicestations  WHERE id_ss IN ('"
                . implode("','",  $favoritos)
                . "') ORDER BY cp ASC";
            $resultado = $this->con->query($sql);
            $rows = $resultado->fetchAll();
        } catch (PDOException $e) {
            echo "<br> Error: Error al obtener los favotitos : " . $e->getMessage();
            file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
            return false;
        }
        $this->desconectarBD();

        return  $this->formatData($rows);
    }

    public function getListadoLocaliddes()
    {
        $this->conectarBD();
        try {
            $sql = "SELECT localidad FROM servicestations ORDER BY localidad DESC";
            $resultado = $this->con->query($sql);
            $row = $resultado->fetchAll();
        } catch (PDOException $e) {
            echo "<br> Error: Error al obtener las localidades" . $e->getMessage();
            file_put_contents("PDOErrors.txt", "\r\n" . date('j F, Y, g:i a ') . $e->getMessage(), FILE_APPEND);
            return false;
        }
        $this->desconectarBD();
        return $row;
    }


    public function formatData($rows)
    {
        $array_respuesta = [];
        $i = 0;
        foreach ($rows as $row) {
            // $array_respuesta[$i] =
            $array_respuesta[$i]["id_ss"] = $row["id_ss"];
            $array_respuesta[$i]["rotulo"] = $row["rotulo"];
            $array_respuesta[$i]["horario"] = $row["horario"];
            $array_respuesta[$i]["precio_diesel"] = $row["precio_diesel"];
            $array_respuesta[$i]["precio_diesel_extra"] = $row["precio_diesel_extra"];
            $array_respuesta[$i]["precio_gasolina_95"] = $row["precio_gasolina_95"];
            $array_respuesta[$i]["precio_gasolina_98"] = $row["precio_gasolina_98"];
            $array_respuesta[$i]["direccion"] = $row["direccion"];
            $array_respuesta[$i]["provincia"] = $row["provincia"];
            $array_respuesta[$i]["localidad"] = $row["localidad"];
            $array_respuesta[$i]["cp"] = $row["cp"];
            $array_respuesta[$i]["longitud"] = $row["longitud"];
            $array_respuesta[$i]["latitud"] = $row["latitud"];
            $array_respuesta[$i]["fecha_actualizacion"] = $row["fecha_actualizacion"];
            $array_respuesta[$i++]["historico"] = $this->getHistorico($row['id_ss']);
        }

        return  $array_respuesta;
    }
}
