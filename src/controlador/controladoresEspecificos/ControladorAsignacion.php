<?php

require_once 'ControladorGeneral.php';

class ControladorAsignacion extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $datos["fk_espacio_curricular"] = $this->buscarEspacioCurricular($datos);
            //print_r($datos);
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_espacio_curricular" => $datos["fk_espacio_curricular"],
                "fk_profesor" => $datos["fk_profesor"],
                "fecha_inicio" => $datos["fecha_inicio"],
                "fecha_fin" => $datos["fecha_fin"]
            );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_ASIGNACION, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
            return $this->buscarUltimaAsignacion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarUltimaAsignacion() {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMA_ASIGNACION);
            $fila = $resultado->fetch(PDO::FETCH_ASSOC);
            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }
    
    public function buscar($datos) {
        try {
            $parametros = array('valor' => $datos['textBusca']);
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCADOR_HORARIOS);
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
            $parametros = array("id_asignacion" => $datos["id_asignacion"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_ASIGNACION, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function listar($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_ASIGNACIONES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function verificarAsignacion($datos) {
        try {
            $datos["fk_espacio_curricular"] = $this->buscarEspacioCurricular($datos);
            $parametros = array(
                "fk_espacio_curricular"=>$datos["fk_espacio_curricular"],
                "fk_profesor" => $datos["fk_profesor"]
            );
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_SOLAPADO_PROFESOR, $parametros);
            $existe = $resultado->fetch();
            //revisa si el curso ya tiene un horario que se interponga con el horario a guardar
            if ($existe["existe"] == 1) {
                return 1;
            }
            $parametros2 = array(
                "fk_espacio_curricular"=>$datos["fk_espacio_curricular"],
                "fk_profesor" => $datos["fk_profesor"]
            );
            $resultado2 = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_SOLAPADO_PROFESOR_2, $parametros2);
            $existe2 = $resultado2->fetch();
            //revisa si el curso ya tiene un horario que se interponga con el horario a guardar
            if ($existe2["existe"] == 1) {
                return 2;
            }
            
            
            return 0;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $datos["fk_espacio_curricular"] = $this->buscarEspacioCurricular($datos);
            //print_r($datos);
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_espacio_curricular" => $datos["fk_espacio_curricular"],
                "fk_profesor" => $datos["fk_profesor"],
                "fecha_inicio" => $datos["fecha_inicio"],
                "fecha_fin" => $datos["fecha_fin"],
                "id_asignacion" => $datos["id_asignacion"]
                );
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_ASIGNACION, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }
      
    public function buscarPlanes($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PLAN_DE_ESTUDIOS);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }
    
    public function buscarSedes($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_SEDES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }
    
    public function buscarMaterias($datos){
        //recibe idplan , anio
        try {
            $parametros = array("id_plan" => $datos["id_plan"] , 
            "anio" => $datos["anio"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MATERIAS_H, $parametros);
            $fila = $resultado->fetchAll(PDO::FETCH_ASSOC);

            return $fila;
        } catch(Exception $e){
            echo "Error :" . $e->getMessage(); 
        }
    }

    public function buscarCursos($datos){
        //id_sede , anios
        try {
            $parametros = array(
                "fk_materia" => $datos["fk_materia"],
                "fk_sede" => $datos["fk_sede"]
                );
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CURSOS_H, $parametros);
            $fila = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $fila;
        } catch(Execption $e){
            echo "Error :" . $e->getMessage();
        }
    }
    
    public function buscarAnio($datos){
        //recibe id
        try {
            $parametros = array("id_plan" => $datos["id_plan"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_AÑOS_EC ,$parametros);
            $fila = $resultado->fetch(PDO::FETCH_ASSOC);

            return $fila;
        } catch (Exception $e){
            echo "Error :" . $e->getMessage();
        }
    }
    
     public function buscarProfesores($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_PROFESORES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }
    
    public function buscarEspacioCurricular($datos) {
        try{
            $parametros = array(
                "fk_materia" => $datos["fk_materia"] , 
                "fk_curso" => $datos["fk_curso"]
                );
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_EC, $parametros);
            $id = $resultado->fetch(PDO::FETCH_ASSOC);

            return $id["id_espacio_curricular"]; 
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }
    
}
