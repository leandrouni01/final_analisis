$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.listarCombos();//funcion para cargar combos.

            setTimeout(() => {
                $("#combos").val('titulo'); //asigno valor titulo para poder listar combos titulos
                app.listarCombos();
            }, 100); //la funcion se ejecutara despues de 100milesimas de segundos.

            setTimeout(() => {
                $("#combos").val('posgrado');//asigno valor posgrado para listar combos posgrado
                app.listarCombos();
            }, 200);//la funcion se ejecutara despues de 150milesimas de segundos.

            app.buscar();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                app.limpiarModal();
                
                $("#combos").val('pais'); //asigno valor 'pais' para poder listar combos en cascada (pais , provincia, localidad)
                app.listarCombos();
                
                setTimeout(() => { 
                    $("#combos").val('titulo'); //asigno valor titulo para poder listar combos titulos
                    app.listarCombos();
                }, 150); //la funcion se ejecutara despues de 100milesimas de segundos.
                
                setTimeout(() => {
                    $("#combos").val('posgrado');//asigno valor posgrado para listar combos posgrado
                    app.listarCombos();
                }, 200);//la funcion se ejecutara despues de 150milesimas de segundos.
                
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Profesor");
                $("#modal").modal({show: true});
            });
            
            $("#comboPais").change(function(){ //le asigno el metodo change,  cuando cambie de valor el comboPais se lista el comboProvincia
               $("#combos").val('provincia');
               app.listarCombos();
            });
            
            $("#comboProvincia").change(function(){
               $("#combos").val('localidad');
               app.listarCombos();
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
                $("#nombre").val($(this).parent().parent().children().html());
                $("#apellido").val($(this).parent().parent().children().first().next().html());
                $("#dni").val($(this).parent().parent().children().first().next().next().html());
                $("#comboTitulo").val($(this).parent().parent().children().first().next().next().next().attr('data-fk_titulo'));
                $("#comboPosgrado").val($(this).parent().parent().children().first().next().next().next().next().attr('data-fk_posgrado'));
                
                $("#comboPais").val($(this).parent().parent().children().first().next().next().next().next().next().attr('data-fk_pais'));                
                $("#comboPais").change();
                
                setTimeout(()=>{
                    $("#comboProvincia").val($(this).parent().parent().children().first().next().next().next().next().next().next().attr('data-fk_provincia'));
                    $("#comboProvincia").change();
                }, 200);
                
                setTimeout(()=>{
                    $("#combo").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().attr('data-fk_localidad'));
                },300);
                
                $("#calle").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
                $("#numero").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().next().next().html());
                $("#tituloModal").html("Editar Profesor");
                $("#modal").modal({show: true})
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                app.eliminar($(this).attr("data-id"));
            });

            $("#salirModal").on('click', function (e) {
                app.listarCombos();
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=profesor";
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
                    app.rellenarCombos(data);
                },
                error: function () {
                    alert('error buscar');
                }
            });
            var item = $("#combos").val();//guardo en una variable el valor del combo, para poder compararlo en el switch.
            
            switch (item) {
                case 'pais':
                    var datosEnviar = {id: id};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=pais";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'provincia':
                    var id_pais = $("#comboPais").find(':selected').val();
                    var datosEnviar = {id: id_pais};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listarCombo&Formulario=provincia";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'localidad':
                    var id_provincia = $("#comboProvincia").find(':selected').val();
                    var datosEnviar = {id: id_provincia};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listarCombo&Formulario=localidad";
                    ajaxObj.data = datosEnviar;
                    break;
                    
                case 'titulo':
                    var datosEnviar = {id: id};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=titulo";
                    ajaxObj.data = datosEnviar;
                    break;
                    
                case 'posgrado':
                    var datosEnviar = {id: id};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=posgrado";
                    ajaxObj.data = datosEnviar;
                    break;

                default:
                    break;
            }

            jQuery.ajax(ajaxObj);
        };

        app.rellenarCombos = function (data) {

            var item = $("#combos").val();
            switch (item) {
                case 'pais':
                    var itemRecibido = 'comboPais';
                    break;

                case 'provincia':
                    var itemRecibido = 'comboProvincia';
                    break;

                case 'localidad':
                    var itemRecibido = 'combo';
                    break;
                    
                case 'titulo':
                    var itemRecibido = 'comboTitulo';
                    break;
                    
                case 'posgrado':
                    var itemRecibido = 'comboPosgrado';
                    break;

                default:

                    break;
            }
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");

            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id + '">' + value.nombre + '</option>');
            });
        };

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=profesor";
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
                            '<td>' + object.nombre + '</td>' +
                            '<td>' + object.apellido + '</td>' +
                            '<td>' + object.dni + '</td>' +
                            '<td data-fk_titulo="'+ object.fk_titulo +'">' + object.titulo + '</td>' +
                            '<td data-fk_posgrado="' + object.fk_posgrado +'">' + object.posgrado + '</td>' + 
                            '<td data-fk_pais="' + object.id_pais + '">' + object.nom_pais + '</td>' +
                            '<td data-fk_provincia="' + object.id_provincia + '">' + object.nom_provincia + '</td>' +
                            '<td data-fk_localidad="' + object.fk_localidad + '">' + object.localidad + '</td>' +
                            '<td>' + object.calle + '</td>' +
                            '<td>' + object.numero + '</td>' +
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=profesor";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                dataType: 'json',
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');

                    $("#combos").val('pais'); //asigno valor 'pais' para poder listar combos en cascada (pais , provincia, localidad)
                    app.listarCombos();

                    setTimeout(() => {
                        $("#combos").val('titulo'); //asigno valor titulo para poder listar combos titulos
                        app.listarCombos();
                    }, 150); //la funcion se ejecutara despues de 100milesimas de segundos.

                    setTimeout(() => {
                        $("#combos").val('posgrado');//asigno valor posgrado para listar combos posgrado
                        app.listarCombos();
                    }, 200);//la funcion se ejecutara despues de 150milesimas de segundos.

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
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    //app.buscar();
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
                        '<td>' + object.nombre + '</td>' +
                        '<td>' + object.apellido + '</td>' +
                        '<td>' + object.dni + '</td>' +
                        '<td data-fk_titulo="' + object.fk_titulo + '">' + object.titulo + '</td>' +
                        '<td data-fk_posgrado="' + object.fk_posgrado + '">' + object.posgrado + '</td>' +
                        '<td data-fk_pais="' + object.id_pais + '">' + object.nom_pais + '</td>' +
                        '<td data-fk_provincia="' + object.id_provincia + '">' + object.nom_provincia + '</td>' +
                        '<td data-fk_localidad="' + object.fk_localidad + '">' + object.localidad + '</td>' +
                        '<td>' + object.calle + '</td>' +
                        '<td>' + object.numero + '</td>' +
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
        };

        app.init();

    })(TallerAvanzada);

});