$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.listarCombo();
            app.buscar();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                $("#id").val(0);
                $("#tituloModal").html("Nuevo");
                $("#modal").modal({show: true});
            });

            $("#guardar").on('click', function (event) {
                event.preventDefault();
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });

            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $("#id").val($(this).attr("data-id"));
                $("#nombre").val($(this).parent().parent().children().html());
                $("#combo").find(':selected').val($(this).parent().parent().children().first().next().html());
                $("#combo").val($(this).parent().parent().children().first().next().attr("data-fk_p"));
                $("#tituloModal").html("Editar");
                $("#modal").modal({show: true})
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                app.eliminar($(this).attr("data-id"));
            });
            
            $("#salirModal").on('click', function (e) {
                app.listarCombo();
            });

            $("#form").bootstrapValidator({
                excluded: [],
            });

        };
        
        app.listarCombo = function (id) {
            var ajaxObj = ({
                method: 'POST',
                dataType: 'json',
                data: {id: id},
                success: function (data) {
                    var item = "combo";
                    app.rellenarCombo(data, item);
                },
                error: function () {
                    alert('error buscar carrera');
                }
            });

            const page = $("#pageName").val();
            switch (page) {
                case "provincia":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=pais";
                    break;
                case "localidad":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=provincia";
                    break;
                default:
                    break;
            };
            jQuery.ajax(ajaxObj);
        };

        app.rellenarCombo = function (data, itemRecibido) { 
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");

            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id + '">' + value.nombre + '</option>');
            });
        };

        app.buscar = function () {
            var ajaxObj = ({
                type: "GET",
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error buscar');
                }
            });

            const page = $("#pageName").val();
            switch (page) {
                case "provincia":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Provincia";
                    break;
                case "localidad":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Localidad";
                    break;
                default:
                    break;
            };
            jQuery.ajax(ajaxObj);
        };

        app.rellenarTabla = function (data) {//funcion para rellenar la tabla pais
            //alert("Entre en rellenar tabla");
            var linea = "";
            $.each(data, function (clave, object) {
                linea += '<tr>' +
                        '<td>' + object.nombre + '</td>' +
                        '<td data-fk_p="'+ object.id_p + '">' + object.nombre_p + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + object.id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' + //data- : crea un metadato de la clave primaria.
                        '<a class="pull-right eliminar" data-id="' + object.id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
            });
            $("#cuerpoTabla").html(linea);
        };

        app.guardar = function () {
            var datosEnviar = $("#form").serialize();
            var ajaxObj = ({
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar");
                    alert(datosRecibidos);
                }
            });

            const page = $("#pageName").val();
            switch (page) {
                case "provincia":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Provincia";
                    break;
                case "localidad":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Localidad";
                    break;
                default:
                    break;
            };
            jQuery.ajax(ajaxObj);
        };

        app.modificar = function () {
            var datosEnviar = $("#form").serialize();
            var ajaxObj = ({
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.buscar();
                    app.listarCombo();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar");
                    alert(datosRecibidos);
                }
            });
            
            const page = $("#pageName").val();
            switch (page) {
                case "provincia":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Provincia";
                    break;
                case "localidad":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Localidad";
                    break;
                default:
                    break;
            };
            jQuery.ajax(ajaxObj);
        };

        app.actualizarTabla = function (object, id) {
            if (id == 0) {
                var html = '<tr>' +
                        '<td>' + object.nombre + '</td>' +
                        '<td data-fk_p="'+ object.id_p + '">' + object.nombre_p + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + object.id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id="' + object.id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
            } else {
                //Modifico un Pais existente, busco la fila.
                var fila = $("#cuerpoTabla").find("a[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre").val() + '</td>' +
                        '<td>' + $("#combo").find(':selected').text() + '</td>' +                       
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id="' + id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {//funcion para eliminar un pais
            //alert(id);
            var ajaxObj = ({
                method: "POST",
                data: {id: id},
                success: function (datosRecibidos) {
                    app.borrarFila(id);
                },
                error: function (datosRecibidos) {
                    alert('error al eliminar');
                }
            });

            const page = $("#pageName").val();
            switch (page) {
                case "provincia":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Provincia";
                    break;
                case "localidad":
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Localidad";
                    break;
                default:
                    break;
            };
            jQuery.ajax(ajaxObj);
        };

        app.borrarFila = function (id) {//funcion para borrar una fila de la tabla pais
            var fila = $("#cuerpoTabla").find("a[data-id='" + id + "']").parent().parent().remove();
        };

        app.limpiarModal = function () {//funcion para limpiar el modal de pais
            $("#id").val(0);
            $("#nombre").val('');
            app.listarCombo();
        };

        app.init();

    })(TallerAvanzada);

});