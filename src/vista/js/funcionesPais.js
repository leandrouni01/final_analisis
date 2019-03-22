$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            $("#eliminar").hide();
            app.buscarPais();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregarPais").on('click', function () {
                $("#id").val(0);
                $("#tituloModal").html("Agregar Pais");
                $("#modalPais").modal({show: true});
            });
            $("#formPais").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id").val() == 0) {
                    app.guardarPais();
                } else {
                    app.editarPais();
                }
            });

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarPais();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#eliminar").on('click', function () {
                app.eliminarPais();
            });

            $("#cuerpoTablaPais").on('click', '.editar', function (event) {
                $("#id").val($(this).attr("data-id_pais"));
                $("#nombrePais").val($(this).parent().parent().children().first().html());
                $("#tituloModal").html("Editar Pais");
                $("#modalPais").modal({show: true});
                //alert($(this).attr("data-id_pais"));
            });

            $("#cuerpoTablaPais").on('click', '.eliminar', function (event) {
                $("#id").val($(this).attr("data-id_pais"));
                $("#nombrePais").val($(this).parent().parent().children().first().html());
                $("#tituloModal").html("¿Esta seguro que desea eliminar este pais?");
                $("#accion").html("Eliminar");
                $("#modalPais").modal({show: true});
                $("#submit").hide();
                $("#eliminar").show();
                $("#inputNombre").attr("disabled", "true");
            });
            $("#modalPais").on('hide.bs.modal', function () {
                app.limpiarModal();
            });

            $("#formPais").bootstrapValidator({
                excluded: []
            });
        };


        app.buscarPais = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Pais";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error buscar pais');
                }
            });
        };

        app.rellenarTabla = function (datosPais) {
            var html = "";
            if (datosPais == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTablaPais").html('');
                $("#alert").html(alerta);
            } else {
                $.each(datosPais, function (clave, pais) {
                    html += "<tr>\n\
                            <td>" + pais.nombre_pais + "</td>\n\
                            <td>\n\
                                <a class='btn btn-warning pull-left editar' data-id_pais='" + pais.id_pais + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                                <a class='btn btn-danger pull-right eliminar' data-id_pais='" + pais.id_pais + "'><span class='glyphicon glyphicon-remove'></span>Eliminar </a>\n\
                            </td>\
                         </tr>";
                });
                $("#cuerpoTablaPais").html(html);
                $("#alert").html('');
            }
        };

        app.guardarPais = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Pais";
            var datosEnviar = $("#formPais").serialize();
            //alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    $("#modalPais").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar pais");
                }
            });
        };
        app.editarPais = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Pais";
            var datosEnviar = $("#formPais").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    //alert("editar");
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    $("#modalPais").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error en editar pais");
                }
            });
        };
        app.eliminarPais = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Pais";
            var datosEnviar = $("#formPais").serialize();
            //alert($("#formPais").serialize());
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    //alert("entré");
                    app.borrarFila($("#id").val());
                    $("#modalPais").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error al eliminar pais");
                }
            });
        };
        app.borrarFila = function (id) {
            var fila = $("#cuerpoTablaPais").find("a[data-id_pais='" + id + "']").parent().parent().remove();
        };
        app.actualizarTabla = function (pais, id) {
            if (id == 0) {
                //alert("guardar");
                var html = "<tr>\n\
                            <td>" + pais.nombre_pais + "</td>\n\
                            <td>\n\
                                <a class='btn btn-warning pull-left editar' data-id_pais='" + pais.id_pais + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                                <a class='btn btn-danger pull-right eliminar' data-id_pais='" + pais.id_pais + "'><span class='glyphicon glyphicon-remove'></span>Eliminar </a>\n\
                            </td>\
                         </tr>";
                $("#cuerpoTablaPais").append(html);
            } else {
                //alert("editar");
                var fila = $("#cuerpoTablaPais").find("a[data-id_pais='" + id + "']").parent().parent();
                var html = "<td>" + $("#nombrePais").val() + "</td>\n\
                            <td>\n\
                                <a class='btn btn-warning pull-left editar' data-id_pais='" + id + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                                <a  class='btn btn-danger pull-right eliminar' data-id_pais='" + id + "'><span class='glyphicon glyphicon-remove'></span>Eliminar </a>\n\
                            </td>";
                fila.html(html);
            }
        };

        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=Pais";
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

        app.limpiarModal = function () {
            $("#id").val(0);
            $("#nombrePais").val("");
            if ($("#inputNombre").attr("disabled")) {
                $("#inputNombre").removeAttr("disabled");
            }
            $("#submit").show();
            $("#eliminar").hide();
            $('#formPais').bootstrapValidator('resetForm', true);
        };
        app.init();
    })(TallerAvanzada);
});