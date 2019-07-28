$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.listarLocalidades();
            app.buscarAlumnos();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) { 
                app.limpiarModal();
                app.habilitarCampos(false);
                $("#id_alumno").val(0);
                $("#tituloModal").html("Nuevo Alumno");
                $("#modal").modal({show: true});
            });
            
            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarAlumnos();
                } else {
                    app.busqueda(parametros);
                }
            });
            
            $("#form").on('success.form.bv',function(e){
                e.preventDefault();
                if($("#id_alumno").val()==0){
                    app.guardar();
                }else{
                    app.modificar();
                }
            });


            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $("#tituloModal").html(" Editar Alumno");
                app.modificarCampos(this);
                app.habilitarCampos(false);
                $("#modal").modal({show: true});   
            });
            
            

            $("#cuerpoTabla").on('click', '.eliminar', function (event) {
                app.modificarCampos(this);
                app.habilitarCampos(true);
                $("#tituloModal").html("¿Desea Eliminar Alumno?");
                $("#guardar").hide();
                $("#borrar").show();
                $("#modal").modal({show: true});  
            });
            
            $("#borrar").on('click', function (e) {
                app.eliminar($("#id_alumno").val());
                $("#modal").modal('hide');
            });

            $("#form").bootstrapValidator({
                excluded: []
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

        app.listarLocalidades = function (id) { 
            var datosEnviar = {id: id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarLocalidades&Formulario=Alumno";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    app.rellenarLocalidades(data);
                },
                error: function () {
                    alert('error buscar');
                }
            });
        };

        app.rellenarLocalidades = function (data) {
            $('#selectLocalidad').html("");
            $('#selectLocalidad').prepend("<option value=''>Seleccione</option>");

            $.each(data, function (clave, value) {
                $('#selectLocalidad').append('<option value="' + value.id_localidad + '">' + value.nombre_localidad +'</option>');
            });
        };

        app.buscarAlumnos = function () { //esta funcion lista todas las alumnos
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Alumno";
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
                console.log(data);
                var linea = "";
                $.each(data, function (clave, object) {

                    linea += '<tr>' +
                            '<td>' + object.legajo + '</td>' +
                            '<td>' + object.nombre + '</td>' +
                            '<td>' + object.apellido + '</td>' +
                            '<td>' + object.dni + '</td>' +
                            '<td>' + object.calle_domicilio + '</td>' +
                            '<td data-fk_domicilio="'+object.fk_domicilio+'">' + object.numero_domicilio + '</td>' +
                            '<td data-fk_localidad="' + object.id_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td>' + object.correo + '</td>' +
                            '<td>' + object.telefono + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_alumno + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_alumno + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
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
                    app.actualizarTabla(datosRecibidos, $("#id_alumno").val());
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Alumno";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');                   
                    app.actualizarTabla(datosRecibidos, $("#id_alumno").val());
                    app.limpiarModal();
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
                            '<td>' + object.calle_domicilio + '</td>' +
                            '<td data-fk_domicilio="'+object.fk_domicilio+'">' + object.numero_domicilio + '</td>' +
                            '<td data-fk_localidad="' + object.id_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td>' + object.correo + '</td>' +
                            '<td>' + object.telefono + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_alumno + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_alumno + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                $("#cuerpoTabla").append(html);
                
            } else {
                //Modifico un Alumno existente, busco la fila por el id.
                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#legajo").val() + '</td>' +
                        '<td>' + $("#nombre_alumno").val() + '</td>' +
                        '<td>' + $("#apellido_alumno").val() + '</td>' +
                        '<td>' + $("#dni_alumno").val() + '</td>' +
                        '<td>' + $("#calle_domicilio").val() + '</td>' +
                        '<td data-fk_domicilio="'+$("#id_domicilio").val()+'">' + $("#numero_domicilio").val() + '</td>' +
                        '<td data-fk_localidad="' + $("#selectLocalidad").find(':selected').val() + '">' + $("#selectLocalidad").find(':selected').text() + '</td>' +
                        '<td>' + $("#email").val() + '</td>' +
                        '<td>' + $("#telefono").val() + '</td>' +
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
            $("#id_alumno").val(0);
            $("#id_domicilio").val(0);
            $("#legajo").val('');
            $("#nombre_alumno").val('');
            $("#apellido_alumno").val('');
            $("#dni_alumno").val('');
            $("#calle_domicilio").val('');
            $("#numero_domicilio").val('');
            $("#telefono").val('');
            $("#email").val('');
            $("#borrar").hide();
            $("#guardar").show();
            app.listarLocalidades();
            app.habilitarCampos(false);
        };
        
        app.habilitarCampos= function(estado){      
            $("#legajo").prop("disabled",estado);          
            $("#nombre_alumno").prop("disabled",estado);
            $("#apellido_alumno").prop("disabled",estado);
            $("#dni_alumno").prop("disabled",estado);
            $("#calle_domicilio").prop("disabled",estado);
            $("#numero_domicilio").prop("disabled",estado);
            $("#selectLocalidad").prop("disabled",estado);
            $("#telefono").prop("disabled",estado);
            $("#email").prop("disabled",estado);
        };

        
        app.modificarCampos= function(boton){
            $("#id_alumno").val($(boton).attr("data-id"));       
            $("#legajo").val($(boton).parent().parent().children().html());              
            $("#nombre_alumno").val($(boton).parent().parent().children().first().next().html());
            $("#apellido_alumno").val($(boton).parent().parent().children().first().next().next().html());
            $("#dni_alumno").val($(boton).parent().parent().children().first().next().next().next().html());
            $("#calle_domicilio").val($(boton).parent().parent().children().first().next().next().next().next().html());
            $("#numero_domicilio").val($(boton).parent().parent().children().first().next().next().next().next().next().html());
            $("#selectLocalidad").val($(boton).parent().parent().children().first().next().next().next().next().next().next().attr("data-fk_localidad"));
            $("#telefono").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
            $("#email").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().html());
            $("#id_domicilio").val($(boton).parent().parent().children().first().next().next().next().next().next().attr("data-fk_domicilio"));
        };

        app.init();

    })(TallerAvanzada);

});