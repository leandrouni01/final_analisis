<?php

require_once 'ControladorGeneral.php';

class ControladorPreInscripcion extends ControladorGeneral{
    
    function __construct() {
        parent::__construct();
    }
    
    public function agregar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= [
                "fk_plan"=>$datos["fk_plan"],
                "fk_sede" => $datos["fk_sede"],
                "fk_alumno"=>$datos["fk_alumno"],
                "anio"=>$datos["ciclo_lectivo"],
                "documentacion"=>$datos["documentacion"]
            ];
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_PRE_INSCRIPCION,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimaPreinscripcion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }
    
    public function buscarAlumno($datos){
        try{
            $parametros=[
              "dni"=>$datos["dni"]
            ];
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ALUMNO,$parametros);
            $array= $resultado->fetch(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }
    
    public function buscarSedes($datos){
        try{
            $parametros= [
                "fk_plan"=>$datos["fk_plan"]
            ];
            $resultado=$this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_SEDES,$parametros);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }
    
    public function buscarPlanes() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_PLANES_DE_ESTUDIO);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscarUltimaPreinscripcion(){
        try{
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMA_PRE_INSCRIPCION);
            $fila= $resultado->fetch(PDO::FETCH_ASSOC);
            return $fila;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = [
                "fk_plan" => $datos["fk_plan"],
                "fk_sede" => $datos["fk_sede"],
                "fk_alumno" => $datos["fk_alumno"],
                "anio" => $datos["ciclo_lectivo_horario"],
                "documentacion" => $datos["documentacion"],
                "id_preinscripcion" => $datos["id_pre_inscripcion"]
            ];
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_PRE_INSCRIPCION, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try{
           $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PRE_INSCRIPCIONES);
           $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
           return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = [
                "fk_plan" => $datos["fk_plan"],
                "fk_sede" => $datos["fk_sede"],
                "fk_alumno" => $datos["fk_alumno"],
                "anio" => $datos["ciclo_lectivo_horario"],
                "documentacion" => $datos["documentacion"],
                "id_preinscripcion" => $datos["id_pre_inscripcion"]
            ];
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_PRE_INSCRIPCION, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
