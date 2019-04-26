$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarHorarios();
            app.listarCombos('Suplente');
            app.listarCombos('Titular');
            app.bindings();
            app.rellenarCiclo();
        };

        app.bindings = function () {

            $("#agregarHorario").on('click', function () {
                //app.ocultarCampos();
                app.limpiarModal();
                $("#tituloModal").html("Agregar Horario Suplente");
                $("#id_horario").val(0);
                $("#fk_ciclo_lectivo").val(0);
                $("#modalHorario").modal({show: true});
            });
            
            
            $("#selectTitular").on('change', function () {
                app.listarCombos('Sede');
                $("#sede").show();
            });
            
            $("#selectSede").on('change', function () {
                app.listarCombos('Curso');
                $("#curso").show();
            });

            $("#selectTitular").on('change', function () {
                app.listarCombos('Plan');
                $("#plan_estudio").show();
            });

            $("#selectPlan").on('change', function () {
                app.listarCombos('Materia');
                $("#materia").show();
            });

            $("#selectMateria").on('change', function () {
                $("#fecha_inicio").show();
            });

            $("#selectFechaInicio").on('change', function () { 
                var fecha;
                alert($(this).val());
                fecha= app.transformarFecha($(this).val());
                alert(fecha);
                $("#selectFechaFin").show();
                $("#selectFechaFin").attr('min', fecha);
            });

            $("#form").on('success.form.bv', function (event) {
                event.preventDefault();
                app.verificarHorarioSuplente();
            });

            $("#cuerpoTablaHorario").on('click', '.editar', function () {
                $("#tituloModal").html("Editar horario Suplente");
                app.modificarCampos(this);
            });

            $("#cuerpoTablaHorario").on('click', '.eliminar', function () {
                $("#tituloModal").html("¿Está seguro de que desea eliminar este horario?");
                $("#fieldsetHorario").attr("disabled", "true");
                app.modificarCampos(this);
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
                app.eliminarHorario($("#id_horario_suplente").val());
                $("#modalHorario").modal('hide');
            });

            $("#modalHorario").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };
        
        app.verificarHorarioSuplente= function(){
          var url= "../../controlador/ruteador/Ruteador.php?accion=verificar&Formulario=HorarioSuplente";
          var datosEnviar= $("#form").serialize();
          $.ajax({
              url:url,
              method: 'POST',
              dataType: 'json',
              data: datosEnviar,
              success: function(datosRecibidos){
                  switch(parseInt(datosRecibidos)){
                      case 0: 
                          if($("#id_horario_suplente").val()==0){
                              app.guardarHorario();
                          }else{
                              app.editarHorario();
                          }
                          break;
                      case 1: app.alertInfo1();
                          break;
                  }
              },
              error: function(){
                  alert("Error al verificar horario");
              }
          })
        };

        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=HorarioSuplente";
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
                    '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error al guardar!' + '</strong>' + ' El suplente ya tiene un horario en el rango de fechas establecidos' +
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

        app.guardarHorario = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=HorarioSuplente";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id_horario").val());
                    app.alertSave();
                    $("#modalHorario").modal('hide');
                },
                error: function (datosRecibidos) {
                    alert("Error al guardar horario");
                    alert(datosRecibidos);
                }
            });
        };

        app.editarHorario = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=HorarioSuplente";
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
                             <td data-id_profesor='" + horario.fk_titular + "'>" + horario.nombre_titular + " " + horario.apellido_titular + "</td>\n\
                             <td data-id_suplente='" + horario.fk_suplente + "'>" + horario.nombre_suplente + " " + horario.apellido_titular +"</td>\n\
                             <td data-id_sede='" + horario.fk_sede + "'>" + horario.nombre_sede + " (Numero:" + horario.numero_sede + ")</td>\n\
                             <td data-id_curso='" + horario.fk_curso + "'>" + horario.nombre_curso + "</td>\n\
                             <td data-id_plan='" + horario.fk_plan_de_estudio + "'>" + horario.nombre_carrera + " (Resolucion:" + horario.resolucion + ")</td>\n\
                             <td data-id_materia='" + horario.fk_materia + "'>" + horario.nombre_materia + "</td>\n\
                             <td >" + horario.fecha_inicio + "</td>\n\
                             <td >" + horario.fecha_fin + "</td>\n\
                             <td>" + horario.fk_ciclo_lectivo + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-warning btn-sm' title='Editar registro' data-id_horario='" + horario.id_horario_suplente + "'><span class='glyphicon glyphicon-pencil'></span> Editar</a>\n\
                                 <a class='eliminar btn btn-danger btn-sm'title='Eliminar registro'  data-id_horario='" + horario.id_horario_suplente + "'><span class='glyphicon glyphicon-trash'></span> Eliminar</a>\n\
                             </td>\n\
                         </tr>";
                $("#cuerpoTablaHorario").append(html);
            } else {
                var fila = $("#cuerpoTablaHorario").find("a[data-id_horario='" + id + "']").parent().parent();
                var html = "<td data-id_profesor='" + $("#selectTitular").val() + "'>" + $("#selectTitular").find(":selected").text() +"</td>\n\
                             <td data-id_suplente='" + $("#selectSuplente").val() + "'>" + $("#selectSuplente").text() + "</td>\n\
                             <td data-id_sede='" + $("#selectSede").val() + "'>" + $("#selectSede").find(":selected").text() + "</td>\n\
                             <td data-id_curso='" + $("#selectCurso") + "'>" + $("#selectCurso").find(":selected").text() + "</td>\n\
                             <td data-id_plan='" + $("#selectPlan").val() + "'>" + $("#selectPlan").find(":selected").text() + "</td>\n\
                             <td data-id_materia='" + $("#selectMateria").val() + "'>" + $("#selectMateria").find(":selected").text() + "</td>\n\
                             <td >" + $("#selectFechaInicio").val() + "</td>\n\
                             <td >" + $("#selectFechaFin").val() + "</td>\n\
                             <td>" + $("#fk_ciclo_lectivo").val() + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-warning btn-sm' title='Editar registro' data-id_horario='" + id + "'><span class='glyphicon glyphicon-pencil'></span> Editar</a>\n\
                                 <a class='eliminar btn btn-danger btn-sm'title='Eliminar registro'  data-id_horario='" + id + "'><span class='glyphicon glyphicon-trash'></span> Eliminar</a>\n\
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
        }

        app.buscarHorarios = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=HorarioSuplente";
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
            if (datosHorario == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTablaHorario").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var html = "";
                $.each(datosHorario, function (clave, horario) {
                    html += "<tr>\n\
                             <td data-id_profesor='" + horario.fk_titular + "'>" + horario.nombre_titular + " " + horario.apellido_titular + "</td>\n\
                             <td data-id_suplente='" + horario.fk_suplente + "'>" + horario.nombre_suplente + " " + horario.apellido_titular +"</td>\n\
                             <td data-id_sede='" + horario.fk_sede + "'>" + horario.nombre_sede + " (Numero:" + horario.numero_sede + ")</td>\n\
                             <td data-id_curso='" + horario.fk_curso + "'>" + horario.nombre_curso + "</td>\n\
                             <td data-id_plan='" + horario.fk_plan_de_estudio + "'>" + horario.nombre_carrera + " (Resolucion:" + horario.resolucion + ")</td>\n\
                             <td data-id_materia='" + horario.fk_materia + "'>" + horario.nombre_materia + "</td>\n\
                             <td >" + horario.fecha_inicio + "</td>\n\
                             <td >" + horario.fecha_fin + "</td>\n\
                             <td>" + horario.fk_ciclo_lectivo + "</td>\n\
                             <td>\n\
                                 <a class='editar btn btn-warning btn-sm' title='Editar registro' data-id_horario='" + horario.id_horario_suplente + "'><span class='glyphicon glyphicon-pencil'></span> Editar</a>\n\
                                 <a class='eliminar btn btn-danger btn-sm'title='Eliminar registro'  data-id_horario='" + horario.id_horario_suplente + "'><span class='glyphicon glyphicon-trash'></span> Eliminar</a>\n\
                             </td>\n\
                         </tr>";
                });
                $("#cuerpoTablaHorario").html(html);
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
                case 'Suplente':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarSuplente&Formulario=HorarioSuplente";
                    break;
                
                case 'Titular':
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarTitular&Formulario=HorarioSuplente";
                    break;

                case 'Sede':
                    var datosEnviar = {fk_titular: $("#selectTitular").find(":selected").val()};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarSede&Formulario=HorarioSuplente";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'Curso':
                    var datosEnviar = {fk_sede: $("#selectSede").find(":selected").val()};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarCurso&Formulario=HorarioSuplente";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'Plan':
                    var datosEnviar = {fk_titular: $("#selectTitular").find(":selected").val()};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarPlan&Formulario=HorarioSuplente";
                    ajaxObj.data = datosEnviar;
                    break;

                case 'Materia':
                    var datosEnviar = {fk_plan: $("#selectPlan").find(":selected").val()};
                    ajaxObj.url = "../../controlador/ruteador/Ruteador.php?accion=buscarMateria&Formulario=HorarioSuplente";
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
                    case 'Suplente':
                        html += "<option value='" + value.id_profesor + "'>" + value.nombre_profesor + " " + value.apellido_profesor + "</option>";
                        break;
                    
                    case 'Titular':
                        html += "<option value='" + value.fk_profesor + "'>" + value.nombre_profesor + " " + value.apellido_profesor + "</option>";
                        break;

                    case 'Sede':
                        html += "<option value='" + value.id_sede + "'>" + value.nombre_sede + " (Numero:" + value.numero_sede + ")</option>";
                        break;

                    case 'Curso':
                        html += "<option value='" + value.id_curso + "'>" + value.nombre_curso + "</option>";
                        break;

                    case 'Plan':
                        html += "<option value='" + value.id_plan + "'>" + value.nombre_carrera + " (Resolucion:" + value.resolucion + ")</option>";
                        break;

                    case 'Materia':
                        html += "<option data-anio='" + value.anio + "' value='" + value.id_materia + "'>" + value.nombre_materia + "</option>";
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
            $("#fk_ciclo_lectivo").val($(boton).parent().parent().children().first().next().next().next().next().next().next().next().next());
            $("#selectTitular").val($(boton).parent().parent().children().first().attr("data-id_profesor"));
            $("#selectTitular").change();
            setTimeout(() => {
                $("#selectSede").val($(boton).parent().parent().children().first().next().next().next().attr("data-id_sede"));
                $("#selectSede").change();
                setTimeout(() => {
                    $("#selectPlan").val($(boton).parent().parent().children().first().next().attr("data-id_plan"));
                    $("#selectPlan").change();
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
            $("#form").bootstrapValidator("resetForm", true);
        };

        app.ocultarCampos = () => {
            $("#materia").hide();
            $("#sede").hide();
            $("#plan_estudio").hide();
            $("#curso").hide();
            $("#hora_inicio").hide();
            $("#hora_fin").hide();
            $("#dia").hide();
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

        app.transformarFecha = function (fecha) {
            var fechaVieja= new Date(fecha);
            var año= fechaVieja.getFullYear();
            alert(fechaVieja.getFullYear().toString()+fechaVieja.getMonth().toString()+fechaVieja.getDate().toString());
            let dias,tiempo;
            switch (fechaVieja.getMonth()) {
                case 0 :
                    dias = 31;
                    break;
                case 1 :
                    if (año % 4 == 0 && (año % 100 !=0 || año % 400 == 0)){
                        dias=29;
                    }else{
                        dias=28;
                    }
                    break;
                case 2 :
                    dias = 31;
                    break;
                case 3 :
                    dias = 30;
                    break;
                case 4 :
                    dias = 31;
                    break;
                case 5 :
                    dias = 30;
                    break;
                case 6 :
                    dias = 31;
                    break;
                case 7 :
                    dias = 31;
                    break;
                case 8 :
                    dias = 30;
                    break;
                case 9 :
                    dias = 31;
                    break;
                case 10 :
                    dias = 30;
                    break;
                case 11 :
                    dias = 31;
                    break;
                default: 
                    break;
            }
            tiempo= fechaVieja.getTime()+dias*86400000;
            let fechaNueva= new Date(tiempo);
            alert(fechaNueva.getFullYear().toString()+fechaNueva.getMonth().toString()+fechaNueva.getDate().toString());
            let fechaFin = `${fechaNueva.getFullYear()}-${("0" + (fechaNueva.getMonth()+1)).slice(-2)}-${("0" + (fechaNueva.getDate()+1)).slice(-2)}`;
            return fechaFin;
        };
        app.init();
    })(TallerAvanzada);
});
