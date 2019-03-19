$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarTitulos();
            app.buscarPostgrados();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregarPostgrado").on('click', function () {
                $("#id_Postgrado").val(0);
                $("#tituloModal").html("Agregar postgrado");
                $("#modalPostgrado").modal({show: true});
                $("#accion").html("Guardar");
            });

            $("#accion").on('click', function () {
                if ($("#accion").html() == "Guardar") {
                    if ($("#id_Postgrado").val() == 0) {
                        app.guardarPostgrado();
                    } else {
                        app.editarPostgrado();
                    }
                } else {
                    app.eliminarPostgrado();
                }
            });

            $("#cuerpoTablaPostgrado").on('click', '.editar', function () {
                $("#id_Postgrado").val($(this).attr("data-id_postgrado"));
                $("#modalPostgrado").modal({show: true});
                $("#tituloModal").html("Editar postgrado");
                $("#accion").html("Guardar");
                $("#nombrePostgrado").val($(this).parent().parent().children().first().html());
                $("#selectTitulo").val($(this).parent().parent().children().first().next().attr("data-id_titulo"));
            });

            $("#cuerpoTablaPostgrado").on('click', '.eliminar', function () {
                $("#id_Postgrado").val($(this).attr("data-id_postgrado"));
                $("#modalPostgrado").modal({show: true});
                $("#tituloModal").html("¿Esta seguro que desea eliminar este postgrado?");
                $("#fieldsetPostgrado").attr("disabled", "true");
                $("#accion").html("Eliminar");
                $("#nombrePostgrado").val($(this).parent().parent().children().first().html());
                $("#selectTitulo").val($(this).parent().parent().children().first().next().attr("data-id_titulo"));
            });

            $("#cuerpoTablaPostgrado").on('click', '.ver', function () {
                $("#id_Postgrado").val($(this).attr("data-id_postgrado"));
                $("#modalPostgrado").modal({show: true});
                $("#tituloModal").html("Ver postgrado");
                $("#fieldsetPostgrado").attr("disabled", "true");
                $("#accion").hide();
                $("#nombrePostgrado").val($(this).parent().parent().children().first().html());
                $("#selectTitulo").val($(this).parent().parent().children().first().next().attr("data-id_titulo"));
            });

            $("#modalPostgrado").on('hide.bs.modal', function () {
                app.limpiarModal();
            });

        };

        app.guardarPostgrado = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Postgrado";
            var datosEnviar = $("#formPostgrado").serialize();
            alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id_Postgrado").val());
                    $("#modalPostgrado").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error al agregar postgrado");
                    alert(datosRecibidos);
                }
            });
        };

        app.editarPostgrado = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Postgrado";
            var datosEnviar = $("#formPostgrado").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id_Postgrado").val())
                    $("#modalPostgrado").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("error al editar postgrado");
                    alert(datosRecibidos);
                }
            })
        };

        app.actualizarTabla = function (postgrado, id) {
            var html = "";
            if (id == 0) {
                html = "<tr>\n\
                             <td>" + postgrado.nombre_postgrado + "</td>\n\
                             <td data-id_titulo='" + postgrado.fk_titulo + "'>" + postgrado.nombre_titulo + "</td>\n\
                             <td>\n\
                                 <a class='ver' data-id_postgrado='" + postgrado.id_postgrado + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a>\n\
                                 <a class='eliminar' data-id_postgrado='" + postgrado.id_postgrado + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                                 <a class='editar' data-id_postgrado='" + postgrado.id_postgrado + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                             </td>\n\
                        </tr>";
                $("#cuerpoTablaPostgrado").append(html);
            } else {
                var fila = $("#cuerpoTablaPostgrado").find("a[data-id_postgrado='" + id + "']").parent().parent();
                html =       "<td>" + $("#nombrePostgrado").val() + "</td>\n\
                             <td data-id_titulo='" + $("#selectTitulo").val() + "'>" + $("#selectTitulo").find(":selected").html() + "</td>\n\
                             <td>\n\
                                 <a class='ver' data-id_postgrado='" + id + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a>\n\
                                 <a class='eliminar' data-id_postgrado='" + id + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                                 <a class='editar' data-id_postgrado='" + id + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                             </td>";
                fila.html(html);
            }
        };

        app.eliminarPostgrado = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Postgrado";
            var datosEnviar = $("#formPostgrado").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function () {
                    app.eliminarFila($("#id_Postgrado").val());
                    $("#modalPostgrado").modal('hide');
                },
                error: function () {
                    alert("Error al eliminar postgrado");
                }
            });
        };

        app.eliminarFila = function (id) {
            $("#cuerpoTablaPostgrado").find("a[data-id_postgrado='" + id + "']").parent().parent().remove();
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

        app.rellenarTabla = function (datosPostgrado) {
            var html = "";
            $.each(datosPostgrado, function (clave, postgrado) {
                html += "<tr>\n\
                             <td>" + postgrado.nombre_postgrado + "</td>\n\
                             <td data-id_titulo='" + postgrado.fk_titulo + "'>" + postgrado.nombre_titulo + "</td>\n\
                             <td>\n\
                                 <a class='ver' data-id_postgrado='" + postgrado.id_postgrado + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a>\n\
                                 <a class='eliminar' data-id_postgrado='" + postgrado.id_postgrado + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                                 <a class='editar' data-id_postgrado='" + postgrado.id_postgrado + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                             </td>\n\
                        </tr>";
            });
            $("#cuerpoTablaPostgrado").html(html);
        };
        
        app.buscarTitulos= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Titulo";
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
        
        app.rellenarTitulos= function (datosTitulo) {
            var html ="<option value=0>Seleccione un titulo</option>";
            $.each(datosTitulo,function(clave,titulo){
                html += "<option value='"+titulo.id_titulo+"'>"+titulo.nombre_titulo+"</option>";
            });
            $("#selectTitulo").html(html);
        };

        app.limpiarModal = function () {
            $("#selectTitulo");
            $("#nombrePostgrado").val("");
            $("#accion").show();
            $("#fieldsetPostgrado").removeAttr("disabled");
        };

        app.init();
    })(TallerAvanzada);
});


