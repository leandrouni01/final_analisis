<?php

require_once 'ControladorGeneral.php';

class ControladorProvincia extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("nombre" => $datos["nombre_provincia"], "fk_pais" => $datos["pais"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_PROVINCIA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimaProvincia();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed" . $e->getMessage();
        }
    }

    public function buscarUltimaProvincia() {
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMA_PROVINCIA, $parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {
        try{
            $parametros= array("valor"=>$datos["textBusca"]);
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCAR_PROVINCIA);
            $resultado= $this->refControladorPersistencia->ejecutarSentencia($query);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("id_provincia" => $datos["id_provincia"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_PROVINCIA,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PROVINCIAS);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "nombre" => $datos["nombre_provincia"],
                "fk_pais" => $datos["pais"],
                "id_provincia" => $datos["id_provincia"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_PROVINCIA, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
