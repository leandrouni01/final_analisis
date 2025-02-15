<?php

require_once 'ControladorGeneral.php';

class ControladorHorario extends ControladorGeneral {

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
                "inicio_horario" => $datos["inicio_horario"],
                "fin_horario" => $datos["fin_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"],
                "dia_horario" => $datos["dia_horario"]
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

    public function verificarHorario($datos) {
        try {
            $parametros3 = array(
                "fk_curso" => $datos["fk_curso"],
                "fin_horario" => $datos["fin_horario"],
                "fin_horario2" => $datos["fin_horario"],
                "inicio_horario" => $datos["inicio_horario"],
                "inicio_horario2" => $datos["inicio_horario"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"],
                "id_horario"=> $datos["id_horario"]
            );
            $resultado3 = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_SOLAPADO_CURSO, $parametros3);
            $existe3 = $resultado3->fetch();
            //revisa si el curso ya tiene un horario que se interponga con el horario a guardar
            if ($existe3["existe"] == 1) {
                return 1;
            }
            $parametros2 = array(
                "fk_curso" => $datos["fk_curso"],
                "inicio_horario" => $datos["inicio_horario"],
                "fin_horario" => $datos["fin_horario"],
                "inicio_horario2" => $datos["inicio_horario"],
                "fin_horario_2" => $datos["fin_horario"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"],
                "id_horario" => $datos["id_horario"]
            );
            $resultado2 = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_SOLAPADO_CURSO_2, $parametros2);
            $existe2 = $resultado2->fetch();
            //revisa si el curso ya tiene un horario que se interponga con el horario a guardar
            if ($existe2["existe"] == 1) {
                return 2;
            }

            //si el valor que retorna es "0" puede guardar en la BD el nuevo Horario cargado.
            return 0;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $datos["fk_espacio_curricular"] = $this->buscarEspacioCurricular($datos);
            print_r($datos);
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_espacio_curricular" => $datos["fk_espacio_curricular"],
                "fk_modulo_inicio" => $datos["inicio_horario"],
                "fk_modulo_fin" => $datos["fin_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"],
                "dia_horario" => $datos["dia_horario"],
                "id_horario" => $datos["id_horario"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_HORARIO, $parametros);
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
    
    public function buscarModulosInicio($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_MODULOS_INICIO);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarModulosFin($datos) {
        try {
            $parametros = array("id_modulo" => $datos["id_modulo"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MODULOS_FIN, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
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
    
    public function buscarEspacioCurricular($datos) {
        try{
            $parametros = array(
                "fk_materia" => $datos["fk_materia"] , 
                "fk_curso" => $datos["fk_curso"]
                );
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_EC, $parametros);
            $id = $resultado->fetch(PDO::FETCH_ASSOC);

            return $id["id_espacio_curricular"]; 
        } catch (Exception $ex) {
            echo "Error :" . $e->getMessage();
        }
    }
    
}
