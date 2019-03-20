$(function () {
    var TallerAvanzada = {};

    var id = "";
    var duracion = "";

    (function (app) {
        app.init = function () {
            app.buscar();
            app.listarPlanEstudio();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                app.limpiarModal();
                app.listarPlanEstudio();
                $("#id").val(0);
                $("#tituloModal").html("Nueva Materia");
                $("#modalMateria").modal({show: true});
            });

            $("#formMateria").on('success.form.bv', function (event) { //Función que se ejecuta una vez que el formulario está validado.

                // Evitar el envío del form
                event.preventDefault();

                //Ejecutar Ajax para enviar el form.
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });

            $("#combo").on('change',function () {
                app.listarDuracion();
                $("#combo").prop("disabled", "true");
            });

            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $("#id").val($(this).attr("data-id_materia"));
                $("#combo").val($(this).parent().parent().children().first().attr("data-fk_plan"));
                $("#semestre").val($(this).parent().parent().children().first().next().html());

                $("#nombre").val($(this).parent().parent().children().first().next().next().html());
                $("#carga_horaria").val($(this).parent().parent().children().first().next().next().next().next().html());

                $("#combo").change();
                setTimeout(() => {
                    $("#comboDuracion").val($(this).parent().parent().children().first().next().next().next().html());
                }, 200);
                $("#cambiarCarrera").hide();
                $("#tituloModal").html("Editar Materia");
                $("#modalMateria").modal({show: true});
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {

                $("#id2").val($(this).attr("data-id_materia"));

                $("#comboDuracion2").prop('disabled', true);
                $("#comboDuracion2").val($(this).parent().parent().children().first().next().next().next().html());

                $("#combo2").prop('disabled', true);
                $("#combo2").val($(this).parent().parent().children().html());

                $("#semestre2").prop('disabled', true);
                $("#semestre2").val($(this).parent().parent().children().first().next().html());

                $("#nombre2").prop('disabled', true);
                $("#nombre2").val($(this).parent().parent().children().first().next().next().html());

                $("#carga_horaria2").prop('disabled', true);
                $("#carga_horaria2").val($(this).parent().parent().children().first().next().next().next().next().html());

                $("#tituloModal2").html("¿Desea Eliminar Materia?");

                $("#modalMateria2").modal({show: true});
            });

            $("#salir").on('click', function (e) {
                app.listarPlanEstudio();
            });

            $("#borrar").on('click', function (e) {
                app.eliminar($("#id2").val());
                $("#modalMateria2").modal('hide');
            });

            $("#salir2").on('click', function () {
                app.limpiarModal2();
            });

            $("#cambiarCarrera").on('click', function () {
                $("#combo").removeAttr("disabled");
            });

            $("#formMateria").bootstrapValidator({
                excluded: [],
            });
            
            $("#modalMateria").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };

        app.listarPlanEstudio = function () {  //funcion para listar carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=PlanDeEstudios";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (data) {
                    var item = "combo";
                    app.rellenarCombo(data, item);
                },
                error: function () {
                    alert('error buscar carrera');
                }
            });
        };

        app.rellenarCombo = function (data, itemRecibido) {   //funcion para rellenar combo.
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option selected disabled value=''>Seleccione una carrera</option>");

            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_plan + '">' + value.nombre_carrera + " ( " + value.resolucion + " )" + '</option>');
            });
        };

        app.listarDuracion = function () {
            var id = $("#combo").find(':selected').val();
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarPlan&Formulario=Materia";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: {id: id},
                success: function (data) {
                    var item = "comboDuracion";
                    app.rellenarComboDuracion(data, item);
                },
                error: function () {
                    alert('error buscar duracion de plan');
                }
            });
        };

        app.rellenarComboDuracion = function (data, itemRecibido) {

            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option selected disabled value=''>Seleccione un año</option>");

            for (var i = 1; i <= data.duracion; i++) {
                $('#' + itemRecibido).append('<option value="' + i + '">' + i + '° año' + '</option>');
            }
            ;

        };

        app.listarDuracionEdit = function (duracion, id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listarDuracion&Formulario=planestudio";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: {id: id},
                success: function (data) {
                    var item = "comboDuracion";
                    app.rellenarComboDuracion2(data, item, duracion);
                },
                error: function () {
                    alert('error buscar duracion de plan');
                }
            });
        };

        app.rellenarComboDuracion2 = function (data, itemRecibido, duracion) {
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).append('<option value="' + duracion + '">' + duracion + '</option>');

            for (var i = 1; i <= data.duracion; i++) {
                if (duracion == i) {
                    console.log('i es igual a ' + duracion);
                } else {
                    $('#' + itemRecibido).append('<option value="' + i + '">' + i + '</option>');
                }
            }

        };

        app.buscar = function () { //esta funcion lista todas las materias
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Materia";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error en buscar materias');
                }
            });
        };

        app.rellenarTabla = function (data) {//funcion para rellenar la tabla carrera
            var linea = "";
            $.each(data, function (clave, materia) {
                if (materia.nombre_materia != "Ninguna") {
                    linea += '<tr>' +
                            '<td data-fk_plan="' + materia.fk_plan_de_estudio + '">' + materia.nombre_carrera + " (" + materia.resolucion + ")" + '</td>' +
                            '<td>' + materia.semestre + '</td>' +
                            '<td>' + materia.nombre_materia + '</td>' +
                            '<td>' + materia.anio + '</td>' +
                            '<td>' + materia.carga_horaria + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id_materia="' + materia.id_materia + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id_materia="' + materia.id_materia + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                }
            });
            $("#cuerpoTabla").html(linea);
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Materia";
            var datosEnviar =
                    // atrapa el id que esta en el combo
                    'fk_planestudio=' + $("#combo").find(':selected').val() +
                    '&comboDuracion=' + $('#comboDuracion').find(':selected').val() +
                    '&nombre=' + $('#nombre').val() +
                    '&semestre=' + $('#semestre').val() +
                    '&carga_horaria=' + $('#carga_horaria').val();

            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.buscar();
                    $("#comboDuracion").val("");
                    $("#semestre").val("");
                    $("#nombre").val("");
                    $("#anio").val("");
                    $("#carga_horaria").val("");
                    //app.actualizarTabla(datosRecibidos, $("#id").val());
                    alert("Exito al guardar Materia");
                },
                error: function (datosRecibidos) {
                    alert('Error al guardar materia');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=materia";
            var datosEnviar =
                    // atrapa el id que esta en el combo
                    'fk_planestudio=' + $("#combo").find(':selected').val() +
                    '&comboDuracion=' + $('#comboDuracion').find(':selected').val() +
                    '&nombre=' + $('#nombre').val() +
                    '&semestre=' + $('#semestre').val() +
                    '&carga_horaria=' + $('#carga_horaria').val() +
                    '&id=' + $("#id").val();

            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalMateria").modal('hide');
                    app.buscar();
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar materia");
                    alert(datosRecibidos);
                }
            });
        };

        app.actualizarTabla = function (materia, id) {
            if (id == 0) {
                var html =
                        '<tr>' +
                        '<td>' + $("#combo").find(':selected').text() + '</td>' +
                        '<td>' + $('#anio').find(':selected').val() + '</td>' +
                        '<td>' + $('#nombre').val() + '</td>' +
                        '<td>' + $('#semestre').val() + '</td>' +
                        '<td>' + $('#carga_horaria').val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + materia.id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + materia.id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
            } else {

                var fila = $("#cuerpoTabla").find("a[data-id_materia='" + id + "']").parent().parent();
                var html = '<td>' + $("#combo").find(':selected').text() + '</td>' +
                        '<td>' + $('#anio').find(':selected').val() + '</td>' +
                        '<td>' + $('#nombre').val() + '</td>' +
                        '<td>' + $('#semestre').val() + '</td>' +
                        '<td>' + $('#carga_horaria').val() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Materia";
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
            var fila = $("#cuerpoTabla").find("[data-id_materia='" + id + "']").parent().parent().remove();
        };

        app.limpiarModal = function () {//funcion para limpiar el modal
            $("#id").val(0);
            $("#combo").val('');
            $("#comboDuracion").html('');
            $("#nombre").val('');
            $("#semestre").val('');
            $("#carga_horaria").val('');
            $("#cambiarCarrera").show();
            $("#combo").removeAttr("disabled");
            $("#formMateria").bootstrapValidator("resetForm", true);
        };

        app.limpiarModal2 = function () {//funcion para limpiar el modal
            $("#id2").val(0);
            $("#combo2").val('');
            $("#comboDuracion2").val('');
            $("#nombre2").val('');
            $("#semestre2").val('');
            $("#carga_horaria2").val('');
        };

        app.init();

    })(TallerAvanzada);
});