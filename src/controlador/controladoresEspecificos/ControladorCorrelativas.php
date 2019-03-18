<?php

require 'ControladorGeneral.php';

class ControladorCorrelativas extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                'fk_plan_de_estudios' => $datos['fk_plan_de_estudios'],
                'fk_materia' => $datos['fk_materia'],
                'fk_correlativa' => $datos['fk_correlativa']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_CORRELATIVA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscar($datos) {
        try{
            $parametros= array(
                "fk_materia"=>$datos['id_materia'],
                "fk_plan_de_estudios"=>$datos['id_plan']);
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CORRELATIVAS,$parametros);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_plan_de_estudios" => $datos['fk_plan_de_estudios'],
                "fk_materia" => $datos['fk_materia'],
                "fk_correlativa" => $datos['fk_correlativa']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_CORRELATIVA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_CORRELATIVAS);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("id_correlativa_nueva" => $datos['id_correlativa'], "fk_plan_de_estudios" => $datos['id_plan_origen'], "id_materia" => $datos['id_materia_origen'], "id_correlativa" => $datos['id_correlativa_origen']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_CORRELATIVA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

}
