$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarTitulos();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregarTitulo").on('click', function () {
                $("#id_titulo").val(0);
                $("#tituloModal").html("Agregar titulo");
                $("#modalTitulo").modal({show: true});
                $("#accion").html("Guardar");
            });

            $("#accion").on('click', function () {
                if ($("#accion").html() == "Guardar") {
                    if ($("#id_titulo").val() == 0) {
                        app.guardarTitulo();
                    } else {
                        app.editarTitulo();
                    }
                } else {
                    app.eliminarTitulo();
                }
            });

            $("#cuerpoTablaTitulo").on('click', '.editar', function () {
                $("#id_titulo").val($(this).attr("data-id_titulo"));
                $("#modalTitulo").modal({show: true});
                $("#tituloModal").html("Editar titulo");
                $("#accion").html("Guardar");
                $("#nombreTitulo").val($(this).parent().parent().children().first().html());
            });
            
            $("#cuerpoTablaTitulo").on('click', '.eliminar', function () {
                $("#id_titulo").val($(this).attr("data-id_titulo"));
                $("#modalTitulo").modal({show: true});
                $("#tituloModal").html("¿Esta seguro que desea eliminar este titulo?");
                $("#fieldsetTitulo").attr("disabled","true");
                $("#accion").html("Eliminar");
                $("#nombreTitulo").val($(this).parent().parent().children().first().html());
            });
            
            $("#cuerpoTablaTitulo").on('click', '.ver', function () {
                $("#id_titulo").val($(this).attr("data-id_titulo"));
                $("#modalTitulo").modal({show: true});
                $("#tituloModal").html("Ver titulo");
                $("#fieldsetTitulo").attr("disabled","true");
                $("#accion").hide();
                $("#nombreTitulo").val($(this).parent().parent().children().first().html());
            });
            
            $("#modalTitulo").on('hide.bs.modal', function () {
                app.limpiarModal();
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
                html = "<tr>\n\
                        <td>" + titulo.nombre_titulo + "</td>\n\
                        <td><a class='ver' data-id_titulo='" + titulo.id_titulo + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a><a class='eliminar' data-id_titulo='" + titulo.id_titulo + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a><a class='editar' data-id_titulo='" + titulo.id_titulo + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a></td>\n\
                        </tr>";
                $("#cuerpoTablaTitulo").append(html);
            } else {
                var fila = $("#cuerpoTablaTitulo").find("a[data-id_titulo='" + id + "']").parent().parent();
                html = "<td>" + $("#nombreTitulo").val() + "</td>\n\
                        <td><a class='ver' data-id_titulo='" + id + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a><a class='eliminar' data-id_titulo='" + id + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a><a class='editar' data-id_titulo='" + id + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a></td>";
                fila.html(html);
            }
        };
        
        app.eliminarTitulo= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Titulo";
            var datosEnviar= $("#formTitulo").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function(){
                    app.eliminarFila($("#id_titulo").val());
                    $("#modalTitulo").modal('hide');
                },
                error: function () {
                    alert("Error al eliminar titulo");
                }
            });
        };
        
        app.eliminarFila= function (id) {
            $("#cuerpoTablaTitulo").find("a[data-id_titulo='"+id+"']").parent().parent().remove();
        }
        
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
            var html = "";
            $.each(datosTitulo, function (clave, titulo) {
                html += "<tr>\n\
                        <td>" + titulo.nombre_titulo + "</td>\n\
                        <td><a class='ver' data-id_titulo='" + titulo.id_titulo + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a><a class='eliminar' data-id_titulo='" + titulo.id_titulo + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a><a class='editar' data-id_titulo='" + titulo.id_titulo + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a></td>\n\
                        </tr>";
            });
            $("#cuerpoTablaTitulo").html(html);
        };
        
        app.limpiarModal= function(){
            $("#nombreTitulo").val("");
            $("#accion").show();
            $("#fieldsetTitulo").removeAttr("disabled");
        };

        app.init();
    })(TallerAvanzada);
});


