<?php

require_once 'ControladorGeneral.php';

class ControladorPais extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("nombre" => $datos['nombre_pais']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_PAIS, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoPais();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    private function buscarUltimoPais() {
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_PAIS, $parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PAISES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {
        try {
            $parametros = array("valor" => $datos['textBusca']);
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCAR_PAIS);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("id" => $datos["id_pais"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_PAIS, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array('nombre' => $datos['nombre_pais'], 'id' => $datos['id_pais']);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_PAIS, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
