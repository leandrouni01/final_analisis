$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarAsignaciones();
            app.listarCombos('Plan');
            app.listarCombos('Sede');
            app.listarCombos('Profesor');
            app.bindings();
            app.rellenarCiclo();
        };

        app.bindings = function () {

            $("#agregarAsignacion").on('click', function () {
                //app.ocultarCampos();
                app.limpiarModal();
                $("#tituloModal").html("Agregar asignación");
                $("#id_horario").val(0);
                $("#modalHorario").modal({show: true});
                $("#accion").html("Guardar");
            });

            $("#form").on('success.form.bv', function (event) {
                event.preventDefault();
                app.verificarHorario();
            });

            $("#selectPlan").on('change', function () {
               app.listarCombos("Año");
               $("#selectPlan").prop('disabled', true);
               if($("#selectSede").find(":selected").val() != ''){
                   $("#año").show();
               }
            });

            $("#selectSede").on('change', function () {
               $("#selectSede").prop('disabled', true);
               if($("#selectPlan").find(":selected").val() != ''){
                   $("#año").show();
               }
            });
            
            $("#selectAño").on('change',function(){
                app.listarCombos('Materia');
                $("#materia").show();
            });
            
            $("#selectMateria").on("change",()=>{
               app.listarCombos('Curso');
               $("#curso").show();
            });

            $("#selectCurso").on('change', () => {
               $("#profesor").show(); 
            });
            
            $("#selectProfesor").on('change', () => {
               $("#fecha_inicio").show(); 
            });
            
            $("#selectFechaInicio").on('change', () => {
               $("#fecha_fin").show(); 
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
                $("#cambiarPlan").hide();
                $("#cambiarSede").hide();
                $("#borrar").show();
                $("#guardar").hide();
            });

            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarHorarios();
                } else {
                    app.busqueda(parametros);
                }
            });

            $("#form").bootstrapValidator({
                excluded: []
            });

            $("#borrar").on('click', function () {
                app.eliminarHorario($("#id_horario").val());
                $("#modalHorario").modal('hide');
            });

            $("#modalHorario").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };

        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=Horario";
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

        app.showAlert = function () {
            $("#alerta").fadeIn();
            setTimeout(function () {
                $("#alerta").fadeOut();
            }, 8000);
        };

        app.showAlert2 = function () {
            $("#alert2").fadeIn();
            setTimeout(function () {
                $("#alert2").fadeOut();
            }, 3000);
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
            var alerta = '<div class="alert alert-warning" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-saved"></span>' + ' ¡Actualizado con exito!' + '</strong>' + ' Se modificó un registro en la Base de Datos. ' +
                    '</div>';
            $("#alert2").html(alerta);
            app.showAlert2();
        };

        app.alertDelete = function () {
            var alerta = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-remove"></span>' + ' ¡Eliminado con exito!' + '</strong>' + ' Se elimino un registro en la Base de Datos. ' +
                    '</div>';
            $("#alert2").html(alerta);
            app.showAlert2();
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
                            if ($("#id_horario").val() == 0) {
                                app.guardarHorario();
                            } else {
                                app.editarHorario();
                            }
                            break;
                        case 1:
                        case 2:
                            //muestro mensaje con el tipo de error
                            //alert(data);
                            app.alertInfo3();

                            //guardo el valor de los campos en variables.
                            let carrera = $("#selectPlan").find(':selected').val();
                            let sede = $("#selectSede").find(':selected').val();
                            let profesor = $("#selectProfesor").find(':selected').val();
                            let materia = $("#selectMateria").find(':selected').val();
                            let curso = $("#selectCurso").find(':selected').val();
                            let dia = $("#selectDia").find(':selected').val();
                            let año_lectivo = $("#selectCicloLectivo").find(':selected').val();
                            let anio= $("#selectAño").find(":selected").val();
                            let hora_inicio= $("#selectInicioHorario").find(":selected").val();
                            let hora_fin = $("#selectFinHorario").find(":selected").val();

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
                            $("#selectAño").val(anio);
                            $("#selectInicioHorario").val(hora_inicio);
                            $("#selectFinHorario").val(hora_fin);
                            break;

                        default:
                            break;
                    }
                },
                error: function (datosRecibidos) {
                    alert("error");
                }
            });
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
                    app.actualizarTabla(datosRecibidos, $("#id_horario").val());
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
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id_horario").val());
                    $("#modalHorario").modal('hide');
                    app.alertModif();
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
                             <td data-id_plan='" + horario.id_plan + "'>" + horario.nombre_carrera + " (Resolucion:" + horario.resolucion + ")</td>\n\
                             <td data-id_materia='" + horario.id_materia + "'>" + horario.nombre_materia + "</td>\n\
                             <td data-id_sede='" + horario.id_sede + "'>" + horario.nombre_sede + " (Numero:" + horario.numero_sede + ")</td>\n\
                             <td data-id_curso='" + horario.id_curso + "' data-anio_curso='"+horario.anio+"'>" + horario.nombre_curso + "</td>\n\
                             <td>" + horario.dia_horario + "</td>\n\
                             <td>" + horario.ciclo_lectivo_horario + "</td>\n\
                             <td data-id_inicio='" + horario.fk_modulo_inicio + "'>" + horario.hora_inicio + "</td>\n\
                             <td data-id_fin='" + horario.fk_modulo_fin + "'>" + horario.hora_fin + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-warning btn-sm' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-pencil'></span> Editar</a>\n\
                                 <a class='eliminar btn btn-danger btn-sm' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-trash'></span> Eliminar</a>\n\
                             </td>\n\
                         </tr>";
                $("#cuerpoTablaHorario").append(html);
            } else {
                var fila = $("#cuerpoTablaHorario").find("a[data-id_horario='" + id + "']").parent().parent();
                var html = " <td data-id_plan='" + $("#selectPlan").find(':selected').val() + "'>" + $("#selectPlan").find(':selected').text() + "</td>\n\
                             <td data-id_materia='" + $("#selectMateria").find(':selected').val() + "'>" + $("#selectMateria").find(':selected').text() + "</td>\n\
                             <td data-id_sede='" + $("#selectSede").find(':selected').val() + "'>" + $("#selectSede").find(':selected').text() + "</td>\n\
                             <td data-id_curso='" + $("#selectCurso").find(':selected').val() + "'data-anio_curso='"+$("#selectAño").find(":selected").val()+"'>" + $("#selectCurso").find(':selected').text() + "</td>\n\
                             <td>" + $("#selectDia").find(':selected').val() + "</td>\n\
                             <td>" + $("#selectCicloLectivo").find(':selected').val() + "</td>\n\
                             <td data-id_inicio='" + $("#selectInicioHorario").find(':selected').val() + "'>" + $("#selectInicioHorario").find(':selected').text() + "</td>\n\
                             <td data-id_fin='" + $("#selectFinHorario").find(':selected').val() + "'>" + $("#selectFinHorario").find(':selected').text() + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-warning btn-sm' data-id_horario='" + id + "'><span class='glyphicon glyphicon-pencil'></span> Editar</a>\n\
                                 <a class='eliminar btn btn-danger btn-sm' data-id_horario='" + id + "'><span class='glyphicon glyphicon-trash'></span> Eliminar</a>\n\
                             </td>";

                fila.html(html);
            }
        };

        app.eliminarHorario = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Horario";
            var datosEnviar = {id_horario: id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.eliminarFila(id);
                    app.alertDelete();
                },
                error: function (datosRecibidos) {
                    alert("Error al eliminar horario");
                    alert(datosRecibidos);
                }
            });
        };

        app.eliminarFila = function (id) {
            $("#cuerpoTablaHorario").find("a[data-id_horario='" + id + "']").parent().parent().remove();
        };

        app.buscarAsignaciones = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Asignacion";
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
            });
        };

        app.rellenarTabla = function (datos) {
            if (datos == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTablaAsignacion").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var html = "";
                $.each(datos, function (clave, asignacion) {
                    html += "<tr>" +
                                `<td data-id_plan=${asignacion.id_plan}>${asignacion.nombre_carrera}(Resolución:${asignacion.resolucion})` +
                                `<td data-id_materia=${asignacion.fk_materia}>${asignacion.nombre_materia}</td>` +
                                `<td data-id_sede=${asignacion.id_sede}>${asignacion.nombre_sede}(Numero:${asignacion.numero_sede})</td>` +
                                `<td data-id_curso=${asignacion.fk_curso} data-anio_curso=${asignacion.anio_curso}>${asignacion.nombre_curso}</td>` +
                                `<td data-id_profesor=${asignacion.id_profesor}>${asignacion.nombre_profesor} ${asignacion.apellido_profesor}</td>` +
                                `<td>${asignacion.fecha_inicio}</td>` +
                                `<td>${asignacion.fecha_fin}</td>` +
                                `<td>` +
                                    `<a class='editar btn btn-warning btn-sm' title='Editar registro' data-id_horario=${asignacion.id_asignacion}><span class='glyphicon glyphicon-pencil'></span> Editar</a>` +
                                    `<a class='eliminar btn btn-danger btn-sm'title='Eliminar registro'  data-id_horario=${asignacion.id_asignacion}><span class='glyphicon glyphicon-trash'></span> Eliminar</a>` +
                                `</td>` +    
                            "</tr>";
                });
                $("#cuerpoTablaAsignacion").html(html);
            }
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
                case 'Año':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarAnio&Formulario=Asignacion";
                    ajaxObj.data = {"id_plan": $("#selectPlan").val()};
                    break;
                case 'Plan':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarPlanes&Formulario=Asignacion";
                    break;

                case 'Materia':
                    var datosEnviar = {"id_plan": $("#selectPlan").val(),"anio": $("#selectAño").val()};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarMaterias&Formulario=Asignacion";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'Sede':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarSedes&Formulario=Asignacion";
                    break;

                case 'Curso':
                    var datosEnviar = {
                        "fk_materia": $("#selectMateria").val(),
                        "fk_sede": $("#selectSede").val()
                    };
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarCursos&Formulario=Asignacion";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'Profesor':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarProfesores&Formulario=Asignacion";
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
                    case 'Año':
                        for(let i=1;i<=value;i++){
                            html += "<option value='"+i+"'>"+i+"° año</option>"; 
                        }
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
                        
                    case 'Profesor':
                        html += "<option value='" + value.id_profesor + "'>" + value.nombre_profesor + " " + value.apellido_profesor + "</option>";
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
            $("#selectPlan").val($(boton).parent().parent().children().first().attr("data-id_plan"));
            $("#selectPlan").change();
            setTimeout(() => {
                $("#selectSede").val($(boton).parent().parent().children().first().next().next().attr("data-id_sede"));
                $("#selectSede").change();
                    setTimeout(() => {
                        $("#selectAño").val($(boton).parent().parent().children().first().next().next().next().attr("data-anio_curso"));
                        $("#selectAño").change();
                        setTimeout( () => {
                            $("#selectMateria").val($(boton).parent().parent().children().first().next().attr("data-id_materia"));
                            $("#selectMateria").change();
                            setTimeout(() => {
                                $("#selectCurso").val($(boton).parent().parent().children().first().next().next().next().attr("data-id_curso"));
                                $("#selectCurso").change();
                                $("#modalHorario").modal({show: true});
                            }, 120);
                        }, 90);
                    }, 60);
            }, 30);

            $("#selectInicioHorario").val($(boton).parent().parent().children().first().next().next().next().next().next().next().attr("data-id_inicio"));
            $("#selectInicioHorario").change();
            setTimeout(() => {
                $("#selectFinHorario").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().attr("data-id_fin"));
                $("#selectFinHorario").change();
            }, 50);    

            $("#selectDia").val($(boton).parent().parent().children().first().next().next().next().next().html());
            $("#selectCicloLectivo").val($(boton).parent().parent().children().first().next().next().next().next().next().html());
        };

        app.limpiarModal = function () {
            $("#id_horario").val("");
            $("#selectPlan").val("");
            $("#selectSede").val("");
            $("#selectAño").val("");
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
            $("#año").hide();
            $("#curso").hide();
            $("#profesor").hide();
            $("#fecha_inicio").hide();
            $("#fecha_fin").hide();
        };

        app.habilitadorCampos = (condicion) => {
            $("#selectPlan").prop('disabled', condicion);
            $("#selectSede").prop('disabled', condicion);
            $("#selectMateria").prop('disabled', condicion);
            $("#selectCurso").prop('disabled', condicion);
            $("#profesor").prop('disabled', condicion);
            $("#fecha_inicio").prop('disabled', condicion);
            $("#fecha_fin").prop('disabled', condicion);
        };

        app.init();
    })(TallerAvanzada);
});
