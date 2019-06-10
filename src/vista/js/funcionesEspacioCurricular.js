$(function () {
    var TallerAvanzada = {};
    
    (function (app) {
        app.init= function(){
            app.buscarEspacioCurricular();
            app.bindigs();
        };
        
        app.buscarEspacioCurricular= function(){
            var url= "../controlador/ruteador/Ruteador.php?accion=listar&&Formulario=EspacioCurricular";
            $.ajax({
               url: url,
               method: 'GET',
               dataType: 'json',
               success: function(datosRecibidos){
                   app.rellenarTabla(datosRecibidos);
               },
               error: function(datosRecibidos){
                   alert("Error al buscar espacios curriculares");
               }
            });
        };
        
        app.rellenarTabla = function (data) {//funcion para rellenar la tabla carrera
            if (data == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTablaCarrera").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var linea = "";
                $.each(data, function (clave, carrera) {
                    linea += '<tr>' +
                            '<td>' + carrera.nombre_carrera + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + carrera.id_carrera + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + carrera.id_carrera + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTablaCarrera").html(linea);
            }
        };
    })(TallerAvanzada);
});