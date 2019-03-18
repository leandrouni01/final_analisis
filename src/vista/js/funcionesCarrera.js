$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            
            app.buscarCarrera();
            app.bindings();
            
        };

        app.bindings = function () {
            $("#agregarCarrera").on('click', function (event) {
                $("#id").val(0);
                $("#tituloModal").html("Nueva Carrera");
                $("#modalCarrera").modal({show: true});
            });

            $("#guardar").on('click', function (event) {
                event.preventDefault();
                if ($("#id").val() == 0) {
                    app.guardarCarrera();
                } else {
                    app.modificarCarrera();
                }
            });

            $("#cuerpoTablaCarrera").on('click', '.editar', function (event) {
                $("#id").val($(this).attr("data-id"));
                $("#nombre").val($(this).parent().parent().children().html());
                $("#tituloModal").html("Editar Carrera");
                $("#modalCarrera").modal({show: true})
            });

            $("#cuerpoTablaCarrera").on('click', '.eliminar', function () {
                $("#id2").val($(this).attr("data-id"));
                $("#nombre2").prop('disabled', true);
                $("#nombre2").val($(this).parent().parent().children().html());
                $("#tituloModal2").html("¿Desea Eliminar Carrera?");
                $("#modal2").modal({show: true});
            });
            
            $("#borrar").on('click', function(){
                app.eliminarCarrera($("#id2").val());
                $("#modal2").modal('hide');
            });

            $("#formCarrera").bootstrapValidator({
                excluded: [],
            });

        };

        app.buscarCarrera = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=carrera";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error buscar carrera');
                }
            });
          
        };        
        
        app.rellenarTabla = function (data) {//funcion para rellenar la tabla carrera
            //alert("Entre en rellenar tabla");
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
        };

        app.guardarCarrera = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=carrera";
            var datosEnviar = $("#formCarrera").serialize();
            alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalCarrera").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar carrera");
                    alert(datosRecibidos);
                }
            });
        };

        app.modificarCarrera = function () {

            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=carrera";
            var datosEnviar = $("#formCarrera").serialize();
            alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalCarrera").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar carrera");
                    alert(datosRecibidos);
                }
            });
        };

        app.actualizarTabla = function (carrera, id) {
            if (id == 0) {
                var html = '<tr>' +
                        '<td>' + carrera.nombre_carrera + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + carrera.id_carrera + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + carrera.id_carrera + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                        '</td>' +
                        '</tr>';
                $("#cuerpoTablaCarrera").append(html);
            } else {
                //Modifico un Pais existente, busco la fila.
                var fila = $("#cuerpoTablaCarrera").find("[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre").val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                        '</td>';
                fila.html(html);
            }
        };       
        
       app.eliminarCarrera = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=carrera";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.borrarFila(id);
                },
                error: function (datosRecibidos) {
                    alert('Error al eliminar');
                }
            });
        };

        app.borrarFila = function (id) {//funcion para borrar una fila de la tabla carrera
            var fila = $("#cuerpoTablaCarrera").find("[data-id='" + id + "']").parent().parent().remove();
        };

        app.limpiarModal = function () {//funcion para limpiar el modal
            $("#id").val(0);
            $("#nombre").val('');
        };

        app.init();

    })(TallerAvanzada);
});