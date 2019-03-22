<?php

require_once 'ControladorGeneral.php';

class ControladorLocalidad extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "nombre_localidad" => $datos["nombre_localidad"],
                "fk_provincia" => $datos["fk_provincia"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_LOCALIDAD, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimaLocalidad();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed" . $e->getMessage();
        }
    }

    public function buscarUltimaLocalidad() {
        try {
            $parametros = null;
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMA_LOCALIDAD, $parametros);
            $fila = $resultado->fetch();
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed" . $e->getMessage();
        }
    }

    public function buscar($datos) {
        try {
            $parametros = array("valor" => $datos["textBusca"]);
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCAR_LOCALIDAD);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed" . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("id_localidad" => $datos["id_localidad"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_LOCALIDAD, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed" . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_LOCALIDADES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function listarProvincias($datos) {
        try {
            $parametros = array("fk_pais" => $datos["fk_pais"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PROV, $parametros);
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
                "fk_provincia" => $datos["fk_provincia"],
                "nombre_localidad" => $datos["nombre_localidad"],
                "id_localidad" => $datos["id_localidad"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_LOCALIDAD, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed" . $e->getMessage();
        }
    }

}
