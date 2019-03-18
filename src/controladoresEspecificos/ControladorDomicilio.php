<?php

require_once 'ControladorGeneral.php';

class ControladorDomicilio extends ControladorGeneral{
    function __construct() {
        parent::__construct();
        }

    public function agregar($datos) {
        $parametros = array("calle_domicilio" => $datos['calle_domicilio'],"numero_domicilio" => $datos['numero_domicilio'],"fk_localidad"=>$datos["fk_localidad"]);
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::INSERTAR_DOMICILIO,$parametros);
    }

    public function buscar($datos) {
        
    }

    public function eliminar($datos) {
        $parametros = array("id_domicilio" => $datos['id_domicilio']);
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ELIMINAR_DOMICILIO,$parametros);
    }

    public function listar($datos) {
        
    }

    public function modificar($datos) {
        $parametros = array("calle_domicilio" => $datos['calle_domicilio'],"numero_domicilio" => $datos['numero_domicilio'],"fk_localidad"=>$datos["fk_localidad"],"id_domicilio" => $datos['id_domicilio']);
        $resultado = $this->refControladorPersistencia->ejecutarSentencia(DbSentencias::ACTUALIZAR_DOMICILIO,$parametros);
    }

}
