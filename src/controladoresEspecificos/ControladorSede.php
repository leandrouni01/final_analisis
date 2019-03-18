<?php

require_once 'ControladorGeneral.php';
require_once 'ControladorDomicilio.php';

class ControladorSede extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "calle_domicilio" => $datos["calle_domicilio"],
                "numero_domicilio" => $datos["numero_domicilio"],
                "fk_localidad" => $datos["fk_localidad"]);
            $controlador = new ControladorDomicilio();
            $controlador->agregar($parametros);

            $parametros = array(
                "nombre_sede" => $datos["nombre_sede"],
                "numero_sede" => $datos["numero_sede"],
                "telefono_sede" => $datos["telefono_sede"],);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_SEDE, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimaSede();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscarUltimaSede() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMA_SEDE);
            $array = $resultado->fetch();
            return $array;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("id_domicilio"=>$datos["id_domicilio"]);
            $controlador= new ControladorDomicilio();
            $controlador->eliminar($parametros);
            
            $parametros = array("id_sede"=>$datos["id_sede"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_SEDE,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_SEDES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarProvincia($datos) {
        try {
            $parametros = array("fk_pais" => $datos["id_pais"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PROV, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarLocalidades($datos) {
        try {
            $parametros = array("fk_provincia" => $datos["id_provincia"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_LOC, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
            "calle_domicilio" => $datos["calle_domicilio"],
            "numero_domicilio" => $datos["numero_domicilio"],
            "fk_localidad" => $datos["fk_localidad"],
            "id_domicilio"=>$datos["id_domicilio"]);
        $controlador= new ControladorDomicilio();
        $controlador->modificar($parametros);
        
        $parametros = array(
            "nombre_sede"=>$datos["nombre_sede"],
            "numero_sede"=>$datos["numero_sede"],
            "telefono_sede"=>$datos["telefono_sede"],
            "id_sede"=>$datos["id_sede"]);
        $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_SEDE,$parametros);
        $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
