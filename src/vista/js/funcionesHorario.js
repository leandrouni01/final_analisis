$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscarHorarios();
            app.buscarProfesores();
            app.buscarCarrera();
            app.buscarSedes();
            app.bindings();
        };

        app.bindings = function () {

            $("#agregarHorario").on('click', function () {
                app.ocultarCampos();
                $("#tituloModal").html("Agregar horario");
                $("#id_horario").val(0);
                $("#modalHorario").modal({show: true});
                $("#accion").html("Guardar");
            });
            
            $("#accion").on('click',function(){
                if($("#accion").html()=="Guardar"){
                    $("#selectPlan").prop('disabled', false);
                    $("#selectSede").prop('disabled', false);
                    if($("#id_horario").val()==0){
                        app.guardarHorario();
                    }else{
                        app.editarHorario();
                    }
                    $("#selectPlan").prop('disabled', true);
                    $("#selectSede").prop('disabled', true);
                }else{
                    app.eliminarHorario();
                }
            });
            
            $("#selectPlan").on('change',function(){
               app.buscarMaterias();
               $("#selectPlan").prop('disabled', true);
            });
            
            $("#selectSede").on('change',function(){
                $("#profesor").show();
                $("#selectSede").prop('disabled', true);
                //alert($("#selectMateria").val());
                if($("#selectMateria").val() != 0){
                   app.buscarCursos();   
               }
            });
            
            $("#selectProfesor").on('change', () => {
               $("#materia").show();
            });
            
            $("#selectMateria").on('change', () => {
               app.buscarCursos();
               $("#curso").show(); 
            });
               
            $("#selectCurso").on('change', () => {
               $("#hora_inicio").show();
               $("#hora_fin").show();
               $("#dia").show();
               $("#ciclo_lectivo").show();
            });
            
            $("#cambiarPlan").on('click', () => {
               $("#selectPlan").prop('disabled', false);
            });
            
            $("#cambiarSede").on('click', () => {
               $("#selectSede").prop('disabled', false);
               
            });
            
            $("#cuerpoTablaHorario").on('click','.editar',function(){
               $("#id_horario").val($(this).attr("data-id_horario"));
               $("#accion").html("Guardar");
               $("#tituloModal").html("Editar horario");
               $("#selectProfesor").val($(this).parent().parent().children().first().attr("data-id_profesor"));
               $("#selectPlan").val($(this).parent().parent().children().first().next().attr("data-id_plan"));
               $("#selectPlan").change();
                setTimeout(()=>{
                    $("#selectMateria").val($(this).parent().parent().children().first().next().next().attr("data-id_materia"));
                    $("#selectMateria").change();
                    setTimeout(()=>{
                        $("#selectSede").val($(this).parent().parent().children().first().next().next().next().attr("data-id_sede"));
                        $("#selectSede").change();
                        setTimeout(()=>{
                            $("#selectCurso").val($(this).parent().parent().children().first().next().next().next().next().attr("data-id_curso"));
                            $("#modalHorario").modal({show:true});
                        },200);
                    },200);
                },200);
               $("#inicioHorario").val($(this).parent().parent().children().first().next().next().next().next().next().html());
               $("#finHorario").val($(this).parent().parent().children().first().next().next().next().next().next().next().html());
               $("#selectDia").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().html());
               $("#selectCicloLectivo").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
            });
            $("#cuerpoTablaHorario").on('click','.eliminar',function(){
               $("#id_horario").val($(this).attr("data-id_horario"));
               $("#accion").html("Eliminar");
               $("#tituloModal").html("¿Está seguro de que desea eliminar este horario?");
               $("#fieldsetHorario").attr("disabled","true");
               $("#selectProfesor").val($(this).parent().parent().children().first().attr("data-id_profesor"));
               $("#selectPlan").val($(this).parent().parent().children().first().next().attr("data-id_plan"));
               $("#selectPlan").change();
                setTimeout(()=>{
                    $("#selectMateria").val($(this).parent().parent().children().first().next().next().attr("data-id_materia"));
                    $("#selectMateria").change();
                    setTimeout(()=>{
                        $("#selectSede").val($(this).parent().parent().children().first().next().next().next().attr("data-id_sede"));
                        $("#selectSede").change();
                        setTimeout(()=>{
                            $("#selectCurso").val($(this).parent().parent().children().first().next().next().next().next().attr("data-id_curso"));
                            $("#modalHorario").modal({show:true});
                        },200);
                    },200);
                },200);
               $("#inicioHorario").val($(this).parent().parent().children().first().next().next().next().next().next().html());
               $("#finHorario").val($(this).parent().parent().children().first().next().next().next().next().next().next().html());
               $("#selectDia").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().html());
               $("#selectCicloLectivo").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
            });
            $("#cuerpoTablaHorario").on('click','.ver',function(){
               $("#id_horario").val($(this).attr("data-id_horario"));
               $("#accion").hide();
               $("#tituloModal").html("Ver horario");
               $("#fieldsetHorario").attr("disabled","true");
               $("#selectProfesor").val($(this).parent().parent().children().first().attr("data-id_profesor"));
               $("#selectPlan").val($(this).parent().parent().children().first().next().attr("data-id_plan"));
               $("#selectPlan").change();
                setTimeout(()=>{
                    $("#selectMateria").val($(this).parent().parent().children().first().next().next().attr("data-id_materia"));
                    $("#selectMateria").change();
                    setTimeout(()=>{
                        $("#selectSede").val($(this).parent().parent().children().first().next().next().next().attr("data-id_sede"));
                        $("#selectSede").change();
                        setTimeout(()=>{
                            $("#selectCurso").val($(this).parent().parent().children().first().next().next().next().next().attr("data-id_curso"));
                            $("#modalHorario").modal({show:true});
                        },200);
                    },200);
                },200);
               $("#inicioHorario").val($(this).parent().parent().children().first().next().next().next().next().next().html());
               $("#finHorario").val($(this).parent().parent().children().first().next().next().next().next().next().next().html());
               $("#selectDia").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().html());
               $("#selectCicloLectivo").val($(this).parent().parent().children().first().next().next().next().next().next().next().next().next().html());
            });
            
            $("#modalHorario").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };
        
        app.guardarHorario= function(){
          var url= "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Horario";
          var datosEnviar= $("#formHorario").serialize();
          $.ajax({
             url: url,
             method: 'POST',
             dataType: 'json',
             data: datosEnviar,
             success: function(datosRecibidos){
                 app.actualizarTabla(datosRecibidos,$("#id_horario").val());
                 $("#modalHorario").modal('hide');
             },
             error: function(datosRecibidos){
                 alert("Error al guardar horario");
                 alert(datosRecibidos);
             }
          });
        };
        
        app.editarHorario= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Horario";
            var datosEnviar= $("#formHorario").serialize();
            $.ajax({
             url: url,
             method: 'POST',
             dataType: 'json',
             data: datosEnviar,
             success: function(datosRecibidos){
                 app.actualizarTabla(datosRecibidos,$("#id_horario").val());
                 $("#modalHorario").modal('hide');
             },
             error: function(datosRecibidos){
                 alert("Error al editar horario");
                 alert(datosRecibidos);
             }
          });
        };
        
        app.actualizarTabla= function(horario,id){
            var html= "";
            if(id==0){
                html= "<tr>\n\
                             <td data-id_profesor='" + horario.fk_profesor + "'>" + horario.nombre_profesor + " " + horario.apellido_profesor + "</td>\n\
                             <td data-id_plan='" + horario.id_plan + "'>" + horario.nombre_carrera + " (Resolucion:" + horario.resolucion + ")</td>\n\
                             <td data-id_materia='" + horario.fk_materia + "'>" + horario.nombre_materia + "</td>\n\
                             <td data-id_sede='" + horario.id_sede + "'>" + horario.nombre_sede + " (Numero:" + horario.numero_sede + ")</td>\n\
                             <td data-id_curso='" + horario.fk_curso + "'>" + horario.nombre_curso + "</td>\n\
                             <td data-anio_materia'"+horario.anio+"'>" + horario.inicio_horario + "</td>\n\
                             <td>" + horario.fin_horario + "</td>\n\
                             <td>" + horario.dia_horario + "</td>\n\
                             <td>" + horario.ciclo_lectivo_horario + "</td>\n\
                             <td>\n\
                                 <a class='ver btn btn-info' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a>\n\
                                 <a class='eliminar btn btn-danger' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                                 <a class='editar btn btn-success' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                             </td>\n\
                         </tr>";
                $("#cuerpoTablaHorario").append(html);
            }else{
                var fila = $("#cuerpoTablaHorario").find("a[data-id_horario='"+id+"']").parent().parent();
                var html= "<td data-id_profesor='" + $("#selectProfesor").val() + "'>" + $("#selectProfesor").find(":selected").html() + "</td>\n\
                             <td data-id_plan='" + $("#selectPlan").val() + "'>" + $("#selectPlan").find(":selected").html() + "</td>\n\
                             <td data-id_materia='" + $("#selectMateria").val() + "'>" + $("#selectMateria").find(":selected").html() + "</td>\n\
                             <td data-id_sede='" + $("#selectSede").val() + "'>" + $("#selectSede").find(":selected").html() + ")</td>\n\
                             <td data-id_curso='" + $("#selectCurso").val() + "'>" + $("#selectCurso").find(":selected").html() + "</td>\n\
                             <td data-anio_materia'"+ $("#anioMateria") +"'>" + $("#inicioHorario").val() + "</td>\n\
                             <td>" + $("#finHorario").val() + "</td>\n\
                             <td>" + $("#selectDia").val() + "</td>\n\
                             <td>" + $("#selectCicloLectivo").val() + "</td>\n\
                             <td>\n\
                                 <a class='ver btn btn-info' data-id_horario='" + id + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a>\n\
                                 <a class='eliminar btn btn-danger' data-id_horario='" + id + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                                 <a class='editar btn btn-success' data-id_horario='" + id + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                             </td>";
                
                fila.html(html);
            }
        };
        
        app.eliminarHorario= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Horario";
            var datosEnviar= $("#formHorario").serialize();
            $.ajax({
             url: url,
             method: 'POST',
             dataType: 'json',
             data: datosEnviar,
             success: function(datosRecibidos){
                 app.eliminarFila($("#id_horario").val());
                 $("#modalHorario").modal('hide');
             },
             error: function(datosRecibidos){
                 alert("Error al eliminar horario");
                 alert(datosRecibidos);
             }
          });
        };
        
        app.eliminarFila= function(id){
            $("#cuerpoTablaHorario").find("a[data-id_horario='"+id+"']").parent().parent().remove();
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
                             <td data-anio_materia'"+horario.anio+"'>" + horario.inicio_horario + "</td>\n\
                             <td>" + horario.fin_horario + "</td>\n\
                             <td>" + horario.dia_horario + "</td>\n\
                             <td>" + horario.ciclo_lectivo_horario + "</td>\n\
                             <td>\n\
                                 <a class='ver btn btn-info' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-info-sign'></span>Ver</a>\n\
                                 <a class='eliminar btn btn-danger' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-remove'></span>Eliminar</a>\n\
                                 <a class='editar btn btn-success' data-id_horario='" + horario.id_horario + "'><span class='glyphicon glyphicon-pencil'></span>Editar</a>\n\
                             </td>\n\
                         </tr>";
            });
            $("#cuerpoTablaHorario").html(html);
        };

        app.buscarProfesores = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Profesor";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarProfesores(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar profesores");
                    alert(datosRecibidos);
                }
            });
        };

        app.rellenarProfesores = function (datosProfesor) {
            var html = "<option value=0>Seleccione un profesor</option>";
            $.each(datosProfesor, function (clave, profesor) {
                html += "<option value='" + profesor.id_profesor + "'>" + profesor.nombre_profesor + " " + profesor.apellido_profesor + "</option>";
            });
            $("#selectProfesor").html(html);
        };
        
        app.buscarCarrera = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=PlanDeEstudios";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarCarrera(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar carreras");
                    alert(datosRecibidos);
                }
            });
        };

        app.rellenarCarrera = function (datosPlan) {
            var html = "<option value=0>Seleccione una carrera</option>";
            $.each(datosPlan, function (clave, plan) {
                html += "<option value='" + plan.id_plan + "'>" + plan.nombre_carrera + " (Resolucion:" + plan.resolucion + ")</option>";
            });
            $("#selectPlan").html(html);
        };
        
        app.buscarMaterias = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarMaterias&Formulario=Horario";
            var datosEnviar= {"fk_plan": $("#selectPlan").val()};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.rellenarMaterias(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar materias");
                    alert(datosRecibidos);
                }
            });
        };

        app.rellenarMaterias = function (datosMateria) {
            var html = "<option value=0>Seleccione una materia</option>";
            $.each(datosMateria, function (clave, materia) {
                html += "<option data-anio='"+materia.anio+"' value='" + materia.id_materia + "'>" + materia.nombre_materia + "</option>";
            });
            $("#selectMateria").html(html);
        };
        
        app.buscarSedes= function(){
          var url="../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Sede";
          $.ajax({
              url: url,
              method: 'GET',
              dataType: 'json',
              success: function(datosRecibidos){
                  app.rellenarSedes(datosRecibidos);
              },
              error: function(datosRecibidos){
                  alert("Error al buscar sedes");
                  alert(datosRecibidos);
              }
          });
        };
        
        app.rellenarSedes = function (datosSede) {
            var html = "<option value=0>Seleccione una sede</option>";
            $.each(datosSede, function (clave, sede) {
                html += "<option value='" + sede.id_sede + "'>" + sede.nombre_sede +" (Numero:"+sede.numero_sede+ ")</option>";
            });
            $("#selectSede").html(html);
        };
        
        app.buscarCursos= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=buscarCursos&Formulario=Horario";
            var datosEnviar= {
                "fk_sede": $("#selectSede").val(),
                "fk_plan": $("#selectPlan").val(),
                "anio": $("#selectMateria").find(":selected").attr("data-anio")
            };
            $.ajax({
               url: url,
               method: 'POST',
               dataType: 'json',
               data: datosEnviar,
               success: function(datosRecibidos){
                   app.rellenarCursos(datosRecibidos);
               },
               error: function(datosRecibidos){
                   alert("Error al buscar cursos");
                   alert(datosRecibidos);
               }
            });
        };
        
        app.rellenarCursos= function(datosCurso){
            var html = "<option value=0>Seleccione un curso</option>";
            $.each(datosCurso, function (clave, curso) {
                html += "<option value='" + curso.id_curso + "'>" + curso.nombre_curso + "</option>";
            });
            $("#selectCurso").html(html);
        };
        
        app.limpiarModal= function(){
            $("#id_horario").val("");
            $("#anioMateria").val("");
            $("#selectPlan").val(0);
            $("#selectPlan").prop('disabled', false);
            $("#selectSede").val(0);
            $("#selectSede").prop('disabled', false);
            $("#selectProfesor").val(0);
            $("#inicioHorario").val(0);
            $("#finHorario").val(0);
            $("#selectDia").val(0);
            $("#selectCicloLectivo").val(0);
            $("#fieldsetHorario").removeAttr("disabled");
            $("#accion").show();
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

        app.init();
    })(TallerAvanzada);
});