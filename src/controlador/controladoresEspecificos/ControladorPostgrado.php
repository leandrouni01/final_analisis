<?php

require_once 'ControladorGeneral.php';

class ControladorPostgrado extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array ("nombre_postgrado"=>$datos["nombre_postgrado"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_POSTGRADO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoPostgrado();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }
    
    public function buscarUltimoPostgrado (){
        try{
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_POSTGRADO);
            $fila= $resultado->fetch(PDO::FETCH_ASSOC);
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("id_postgrado"=>$datos["id_Postgrado"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_POSTGRADO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try{
            $resultado=  $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_POSTGRADOS);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("nombre_postgrado"=>$datos["nombre_postgrado"],"id_postgrado"=>$datos["id_Postgrado"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_POSTGRADO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
