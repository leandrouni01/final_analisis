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
                "dni_alumno" => $datos["dni_alumno"],
                "legajo" => $datos["legajo"],
                "apellido_alumno" => $datos["apellido_alumno"],
                "nombre_alumno" => $datos["nombre_alumno"],
                "telefono" => $datos["telefono"],
                "email" => $datos["email"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_ALUMNO, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoAlumno();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscarUltimoAlumno() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_ALUMNO);
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
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCADOR_ALUMNO);
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
            
            $parametros= array("id_alumno"=>$datos["id"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_ALUMNO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_ALUMNOS);
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
                "dni_alumno" => $datos["dni_alumno"],
                "legajo" => $datos["legajo"],
                "apellido_alumno" => $datos["apellido_alumno"],
                "nombre_alumno" => $datos["nombre_alumno"],
                "fk_domicilio"=>$datos["id_domicilio"],
                "telefono" => $datos["telefono"],
                "email" => $datos["email"],
                "id_alumno"=>$datos["id_alumno"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_ALUMNO, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

     public function buscarLocalidades($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_LOCALIDADES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }
    
}
