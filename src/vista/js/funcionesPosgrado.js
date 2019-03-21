$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarTitulos();
            app.buscarPostgrados();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregarPosgrado").on('click', function () {
                app.limpiarModal();
                app.buscarTitulos();
                $("#id").val(0);
                $("#tituloModal").html("Agregar Posgrado");
                $("#modalPosgrado").modal({show: true});
            });

            $("#formPosgrado").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id").val() == 0) {
                    app.guardarPostgrado();
                } else {
                    app.editarPostgrado();
                }
            });


            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarPostgrados();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#cuerpoTabla").on('click', '.editar', function () {
                $("#formPosgrado").bootstrapValidator('resetForm', true);
                $("#id").val($(this).attr("data-id_posgrado"));
                $("#modalPosgrado").modal({show: true});
                $("#tituloModal").html("Editar Posgrado");
                $("#nombre_posgrado").val($(this).parent().parent().children().first().html());
                $("#selectTitulo").val($(this).parent().parent().children().first().next().attr("data-fk_titulo"));
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                $("#id2").val($(this).attr("data-id_posgrado"));
                $("#modal2").modal({show: true});
                $("#tituloModal2").html("¿Desea eliminar Posgrado?");
                $("#nombre2").prop('disabled', true);
                $("#nombre2").val($(this).parent().parent().children().first().next().html());
                $("#titulo2").prop('disabled', true);
                $("#titulo2").val($(this).parent().parent().children().first().html());
            });

            $("#borrar").on('click', function () {
                app.eliminarPostgrado($("#id2").val());
                $("#modal2").modal('hide');
            });

            $("#formPosgrado").bootstrapValidator({
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=postgrado";
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

        app.guardarPostgrado = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Postgrado";
            var datosEnviar = $("#formPosgrado").serialize();
            alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    $("#modalPosgrado").modal('hide');
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error al agregar posgrado");
                    alert(datosRecibidos);
                }
            });
        };

        app.editarPostgrado = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Postgrado";
            var datosEnviar = $("#formPosgrado").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id").val())
                    $("#modalPosgrado").modal('hide');
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("error al editar postgrado");
                    alert(datosRecibidos);
                }
            })
        };

        app.actualizarTabla = function (posgrado, id) {
            var html = "";
            if (id == 0) {
                html = '<tr>' +
                        '<td>' + posgrado.nombre_postgrado + '</td>' +
                        '<td data-fk_titulo="' + posgrado.fk_titulo + '">' + posgrado.nombre_titulo + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id_posgrado="' + posgrado.id_postgrado + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id_posgrado="' + posgrado.id_postgrado + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
            } else {
                var fila = $("#cuerpoTabla").find("[data-id_posgrado='" + id + "']").parent().parent();
                html = '<td>' + $("#nombre_posgrado").val() + '</td>' +
                        '<td data-fk_titulo="' + $("#selectTitulo").find(':selected').val() + '">' + $("#selectTitulo").find(':selected').text() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id_posgrado="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id_posgrado="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminarPostgrado = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Postgrado";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function () {
                    app.eliminarFila(id);
                    $("#modalPosgrado").modal('hide');
                },
                error: function () {
                    alert("Error al eliminar postgrado");
                }
            });
        };

        app.eliminarFila = function (id) {
            $("#cuerpoTabla").find("[data-id_posgrado='" + id + "']").parent().parent().remove();
        }

        app.buscarPostgrados = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Postgrado";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar postgrados");
                    alert(datosRecibidos);
                }
            });
        };

        app.rellenarTabla = function (datosPosgrado) {
            if (datosPosgrado == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTabla").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var html = "";
                $.each(datosPosgrado, function (clave, posgrado) {
                    html += '<tr>' +
                            '<td>' + posgrado.nombre_postgrado + '</td>' +
                            '<td data-fk_titulo="' + posgrado.fk_titulo + '">' + posgrado.nombre_titulo + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id_posgrado="' + posgrado.id_postgrado + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id_posgrado="' + posgrado.id_postgrado + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTabla").html(html);
            }
        };

        app.buscarTitulos = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Titulo";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTitulos(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert(datosRecibidos);
                    alert("Error al buscar titulos");
                }
            });
        };

        app.rellenarTitulos = function (datosTitulo) {
            var html = "<option selected disabled>Seleccione un titulo</option>";
            $.each(datosTitulo, function (clave, titulo) {
                html += "<option value='" + titulo.id_titulo + "'>" + titulo.nombre_titulo + "</option>";
            });
            $("#selectTitulo").html(html);
        };

        app.limpiarModal = function () {
            $("#nombrePostgrado").val("");
            $("#formPosgrado").bootstrapValidator('resetForm', true);
        };

        app.init();
    })(TallerAvanzada);
});


