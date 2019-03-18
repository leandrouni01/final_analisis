<?php

require 'ControladorGeneral.php';

class ControladorMateria extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $resultado = array(
                "idPlan" => $datos['idPlan'],
                "anio" => $datos['anio'],
                "nombre_materia" => $datos['nombre_materia'],
                "semestre" => $datos['semestre'],
                "carga_horaria" => $datos['carga_horaria']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_MATERIA, $resultado);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimaMateria();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarUltimaMateria() {
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMA_MATERIA, $parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscar($datos) {
        
    }
    
    public function buscarPlan($datos){
        try{
            $parametros= array("idPlan"=> $datos["idPlan"]);
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_PLAN,$parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("id_materia" => $datos['id_materia']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_MATERIA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_MATERIAS);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            //print_r($array);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_plan_de_estudio" => $datos['idPlan'],
                "anio" => $datos['anio'],
                "nombre_materia" => $datos['nombre_materia'],
                "semestre" => $datos['semestre'],
                "carga_horaria" => $datos['carga_horaria'],
                "id_materia" => $datos['id_materia']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_MATERIA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

}