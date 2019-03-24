$(function () {
    var TallerAvanzada = {};

    var plan = "";
    var materia = "";
    var corr = "";

    (function (app) {
        app.init = function () {
            app.listarPlanEstudio();
            app.buscar();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                $("#id").val(0);
                app.listarPlanEstudio();
                $("#comboPlanE").prop('disabled', false);
                $("#comboMateria").prop('disabled', false);
                $("#tituloModal").html("Nueva Correlativa");
                $("#modalCorrelativa").modal({show: true});
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

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscar();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#comboPlanE").on('change', function () {
                app.listarMateria();
                $(this).prop('disabled', true);
            });

            $("#cambiarCarrera").on('click', function (event) {
                event.preventDefault();
                $("#comboPlanE").prop('disabled', false);
                $("#comboMateria").prop('disabled', false);
            });

            $("#comboMateria").change(function () {
                $(this).prop('disabled', true);
                app.listarCorrelativa();
            });

            $("#cambiarMateria").on('click', function (event) {
                event.preventDefault();
                $("#comboMateria").prop('disabled', false);
            });

            $("#cuerpoTabla").on('click', '.editar', function () {
                $("#id").val($(this).attr("data-id_correlativa"));
                $("#tituloModal").html("Editar Correlativa");
                plan = $(this).parent().parent().children().first().attr("data-id_planestudio");
                materia = $(this).parent().parent().children().first().next().attr("data-id_materiaini");
                corr = $(this).parent().parent().children().first().next().next().attr("data-id_correlativa");
                $("#cambiarMateria").hide();
                $("#cambiarCarrera").hide();
                $("#comboPlanE").val($(this).parent().parent().children().first().attr("data-id_planestudio"));
                $("#comboPlanE").prop('disabled', true);
                $("#comboPlanE").change();
                setTimeout(() => {
                    $("#comboMateria").val($(this).parent().parent().children().first().next().attr("data-id_materiaini"));
                    $("#comboMateria").change();
                    setTimeout(() => {
                        $("#comboCorrelativa").val($(this).parent().parent().children().first().next().next().attr("data-id_correlativa"));
                        $("#modalCorrelativa").modal({show: true});
                    }, 200);
                }, 200);
                $("#comboMateria").prop('disabled', true);
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                plan = $(this).parent().parent().children().first().attr("data-id_planestudio");
                materia = $(this).parent().parent().children().first().next().attr("data-id_materiaini");
                corr = $(this).parent().parent().children().first().next().next().attr("data-id_correlativa");
                $("#id").val($(this).attr("data-id_correlativa"));
                $("#plan2").prop('disabled', true);
                $("#plan2").val($(this).parent().parent().children().html());
                $("#materia2").prop('disabled', true);
                $("#materia2").val($(this).parent().parent().children().first().next().html());
                $("#correlativa2").prop('disabled', true);
                $("#correlativa2").val($(this).parent().parent().children().first().next().next().html());
                $("#tituloModal2").html("¿Desea Eliminar Correlativa?");
                $("#modal2").modal({show: true});
            });

            $("#borrar").on('click', function () {
                app.eliminar(plan, materia, corr);
            });

            $("#formMateria").bootstrapValidator({
                excluded: [],
            });

            $("#modalCorrelativa").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };

        app.listarMateria2 = function (nombre, id_materia) {
            var id = $("#comboPlanE").find(':selected').val();
            var url = "../../controlador/ruteador/Ruteador.php?accion=listarCombo&Formulario=materia";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    var item = "comboMateria";
                    app.rellenarCombo5(datosRecibidos, item, nombre, id_materia);
                },
                error: function () {
                    alert('error buscar materia');
                }
            });
        };

        app.rellenarCombo5 = function (data, itemRecibido, nombre, id_materia) {   //funcion para rellenar la tabla de alumnos.
            $("#comboMateria").html("");
            $("#comboMateria").append('<option value="' + id_materia + '">' + nombre + '</option>');
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_materia + '">' + value.nombre + '</option>');
            });
        };

        app.listarCorrelativa2 = function (nombre1, id_correlativa) {
            var fk_planestudio = $("#comboPlanE").find(':selected').val();
            var id_materia = $("#comboMateria").find(':selected').val();
            var url = "../../controlador/ruteador/Ruteador.php?accion=listarCombo&Formulario=correlativa";
            var datosEnviar = {fk_planestudio: fk_planestudio, id_materia: id_materia};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    var item = "comboCorrelativa";
                    app.rellenarComboCorr(datosRecibidos, item, nombre1, id_correlativa);
                },
                error: function () {
                    alert('error buscar correlativa');
                }
            });
        };

        app.rellenarComboCorr = function (data, itemRecibido, nombre1, id_correlativa) {   //funcion para rellenar la tabla de alumnos.
            $("#" + itemRecibido).html("");
            $("#" + itemRecibido).append('<option value="' + id_correlativa + '">' + nombre1 + '</option>');
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_materia + '">' + value.nombre + '</option>');
            });
        };

        app.listarPlanEstudio = function (id) {  //funcion para listar plan de estudios
            var datosEnviar = {id: id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=PlanDeEstudios";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    var item = "comboPlanE";
                    app.rellenarCombo(data, item);
                },
                error: function () {
                    alert('error buscar carreras');
                }
            });
        };

        app.rellenarCombo = function (data, itemRecibido) {   //funcion para rellenar la tabla de alumnos.
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option selected disabled value=''>Seleccione una carrera</option>");
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_plan + '">' + value.nombre_carrera + '(' + value.resolucion + ')</option>');
            });
        };

        app.listarMateria = function () {
            var id = $("#comboPlanE").find(':selected').val();
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarMaterias&Formulario=Correlativas";
            var datosEnviar = {id: id};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    var item = "comboMateria";
                    app.rellenarCombo2(datosRecibidos, item);
                },
                error: function () {
                    alert('error buscar materia');
                }
            });
        };

        app.rellenarCombo2 = function (data, itemRecibido) {   //funcion para rellenar la tabla de alumnos.
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option selected disabled value=''>Seleccione una materia</option>");
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option data-anio="' + value.anio + '" value="' + value.id_materia + '">' + value.nombre_materia + '</option>');
            });
        };

        app.listarCorrelativa = function () {
            var fk_planestudio = $("#comboPlanE").find(':selected').val();
            var id_materia = $("#comboMateria").find(':selected').val();
            var anio = $("#comboMateria").find(":selected").attr("data-anio");
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarMateria2&Formulario=Correlativas";
            var datosEnviar = {fk_plan_de_estudio: fk_planestudio, id_materia: id_materia, anio: anio};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    var item = "comboCorrelativa";
                    app.rellenarCombo3(datosRecibidos, item);
                },
                error: function () {
                    alert('error buscar correlativa');
                }
            });
        };

        app.rellenarCombo3 = function (data, itemRecibido) {   //funcion para rellenar la tabla de alumnos.
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option selected disabled value=''>Seleccione una correlativa</option>");
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_materia + '">' + value.nombre_materia + '</option>');
            });
        };

        app.buscar = function () { //esta funcion lista todas las correlativas
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Correlativas";
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

        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarC&Formulario=Correlativas";
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

        app.rellenarTabla = function (data) {//funcion para rellenar la tabla correlativas
            if (data == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTabla").html('');
                $("#alert").html(alerta);
            } else {
                var linea = "";
                $.each(data, function (clave, correlatividades) {
                    linea += '<tr>' +
                            '<td data-id_planestudio="' + correlatividades.fk_plan_de_estudios + '">' + correlatividades.nombre_carrera + " ( " + correlatividades.resolucion + " )" + '</td>' +
                            '<td data-id_materiaini="' + correlatividades.id_materia + '">' + correlatividades.nombre_materia + '</td>' +
                            '<td data-id_correlativa="' + correlatividades.id_correlativa + '">' + correlatividades.nombre_correlativa + '</td>' +
                            '<td>' +
                            '<button data-id_correlativa="' + correlatividades.fk_plan_de_estudios + correlatividades.id_materia + correlatividades.id_correlativa + '" type="button" class="btn btn-sm btn-warning pull-left editar"  data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button data-id_correlativa="' + correlatividades.fk_plan_de_estudios + correlatividades.id_materia + correlatividades.id_correlativa + '" type="button" class="btn btn-sm btn-danger pull-right eliminar"  data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                });
                $("#alert").html('');
                $("#cuerpoTabla").html(linea);
            }
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Correlativas";
            var datosEnviar = {id_materiaini: $("#comboMateria").find(':selected').val(),
                id_correlativa: $("#comboCorrelativa").find(':selected').val(),
                id_planestudio: $("#comboPlanE").find(':selected').val()};

            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla($("#id").val());
                    alert("Se ha cargado la correlativa con exito");
                    $("#formMateria").bootstrapValidator("resetForm", true);
                    $("#comboPlanE").val(datosEnviar.id_planestudio);
                    $("#comboMateria").val(datosEnviar.id_materiaini);
                },
                error: function (datosRecibidos) {
                    alert('error al guardar');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Correlativas";
            var datosEnviar = {
                plan: plan,
                materia: materia,
                correlativa: corr,
                nueva_correlativa: $("#comboCorrelativa").val()
            };
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla($("#id").val());
                    $("#modalCorrelativa").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error al modificar correlativa");
                }
            });
        };

        app.actualizarTabla = function (id) {
            if (id == 0) {
                var html =
                        '<tr>' +
                        '<td data-id_planestudio="' + $("#comboPlanE").val() + '">' + $("#comboPlanE").find(':selected').html() + '</td>' +
                        '<td data-id_materiaini="' + $("#comboMateria").val() + '">' + $("#comboMateria").find(':selected').html() + '</td>' +
                        '<td data-id_correlativa="' + $("#comboCorrelativa").val() + '">' + $("#comboCorrelativa").find(':selected').html() + '</td>' +
                        '<td>' +
                        '<button data-id_correlativa="' + $("#comboPlanE").val() + $("#comboMateria").val() + $("#comboCorrelativa").val() + '" type="button" class="btn btn-sm btn-warning pull-left editar"  data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button data-id_correlativa="' + $("#comboPlanE").val() + $("#comboMateria").val() + $("#comboCorrelativa").val() + '" type="button" class="btn btn-sm btn-danger pull-right eliminar"  data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);

            } else {
                var fila = $("#cuerpoTabla").find("button[data-id_correlativa='" + id + "']").parent().parent();
                var html = '<td data-id_planestudio="' + $("#comboPlanE").val() + '">' + $("#comboPlanE").find(':selected').html() + '</td>' +
                        '<td data-id_materiaini="' + $("#comboMateria").val() + '">' + $("#comboMateria").find(':selected').html() + '</td>' +
                        '<td data-id_correlativa="' + $("#comboCorrelativa").val() + '">' + $("#comboCorrelativa").find(':selected').html() + '</td>' +
                        '<td>' +
                        '<button data-id_correlativa="' + $("#id").val() + '" type="button" class="btn btn-sm btn-warning pull-left editar"  data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button data-id_correlativa="' + $("#id").val() + '" type="button" class="btn btn-sm btn-danger pull-right eliminar"  data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (plan, materia, corr) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Correlativas";
            var datosEnviar = {id_planestudio: plan, id_materiaini: materia, id_correlativa: corr};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.eliminarFila($("#id").val());
                    $("#modal2").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert('Error al eliminar');
                }
            });
        };

        app.eliminarFila = function (id) {
            $("#cuerpoTabla").find("button[data-id_correlativa='" + id + "']").parent().parent().remove();
        };

        app.limpiarModal = function () {//funcion para limpiar el modal           
            $("#comboPlanE").val("");
            $("#comboMateria").html("");
            $("#comboCorrelativa").html("");
            $("#formMateria").bootstrapValidator("resetForm", true);
            $("#cambiarMateria").show();
            $("#cambiarCarrera").show();
        };

        app.init();

    })(TallerAvanzada);
});

