<?php

require_once 'ControladorGeneral.php';

class ControladorHorarioSuplente extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }
    
    public function agregar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array(
                "fk_titular"=>$datos["fk_titular"],
                "fk_suplente"=>$datos["fk_suplente"],
                "fk_sede"=>$datos["fk_sede"],
                "fk_materia"=>$datos["fk_materia"],
                "fk_ciclo_lectivo"=>date('Y'),
                "fk_curso"=>$datos["fk_curso"],
                "fecha_inicio"=>$datos["fecha_inicio"],
                "fecha_fin"=>$datos["fecha_fin"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_HORARIO_SUPLENTE,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimoHorarioSuplente();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo 'Error :' . $e->getMessage();
        }
    }
    
    public function buscarUltimoHorarioSuplente(){
        $parametros = null;
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_HORARIO_SUPLENTE, $parametros);
        $fila = $resultado->fetch();
        return $fila;
    }

    public function buscar($datos) {
        
    }
    
    public function verificar($datos){
        try{
            $parametros= array(
                "fk_suplente"=>$datos["fk_suplente"],
                "fecha_inicio"=>$datos["fecha_inicio"],
                "fecha_inicio2"=>$datos["fecha_inicio"],
                "fecha_fin"=>$datos["fecha_fin"],
                "fecha_fin2"=>$datos["fecha_fin"],
                "ciclo_lectivo"=>date("Y"),
                "id_horario_suplente"=>$datos["id_horario_suplente"]
            );
            $resultado=$this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_SUPLENTE,$parametros);
            $valor= $resultado->fetch();
            return $valor["existe"];
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function eliminar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array("id_horario_suplente"=>$datos["id_horario_suplente"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_HORARIO_SUPLENTE,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo 'Error :' . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_HORARIOS_SUPLENTES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarTitular() {
        try {
            $parametros = array("anio"=>date('Y'));
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_TITULARES, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarSuplente() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_SUPLENTES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarSede($datos) {
        try {
            $parametros = array("fk_profesor" => $datos["fk_titular"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_SEDES, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }

    public function buscarCurso($datos) {
        try {
            $parametros = array("fk_sede" => $datos["fk_sede"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CURSOS, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }
    
    public function buscarPlan($datos){
        try{
            $parametros= array("fk_titular"=>$datos["fk_titular"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_PLANES,$parametros);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }
    
    public function buscarMateria($datos){
        try{
            $parametros= array("fk_plan"=>$datos["fk_plan"]);
            $resultado= $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MATERIAS_HORARIOS_SUPLENTES,$parametros);
            $array= $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo 'Error :' . $e->getMessage();
        }
    }
    

    public function modificar($datos) {
        try{
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros= array(
                "fk_titular"=>$datos["fk_titular"],
                "fk_suplente"=>$datos["fk_suplente"],
                "fk_sede"=>$datos["fk_sede"],
                "fk_materia"=>$datos["fk_materia"],
                "fk_ciclo_lectivo"=>$datos["fk_ciclo_lectivo"],
                "fk_curso"=>$datos["fk_curso"],
                "fecha_inicio"=>$datos["fecha_inicio"],
                "fecha_fin"=>$datos["fecha_fin"],
                "id_horario_suplente"=>$datos["id_horario_suplente"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_HORARIO_SUPLENTE,$parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo 'Error :' . $e->getMessage();
        }
    }

}
