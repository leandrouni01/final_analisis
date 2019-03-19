$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {

            app.buscarCarrera();
            app.bindings();

        };

        app.bindings = function () {
            $("#agregarCarrera").on('click', function (event) {
                app.limpiarModal();
                $("#id").val(0);
                $("#tituloModal").html("Nueva Carrera");
                $("#modalCarrera").modal({show: true});
            });

            $("#formCarrera").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id").val() == 0) {
                    app.guardarCarrera();
                } else {
                    app.modificarCarrera();
                }
            });

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarCarrera();
                } else {
                    app.busqueda(parametros);
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

            $("#borrar").on('click', function () {
                app.eliminarCarrera($("#id2").val());
                $("#modal2").modal('hide');
            });

            $("#formCarrera").bootstrapValidator({
                excluded: [],
            });

        };

        app.showAlert = function () {
            $("#alerta").fadeIn();
            setTimeout(function () {
                $("#alerta").fadeOut();
            }, 1500);
        };

        app.alertSave = function () {
            var alerta = '<div class="alert alert-success" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-saved"></span>' + ' ¡Agregado con exito!' + '</strong>' + ' Se cargo un registro en la Base de Datos ' +
                    '</div>';
            $("#alerta").html(alerta);
            app.showAlert();
        };

        app.alertModif = function () {
            var alerta = '<div class="alert alert-warning" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-saved"></span>' + ' ¡Actualizado con exito!' + '</strong>' + ' Se modificó un registro en la Base de Datos ' +
                    '</div>';
            $("#alerta").html(alerta);
            app.showAlert();
        };

        app.alertDelete = function () {
            var alerta = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-remove"></span>' + ' ¡Eliminado con exito!' + '</strong>' + ' Se elimino un registro en la Base de Datos ' +
                    '</div>';
            $("#alerta").html(alerta);
            app.showAlert();
        };

        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=carrera";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: {textBusca: parametros},
                success: function (data) {
                    app.rellenarTabla(data);
                },
                error: function () {
                    alert('error busqueda');
                }
            });
        };

        app.buscarCarrera = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Carrera";
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

        app.guardarCarrera = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Carrera";
            var datosEnviar = $("#formCarrera").serialize();
            //alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalCarrera").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertSave();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar carrera");
                    alert(datosRecibidos);
                }
            });
        };

        app.modificarCarrera = function () {

            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Carrera";
            var datosEnviar = $("#formCarrera").serialize();
            //alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalCarrera").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertModif();
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Carrera";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.borrarFila(id);
                    app.alertDelete();
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
            $('#formCarrera').bootstrapValidator('resetForm', true);
        };

        app.init();

    })(TallerAvanzada);
});