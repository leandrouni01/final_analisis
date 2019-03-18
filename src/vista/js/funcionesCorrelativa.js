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
                app.limpiarModal();
                app.listarPlanEstudio();
                $("#comboPlanE").prop('disabled', false);
                $("#comboMateria").prop('disabled', false);
                $("#tituloModal").html("Nueva Correlativa");
                $("#modalCorrelativa").modal({show: true});
            });

            $("#guardar").on('click', function (event) {
                event.preventDefault();
                $("#comboPlanE").prop('disabled', false);
                $("#comboMateria").prop('disabled', false);
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });

            $("#comboPlanE").change(function () {
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
                $("#id").val(1);
                plan = $(this).parent().parent().children().first().attr("data-id_planestudio");
                materia = $(this).parent().parent().children().first().next().attr("data-id_materiaini");
                corr = $(this).parent().parent().children().first().next().next().attr("data-id_correlativa");
                
                $("#comboPlanE").find(':selected').text($(this).parent().parent().children().html());
                $("#comboPlanE").val($(this).parent().parent().children().attr("data-id_planestudio"));
                $("#comboPlanE").prop('disabled', true);

                var nombre = $(this).parent().parent().children().first().next().text();
                var id_materia = $(this).parent().parent().children().attr("data-id_materiaini");
                $("#comboMateria").append('<option value="' + id_materia + '">' + nombre + '</option>');

                app.listarMateria2(nombre, id_materia);
                $("#comboMateria").prop('disabled', true);

                var nombre1 = $(this).parent().parent().children().first().next().next().text();
                var id_correlativa = $(this).parent().parent().children().attr("data-id_correlativa");
                app.listarCorrelativa2(nombre1, id_correlativa);
                $("#tituloModal").html("Editar Correlativa");

                $("#salir").on('click', function (event) {
                    $("#comboPlanE").val('');
                    $("#comboMateria").empty();
                    $("#comboCorrelativa").empty();
                });

                $("#modalCorrelativa").modal({show: true});           
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {   
                plan = $(this).parent().parent().children().first().attr("data-id_planestudio");
                materia = $(this).parent().parent().children().first().next().attr("data-id_materiaini");
                corr = $(this).parent().parent().children().first().next().next().attr("data-id_correlativa");
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
                app.eliminar(plan  , materia, corr);
                $("#modal2").modal('hide');
            });

            $("#formMateria").bootstrapValidator({
                excluded: [],
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

        app.listarPlanEstudio = function (id) {  //funcion para listar carreras
            var datosEnviar = {id: id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=planestudio";
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
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_planestudio + '">' + value.resolucion + '</option>');
            });
        };

        app.listarMateria = function () {
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
                    app.rellenarCombo2(datosRecibidos, item);
                },
                error: function () {
                    alert('error buscar materia');
                }
            });
        };

        app.rellenarCombo2 = function (data, itemRecibido) {   //funcion para rellenar la tabla de alumnos.
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_materia + '">' + value.nombre + '</option>');
            });
        };

        app.listarCorrelativa = function () {
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
                    app.rellenarCombo3(datosRecibidos, item);
                },
                error: function () {
                    alert('error buscar correlativa');
                }
            });
        };

        app.rellenarCombo3 = function (data, itemRecibido) {   //funcion para rellenar la tabla de alumnos.
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");
            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_materia + '">' + value.nombre + '</option>');
            });
        };

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=correlativa";
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
            $.each(data, function (clave, correlatividades) {
                linea += '<tr>' +
                        '<td data-id_planestudio="' + correlatividades.id_planestudio + '">'+ correlatividades.nombre + " ( " + correlatividades.resolucion + " )" +'</td>' +
                        '<td data-id_materiaini="' + correlatividades.id_materia + '">' + correlatividades.Materia + '</td>' +
                        '<td data-id_correlativa="' + correlatividades.id_correlativa + '">' + correlatividades.Correlatividad + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar"  data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar"  data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
            });
            $("#cuerpoTabla").html(linea);
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=correlativa";
            var datosEnviar =
                    'id_materiaini=' + $("#comboMateria").find(':selected').val() +
                    '&id_correlativa=' + $("#comboCorrelativa").find(':selected').val() +
                    '&id_planestudio=' + $("#comboPlanE").find(':selected').val();

            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalCorrelativa").modal({show: true});
                    $("#comboPlanE").prop('disabled', true);
                    $("#comboMateria").prop('disabled', true);
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                },
                error: function (datosRecibidos) {
                    alert('error al guardar');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=correlativa";
            var plan2 = $("#comboPlanE").find(':selected').text();
            var mat2 = $("#comboMateria").find(':selected').text();
            var corr2 = $("#comboCorrelativa").find(':selected').val();
            var datosEnviar = {nombre: mat2, resolucion: plan2, id_materia: corr2, id_planestudio: plan, id_materiaini: materia, id_correlativa: corr};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalCorrelativa").modal('hide');
                    app.buscar();
                },
                error: function (datosRecibidos) {
                    alert(datosRecibidos);
                }
            });
        };

        app.actualizarTabla = function (data, id) {
            if (id == 0) {
                var html =
                        '<tr>' +
                        '<td>' + $("#comboPlanE").find(':selected').text() + '</td>' +
                        '<td>' + $("#comboMateria").find(':selected').text() + '</td>' +
                        '<td>' + $("#comboCorrelativa").find(':selected').text() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar"  data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar"  data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);

            } else {
                var fila = $("#cuerpoTabla").find().parent().parent();
                var html = '<td>' + $("#comboPlanE").find(':selected').text() + '</td>' +
                        '<td>' + $("#comboMateria").find(':selected').text() + '</td>' +
                        '<td>' + $("#comboCorrelativa").find(':selected').text() + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar"  data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar"  data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' ;
                        fila.html(html);
            }
        };

        app.eliminar = function (plan, materia, corr) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=correlativa";
            var datosEnviar = {id_planestudio: plan, id_materiaini: materia, id_correlativa: corr};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.buscar();
                },
                error: function (datosRecibidos) {
                    alert('Error al eliminar');
                }
            });
        };

        app.limpiarModal = function () {//funcion para limpiar el modal           
            $("#comboPlanE").html("");
            $("#comboMateria").html("");
            $("#comboCorrelativa").html("");
        };

        app.init();

    })(TallerAvanzada);
});

