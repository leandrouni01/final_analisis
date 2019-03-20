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
                'fk_plan_de_estudios' => $datos['id_planestudio'],
                'fk_materia' => $datos['id_materiaini'],
                'fk_correlativa' => $datos['id_correlativa']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_CORRELATIVA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarMaterias($datos) {
        try {
            $parametros = array("id_plan" => $datos["id"]);
            //print_r($parametros);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MATERIAS, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarMateria2($datos) {
        try {
            $parametros = array(
                "fk_plan_de_estudio" => $datos["fk_plan_de_estudio"],
                "id_materia" => $datos["id_materia"],
                "anio" => $datos["anio"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MATERIA_2, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscar($datos) {
        try {
            $parametros = array(
                "fk_materia" => $datos['id_materia'],
                "fk_plan_de_estudios" => $datos['id_plan']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CORRELATIVAS, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_plan_de_estudios" => $datos['id_planestudio'],
                "fk_materia" => $datos['id_materiaini'],
                "fk_correlativa" => $datos['id_correlativa']);
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
            $parametros = array(
                "id_correlativa_nueva" => $datos['nueva_correlativa'],
                "fk_plan_de_estudios" => $datos['plan'],
                "id_materia" => $datos['materia'],
                "id_correlativa" => $datos['correlativa']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_CORRELATIVA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

}
