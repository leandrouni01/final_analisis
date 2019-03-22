$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            $("#eliminar").hide();
            app.buscarLocalidades();
            app.buscarPaises();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregarLocalidad").on('click', function () {
                $("#tituloModal").html("Agregar localidad");
                $("#id").val(0);
                $("#modalLocalidad").modal({show: true});
            });

            $("#formLocalidad").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id").val() == 0) {
                    app.guardarLocalidad();
                } else {
                    app.editarLocalidad();
                }
            });

            $("#eliminar").on('click', function () {
                app.eliminarLocalidad();
            });

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarLocalidades();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#cuerpoTablaLocalidades").on('click', '.editar', function () {
                $("#tituloModal").html("Editar localidad");
                $("#id").val($(this).attr("data-id_localidad"));
                $("#selectPais").find("option[value='" + $(this).parent().parent().children().first().next().attr("data-id_pais") + "']").prop("selected", "true");
                $("#selectPais").change();
                setTimeout(() => {
                    $("#selectProvincia").val($(this).parent().parent().children().first().next().next().attr("data-id_provincia"));
                }, 200);
                $("#nombreLocalidad").val($(this).parent().parent().children().first().html());
                $("#accion").html("Guardar");
                $("#modalLocalidad").modal({show: true});
            });

            $("#cuerpoTablaLocalidades").on('click', '.eliminar', function () {
                $("#tituloModal").html("¿Está seguro que desea eliminar esta localidad?");
                $("#id").val($(this).attr("data-id_localidad"));
                $("#selectPais").find("option[value='" + $(this).parent().parent().children().first().next().attr("data-id_pais") + "']").prop("selected", "true");
                $("#selectPais").change();
                setTimeout(() => {
                    $("#selectProvincia").val($(this).parent().parent().children().first().next().next().attr("data-id_provincia"));
                }, 200);
                $("#nombreLocalidad").val($(this).parent().parent().children().first().html());
                $("#submit").hide();
                $("#eliminar").show();
                $("#fieldsetLocalidad").attr("disabled", "true");
                $("#accion").html("Eliminar");
                $("#modalLocalidad").modal({show: true});
            });

            $("#cuerpoTablaLocalidades").on('click', '.ver', function () {
                $("#tituloModal").html("Ver localidad");
                $("#id").val($(this).attr("data-id_localidad"));
                $("#selectPais").find("option[value='" + $(this).parent().parent().children().first().next().attr("data-id_pais") + "']").prop("selected", "true");
                var html = "<option value='" + $(this).parent().parent().children().first().next().next().attr("data-id_provincia") + "'>" + $(this).parent().parent().children().first().next().next().html() + "</option>";
                $("#selectProvincia").prepend(html);
                $("#nombreLocalidad").val($(this).parent().parent().children().first().html());
                $("#fieldsetLocalidad").attr("disabled", "true");
                $("#submit").hide();
                $("#modalLocalidad").modal({show: true});
            });

            $("#selectPais").on("change", function () {
                app.buscarProvincia();
            });

            $("#formLocalidad").bootstrapValidator({
                excluded: []
            });

            $("#modalLocalidad").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };

        app.guardarLocalidad = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Localidad";
            var datosEnviar = $("#formLocalidad").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    $("#modalLocalidad").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error al guardar Localidad");
                    alert(datosRecibidos);
                }
            });
        };

        app.editarLocalidad = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Localidad";
            var datosEnviar = $("#formLocalidad").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    $("#modalLocalidad").modal("hide");
                },
                error: function (datosRecibidos) {
                    alert("error al editar localidad");
                    alert(datosRecibidos);
                }
            });
        };

        app.actualizarTabla = function (localidad, id) {
            var html = "";
            if (id == 0) {
                html = "<tr>\n\
                          <td>" + localidad.nombre_localidad + "</td>\n\
                          <td data-id_pais='" + localidad.fk_pais + "'>" + localidad.nombre_pais + "</td>\n\
                          <td data-id_provincia='" + localidad.fk_provincia + "'>" + localidad.nombre_provincia + "</td>\n\
                          <td>\n\
                              <a class='btn btn-sm btn-warning pull-left editar' data-id_localidad='" + localidad.id_localidad + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                              <a class='btn btn-sm btn-danger pull-right eliminar' data-id_localidad='" + localidad.id_localidad + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                          </td>\n\
                        </tr>";
                $("#cuerpoTablaLocalidades").append(html);
            } else {
                var fila = $("#cuerpoTablaLocalidades").find("a[data-id_localidad='" + id + "']").parent().parent();
                html = "<td>" + $("#nombreLocalidad").val() + "</td>\n\
                        <td data-id_pais='" + $("#selectPais").find(":selected").val() + "'>" + $("#selectPais").find(":selected").html() + "</td>\n\
                        <td data-id_provincia='" + $("#selectProvincia").find(":selected").val() + "'>" + $("#selectProvincia").find(":selected").html() + "</td>\n\
                        <td>\n\
                          <a class='btn btn-sm btn-warning pull-left editar' data-id_localidad='" + id + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                          <a class='btn btn-sm btn-danger pull-right eliminar' data-id_localidad='" + id + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                        </td>";
                fila.html(html);
            }
        };

        app.eliminarLocalidad = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Localidad";
            var datosEnviar = $("#formLocalidad").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function () {
                    app.eliminarFila($("#id").val());
                    $("#modalLocalidad").modal("hide");
                },
                error: function () {
                    alert("Error al eliminar localidad");
                }
            });
        };

        app.eliminarFila = function (id) {
            $("#cuerpoTablaLocalidades").find("a[data-id_localidad='" + id + "']").parent().parent().remove();
        };

        app.buscarLocalidades = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Localidad";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar localidades");
                    alert(datosRecibidos);
                }
            });
        };

        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=Localidad";
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

        app.rellenarTabla = function (datosLocalidad) {
            if (datosLocalidad == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTablaLocalidades").html('');
                $("#alert").html(alerta);
            } else {
                var html = "";
                $.each(datosLocalidad, function (clave, localidad) {
                    html += "<tr>\n\
                            <td>" + localidad.nombre_localidad + "</td>\n\
                            <td data-id_pais='" + localidad.fk_pais + "'>" + localidad.nombre_pais + "</td>\n\
                            <td data-id_provincia='" + localidad.fk_provincia + "'>" + localidad.nombre_provincia + "</td>\n\
                            <td>\n\
                                <a class='btn btn-sm btn-warning pull-left editar' data-id_localidad='" + localidad.id_localidad + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                                <a class='btn btn-sm btn-danger pull-right eliminar' data-id_localidad='" + localidad.id_localidad + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                            </td>\n\
                        </tr>";
                });
                $("#alert").html('');
                $("#cuerpoTablaLocalidades").html(html);
            }
        };

        app.buscarPaises = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Pais";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarPaises(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar paises");
                    alert(datosRecibidos);
                }
            });
        };

        app.rellenarPaises = function (datosPaises) {
            var html = "<option selected disabled value=''>Seleccione un pais</option>";
            $.each(datosPaises, function (clave, pais) {
                html += "<option value='" + pais.id_pais + "'>" + pais.nombre_pais + "</option>";
            });
            $("#selectPais").html(html);
        };

        app.buscarProvincia = function (datos) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listarProvincias&Formulario=Localidad";
            var datosEnviar = $("#formLocalidad").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.rellenarProvincia(datosRecibidos, datos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar provincias");
                    alert(datosRecibidos);
                }
            });
        };

        app.rellenarProvincia = function (datosProvincia) {
            var html = "<option selected disabled value=''>Seleccione una provincia</option>";
            $.each(datosProvincia, function (clave, provincia) {
                html += "<option value='" + provincia.id_provincia + "'>" + provincia.nombre_provincia + "</option>";
            });
            $("#selectProvincia").html(html);
        };

        app.limpiarModal = function () {
            $("#selectPais").val("");
            $("#selectProvincia").html("");
            $("#nombreLocalidad").val("");
            $("#fieldsetLocalidad").removeAttr("disabled");
            $("#submit").show();
            $("#eliminar").hide();
            $("#formLocalidad").bootstrapValidator('resetForm', true);
        };

        app.init();
    })(TallerAvanzada);
});