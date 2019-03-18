<?php




  
     // averiguo que formulario me pide una acciòn atrapo los datos de la URL   
        $formulario = $_GET['Formulario'];
        $accion = $_GET['accion'];
        
        // armo una variable local con un contenido para hacerlo dinàmico
        $controlador = 'Controlador' . $formulario;
      // importo el controlador especìfico armamdo la cadena dinàmica de texto  
        require_once '../controladoresEspecificos/' . $controlador . '.php'; //cargo el controlador espeficifico
// recupero los datos enviados en el formulario si los hubiera
        // creo una instancia del controlador y le paso los datos del formulario
        $datosFormulario= $_POST;
        $refControlador = new $controlador($datosFormulario);
        // llamo al mètodo solicitado en la vista
        $resultado = $refControlador->$accion($datosFormulario);
        // devuelvo la acciòn a la vista
        echo json_encode($resultado); //devuelvo datos al js