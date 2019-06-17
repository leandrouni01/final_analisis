<?php

require_once 'ControladorGeneral.php';

class ControladorEspacioCurricular extends ControladorGeneral
{
    function __construct()
    {
        parent::__construct();
    }

    public function agregar($datos)
    {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_materia" => $datos["fk_materia"],
                "fk_curso" => $datos["fk_curso"]
            );

            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_ESPACIO_CURRICULAR, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();

            return $this->buscarUltimoEspacio();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error : " . $e->getMessage();
        }
    }

    public function buscarUltimoEspacio()
    {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_ULTIMO_ESPACIO_CURRICULAR);
            $fila = $resultado->fetch(PDO::FETCH_ASSOC);

            return $fila;
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function listar($datos)
    {
        try {
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::LISTAR_ESPACIOS_CURRICULARES);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);

            return $array;
        } catch (Exception $e) {
            echo "Error : " . $e->getMessage();
        }
    }

    public function modificar($datos)
    {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array(
                "fk_materia" => $datos["fk_materia"],
                "fk_curso" => $datos["fk_curso"]
            );

            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_ESPACIO_CURRICULAR, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exeption $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarDuracion($datos){
        //recibe id
        try {
            $parametros = array("id_plan" => $datos["id_plan"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_AÑOS_EC ,$parametros);
            $fila = $resultado->fetch();

            return $fila;
        } catch (Exception $e){
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscarMaterias($datos){
        //recibe idplan , anio
        try {
            $parametros = array("id_plan" => $datos["id_plan"] , 
            "anio" => $datos["anio"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_MATERIAS_EC, $parametros);
            $fila = $resultado->fetchAll(PDO::FETCH_ASSOC);

            return $fila;
        } catch(Exception $e){
            echo "Error :" . $e->getMessage(); 
        }
    }

    public function buscarCursos($datos){
        //id_sede , anios
        try {
            $parametros = array("fk_sede" => $datos["id_sede"],
            "anio_curso" => $datos["anio"]);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::BUSCAR_CURSOS_EC, $parametros);
            $fila = $resultado->fetchAll(PDO::FETCH_ASSOC);

            return $fila;
        } catch(Execption $e){
            echo "Error :" . $e->getMessage();
        }
    }

    public function eliminar($datos)
    {
        try {
            $this->refControladorPersistencia->iniciarTransaccion();
            $parametros = array("id_espacio_curricular" => $datos["id_espacio_curricular"]);

            $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_ESPACIO_CURRICULAR, $parametros);
            $this->refControladorPersistencia->confirmarTransaccion();
        } catch (Exception $e) {
            $this->refControladorPersistencia->rollBackTransaccion();
            echo "Error :" . $e->getMessage();
        }
    }

    public function buscar($datos)
    {
        try {
            $parametros = array("valor" => $datos['textBusca']);
            $query = str_replace("?", $parametros['valor'] . "", DbSentencias::BUSCADOR_ESPACIO_CURRICULAR);
            $resultado = $this->refControladorPersistencia->ejecutarSentencia($query);
            $array = $resultado->fetchAll(PDO::FETCH_ASSOC);
            return $array;
        } catch (Exception $e) {
            echo "Error :" . $e->getMessage();
        }
    }
}
