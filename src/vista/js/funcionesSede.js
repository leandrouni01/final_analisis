$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.listarCombos(1,'pais');
            app.buscar();
            app.bindings();
        };

        app.bindings = function () {

            $("#agregar").on('click', function (event) {
                app.limpiarModal();                                                                                                                                                                                                                                                                                                                                                                                                   //limpio el modal entero
                var item = $("#combos").val('pais'); //asigno el valor de pais para poder listar nuevamente los combos.
                app.listarCombos(1,'pais');

                $("#id").val(0);
                $("#tituloModal").html("Nueva Sede");
                $("#modal").modal({show: true});

            });

            $("#form").on('success.form.bv' , function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });

            $("#comboPais").change(function () {
                var item = 'provincia';
                app.listarCombos($("#comboPais").find(':selected').val(),'provincia');
            });

            $("#comboProvincia").change(function () {
                var item = $("#combos").val('localidad');
                app.listarCombos($("#comboProvincia").find(':selected').val(),'localidad');
            });

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscar();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $('#form').bootstrapValidator('resetForm', true);
                $("#id").val($(this).attr("data-id"));
                $("#id_domicilio").val($(this).parent().parent().children().first().next().next().next().next().next().next().attr("data-fk_domicilio"));
                $("#nombre_sede").val($(this).parent().parent().children().html());
                $("#numero_sede").val($(this).parent().parent().children().first().next().html());
                $("#telefono_sede").val($(this).parent().parent().children().first().next().next().html());
                $("#comboPais").val($(this).parent().parent().children().first().next().next().next().attr("data-fk_pais"));

                $("#comboPais").change();
                setTimeout(() => {
                    $("#comboProvincia").val($(this).parent().parent().children().first().next().next().next().next().attr("data-fk_provincia"));
                    $("#comboProvincia").change();

                }, 200);

                setTimeout(() => {
                    $("#combo").val($(this).parent().parent().children().first().next().next().next().next().next().attr("data-fk_localidad"));
                }, 300);

                $("#calle_domicilio").val($(this).parent().parent().children().first().next().next().next().next().next().next().html());
                $("#numero_domicilio").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().html());
                $("#tituloModal").html("Editar Sede");
                $("#modal").modal({show: true});
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                $("#id2").val($(this).attr("data-id"));
                $("#nombre2").prop('disabled', true);
                $("#nombre2").val($(this).parent().parent().children().html());
                $("#nro2").prop('disabled', true);
                $("#nro2").val($(this).parent().parent().children().first().next().html());
                $("#telefono2").prop('disabled', true);
                $("#telefono2").val($(this).parent().parent().children().first().next().next().html());
                $("#pais2").prop('disabled', true);
                $("#pais2").val($(this).parent().parent().children().first().next().next().next().html());
                $("#provincia2").prop('disabled', true);
                $("#provincia2").val($(this).parent().parent().children().first().next().next().next().next().html());
                $("#localidad2").prop('disabled', true);
                $("#localidad2").val($(this).parent().parent().children().first().next().next().next().next().next().html());
                $("#calle2").prop('disabled', true);
                $("#calle2").val($(this).parent().parent().children().first().next().next().next().next().next().next().html());
                $("#numero2").prop('disabled', true);
                $("#numero2").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().html());
                $("#tituloModal2").html("¿Desea Eliminar Sede?");
                $("#modal2").modal({show: true})
            });

            $("#borrar").on('click', function () {

                app.eliminar($("#id2").val());
                $("#modal2").modal('hide');
            });

            $("#salirModal").on('click', function (e) {
                //app.listarCombos();
            });

            $("#form").bootstrapValidator({
                excluded: []
            });

        };

        app.validar = function () {

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
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=sede";
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

        app.listarCombos = function (id, item) { //funcion para listar combos.

            var ajaxObj = ({
                type: 'POST',
                dataType: 'json',
                success: function (data) {
                    app.rellenarCombos(data,item);
                },
                error: function () {
                    alert('error buscar');
                }
            });

            //var item = $("#combos").val();//guardo en una variable el valor del combo, para poder compararla en el switch.
            //alert(item);

            switch (item) {
                case 'pais':
                    var datosEnviar = {id: id};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Pais";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'provincia':
                    //var id_pais = $("#comboPais").find(':selected').val();
                    var datosEnviar = {id: id};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarProvincia&Formulario=Sede";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'localidad':
                    //var id_provincia = $("#comboProvincia").find(':selected').val();
                    var datosEnviar = {id: id};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarLocalidades&Formulario=Sede";
                    ajaxObj.data = datosEnviar;
                    break;

                default:
                    break;
            }
            ;

            jQuery.ajax(ajaxObj);

        };

        app.rellenarCombos = function (data,item) {

            //var item = $("#combos").val();
            switch (item) {
                case 'pais':
                    var itemRecibido = 'comboPais';
                    var item = 'pais';
                    break;

                case 'provincia':
                    var itemRecibido = 'comboProvincia';
                    var id = 'provincia';
                    break;

                case 'localidad':
                    var itemRecibido = 'combo';
                    var item = 'localidad';
                    break;

                default:

                    break;
            }
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option selected disabled> Seleccione </option>");

            $.each(data, function (clave, value) {   
                $('#' + itemRecibido).append('<option value="' + value[`id_${item}`] + '">' + value[`nombre_${item}`] + '</option>');
            });
        };

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=sede";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error buscar domicilio');
                }
            });
        };

        app.rellenarTabla = function (data) {
            if (data == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTabla").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var linea = "";
                $.each(data, function (clave, object) {
                    linea += '<tr>' +
                            '<td>' + object.nombre_sede + '</td>' +
                            '<td>' + object.numero_sede + '</td>' +
                            '<td>' + object.telefono_sede + '</td>' +
                            '<td data-fk_pais="' + object.fk_pais + '">' + object.nombre_pais + '</td>' +
                            '<td data-fk_provincia="' + object.fk_provincia + '">' + object.nombre_provincia + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td data-fk_domicilio="' + object.fk_domicilio + '">' + object.calle_domicilio + '</td>' +
                            '<td>' + object.numero_domicilio + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_sede + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_sede + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTabla").html(linea);
            }

        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Sede";
            var datosEnviar = $("#form").serialize();
            //alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                dataType: 'json',
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    $("#combos").val('pais'); //le asigno el valor 'sede' al id 'combos' para poder listar de vuelta los combos.
                    setTimeout(() => {
                        app.listarCombos(id,'pais');
                    }, 200);
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertSave();
                },
                error: function (datosRecibidos) {
                    alert('Error al guardar Sede');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Sede";
            var datosEnviar = $("#form").serialize();
            alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    //app.listarCombos();
                    app.alertModif();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar");
                    alert(datosRecibidos);
                }
            });
        };

        app.actualizarTabla = function (object, id) {
            if (id == 0) {
                var html = '<tr>' +
                            '<td>' + object.nombre_sede + '</td>' +
                            '<td>' + object.numero_sede + '</td>' +
                            '<td>' + object.telefono_sede + '</td>' +
                            '<td data-fk_pais="' + object.fk_pais + '">' + object.nombre_pais + '</td>' +
                            '<td data-fk_provincia="' + object.fk_provincia + '">' + object.nombre_provincia + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td data-fk_domicilio="' + object.fk_domicilio + '">' + object.calle_domicilio + '</td>' +
                            '<td>' + object.numero_domicilio + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_sede + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_sede + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                $("#cuerpoTabla").append(html);
            } else {
                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre_sede").val() + '</td>' +
                        '<td>' + $("#numero_sede").val() + '</td>' +
                        '<td>' + $("#telefono_sede").val() + '</td>' +
                        '<td data-fk_pais="' + $("#comboPais").find(':selected').val() + '">' + $("#comboPais").find(':selected').text() + '</td>' +
                        '<td data-fk_provincia="' + $("#comboProvincia").find(':selected').val() + '">' + $("#comboProvincia").find(':selected').text() + '</td>' +
                        '<td data-fk_localidad="' + $("#combo").find(':selected').val() + '">' + $("#combo").find(':selected').text() + '</td>' +
                        '<td>' + $("#calle_domicilio").val() + '</td>' +
                        '<td>' + $("#numero_domicilio").val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=sede";
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
            var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent().remove();
        };

        app.limpiarModal = function () {//funcion para limpiar el modal
            $("#id").val(0);
            $("#nombre_sede").val('');
            $("#numero_sede").val('');
            $("#telefono_sede").val('');
            $("#calle_domicilio").val('');
            $("#numero_domicilio").val('');
            $("#comboPais").val('');
            $("#comboProvincia").html('');
            $("#combo").html('');
            $('#form').bootstrapValidator('resetForm', true);
        };

        app.init();

    })(TallerAvanzada);

});