<?php

require_once 'ControladorGeneral.php';
require_once 'ControladorDomicilio.php';

class ControladorAlumno extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            //print_r($datos);
            $parametros = array(
                "calle_domicilio" => $datos["calle_domicilio"],
                "numero_domicilio" => $datos["numero_domicilio"],
                "fk_localidad" => $datos["fk_localidad"]);
            $controlador = new ControladorDomicilio();
            $controlador->agregar($parametros);

            $parametros = array(
                "nombre_profesor" => $datos["nombre_profesor"],
                "apellido_profesor" => $datos["apellido_profesor"],
                "cuil" => $datos["cuil_profesor"],
                "fk_titulo" => $datos["fk_titulo"],
                "fk_postgrado" => $datos["fk_postgrado"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_PROFESOR, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoProfesor();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscarUltimoAlumno() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_PROFESOR);
            $fila = $resultado->fetch(PDO::FETCH_ASSOC);
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {
        try {
            $parametros = array('valor' => $datos['textBusca']);
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCADOR_PROFESOR);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("id_domicilio"=>$datos["id_domicilio"]);
            $controlador= new ControladorDomicilio();
            $controlador->eliminar($parametros);
            
            $parametros= array("id_profesor"=>$datos["id"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_PROFESOR,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PROFESORES);
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
                "id_domicilio" => $datos["id_domicilio"]);
            $controlador = new ControladorDomicilio();
            $controlador->modificar($parametros);

            $parametros = array(
                "nombre_profesor" => $datos["nombre_profesor"],
                "apellido_profesor" => $datos["apellido_profesor"],
                "cuil" => $datos["cuil_profesor"],
                "fk_titulo" => $datos["fk_titulo"],
                "fk_postgrado" => $datos["fk_postgrado"],
                "fk_domicilio" => $datos["id_domicilio"],
                "id_profesor" => $datos["id"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_PROFESOR, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
