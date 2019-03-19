$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {

            app.listarCarreras();
            app.buscarPlanEstudio();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                app.limpiarModal();
                app.listarCarreras();
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Plan de Estudio");
                $("#modalPlanEstudio").modal({show: true});
            });

            $("#formPlanEstudio").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

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
                    app.buscarPlanEstudio();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $("#id").val($(this).attr("data-id"));
                var value = $(this).parent().parent().children().first().html();
                setTimeout(() => {
                    $('#comboCarrera option:contains(' + value + ')').prop('selected', true);
                }, 50);
                $("#combocarrera").val($(this).parent().parent().children().attr("data-fk_carrera"));
                $("#resolucion").val($(this).parent().parent().children().first().next().html());
                $("#fecha").val($(this).parent().parent().children().first().next().next().html());
                $("#horas_catedra").val($(this).parent().parent().children().first().next().next().next().html());
                $("#horas_reloj").val($(this).parent().parent().children().first().next().next().next().next().html());
                $("#duracion").val($(this).parent().parent().children().first().next().next().next().next().next().html());
                $("#tituloModal").html("Editar Plan Estudio");
                $("#modalPlanEstudio").modal({show: true})

            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                $("#id2").val($(this).attr("data-id"));
                $("#carrera2").prop('disabled', true);
                $("#carrera2").val($(this).parent().parent().children().html());
                $("#resolucion2").prop('disabled', true);
                $("#resolucion2").val($(this).parent().parent().children().first().next().html());
                $("#fecha2").prop('disabled', true);
                $("#fecha2").val($(this).parent().parent().children().first().next().next().html());
                $("#horas_catedras2").prop('disabled', true);
                $("#horas_catedras2").val($(this).parent().parent().children().first().next().next().next().html());
                $("#horas_reloj2").prop('disabled', true);
                $("#horas_reloj2").val($(this).parent().parent().children().first().next().next().next().next().html());
                $("#duracion2").prop('disabled', true);
                $("#duracion2").val($(this).parent().parent().children().first().next().next().next().next().next().html());
                $("#tituloModal2").html("¿Desea Eliminar Plan de Estudio?");
                $("#modal2").modal({show: true})
            });

            $("#salir").on('click', function (e) {
                app.listarCarreras();
            });

            $("#borrar").on('click', function () {
                app.eliminarPlanEstudio($("#id2").val());
                $("#modal2").modal('hide');
            });

            $("#formPlanEstudio").bootstrapValidator({
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=plandeestudios";
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

        app.listarCarreras = function (id) {  //funcion para listar carreras
            // genero la variable que viaja por post
            //alert("estoy en buscar carreras y elegi el id numero:" + id);
            var datosEnviar = {id: id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Carrera";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    var item = "comboCarrera";
                    app.rellenarCombo(data, item);
                },
                error: function () {
                    alert('error buscar carrera');
                }
            });
        };

        app.rellenarCombo = function (data, itemRecibido) {   //funcion para rellenar la tabla de alumnos.
            // en itemrecibido se trae el valor del id htm para inyectar        
            // limpio el combo
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");

            $.each(data, function (clave, value) {
                //alert("Entre en rellenar combo " + value.nombre + " " + value.id_carrera);
                //console.log(JSON.stringify(data));
                $('#' + itemRecibido).append('<option value="' + value.id_carrera + '">' + value.nombre_carrera + '</option>');

                // alert("value :" + value.id_carrera);
                // alert("nombre :" + value.nombre);
            });
        };

        app.buscarPlanEstudio = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=PlanDeEstudios";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error buscar plan de estudio');
                }
            });
        };

        app.rellenarTabla = function (data) {//funcion para rellenar la tabla carrera
            if (data == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTabla").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var linea = "";
                $.each(data, function (clave, planestudio) {

                    linea += '<tr>' +
                            '<td data-fk_carrera="' + planestudio.id_carrera + '">' + planestudio.nombre_carrera + '</td>' +
                            '<td>' + planestudio.resolucion + '</td>' +
                            '<td>' + planestudio.fecha + '</td>' +
                            '<td>' + planestudio.horas_catedra + '</td>' +
                            '<td>' + planestudio.horas_reloj + '</td>' +
                            '<td>' + planestudio.duracion + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + planestudio.id_plan + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + planestudio.id_plan + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTabla").html(linea);
            }
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=PlanDeEstudios";
            var datosEnviar =
                    // atrapa el id que esta en el combo
                    'fk_carrera=' + $("#comboCarrera").find(':selected').val() +
                    //'fk_carrera=' + $('#combocarrera option:selected').text() +
                    '&resolucion=' + $('#resolucion').val() +
                    '&fecha=' + $('#fecha').val() +
                    '&horas_catedra=' + $('#horas_catedra').val() +
                    '&horas_reloj=' + $('#horas_reloj').val() +
                    '&duracion=' + $("#duracion").find(':selected').val();


            //alert(datosEnviar);

            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                dataType: 'json',
                success: function (datosRecibidos) {
                    $("#modalPlanEstudio").modal('hide');
                    //app.buscarPlanEstudio();
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertSave()
                },
                error: function (datosRecibidos) {
                    alert('entre en el error del ajax');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=PlanDeEstudios";
            //alert("estoy");
            //alert($("#combocarrera").find(':checked').val());
            var datosEnviar =
                    // atrapa el id que esta en el combo
                    'fk_carrera=' + $("#comboCarrera").find(':selected').val() +
                    //'fk_carrera=' + $('#combocarrera option:selected').text() +
                    '&resolucion=' + $('#resolucion').val() +
                    '&fecha=' + $('#fecha').val() +
                    '&horas_catedra=' + $('#horas_catedra').val() +
                    '&horas_reloj=' + $('#horas_reloj').val() +
                    '&duracion=' + $("#duracion").find(':selected').val() +
                    '&id=' + $("#id").val();

            //alert(datosEnviar);

            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalPlanEstudio").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                    app.alertModif();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar plan de estudio");
                    alert(datosRecibidos);
                }
            });
        };

        app.actualizarTabla = function (planestudio, id) {
            if (id == 0) {
                var html =
                        '<tr>' +
                        '<td data-fk_carrera="' + planestudio.fk_carrera + '">' + planestudio.nombre_carrera + '</td>' +
                        '<td>' + planestudio.resolucion + '</td>' +
                        '<td>' + planestudio.fecha + '</td>' +
                        '<td>' + planestudio.horas_catedra + '</td>' +
                        '<td>' + planestudio.horas_reloj + '</td>' +
                        '<td>' + planestudio.duracion + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + planestudio.id_plan + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + planestudio.id_plan + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
            } else {

                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td data-fk_carrera="' + $("#comboCarrera").find(':selected').val() + '">' + $("#comboCarrera").find(':selected').text() + '</td>' +
                        '<td>' + $("#resolucion").val() + '</td>' +
                        '<td>' + $("#fecha").val() + '</td>' +
                        '<td>' + $("#horas_catedra").val() + '</td>' +
                        '<td>' + $("#horas_reloj").val() + '</td>' +
                        '<td>' + $("#duracion").find(':selected').val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminarPlanEstudio = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=PlanDeEstudios";
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
            $("#combocarrera").val('');
            $("#resolucion").val('');
            $("#fecha").val('');
            $("#horas_catedras").val('');
            $("#horas_reloj").val('');
            $("#duracion").val('');
            $('#formPlanEstudio').bootstrapValidator('resetForm', true);
        };

        app.init();

    })(TallerAvanzada);

});

