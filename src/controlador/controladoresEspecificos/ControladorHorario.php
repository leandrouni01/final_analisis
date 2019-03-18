<?php

require_once 'ControladorGeneral.php';

class ControladorHorario extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_profesor" => $datos["fk_profesor"],
                "fk_materia" => $datos["fk_materia"],
                "inicio_horario" => $datos["inicio_horario"],
                "fin_horario" => $datos["fin_horario"],
                "fk_curso" => $datos["fk_curso"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_HORARIO, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoHorario();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarUltimoHorario() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_HORARIO);
            $fila = $resultado->fetch(PDO::FETCH_ASSOC);
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarMaterias($datos) {
        try {
            $parametros = array("fk_plan_de_estudio" => $datos["fk_plan"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MATERIAS, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarCursos($datos) {
        try {
            $parametros = array(
                "fk_sede" => $datos["fk_sede"],
                "fk_plan" => $datos["fk_plan"],
                "anio" => $datos["anio"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CURSO, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("id_horario" => $datos["id_horario"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_HORARIO, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_HORARIOS);
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
                "fk_profesor" => $datos["fk_profesor"],
                "fk_materia" => $datos["fk_materia"],
                "inicio_horario" => $datos["inicio_horario"],
                "fin_horario" => $datos["fin_horario"],
                "fk_curso" => $datos["fk_curso"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"],
                "id_horario" => $datos["id_horario"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_HORARIO, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

}
