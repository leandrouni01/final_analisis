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
                $("#tituloModal").html("Nuevo Domicilio");
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
                $("#calle").val($(this).parent().parent().children().html());              
                $("#numero").val($(this).parent().parent().children().first().next().html());
                $("#fk_localidad").find(':selected').val($(this).parent().parent().children().first().next().next().html());
                $("#fk_localidad").val($(this).parent().parent().children().first().next().next().attr("data-fk_loc"));
                $("#tituloModal").html("Editar Domicilio");
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

        app.listarCombo = function (id) {  //funcion para listar carreras
            // genero la variable que viaja por post
            //alert("estoy en buscar carreras y elegi el id numero:" + id);
            var datosEnviar = {id: id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=localidad";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    var item = "fk_localidad";
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
                $('#' + itemRecibido).append('<option value="' + value.id + '">' + value.nombre + '</option>');
            });
        };

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=domicilio";
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

        app.rellenarTabla = function (data) {//funcion para rellenar la tabla carrera          
            var linea = "";
            $.each(data, function (clave, object) {

                linea += '<tr>' +
                        '<td>' + object.calle + '</td>' +
                        '<td>' + object.numero + '</td>' +
                        '<td data-fk_loc="'+ object.id_l + '">' + object.nombre_l + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + object.id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' + //data- : crea un metadato de la clave primaria.
                        '<a class="pull-right eliminar" data-id="' + object.id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
            });
            $("#cuerpoTabla").html(linea);
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=domicilio"
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert('entre en el error del ajax');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=domicilio";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                type: 'POST',
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
        };

        app.actualizarTabla = function (object, id) {
            if (id == 0) {
                var html = '<tr>' +
                        '<td>' + $("#calle").val() + '</td>' +
                        '<td>' + $("#numero").val() + '</td>' +
                        '<td data-fk_loc="' + $("#fk_localidad").find(':selected').val() + '">' + $("#fk_localidad").find(':selected').text() + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + object.id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id="' + object.id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
            } else {
                //Modifico un Pais existente, busco la fila.
                var fila = $("#cuerpoTabla").find("a[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#calle").val() + '</td>' +
                        '<td>' + $("#numero").val() + '</td>' +
                        '<td>' + $("#fk_localidad").find(':selected').text() + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id="' + id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=domicilio";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.borrarFila(id);
                },
                error: function (datosRecibidos) {
                    alert('Error al eliminar');
                }
            });
        };

        app.borrarFila = function (id) {//funcion para borrar una fila de la tabla carrera
            var fila = $("#cuerpoTabla").find("a[data-id='" + id + "']").parent().parent().remove();
        };

        app.limpiarModal = function () {//funcion para limpiar el modal
            $("#id").val(0);
            $("#calle").val('');
            $("#numero").val('');
            app.listarCombo();
        };

        app.init();

    })(TallerAvanzada);

});