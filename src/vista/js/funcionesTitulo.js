$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarTitulos();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregarTitulo").on('click', function () {
                app.limpiarModal();
                $("#id_titulo").val(0);
                $("#tituloModal").html("Agregar titulo");
                $("#modalTitulo").modal({show: true});
            });

            $("#formTitulo").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id_titulo").val() == 0) {
                    app.guardarTitulo();
                } else {
                    app.editarTitulo();
                }
            });

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarTitulos();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#cuerpoTablaTitulo").on('click', '.editar', function () {
                $("#id_titulo").val($(this).attr("data-id_titulo"));
                $("#modalTitulo").modal({show: true});
                $("#tituloModal").html("Editar titulo");
                $("#nombre_titulo").val($(this).parent().parent().children().first().html());
            });

            $("#cuerpoTablaTitulo").on('click', '.eliminar', function () {
                $("#id2").val($(this).attr("data-id_titulo"));
                $("#modal2").modal({show: true});
                $("#tituloModal2").html("¿Desea eliminar Título?");
                $("#nombre2").prop('disabled', true);
                $("#nombre2").val($(this).parent().parent().children().first().html());
            });

            $("#borrar").on('click', function () {
                app.eliminarTitulo($("#id2").val());
                $("#modal2").modal('hide');
            });

            $("#formTitulo").bootstrapValidator({
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=titulo";
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

        app.guardarTitulo = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Titulo";
            var datosEnviar = $("#formTitulo").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id_titulo").val());
                    $("#modalTitulo").modal('hide');
                    app.limpiarModal();
                    app.alertSave();
                },
                error: function (datosRecibidos) {
                    alert("Error al agregar titulo");
                    alert(datosRecibidos);
                }
            });
        };

        app.editarTitulo = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Titulo";
            var datosEnviar = $("#formTitulo").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id_titulo").val())
                    $("#modalTitulo").modal('hide');
                    app.limpiarModal();
                    app.alertModif();
                },
                error: function (datosRecibidos) {
                    alert("error al editar tiutlo");
                    alert(datosRecibidos);
                }
            })
        };

        app.actualizarTabla = function (titulo, id) {
            var html = "";
            if (id == 0) {
                html = '<tr>' +
                        '<td>' + titulo.nombre_titulo + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + titulo.id_titulo + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + titulo.id_titulo + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                        '</td>' +
                        '</tr>';
                $("#cuerpoTablaTitulo").append(html);
            } else {
                var fila = $("#cuerpoTablaTitulo").find("[data-id_titulo='" + id + "']").parent().parent();
                html = '<td>' + $("#nombre_titulo").val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id_titulo="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id_titulo="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminarTitulo = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Titulo";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function () {
                    app.eliminarFila(id);
                    $("#modalTitulo").modal('hide');
                    app.limpiarModal();
                    app.alertDelete();
                },
                error: function () {
                    alert("Error al eliminar titulo");
                }
            });
        };

        app.eliminarFila = function (id) {
            $("#cuerpoTablaTitulo").find("[data-id_titulo='" + id + "']").parent().parent().remove();
        };

        app.buscarTitulos = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Titulo";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar titulos");
                    alert(datosRecibidos);
                }
            });
        };

        app.rellenarTabla = function (datosTitulo) {
            if (datosTitulo == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTablaTitulo").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var html = "";
                $.each(datosTitulo, function (clave, titulo) {
                    html += '<tr>' +
                            '<td>' + titulo.nombre_titulo + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id_titulo="' + titulo.id_titulo + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id_titulo="' + titulo.id_titulo + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTablaTitulo").html(html);
            }
        };

        app.limpiarModal = function () {
            $("#nombre_titulo").val("");
            $("#accion").show();
            $("#formTitulo").bootstrapValidator('resetForm', true);
        };

        app.init();
    })(TallerAvanzada);
});


