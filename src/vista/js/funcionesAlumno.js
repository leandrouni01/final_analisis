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
                app.limpiarModal();
                app.listarCombo();
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Alumno");
                $("#modal").modal({show: true});
            });
            
            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscar();
                } else {
                    app.busqueda(parametros);
                }
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
                $("#legajo").val($(this).parent().parent().children().html());              
                $("#nombre").val($(this).parent().parent().children().first().next().html());
                $("#apellido").val($(this).parent().parent().children().first().next().next().html());
                $("#dni").val($(this).parent().parent().children().first().next().next().next().html());
                $("#calle").val($(this).parent().parent().children().first().next().next().next().next().html());
                $("#numero").val($(this).parent().parent().children().first().next().next().next().next().next().html());
                $("#combo").find(':selected').val($(this).parent().parent().children().first().next().next().next().next().next().next().html());
                $("#combo").val($(this).parent().parent().children().first().next().next().next().next().next().next().attr("data-fk_localidad"));
                $("#tituloModal").html(" Editar Alumno");
                $("#modal").modal({show: true})   
            });
            
            

            $("#cuerpoTabla").on('click', '.eliminar', function (event) {
                $("#id2").val($(this).attr("data-id"));
                $("#legajo2").prop('disabled', true);
                $("#legajo2").val($(this).parent().parent().children().html());
                $("#nombre2").prop('disabled', true);
                $("#nombre2").val($(this).parent().parent().children().first().next().html());
                $("#apellido2").prop('disabled', true);
                $("#apellido2").val($(this).parent().parent().children().first().next().next().html());
                $("#dni2").prop('disabled', true);
                $("#dni2").val($(this).parent().parent().children().first().next().next().next().html());
                $("#calle2").prop('disabled', true);
                $("#calle2").val($(this).parent().parent().children().first().next().next().next().next().html());
                $("#numero2").prop('disabled', true);
                $("#numero2").val($(this).parent().parent().children().first().next().next().next().next().next().html());
                $("#localidad2").prop('disabled', true);
                $("#localidad2").val($(this).parent().parent().children().first().next().next().next().next().next().next().html());
                $("#tituloModal2").html("¿Desea Eliminar Alumno?");
                $("#modal2").modal({show: true});  
            });
            
            $("#salirModal").on('click', function (e) {
                app.listarCombo();
            });
            
            $("#borrar").on('click', function (e) {
                app.eliminar($("#id2").val());
                $("#modal2").modal('hide');
            });

            $("#form").bootstrapValidator({
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
        };

        app.alertModif = function () {
            var alerta = '<div class="alert alert-warning" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-saved"></span>' + ' ¡Actualizado con exito!' + '</strong>' + ' Se modificó un registro en la Base de Datos ' +
                    '</div>';
            $("#alerta").html(alerta);
        };

        app.alertDelete = function () {
            var alerta = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-remove"></span>' + ' ¡Eliminado con exito!' + '</strong>' + ' Se elimino un registro en la Base de Datos ' +
                    '</div>';
            $("#alerta").html(alerta);
        };
        
        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=alumno";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: { textBusca: parametros},
                success: function (data) {
                    app.rellenarTabla(data);
                },
                error: function () {
                    alert('error busqueda');
                }
            });
        };

        app.listarCombo = function (id) { 
            var datosEnviar = {id: id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=localidad";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    var item = "combo";
                    app.rellenarCombo(data, item);
                },
                error: function () {
                    alert('error buscar');
                }
            });
        };

        app.rellenarCombo = function (data, itemRecibido) {
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");

            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id + '">' + value.nombre +'</option>');
            });
        };

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=alumno";
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
                            '<td>' + object.legajo + '</td>' +
                            '<td>' + object.nombre + '</td>' +
                            '<td>' + object.apellido + '</td>' +
                            '<td>' + object.dni + '</td>' +
                            '<td>' + object.calle + '</td>' +
                            '<td>' + object.numero + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.localidad + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTabla").html(linea);
            };
            
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=alumno";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                dataType: 'json',
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertSave();
                    app.showAlert();
                    
                },
                error: function (datosRecibidos) {
                    alert('entre en el error del ajax');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=alumno";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');                   
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.listarCombo();
                    app.alertModif();
                    app.showAlert();
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
                        '<td>' + object.legajo + '</td>' +
                        '<td>' + object.nombre + '</td>' +
                        '<td>' + object.apellido + '</td>' +
                        '<td>' + object.dni + '</td>' +
                        '<td>' + object.calle + '</td>' +
                        '<td>' + object.numero + '</td>' +
                        '<td data-fk_localidad="' + object.fk_localidad + '">' + object.localidad + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
                
            } else {
                //Modifico un Alumno existente, busco la fila por el id.
                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#legajo").val() + '</td>' +
                        '<td>' + $("#nombre").val() + '</td>' +
                        '<td>' + $("#apellido").val() + '</td>' +
                        '<td>' + $("#dni").val() + '</td>' +
                        '<td>' + $("#calle").val() + '</td>' +
                        '<td>' + $("#numero").val() + '</td>' +
                        '<td data-fk_localidad="' + $("#combo").find(':selected').val() + '">' + $("#combo").find(':selected').text() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=alumno";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.alertDelete();
                    app.showAlert();
                    app.borrarFila(id);
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
            $("#legajo").val('');
            $("#nombre").val('');
            $("#apellido").val('');
            $("#dni").val('');
            $("#calle").val('');
            $("#numero").val('');
            app.listarCombo();
        };

        app.init();

    })(TallerAvanzada);

});