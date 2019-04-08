$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarHorarios();
            app.listarCombos('Profesor');
            app.listarCombos('Plan');
            app.listarCombos('Sede');
            app.listarCombos('InicioHorario');
            app.bindings();
            app.rellenarCiclo();
        };

        app.bindings = function () {

            $("#agregarHorario").on('click', function () {
                //app.ocultarCampos();
                app.limpiarModal();
                $("#tituloModal").html("Agregar horario");
                $("#id").val(0);
                $("#modalHorario").modal({show: true});
                $("#accion").html("Guardar");
            });

            $("#form").on('success.form.bv', function (event) {
                event.preventDefault();
                app.verificarHorario();
            });

            $("#selectPlan").on('change', function () {
                app.listarCombos('Materia');
                $("#selectPlan").prop('disabled', true);
            });

            $("#selectSede").on('change', function () {
                $("#profesor").show();
                $("#selectSede").prop('disabled', true);
                //alert($("#selectMateria").val());
                if ($("#selectMateria").find(":selected").val() != 0) {
                    app.listarCombos('Curso');
                }
            });

            $("#selectProfesor").on('change', () => {
                $("#materia").show();
            });

            $("#selectMateria").on('change', () => {
                app.listarCombos('Curso');
                $("#curso").show();
            });

            $("#selectCurso").on('change', () => {
                $("#hora_inicio").show();
                $("#hora_fin").show();
                $("#dia").show();
                $("#ciclo_lectivo").show();
            });

            $("#selectInicioHorario").on('change', () => {
                app.listarCombos('FinHorario');
            });

            $("#cambiarPlan").on('click', () => {
                $("#selectPlan").prop('disabled', false);
            });

            $("#cambiarSede").on('click', () => {
                $("#selectSede").prop('disabled', false);
            });

            $("#cuerpoTablaHorario").on('click', '.editar', function () {
                $("#accion").html("Guardar");
                $("#tituloModal").html("Editar horario");
                app.modificarCampos(this);
            });

            $("#cuerpoTablaHorario").on('click', '.eliminar', function () {
                $("#accion").html("Eliminar");
                $("#tituloModal").html("¿Está seguro de que desea eliminar este horario?");
                $("#fieldsetHorario").attr("disabled", "true");
                app.modificarCampos(this);
                app.habilitadorCampos(true);
                $("#borrar").show();
                $("#guardar").hide();
            });

            $("#form").bootstrapValidator({
                excluded: []
            });

            $("#modalHorario").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };

        app.showAlert = function () {
            $("#alerta").fadeIn();
            setTimeout(function () {
                $("#alerta").fadeOut();
            }, 2500);
        };

        app.alertSave = function () {
            var alerta = '<div class="alert alert-success" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-saved"></span>' + ' ¡Agregado con exito!' + '</strong>' + ' Se cargo un registro en la Base de Datos. ' +
                    '</div>';
            $("#alerta").html(alerta);
            app.showAlert();
        };

        app.alertInfo1 = function () {
            var alerta = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error al guardar!' + '</strong>' + ' El horario ingresado ya pertenece a un Profesor.' +
                    '</div>';
            $("#alerta").html(alerta);
            app.showAlert();
        };

        app.alertInfo2 = function () {
            var profesor = $("#selectProfesor").find(':selected').text();
            var alerta = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error al guardar!' + '</strong>' + ' El Prof: ' + profesor + ' ya dicta una Materia en el horario ingresado. ' +
                    '</div>';
            $("#alerta").html(alerta);
            app.showAlert();
        };

        app.alertInfo3 = function () {
            var curso = $("#selectCurso").find(':selected').text();
            var alerta = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error al guardar!' + '</strong>' + ' En el curso: ' + curso + ' ya se dicta una Materia con el mismo horario. ' +
                    '</div>';
            $("#alerta").html(alerta);
            app.showAlert();
        };

        app.alertModif = function () {
            var alert2 = '<div class="alert alert-warning" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-saved"></span>' + ' ¡Actualizado con exito!' + '</strong>' + ' Se modificó un registro en la Base de Datos. ' +
                    '</div>';
            $("#alerta").html(alert2);
            app.showAlert();
        };

        app.alertDelete = function () {
            var alert2 = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-remove"></span>' + ' ¡Eliminado con exito!' + '</strong>' + ' Se elimino un registro en la Base de Datos. ' +
                    '</div>';
            $("#alerta").html(alert2);
            app.showAlert();
        };

        app.verificarHorario = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=verificarHorario&Formulario=Horario";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                //dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {

                    //parseo los datosRecibidos a tipo de dato Int
                    var data = parseInt(datosRecibidos);

                    switch (data) {
                        case 0:
                            if ($("#id").val() == 0) {
                                app.guardarHorario();
                            } else {
                                app.editarHorario();
                            }
                            break;

                        case 1:
                            //muestro mensaje con el tipo de error.
                            app.alertInfo1();

                            //guardo el valor de los campos en variables.
                            var carrera = $("#selectPlan").find(':selected').val();
                            var sede = $("#selectSede").find(':selected').val();
                            var profesor = $("#selectProfesor").find(':selected').val();
                            var materia = $("#selectMateria").find(':selected').val();
                            var curso = $("#selectCurso").find(':selected').val();
                            var dia = $("#selectDia").find(':selected').val();
                            var año_lectivo = $("#selectCicloLectivo").find(':selected').val();

                            //reseteo el formulario y su validación.
                            $("#form").bootstrapValidator('resetForm', true);

                            //cargo valores guardados en las variables.
                            $("#selectPlan").val(carrera);
                            $("#selectSede").val(sede);
                            $("#selectProfesor").val(profesor);
                            $("#selectMateria").val(materia);
                            $("#selectCurso").val(curso);
                            $("#selectDia").val(dia);
                            $("#selectCicloLectivo").val(año_lectivo);

                            //genero el click con JS para validar el form nuevamente (Es cochino pero eficaz). 
                            $("#guardar").click();

                            break;

                        case 2:
                            //muestro mensaje con el tipo de error
                            app.alertInfo2();

                            //guardo el valor de los campos en variables.
                            var carrera = $("#selectPlan").find(':selected').val();
                            var sede = $("#selectSede").find(':selected').val();
                            var profesor = $("#selectProfesor").find(':selected').val();
                            var materia = $("#selectMateria").find(':selected').val();
                            var dia = $("#selectDia").find(':selected').val();
                            var año_lectivo = $("#selectCicloLectivo").find(':selected').val();

                            //reseteo el formulario y su validación.
                            $("#form").bootstrapValidator('resetForm', true);

                            //cargo valores guardados en las variables.
                            $("#selectPlan").val(carrera);
                            $("#selectSede").val(sede);
                            $("#selectProfesor").val(profesor);
                            $("#selectMateria").val(materia);
                            $("#selectDia").val(dia);
                            $("#selectCicloLectivo").val(año_lectivo);

                            //genero el click con JS para validar el form nuevamente (Es cochino pero eficaz). 
                            $("#guardar").click();

                            break;

                        case 3:
                            //muestro mensaje con el tipo de error
                            app.alertInfo3();

                            //guardo el valor de los campos en variables.
                            var carrera = $("#selectPlan").find(':selected').val();
                            var sede = $("#selectSede").find(':selected').val();
                            var profesor = $("#selectProfesor").find(':selected').val();
                            var materia = $("#selectMateria").find(':selected').val();
                            var curso = $("#selectCurso").find(':selected').val();
                            var dia = $("#selectDia").find(':selected').val();
                            var año_lectivo = $("#selectCicloLectivo").find(':selected').val();

                            //reseteo el formulario y su validación.
                            $("#form").bootstrapValidator('resetForm', true);

                            //cargo valores guardados en las variables.
                            $("#selectPlan").val(carrera);
                            $("#selectSede").val(sede);
                            $("#selectProfesor").val(profesor);
                            $("#selectMateria").val(materia);
                            $("#selectCurso").val(curso);
                            $("#selectDia").val(dia);
                            $("#selectCicloLectivo").val(año_lectivo);

                            //genero el click con JS para validar el form nuevamente (Es cochino pero eficaz). 
                            $("#guardar").click();

                            break;

                        default:

                            break;
                    }
                },
                error: function (datosRecibidos) {
                    alert("error");
                }
            })
        };

        app.guardarHorario = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Horario";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.alertSave();
                    var plan = $("#selectPlan").find(':selected').val();
                    var sede = $("#selectSede").find(':selected').val();
                    app.limpiarModal();
                    $("#selectPlan").val(plan);
                    $("#selectPlan").prop('disabled', true);
                    $("#selectSede").val(sede);
                    $("#selectSede").change();
                },
                error: function (datosRecibidos) {
                    alert("Error al guardar horario");
                    alert(datosRecibidos);
                }
            });
        };

        app.editarHorario = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Horario";
            var datosEnviar = $("#formHorario").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    $("#modalHorario").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error al editar horario");
                    alert(datosRecibidos);
                }
            });
        };

        app.actualizarTabla = function (horario, id) {
            var html = "";
            if (id == 0) {
                html = "<tr>\n\
                             <td data-id_profesor='" + horario.fk_profesor + "'>" + horario.nombre_profesor + " " + horario.apellido_profesor + "</td>\n\
                             <td data-id_plan='" + horario.id_plan + "'>" + horario.nombre_carrera + " (Resolucion:" + horario.resolucion + ")</td>\n\
                             <td data-id_materia='" + horario.fk_materia + "'>" + horario.nombre_materia + "</td>\n\
                             <td data-id_sede='" + horario.id_sede + "'>" + horario.nombre_sede + " (Numero:" + horario.numero_sede + ")</td>\n\
                             <td data-id_curso='" + horario.fk_curso + "'>" + horario.nombre_curso + "</td>\n\
                             <td data-id_inicio='" + horario.fk_modulo_inicio + "'>" + horario.hora_inicio + "</td>\n\
                             <td data-id_fin='" + horario.fk_modulo_fin + "'>" + horario.hora_fin + "</td>\n\
                             <td>" + horario.dia_horario + "</td>\n\
                             <td>" + horario.ciclo_lectivo_horario + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-success' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                                 <a class='eliminar btn btn-danger' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                             </td>\n\
                         </tr>";
                $("#cuerpoTablaHorario").append(html);
            } else {
                var fila = $("#cuerpoTablaHorario").find("a[data-id_horario='" + id + "']").parent().parent();
                var html = "<td data-id_profesor='" + horario.fk_profesor + "'>" + horario.nombre_profesor + " " + horario.apellido_profesor + "</td>\n\
                             <td data-id_plan='" + horario.id_plan + "'>" + horario.nombre_carrera + " (Resolucion:" + horario.resolucion + ")</td>\n\
                             <td data-id_materia='" + horario.fk_materia + "'>" + horario.nombre_materia + "</td>\n\
                             <td data-id_sede='" + horario.id_sede + "'>" + horario.nombre_sede + " (Numero:" + horario.numero_sede + ")</td>\n\
                             <td data-id_curso='" + horario.fk_curso + "'>" + horario.nombre_curso + "</td>\n\
                             <td data-id_inicio='" + horario.fk_modulo_inicio + "'>" + horario.hora_inicio + "</td>\n\
                             <td data-id_fin='" + horario.fk_modulo_fin + "'>" + horario.hora_fin + "</td>\n\
                             <td>" + horario.dia_horario + "</td>\n\
                             <td>" + horario.ciclo_lectivo_horario + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-success' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                                 <a class='eliminar btn btn-danger' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                             </td>";

                fila.html(html);
            }
        };

        app.eliminarHorario = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Horario";
            var datosEnviar = $("#formHorario").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.eliminarFila($("#id_horario").val());
                    $("#modalHorario").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error al eliminar horario");
                    alert(datosRecibidos);
                }
            });
        };

        app.eliminarFila = function (id) {
            $("#cuerpoTablaHorario").find("a[data-id_horario='" + id + "']").parent().parent().remove();
        }

        app.buscarHorarios = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Horario";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert("Error al buscar horarios");
                }
            })
        };

        app.rellenarTabla = function (datosHorario) {
            var html = "";
            $.each(datosHorario, function (clave, horario) {
                html += "<tr>\n\
                             <td data-id_profesor='" + horario.fk_profesor + "'>" + horario.nombre_profesor + " " + horario.apellido_profesor + "</td>\n\
                             <td data-id_plan='" + horario.id_plan + "'>" + horario.nombre_carrera + " (Resolucion:" + horario.resolucion + ")</td>\n\
                             <td data-id_materia='" + horario.fk_materia + "'>" + horario.nombre_materia + "</td>\n\
                             <td data-id_sede='" + horario.id_sede + "'>" + horario.nombre_sede + " (Numero:" + horario.numero_sede + ")</td>\n\
                             <td data-id_curso='" + horario.fk_curso + "'>" + horario.nombre_curso + "</td>\n\
                             <td data-id_inicio='" + horario.fk_modulo_inicio + "'>" + horario.hora_inicio + "</td>\n\
                             <td data-id_fin='" + horario.fk_modulo_fin + "'>" + horario.hora_fin + "</td>\n\
                             <td>" + horario.dia_horario + "</td>\n\
                             <td>" + horario.ciclo_lectivo_horario + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-success' title='Editar registro' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                                 <a class='eliminar btn btn-danger'title='Eliminar registro'  data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                             </td>\n\
                         </tr>";
            });
            $("#cuerpoTablaHorario").html(html);
        };

        app.listarCombos = (item) => {
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
                case 'Profesor':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Profesor";
                    break;

                case 'Plan':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=PlanDeEstudios";
                    break;

                case 'Materia':
                    var datosEnviar = {"fk_plan": $("#selectPlan").val()};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarMaterias&Formulario=Horario";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'Sede':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Sede";
                    break;

                case 'Curso':
                    var datosEnviar = {
                        "fk_sede": $("#selectSede").val(),
                        "fk_plan": $("#selectPlan").val(),
                        "anio": $("#selectMateria").find(":selected").attr("data-anio")
                    };
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarCursos&Formulario=Horario";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'InicioHorario':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=listarModulosInicio&Formulario=Horario";
                    break;

                case 'FinHorario':
                    var datosEnviar = {id_modulo: $("#selectInicioHorario").find(":selected").val()};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarModulosFin&Formulario=Horario";
                    ajaxObj.data = datosEnviar;
                    break;

                default:
                    break;
            }

            jQuery.ajax(ajaxObj);
        };

        app.rellenarCombos = (data, item) => {
            var itemRecibido = `select${item}`;
            var html = "";

            //alert(itemRecibido);

            $('#' + itemRecibido).html("");

            $.each(data, function (clave, value) {
                switch (item) {
                    case 'Profesor':
                        html += "<option value='" + value.id_profesor + "'>" + value.nombre_profesor + " " + value.apellido_profesor + "</option>";
                        break;

                    case 'Plan':
                        html += "<option value='" + value.id_plan + "'>" + value.nombre_carrera + " (Resolucion:" + value.resolucion + ")</option>";
                        break;

                    case 'Materia':
                        html += "<option data-anio='" + value.anio + "' value='" + value.id_materia + "'>" + value.nombre_materia + "</option>";
                        break;

                    case 'Sede':
                        html += "<option value='" + value.id_sede + "'>" + value.nombre_sede + " (Numero:" + value.numero_sede + ")</option>";
                        break;

                    case 'Curso':
                        html += "<option value='" + value.id_curso + "'>" + value.nombre_curso + "</option>";
                        break;

                    case 'InicioHorario':
                    case 'FinHorario':
                        html += "<option value='" + value.id_modulo + "'>" + value.hora_modulo + "</option>";
                        break;

                    default:
                        break;
                }
            });

            $('#' + itemRecibido).html(html);
            $('#' + itemRecibido).prepend("<option selected disabled value=''>Seleccione</option>");
        };

        app.rellenarCiclo = () => {
            var año = new Date();
            var html = "";
            //alert(año.getFullYear());
            html += '<option selected disabled value="">Selecione el ciclo lectivo</option>';
            for (var i = 2000; i <= año.getFullYear(); i++) {
                html += `<option value='${i}'>` + i + "</option>";
            }
            $("#selectCicloLectivo").html(html);
        };

        app.modificarCampos = (boton) => {
            app.limpiarModal();
            $("#id_horario").val($(boton).attr("data-id_horario"));
            $("#selectPlan").val($(boton).parent().parent().children().first().next().attr("data-id_plan"));
            $("#selectPlan").change();
            setTimeout(() => {
                $("#selectSede").val($(boton).parent().parent().children().first().next().next().next().attr("data-id_sede"));
                $("#selectSede").change();
                setTimeout(() => {
                    $("#selectProfesor").val($(boton).parent().parent().children().first().attr("data-id_profesor"));
                    $("#selectProfesor").change();
                    setTimeout(() => {
                        $("#selectMateria").val($(boton).parent().parent().children().first().next().next().attr("data-id_materia"));
                        $("#selectMateria").change();
                        setTimeout(() => {
                            $("#selectCurso").val($(boton).parent().parent().children().first().next().next().next().next().attr("data-id_curso"));
                            $("#selectCurso").change();
                            $("#modalHorario").modal({show: true});
                        }, 120);
                    }, 90);
                }, 60);
            }, 30);

            $("#selectInicioHorario").val($(boton).parent().parent().children().first().next().next().next().next().next().attr("data-id_inicio"));
            $("#selectInicioHorario").change();
            setTimeout(() => {
                $("#selectFinHorario").val($(boton).parent().parent().children().first().next().next().next().next().next().next().attr("data-id_fin"));
            }, 50);

            $("#selectDia").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().html());
            $("#selectCicloLectivo").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
        };

        app.limpiarModal = function () {
            $("#id_horario").val("");
            $("#selectPlan").val("");
            $("#selectSede").val("");
            $("#selectProfesor").val("");
            $("#selectMateria").val("");
            $("#selectCurso").val("");
            $("#selectInicioHorario").val("");
            $("#selectFinHorario").val("");
            $("#selectDia").val("");
            $("#selectCicloLectivo").val("");
            $("#fieldsetHorario").removeAttr("disabled");
            app.ocultarCampos();
            app.habilitadorCampos(false);
            $("#borrar").hide();
            $("#guardar").show();
            $("#accion").show();
            $("#form").bootstrapValidator("resetForm", true);
        };

        app.ocultarCampos = () => {
            $("#materia").hide();
            $("#profesor").hide();
            $("#curso").hide();
            $("#hora_inicio").hide();
            $("#hora_fin").hide();
            $("#dia").hide();
            $("#ciclo_lectivo").hide();
        };

        app.habilitadorCampos = (condicion) => {
            $("#selectPlan").prop('disabled', condicion);
            $("#selectSede").prop('disabled', condicion);
            $("#selectProfesor").prop('disabled', condicion);
            $("#selectMateria").prop('disabled', condicion);
            $("#selectCurso").prop('disabled', condicion);
            $("#selectInicioHorario").prop('disabled', condicion);
            $("#selectFinHorario").prop('disabled', condicion);
            $("#selectDia").prop('disabled', condicion);
            $("#selectCicloLectivo").prop('disabled', condicion);
        };

        app.init();
    })(TallerAvanzada);
});
