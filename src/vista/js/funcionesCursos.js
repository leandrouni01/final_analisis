$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.listarCombos(1, 'sede');
            app.buscar();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                app.limpiarModal();
                app.listarCombos(1, 'sede');//listo el combo de 'sede'
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Curso");
                $("#modal").modal({show: true});
            });

            $("#comboSede").change(function () {

                app.listarCombos(1, 'carrera');
            });

            $("#comboCarrera").change(function () {
                app.listarCombos(1, 'año');
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
                $("#nombre").val($(this).parent().parent().children().html());
                $("#comboSede").val($(this).parent().parent().children().first().next().next().attr('data-fk_sede'));
                $("#comboSede").change();

                setTimeout(() => {
                    $("#comboCarrera").val($(this).parent().parent().children().first().next().attr('data-fk_plan_de_estudios'));
                    $("#comboCarrera").change();
                }, 200);

                setTimeout(() => {
                    $("#año").val($(this).parent().parent().children().first().next().next().next().html());
                }, 300);
                $("#año").val($(this).parent().parent().children().first().next().next().next().html());
                $("#tituloModal").html("Editar Curso");
                $("#modal").modal({show: true});
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                $("#id2").val($(this).attr("data-id"));
                $("#nombre2").prop('disabled', true);
                $("#nombre2").val($(this).parent().parent().children().html());
                $("#comboSede2").prop('disabled', true);
                $("#comboSede2").val($(this).parent().parent().children().first().next().next().html());
                $("#comboCarrera2").prop('disabled', true);
                $("#comboCarrera2").val($(this).parent().parent().children().first().next().html());
                $("#año2").prop('disabled', true);
                $("#año2").val($(this).parent().parent().children().first().next().next().next().html());
                $("#tituloModal2").html("¿Desea Eliminar Curso?");
                $("#modal2").modal({show: true});
            });

            $("#borrar").on('click', function () {
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

        app.buscar = function () { //esta funcion lista todos los cursos.
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=curso";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error buscar');
                }
            });
        };

        app.rellenarTabla = function (data) {//funcion para rellenar la tabla
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
                            '<td>' + object.nombre_curso + '</td>' +
                            '<td data-fk_plan_de_estudios="' + object.fk_plan_de_estudios + '">' + object.nombre_carrera + ' ( ' + object.resolucion + ' )' + '</td>' +
                            '<td data-fk_sede="' + object.fk_sede + '">' + object.nombre_sede + ' ( ' + object.numero_sede + ' )' + '</td>' +
                            '<td>' + object.anio_curso + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_curso + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_curso + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' +
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTabla").html(linea);
            }
        };

        app.listarCombos = function (id, item) { //funcion para listar todos los combos del modal
            var ajaxObj = ({
                method: 'post',
                dataType: 'json',
                success: function (data) {
                    app.rellenarCombos(data, item);
                },
                error: function () {
                    alert('Error en listar sedes');
                }
            });

            switch (item) {
                case 'sede':
                    var datosEnviar = {id: id};
                    ajaxObj.data = datosEnviar;
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=sede";
                    break;

                case 'carrera':
                    var datosEnviar = {id: id};
                    ajaxObj.data = datosEnviar;
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=plandeestudios";
                    break;

                case 'año':
                    var id_plan = $("#comboCarrera").find(':selected').val();
                    var datosEnviar = {id: id_plan};
                    ajaxObj.data = datosEnviar;
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarPlan&Formulario=materia";
                    break;

                default:
                    break;
            }

            jQuery.ajax(ajaxObj); //ejecuto la llamada ajax y le paso como parametros ajaxObj
        };

        app.rellenarCombos = function (data, item) {// funcion para rellenar todos los combos del modal

            switch (item) {
                case 'sede': //si el valor es 'sede' relleno el combo de sede
                    $('#comboSede').html("");
                    $('#comboSede').prepend("<option value=''>Seleccione</option>");

                    $.each(data, function (clave, value) {
                        $('#comboSede').append('<option value="' + value.id_sede + '">' + value.nombre_sede + ' (' + value.numero_sede + ' )' + '</option>');
                    });
                    break;

                case 'carrera': // si el valor es 'carrera' relleno el combo carrera
                    $('#comboCarrera').html("");
                    $('#comboCarrera').prepend("<option value=''>Seleccione</option>");

                    $.each(data, function (clave, value) {
                        $('#comboCarrera').append('<option value="' + value.id_plan + '">' + value.nombre_carrera + ' (' + value.resolucion + ' )' + '</option>');
                    });
                    break;

                case 'año': //si el valor es 'año' relleno el combo con la duracion del plan de estudio perteneciente a la carrera seleccionada
                    $('#año').html("");
                    $('#año').prepend("<option value=''>Seleccione</option>");

                    for (var i = 1; i <= data.duracion; i++) {
                        $('#año').append('<option value="' + i + '">' + i + '</option>');
                    }
                    break;

                default:
                    break;
            }
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=curso";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                method: 'post',
                data: datosEnviar,
                dataType: 'json',
                url: url,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    setTimeout(() => {
                        app.listarCombos(1,'sede');
                    }, 200);
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertSave();
                },
                error: function () {
                    alert('Error en guardar curso');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=curso";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                data: datosEnviar,
                method: 'post',
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.alertModif();
                },
                error: function () {
                    alert('Error en modificar');
                }
            });
        };

        app.actualizarTabla = function (object, id) {
            if (id == 0) {
                var html = '<tr>' +
                        '<td>' + object.nombre_curso + '</td>' +
                        '<td data-fk_plan_de_estudios="' + object.fk_plan_de_estudios + '">' + object.nombre_carrera + ' ( ' + object.resolucion + ' )' + '</td>' +
                        '<td data-fk_sede="' + object.fk_sede + '">' + object.nombre_sede + ' ( ' + object.numero_sede + ' )' + '</td>' +
                        '<td>' + object.anio_curso + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_curso + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_curso + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
            } else {

                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre").val() + '</td>' +
                        '<td data-fk_plan_de_estudios="' + $("#comboCarrera").find(':selected').val() + '">' + $("#comboCarrera").find(':selected').text() + '</td>' +
                        '<td data-fk_sede="' + $("#comboSede").find(':selected').val() + '">' + $("#comboSede").find(':selected').text() + '</td>' +
                        '<td>' + $("#año").find(':selected').val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=curso";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                data: datosEnviar,
                method: 'post',
                success: function (data) {
                    app.borrarFila(id);
                    app.alertDelete();
                },
                error: function (data) {
                    alert('Error al eliminar');
                }
            });
        };

        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=curso";
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

        app.borrarFila = function (id) {
            var fila = $("#cuerpoTabla").find('[data-id="' + id + '"]').parent().parent().remove();
        };

        app.limpiarModal = function () {
            $("#id").val(0);
            $("#nombre").val('');
            $("#año").html('');
            $("#comboSede").html('');
            $("#comboCarrera").html('');
            $('#form').bootstrapValidator('resetForm', true);
        };

        app.init();

    })(TallerAvanzada);
});