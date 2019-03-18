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
                "fk_sede"=>$datos["fk_sede"],
                "fk_plan_de_estudios"=>$datos["fk_plan_de_estudios"],
                "nombre_curso"=>$datos["nombre_curso"],
                "anio_curso"=>$datos["anio_curso"]);
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
        
    }

    public function eliminar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("id_curso"=>$datos["id_curso"]);
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
                "fk_sede"=>$datos["fk_sede"],
                "fk_plan_de_estudios"=>$datos["fk_plan_de_estudios"],
                "nombre_curso"=>$datos["nombre_curso"],
                "anio_curso"=>$datos["anio_curso"],
                "id_curso"=>$datos["id_curso"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_CURSO,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Failed: " . $e->getMessage();
        }
    }

}
