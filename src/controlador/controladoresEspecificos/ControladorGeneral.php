<?php
require_once '../persistencia/ControladorPersistencia.php';
require_once '../persistencia/DbSentencias.php';

abstract class ControladorGeneral implements DbSentencias {
    protected $refControladorPersistencia;
    
    function __construct() {
        $this->refControladorPersistencia = ControladorPersistencia::obtenerCP();
    }

    public abstract function agregar($datos);
    public abstract function modificar($datos);
    public abstract function eliminar($datos);
    public abstract function buscar($datos);
    public abstract function listar($datos);
}
