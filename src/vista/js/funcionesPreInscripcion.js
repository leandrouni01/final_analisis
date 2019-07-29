$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            $("#sede").hide();
            $("#borrar").hide();
            app.listarPlanes();
            app.rellenarCiclo();
            app.buscarPreInscripciones();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) { 
                app.limpiarModal();
                $("#id_pre_inscripcion").val(0);
                $("#tituloModal").html("Nueva Pre-inscripción");
                $("#modal").modal({show: true});
            });
            
            $("#selectPlan").on('change', () => {
                app.listarSedes();
                $("#sede").show();
            });
            
            $("#buscarAlumno").on('click', (e) =>{
                app.buscarAlumno($("#textBuscaAlumno").val());
            });
            
            $("#textBusca").keyup(function (e) {
                var parametros = $(this).val();
                if (parametros == "") {
                    app.buscarPreInscripciones();
                } else {
                    app.busqueda(parametros);
                }
            });
            
            $("#form").on('success.form.bv',function(e){
                e.preventDefault();
                if($("#id_pre_inscripcion").val()==0){
                    app.guardar();
                }else{
                    app.modificar();
                }
            });


            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $("#tituloModal").html("Editar Pre-inscripción");
                app.modificarCampos(this);
                $("#modal").modal({show: true});   
            });
            
            

            $("#cuerpoTabla").on('click', '.eliminar', function (event) {
                $("#tituloModal").html("¿Está seguro de que desea eliminar este horario?");
                app.modificarCampos(this);
                app.habilitadorCampos(true);
                $("#borrar").show();
                $("#guardar").hide();
                $("#modal").modal({show:true});
            });
            
            $("#borrar").on('click', function (e) {
                app.eliminar($("#id_pre_inscripcion").val());
                $("#modal").modal('hide');
            });

            $("#form").bootstrapValidator({
                excluded: []
            });
            
            $("#modal").on('hide.bs.modal',()=>{
               app.limpiarModal();
               $("#form").bootstrapValidator('resetForm', true);
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
        };

        app.alertModif = function () {
            var alerta = '<div class="alert alert-warning" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-saved"></span>' + ' ¡Actualizado con exito!' + '</strong>' + ' Se modificó un registro en la Base de Datos ' +
                    '</div>';
            $("#alerta").html(alerta);
        };

        app.alertDelete = function () {
            var alerta = '<div class="alert alert-danger" role="alert">' +
                    '<strong>' + '<span class="glyphicon glyphicon-floppy-remove"></span>' + ' ¡Eliminado con exito!' + '</strong>' + ' Se elimino un registro en la Base de Datos ' +
                    '</div>';
            $("#alerta").html(alerta);
        };
        
        app.buscarAlumno = (dni) => {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarAlumno&Formulario=PreInscripcion";
            var datosEnviar = {"dni": dni};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    app.rellenarAlumno(data);
                },
                error: function () {
                    alert('error buscar alumno');
                }
            });
        };
        
        app.rellenarAlumno = function (data) {
            $("#id_alumno").val(data.id_alumno);
            $("#legajo").val(data.legajo);
            $("#nombre_alumno").val(data.nombre);
            $("#apellido_alumno").val(data.apellido);
            $("#dni_alumno").val(data.dni);
        };
        
        app.busqueda = function (parametros) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=alumno";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: { textBusca: parametros},
                success: function (data) {
                    app.rellenarTabla(data);
                },
                error: function () {
                    alert('error busqueda');
                }
            });
        };

        app.listarPlanes = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarPlanes&Formulario=PreInscripcion";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                success: function (data) {
                    app.rellenarPlanes(data);
                },
                error: function () {
                    alert('error buscar carreras');
                }
            });
        };

        app.rellenarPlanes = function (data) {
            $('#selectPlan').html("");
            $('#selectPlan').prepend("<option selected disabled value=''>Seleccione el plan</option>");

            $.each(data, function (clave, value) {
                $('#selectPlan').append("<option value='" + value.id_plan + "'>" + value.nombre_carrera + " (Resolucion:" + value.resolucion + ")</option>");
            });
        };

        app.listarSedes = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarSedes&Formulario=PreInscripcion";
            var datosEnviar = {"fk_plan": $("#selectPlan").find(':selected').val()};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    console.log(data);
                    app.rellenarSedes(data);
                },
                error: function () {
                    alert('error buscar sedes');
                }
            });
        };

        app.rellenarSedes = function (data) {
            $('#selectSede').html("");
            $('#selectSede').prepend("<option selected disabled value=''>Seleccione la sede</option>");

            $.each(data, function (clave, value) {
                $('#selectSede').append("<option value='" + value.id_sede + "'>" + value.nombre_sede + "</option>");
            });
        };

        app.buscarPreInscripciones = function () { 
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=PreInscripcion";
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
                            `<td data-id_alumno=${object.id_alumno}>` + object.legajo + '</td>' +
                            '<td>' + object.nombre + '</td>' +
                            '<td>' + object.apellido + '</td>' +
                            '<td>' + object.dni + '</td>' +
                            '<td data-fk_plan="' + object.fk_plan + '">' + object.nombre_carrera + ' (Resolucion:"' + object.resolucion + '")</td>' +
                            '<td data-fk_sede="' + object.fk_sede + '">' + object.nombre_sede +'  (Numero:'+object.numero_sede+')' + '</td>' +
                            '<td>' + object.anio + '</td>' +
                            '<td>' + object.documentacion + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_pre_inscripcion + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_pre_inscripcion + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                });
                $("#cuerpoTabla").html(linea);
            };
            
        };

        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=PreInscripcion";
            $("#ciclo").prop('disabled', false);
            var datosEnviar = {
                "fk_alumno": $("#id_alumno").val(),
                "fk_plan": $("#selectPlan").find(':selected').val(),
                "fk_sede": $("#selectSede").find(':selected').val(),
                "documentacion": $("#selectDocumentacion").find(':selected').val(),
                "ciclo_lectivo": $("#ciclo").val()
            };
            console.log(datosEnviar);
            $("#ciclo").prop('disabled', true);
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                dataType: 'json',
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id_pre_inscripcion").val());
                    app.limpiarModal();
                    app.alertSave();
                    app.showAlert();
                    
                },
                error: function (datosRecibidos) {
                    alert('entre en el error del ajax');
                }
            });
        };

        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=PreInscripcion";
            var datosEnviar = {
              'fk_plan': $("#selectPlan").val(),
              'fk_sede': $("#selectSede").val(),
              'documentacion': $("#selectDocumentacion").val(),
              'id_pre_inscripcion': $("#id_pre_inscripcion").val()
            };
            console.log(datosEnviar);
            $.ajax({
                url: url,
                type: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.actualizarTabla(datosRecibidos, $("#id_pre_inscripcion").val());
                    $("#modal").modal('hide');
                    app.alertModif();
                    app.showAlert();
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
                            `<td data-id_alumno=${object.id_alumno}>` + object.legajo + '</td>' +
                            '<td>' + object.nombre + '</td>' +
                            '<td>' + object.apellido + '</td>' +
                            '<td>' + object.dni + '</td>' +
                            '<td data-fk_plan="' + object.fk_plan + '">' + object.nombre_carrera + ' (Resolucion:"' + object.resolucion + '")</td>' +
                            '<td data-fk_sede="' + object.fk_sede + '">' + object.nombre_sede +'  (Numero:'+object.numero_sede+')' + '</td>' +
                            '<td>' + object.anio + '</td>' +
                            '<td>' + object.documentacion + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + object.id_pre_inscripcion + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + object.id_pre_inscripcion + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>' +
                            '</tr>';
                $("#cuerpoTabla").append(html);
                
            } else {
                //Modifico una preinscripcion existente, busco la fila por el id.
                var fila = $("#cuerpoTabla").find("[data-id='" + id + "']").parent().parent();
                var html = '<td data-id_alumno="'+$("#id_alumno").val()+'">' + $("#legajo").val() + '</td>' +
                            '<td>' + $("#nombre_alumno").val() + '</td>' +
                            '<td>' + $("#apellido_alumno").val() + '</td>' +
                            '<td>' + $("#dni_alumno").val() + '</td>' +
                            '<td data-fk_plan="' + $("#selectPlan").val() + '">' + $("#selectPlan").find(":selected").html() + '</td>' +
                            '<td data-fk_sede="' + $("#selectSede").val() + '">' + $("#selectSede").find(":selected").html() + '</td>' +
                            '<td>' + $("#ciclo").val() + '</td>' +
                            '<td>' + $("#selectDocumentacion").val() + '</td>' +
                            '<td>' +
                            '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                            '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id="' + id + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                            '</td>';
                fila.html(html);
            }
        };

        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=PreInscripcion";
            var datosEnviar = {'id_preinscripcion': id};
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.alertDelete();
                    app.showAlert();
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

        app.rellenarCiclo = () => {
          const año = new Date();
          $("#ciclo").val(año.getFullYear());
          $("#ciclo").prop('disabled', true);
        };
        
        app.modificarCampos= function(linea){
            $("#id_pre_inscripcion").val($(linea).attr("data-id")); 
            $("#id_alumno").val($(linea).parent().parent().children().first().attr("data-id_alumno"));
            $("#legajo").val($(linea).parent().parent().children().html());              
            $("#nombre_alumno").val($(linea).parent().parent().children().first().next().html());
            $("#apellido_alumno").val($(linea).parent().parent().children().first().next().next().html());
            $("#dni_alumno").val($(linea).parent().parent().children().first().next().next().next().html());
            $("#selectPlan").val($(linea).parent().parent().children().first().next().next().next().next().attr("data-fk_plan"));
            $("#selectPlan").change();
            setTimeout(()=>{
                $("#selectSede").val($(linea).parent().parent().children().first().next().next().next().next().next().attr("data-fk_sede"));
                $("#sede").show();
            },90);
            $("#ciclo").val($(linea).parent().parent().children().first().next().next().next().next().next().next().html());
            $("#selectDocumentacion").val($(linea).parent().parent().children().first().next().next().next().next().next().next().next().html());
            $("#buscadorAlumno").hide();
        };

        app.habilitadorCampos = (condicion) => {
            $("#selectPlan").prop('disabled', condicion);
            $("#selectSede").prop('disabled', condicion);
            $("#selectDocumentacion").prop('disabled', condicion);
        };
        
        app.limpiarModal = function () {//funcion para limpiar el modal
            $("#id_pre_inscripcion").val(0);
            $("#legajo").val('');
            $("#nombre_alumno").val('');
            $("#apellido_alumno").val('');
            $("#dni_alumno").val('');
            $("#selectPlan").val('');
            $("#selectSede").html('');
            $("#selectDocumentacion").val('');
            $("#ciclo").val('');
            $("#borrar").hide();
            $("#guardar").show();
            $("#sede").hide();
            app.listarPlanes();
            app.rellenarCiclo();
            app.habilitadorCampos(false);
        };
        
        app.init();

    })(TallerAvanzada);

});