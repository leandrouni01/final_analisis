<?php

require_once 'ControladorGeneral.php';

class ControladorCurso extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array(
                "fk_sede"=>$datos["comboSede"],
                "fk_plan_de_estudios"=>$datos["comboCarrera"],
                "nombre_curso"=>$datos["nombre"],
                "anio_curso"=>$datos["año"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_CURSO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoProfesor();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }
    
    public function buscarUltimoProfesor(){
        try{
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_CURSO);
            $fila= $resultado->fetch(PDO::FETCH_ASSOC);
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function buscar($datos) {
        try {
            $parametros = array('valor' => $datos['textBusca']);
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCADOR_CURSOS);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("id_curso"=>$datos["id"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_CURSO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

    public function listar($datos) {
        try{
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_CURSOS);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Failed: " . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array(
                "fk_sede"=>$datos["comboSede"],
                "fk_plan_de_estudios"=>$datos["comboCarrera"],
                "nombre_curso"=>$datos["nombre"],
                "anio_curso"=>$datos["año"],
                "id_curso"=>$datos["id"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_CURSO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
