$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscar();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                app.limpiarModal();
                
                app.listarCombos('Titulo');//asigno valor titulo para poder listar combos titulos
                
                app.listarCombos('Pais');//asigno valor 'pais' para poder listar combos en cascada (pais , provincia, localidad)
                
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Profesor");
                $("#modal").modal({show: true});
            });
            
            $("#comboTitulo").change(function(){ //le asigno el metodo change,  cuando cambie de valor el comboTitulo se lista el comboPostgrado
               app.listarCombos('Postgrado');
            });
            
            $("#comboPais").change(function(){ //le asigno el metodo change,  cuando cambie de valor el comboPais se lista el comboProvincia
               app.listarCombos('Provincia');
            });
            
            $("#comboProvincia").change(function(){
               app.listarCombos('Localidad');
            });

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscar();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#form").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });

            $("#cuerpoTabla").on('click', '.editar', function (event) {
                app.modificarCampos(this);
                
                $("#tituloModal").html("Editar Profesor");
                $("#modal").modal({show: true});
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                app.modificarCampos(this);
                app.deshabilitarCampos();
                
                $("#tituloModal").html("Eliminar Profesor");
                $("#guardar").hide();
                $("#borrar").removeClass('hidden');
                $("#modal").modal({show: true});
            });
            
            $("#borrar").on('click', function () {
               app.eliminar($("#id").val(), $("#id_domicilio").val());
                $("#modal").modal('hide');
            });

            $("#salirModal").on('click', function (e) {
                app.listarCombos();
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=Profesor";
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

        app.listarCombos = function (item) { //funcion para listar combos.

            var ajaxObj = ({
                method: 'POST',
                dataType: 'json',
                success: function (data) {
                    app.rellenarCombos(data, item);
                },
                error: function () {
                    alert(`Error buscar ${item}`);
                }
            });
            
            //alert(item);
            switch (item) {
                case 'Pais':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Pais";
                    break;

                case 'Provincia':
                    var id_pais = $("#comboPais").find(':selected').val();
                    var datosEnviar = {id_pais: id_pais};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarProvincia&Formulario=Profesor";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'Localidad':
                    var id_provincia = $("#comboProvincia").find(':selected').val();
                    var datosEnviar = {id_provincia: id_provincia};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarLocalidades&Formulario=Profesor";
                    ajaxObj.data = datosEnviar;
                    break;
                    
                case 'Titulo':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Titulo";
                    break;
                    
                case 'Postgrado':
                    var id_titulo = $("#comboTitulo").find(':selected').val();
                    var datosEnviar = {id_titulo: id_titulo};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarPostgrados&Formulario=Profesor";
                    ajaxObj.data = datosEnviar;
                    break;

                default:
                    break;
            }

            jQuery.ajax(ajaxObj);
        };

        app.rellenarCombos = function (data, item) {

            var tabla = item.toLowerCase();
            var itemRecibido = `combo${item}`;
            
            //alert(tabla);
            //alert(itemRecibido);

            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");

            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value[`id_${tabla}`] + '">' + value[`nombre_${tabla}`] + '</option>');
            });
        };

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Profesor";
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
                            '<td>' + object.nombre_profesor + '</td>' +
                            '<td>' + object.apellido_profesor + '</td>' +
                            '<td>' + object.dni_profesor + '</td>' +
                            '<td data-fk_titulo="'+ object.fk_titulo +'">' + object.nombre_titulo + '</td>' +
                            '<td data-fk_postgrado="' + object.fk_postgrado +'">' + object.nombre_postgrado + '</td>' + 
                            '<td data-fk_pais="' + object.id_pais + '">' + object.nombre_pais + '</td>' +
                            '<td data-fk_provincia="' + object.id_provincia + '">' + object.nombre_provincia + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td data-fk_domicilio="' + object.fk_domicilio + '">' + object.calle_domicilio + '</td>' +
                            '<td>' + object.numero_domicilio + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_profesor + '"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_profesor + '"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTabla").html(linea);
            }
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Profesor";
            var datosEnviar = $("#form").serialize();
            //alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                dataType: 'json',
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertSave();
                },
                error: function (datosRecibidos) {
                    alert('Error al guardar profesor');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=profesor";
            var datosEnviar = $("#form").serialize();
            //alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
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
                            '<td>' + object.nombre_profesor + '</td>' +
                            '<td>' + object.apellido_profesor + '</td>' +
                            '<td>' + object.dni_profesor + '</td>' +
                            '<td data-fk_titulo="'+ object.fk_titulo +'">' + object.nombre_titulo + '</td>' +
                            '<td data-fk_postgrado="' + object.fk_postgrado +'">' + object.nombre_postgrado + '</td>' + 
                            '<td data-fk_pais="' + object.id_pais + '">' + object.nombre_pais + '</td>' +
                            '<td data-fk_provincia="' + object.id_provincia + '">' + object.nombre_provincia + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td data-fk_domicilio="' + object.fk_domicilio + '">' + object.calle_domicilio + '</td>' +
                            '<td>' + object.numero_domicilio + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_profesor + '"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_profesor + '"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                $("#cuerpoTabla").append(html);

            } else {
                //Modifico un Pais existente, busco la fila.
                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre_profesor").val() + '</td>' +
                        '<td>' + $("#apellido_profesor").val() + '</td>' +
                        '<td>' + $("#dni_profesor").val() + '</td>' +
                        '<td data-fk_titulo="'+ $("#comboTitulo").find(':selected').val() +'">' + $("#comboTitulo").find(':selected').text() + '</td>' +
                        '<td data-fk_postgrado="'+ $("#comboPostgrado").find(':selected').val() +'">' + $("#comboPostgrado").find(':selected').text() + '</td>' +
                        '<td data-fk_pais="'+ $("#comboPais").find(':selected').val() +'">' + $("#comboPais").find(':selected').text() + '</td>' +
                        '<td data-fk_provincia="'+ $("#comboProvincia").find(':selected').val() +'">' + $("#comboProvincia").find(':selected').text() + '</td>' +
                        '<td data-fk_localidad="'+ $("#comboLocalidad").find(':selected').val() +'">' + $("#comboLocalidad").find(':selected').text() + '</td>' +
                        '<td data-fk_domicilio="'+ $("#id_domicilio").val() +'">' + $("#calle_domicilio").val() + '</td>' +
                        '<td>' + $("#numero_domicilio").val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id, id_domicilio) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Profesor";
            var datosEnviar = {id: id, id_domicilio: id_domicilio};
            //alert(datosEnviar.id);
            //alert(datosEnviar.id_domicilio);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.alertDelete();
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
            $("#guardar").show();
            $("#borrar").addClass('hidden');
            app.habilitarCampos();
            $("#id").val(0);
            $("#id_domicilio").val();
            $("#nombre_profesor").val('');
            $("#apellido_profesor").val('');
            $("#dni_profesor").val('');
            $("#comboTitulo").html('');
            $("#comboPostgrado").html('');
            $("#comboPais").html('');
            $("#comboProvincia").html('');
            $("#comboLocalidad").html('');
            $("#calle_domicilio").val('');
            $("#numero_domicilio").val('');
            $("#form").bootstrapValidator('resetForm', true);
        };


        app.modificarCampos = (boton) => {
            app.limpiarModal();
            $("#id").val($(boton).attr("data-id"));
            $("#id_domicilio").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().next().attr('data-fk_domicilio'));
            $("#nombre_profesor").val($(boton).parent().parent().children().html());
            $("#apellido_profesor").val($(boton).parent().parent().children().first().next().html());
            $("#dni_profesor").val($(boton).parent().parent().children().first().next().next().html());

            app.listarCombos('Titulo');
            setTimeout(() => {
                $("#comboTitulo").val($(boton).parent().parent().children().first().next().next().next().attr('data-fk_titulo'));
                $("#comboTitulo").change();
            }, 100);

            setTimeout(() => {
                $("#comboPostgrado").val($(boton).parent().parent().children().first().next().next().next().next().attr('data-fk_postgrado'));
            }, 150);

            app.listarCombos('Pais');
            setTimeout(() => {
                $("#comboPais").val($(boton).parent().parent().children().first().next().next().next().next().next().attr('data-fk_pais'));
                $("#comboPais").change();
            }, 100);

            setTimeout(() => {
                $("#comboProvincia").val($(boton).parent().parent().children().first().next().next().next().next().next().next().attr('data-fk_provincia'));
                $("#comboProvincia").change();
            }, 200);

            setTimeout(() => {
                $("#comboLocalidad").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().attr('data-fk_localidad'));
            }, 300);

            $("#calle_domicilio").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
            $("#numero_domicilio").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().next().next().html());
        };

        app.habilitarCampos = () => {
            $("#nombre_profesor").prop('disabled', false);
            $("#apellido_profesor").prop('disabled', false);
            $("#dni_profesor").prop('disabled', false);
            $("#comboTitulo").prop('disabled', false);
            $("#comboPostgrado").prop('disabled', false);
            $("#comboPais").prop('disabled', false);
            $("#comboProvincia").prop('disabled', false);
            $("#comboLocalidad").prop('disabled', false);
            $("#calle_domicilio").prop('disabled', false);
            $("#numero_domicilio").prop('disabled', false);
        };

        app.deshabilitarCampos = () => {
            $("#nombre_profesor").prop('disabled', true);
            $("#apellido_profesor").prop('disabled', true);
            $("#dni_profesor").prop('disabled', true);
            $("#comboTitulo").prop('disabled', true);
            $("#comboPostgrado").prop('disabled', true);
            $("#comboPais").prop('disabled', true);
            $("#comboProvincia").prop('disabled', true);
            $("#comboLocalidad").prop('disabled', true);
            $("#calle_domicilio").prop('disabled', true);
            $("#numero_domicilio").prop('disabled', true);
        };

        app.init();

    })(TallerAvanzada);

});