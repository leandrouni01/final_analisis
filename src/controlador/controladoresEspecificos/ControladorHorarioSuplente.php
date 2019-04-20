<?php

require_once 'ControladorGeneral.php';

class ControladorHorarioSuplente extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {
        
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_HORARIOS_SUPLENTES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarTitular() {
        try {
            $parametros = date('Y');
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_TITULARES, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarSuplente() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_SUPLENTES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarSede($datos) {
        try {
            $parametros = array("fk_titular" => $datos["fk_titular"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_SEDES, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarCurso($datos) {
        try {
            $parametros = array("fk_sede" => $datos["fk_sede"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CURSOS, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }
    
    public function buscarPlan($datos){
        try{
            $parametros= array("fk_titular"=>$datos["fk_titular"]);
            $resultado = $this->refControladorPersistencia->ejecuutarSentencia(DbSentencias::BUSCAR_SEDES,$parametros);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
            
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function modificar($datos) {
        
    }

}
