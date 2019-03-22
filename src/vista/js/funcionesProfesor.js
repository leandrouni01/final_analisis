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
                
                app.listarCombos('Pais');//asigno valor 'pais' para poder listar combos en cascada (pais , provincia, localidad)
                
                setTimeout(() => { 
                    app.listarCombos('Titulo');//asigno valor titulo para poder listar combos titulos
                }, 150); //la funcion se ejecutara despues de 100milesimas de segundos.
                
                setTimeout(() => {
                    app.listarCombos('Postgrado');//asigno valor posgrado para listar combos posgrado
                }, 200);//la funcion se ejecutara despues de 150milesimas de segundos.
                
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Profesor");
                $("#modal").modal({show: true});
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
                $("#form").bootstrapValidator('resetForm', true);
                $("#id").val($(this).attr("data-id"));
                $("id_domicilio").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().attr('fk_domicilio'));
                $("#nombre_profesor").val($(this).parent().parent().children().html());
                $("#apellido_profesor").val($(this).parent().parent().children().first().next().html());
                $("#dni_profesor").val($(this).parent().parent().children().first().next().next().html());
                app.listarCombos('Titulo');
                setTimeout( () => {
                    $("#comboTitulo").val($(this).parent().parent().children().first().next().next().next().attr('data-fk_titulo'));
                },100);
                app.listarCombos('Postgrado');
                setTimeout( () => {
                     $("#comboPostgrado").val($(this).parent().parent().children().first().next().next().next().next().attr('data-fk_posgrado'));
                },100);
                
                app.listarCombos('Pais');
                setTimeout( () => {
                    $("#comboPais").val($(this).parent().parent().children().first().next().next().next().next().next().attr('data-fk_pais'));
                    $("#comboPais").change();
                },100);
                
                setTimeout(()=>{
                    $("#comboProvincia").val($(this).parent().parent().children().first().next().next().next().next().next().next().attr('data-fk_provincia'));
                    $("#comboProvincia").change();
                }, 200);
                
                setTimeout(()=>{
                    $("#comboLocalidad").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().attr('data-fk_localidad'));
                },300);
                
                $("#calle_domicilio").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
                $("#numero_domicilio").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().next().next().html());
                $("#tituloModal").html("Editar Profesor");
                $("#modal").modal({show: true});
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                app.eliminar($(this).attr("data-id"));
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
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Postgrado";
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
                            '<td data-fk_posgrado="' + object.fk_postgrado +'">' + object.nombre_postgrado + '</td>' + 
                            '<td data-fk_pais="' + object.id_pais + '">' + object.nombre_pais + '</td>' +
                            '<td data-fk_provincia="' + object.id_provincia + '">' + object.nombre_provincia + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td data-fk_domicilio="' + object.fk_domicilio + '">' + object.calle_domicilio + '</td>' +
                            '<td>' + object.numero_domicilio + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id + '"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id + '"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
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
            alert(datosEnviar);
//            $.ajax({
//                url: url,
//                type: 'POST',
//                data: datosEnviar,
//                success: function (datosRecibidos) {
//                    $("#modal").modal('hide');
//                    app.actualizarTabla(datosRecibidos, $("#id").val());
//                    //app.buscar();
//                    //app.listarCombos();
//                    app.alertModif();
//                },
//                error: function (datosRecibidos) {
//                    alert("Error en guardar");
//                    alert(datosRecibidos);
//                }
//            });
        };

        app.actualizarTabla = function (object, id) {
            if (id == 0) {
                var html = '<tr>' +
                            '<td>' + object.nombre_profesor + '</td>' +
                            '<td>' + object.apellido_profesor + '</td>' +
                            '<td>' + object.dni_profesor + '</td>' +
                            '<td data-fk_titulo="'+ object.fk_titulo +'">' + object.nombre_titulo + '</td>' +
                            '<td data-fk_posgrado="' + object.fk_postgrado +'">' + object.nombre_postgrado + '</td>' + 
                            '<td data-fk_pais="' + object.id_pais + '">' + object.nombre_pais + '</td>' +
                            '<td data-fk_provincia="' + object.id_provincia + '">' + object.nombre_provincia + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.nombre_localidad + '</td>' +
                            '<td data-fk_domicilio="' + object.fk_domicilio + '">' + object.calle_domicilio + '</td>' +
                            '<td>' + object.numero_domicilio + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id + '"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id + '"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                $("#cuerpoTabla").append(html);

            } else {
                //Modifico un Pais existente, busco la fila.
                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre").val() + '</td>' +
                        '<td>' + $("#apellido").val() + '</td>' +
                        '<td>' + $("#dni").val() + '</td>' +
                        '<td data-fk_titulo="'+ $("#comboTitulo").find(':selected').val() +'">' + $("#comboTitulo").find(':selected').text() + '</td>' +
                        '<td data-fk_posgrado="'+ $("#comboPosgrado").find(':selected').val() +'">' + $("#comboPosgrado").find(':selected').text() + '</td>' +
                        '<td data-fk_pais="'+ $("#comboPais").find(':selected').val() +'">' + $("#comboPais").find(':selected').text() + '</td>' +
                        '<td data-fk_provincia="'+ $("#comboProvincia").find(':selected').val() +'">' + $("#comboProvincia").find(':selected').text() + '</td>' +
                        '<td data-fk_localidad="'+ $("#combo").find(':selected').val() +'">' + $("#combo").find(':selected').text() + '</td>' +
                        '<td>' + $("#calle").val() + '</td>' +
                        '<td>' + $("#numero").val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=profesor";
            var datosEnviar = {id: id};
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
            $("#id").val(0);
            $("#nombre").val('');
            $("#apellido").val('');
            $("#dni").val('');
            $("#comboTitulo").html('');
            $("#comboPosgrado").html('');
            $("#comboPais").html('');
            $("#comboProvincia").html('');
            $("#combo").html('');
            $("#calle").val('');
            $("#numero").val('');
            $("#form").bootstrapValidator('resetForm', true);
        };

        app.init();

    })(TallerAvanzada);

});