<?php

require_once 'ControladorGeneral.php';

class ControladorHorario extends ControladorGeneral {

    function __construct() {
        parent::__construct();
    }

    public function agregar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_profesor" => $datos["fk_profesor"],
                "fk_materia" => $datos["fk_materia"],
                "inicio_horario" => $datos["inicio_horario"],
                "fin_horario" => $datos["fin_horario"],
                "fk_curso" => $datos["fk_curso"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"]
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

    public function buscarMaterias($datos) {
        try {
            $parametros = array("fk_plan_de_estudio" => $datos["fk_plan"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MATERIAS, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarCursos($datos) {
        try {
            $parametros = array(
                "fk_sede" => $datos["fk_sede"],
                "fk_plan" => $datos["fk_plan"],
                "anio" => $datos["anio"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CURSO, $parametros);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
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
    
    public function listarProfesores($datos) {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_TITULARES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function listarModulosInicio($datos) {
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

    public function verificarHorario($datos) {
        try {
            $parametros1 = array(
                "fk_materia" => $datos["fk_materia"],
                "inicio_horario" => $datos["inicio_horario"],
                "fin_horario" => $datos["fin_horario"],
                "fk_curso" => $datos["fk_curso"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"]
            );
            $resultado1 = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_TOMADO, $parametros1);
            $existe1 = $resultado1->fetch();
            //revisa si el horario ya esta tomado por otro profesor
            if ($existe1["existe"] == 1) {
                return 1;
            }

            $parametros2 = array(
                "fk_profesor" => $datos["fk_profesor"],
                "fin_horario" => $datos["fin_horario"],
                "fin_horario2" => $datos["fin_horario"],
                "inicio_horario" => $datos["inicio_horario"],
                "inicio_horario2" => $datos["inicio_horario"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"]
            );
            $resultado2 = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_SOLAPADO_PROFESOR, $parametros2);
            $existe2 = $resultado2->fetch();
            //revisa si el profesor ya tiene un horario que no le permita estar en el nuevo horario  a guardar
            if ($existe2["existe"] == 1) {
                return 2;
            }

            $parametros3 = array(
                "fk_curso" => $datos["fk_curso"],
                "fin_horario" => $datos["fin_horario"],
                "fin_horario2" => $datos["fin_horario"],
                "inicio_horario" => $datos["inicio_horario"],
                "inicio_horario2" => $datos["inicio_horario"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"]
            );
            $resultado3 = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::VERIFICAR_HORARIO_SOLAPADO_CURSO, $parametros3);
            $existe3 = $resultado3->fetch();
            //revisa si el curso ya tiene un horario que se interponga con el horario a guardar
            if ($existe3["existe"] == 1) {
                return 3;
            }

            //si el valor que retorna es "0" puede guardar en la BD el nuevo Horario cargado.
            return 0;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }

    public function modificar($datos) {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_profesor" => $datos["fk_profesor"],
                "fk_materia" => $datos["fk_materia"],
                "fk_modulo_inicio" => $datos["inicio_horario"],
                "fk_modulo_fin" => $datos["fin_horario"],
                "fk_curso" => $datos["fk_curso"],
                "dia_horario" => $datos["dia_horario"],
                "ciclo_lectivo_horario" => $datos["ciclo_lectivo_horario"],
                "id_horario" => $datos["id_horario"]);
            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_HORARIO, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

}
