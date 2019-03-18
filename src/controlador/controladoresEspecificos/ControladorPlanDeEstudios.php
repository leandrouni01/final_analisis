<?php

require_once 'ControladorGeneral.php';

class ControladorPlanDeEstudios extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            //print_r($datos);
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array('fk_carrera' => $datos['fk_carrera'], 'resolucion' => $datos['resolucion'], 'fecha' => $datos['fecha'], 'horas_catedra' => $datos['horas_catedra'], 'horas_reloj' => $datos['horas_reloj'], 'duracion' => $datos['duracion']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_PLAN_DE_ESTUDIOS, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoPlan();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarUltimoPlan() {
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_PLAN, $parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $resultado = array('id' => $datos['id']);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_PLAN, $resultado);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PLAN_DE_ESTUDIOS);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $resultado = array('fk_carrera' => $datos['fk_carrera'], 'resolucion' => $datos['resolucion'], 'fecha' => $datos['fecha'], 'horas_catedra' => $datos['horas_catedra'], 'horas_reloj' => $datos['horas_reloj'], 'duracion' => $datos['duracion'], 'id_plan' => $datos['id']);
            //print_r($resultado);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_PLAN, $resultado);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

}
