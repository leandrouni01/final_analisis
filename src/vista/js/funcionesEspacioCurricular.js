$(function () {
    var TallerAvanzada = {};
    
    (function (app) {
        app.init= function(){
            app.buscarEspacioCurricular();
            app.bindigs();
        };
        
        app.bindigs= function(){
          $("#agregar_espacio_curricular").on('click',function(){
              $("#modalEspacioCurricular").modal({show:true});
              app.limpiarModal();
              app.buscarCarrera();
              app.buscarSede();
              $("#tituloModal").html("Agregar espacio curricular");
          });
          
            $("#selectSede").on('change', function () {
                if ($("#selectPlan").find(":selected").val() !== 0) {
                    $("#anio").show();
                    app.buscarAnio();
                }
            });
          
            $("#selectPlan").on('change', function () {
                if ($("#selectSede").find(":selected").val() !== 0) {
                    $("#anio").show();
                    app.buscarAnio();
                }
            });
          
          $("#selectAnio").on('change',function(){
              app.buscarMaterias();
              app.buscarCursos();
              $("#materia").show();
              $("#curso").show();
          });
          
          $("#cuerpoTablaEspacioCurricular").on('click', '.editar', function (event) {
                app.modificarCampos(this);
                
                $("#tituloModal").html("Editar Espacio Curricular");
                $("#modalEspacioCurricular").modal({show: true});
          });
          
          $("#cuerpoTablaEspacioCurricular").on('click', '.eliminar', function (event) {
                app.modificarCampos(this);
                app.habilitadorCampos(true);
                $("#guardar").hide();
                $("#borrar").removeClass('hidden');
                
                $("#tituloModal").html("Eliminar Espacio Curricular");
                $("#modalEspacioCurricular").modal({show: true});
          });
          
          $("#borrar").on('click', function () {
               app.eliminar($("#id_espacio_curricular").val());
               $("#modalEspacioCurricular").modal('hide');
          });
          
          $("#form").on('success.form.bv', function (event) {

                event.preventDefault();

                if ($("#id_espacio_curricular").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });
            
            $("#form").bootstrapValidator({
                excluded: []
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
        
        app.buscarEspacioCurricular= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=EspacioCurricular";
            $.ajax({
               url: url,
               method: 'GET',
               dataType: 'json',
               success: function(datosRecibidos){
                   app.rellenarTabla(datosRecibidos);
               },
               error: function(datosRecibidos){
                   alert("Error al buscar espacios curriculares");
               }
            });
        };
        
        app.rellenarTabla = function (data) {//funcion para rellenar la tabla espacio curricular
            if (data == '') {
                var alerta = '<div class="alert alert-danger" role="alert">' +
                        '<strong>' + '<span class="glyphicon glyphicon-warning-sign"></span>' + ' ¡Error de búsqueda!' + '</strong>' + ' No existen registros con los valores ingresados.' +
                        '</div>';
                $("#cuerpoTablaEspacioCurricular").html('');
                $("#alert").html(alerta);
            } else {
                $("#alert").html('');
                var linea = "";
                $.each(data, function (clave, espacio) {
                    linea += `<tr>
                                   <td data-id_sede="${espacio.id_sede}">${espacio.nombre_sede}(Numero: ${espacio.numero_sede})</td>
                                   <td data-id_plan="${espacio.id_plan}">${espacio.nombre_carrera}(Resolucion: ${espacio.resolucion})</td>
                                   <td data-id_materia="${espacio.fk_materia}">${espacio.nombre_materia}</td>
                                   <td data-id_curso="${espacio.fk_curso}">${espacio.nombre_curso}</td>
                                   <td data-anio="${espacio.anio}">${espacio.anio}°</td>
                                   <td>
                                       <button type="button" class='btn btn-warning pull-left editar' data-id_espacio="${espacio.id_espacio_curricular}"><span class='glyphicon glyphicon-pencil'></span>Editar</button>
                                       <button type="button" class='btn btn-danger pull-right eliminar' data-id_espacio="${espacio.id_espacio_curricular}"><span class='glyphicon glyphicon-remove'></span>Eliminar </button>
                                   </td>
                              </tr>`;
                });
                $("#cuerpoTablaEspacioCurricular").html(linea);
            }
        };
        
        app.buscarCarrera= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=PlanDeEstudios";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function(datosRecibidos){
                    app.rellenarCarrera(datosRecibidos);
                },
                error: function(datosRecibidos){
                    alert("Error al buscar carrera");
                }
            });
        };
        
        app.rellenarCarrera= function(data){
            var linea= "<option selected disabled value=0>Seleccione una carrera</option>";
          $.each(data,function(clave, carrera){
              linea += `<option value="${carrera.id_plan}">${carrera.nombre_carrera}(Resolucion: ${carrera.resolucion})</option>`;
          });
          $("#selectPlan").html(linea);
        };
        
        app.buscarSede = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Sede";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarSede(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar sede");
                }
            });
        };
        
        app.rellenarSede = function (data) {
            var linea = "<option selected disabled value=0>Seleccione una sede</option>";
            $.each(data, function (clave, sede) {
                linea += `<option value="${sede.id_sede}">${sede.nombre_sede}(Numero: ${sede.numero_sede})</option>`;
            });
            $("#selectSede").html(linea);
        };
        
        app.buscarAnio= function(){
          var url= "../../controlador/ruteador/Ruteador.php?accion=buscarDuracion&Formulario=EspacioCurricular";
          var datosEnviar= {id_plan: $("#selectPlan").val()};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.rellenarAnio(datosRecibidos.duracion);
                },
                error: function () {
                    alert("Error al buscar años");
                }
            });
        };
        
        app.rellenarAnio = function (dato) {
            var html= "<option selected disabled value='0'>Seleccione un año</option>";
            for (let i = 1; i <= dato; i++) {
                html+=`<option value="${i}">${i}°</option>`;
            };
            $("#selectAnio").html(html);
        };
        
        app.buscarMaterias= function(){
          var url="../../controlador/ruteador/Ruteador.php?accion=buscarMaterias&Formulario=EspacioCurricular";
          var datosEnviar = {id_plan: $("#selectPlan").val(),anio: $("#selectAnio").val()};
          $.ajax({
              url: url,
              method: 'POST',
              dataType: 'json',
              data: datosEnviar,
              success: function(datosRecibidos){
                  app.rellenarMaterias(datosRecibidos);
              },
              error: function(datosRecibidos){
                  alert("Error al buscar materias");
              }
          });
        };
        
        app.rellenarMaterias = function (data) {
            var linea = "<option selected disabled value=0>Seleccione una materia</option>";
            $.each(data, function (clave, materia) {
                linea += `<option value="${materia.id_materia}">${materia.nombre_materia}</option>`;
            });
            $("#selectMateria").html(linea);
        };
        
        app.buscarCursos = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscarCursos&Formulario=EspacioCurricular";
            var datosEnviar = {id_sede: $("#selectSede").val(),anio: $("#selectAnio").val()};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.rellenarCursos(datosRecibidos);
                },
                error: function (datosRecibidos) {
                    alert("Error al buscar cursos");
                }
            });
        };

        app.rellenarCursos = function (data) {
            var linea = "<option selected disabled value=0>Seleccione un curso</option>";
            $.each(data, function (clave, curso) {
                linea += `<option value="${curso.id_curso}">${curso.nombre_curso}</option>`;
            });
            $("#selectCurso").html(linea);
        };
        
        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=EspacioCurricular";
            var datosEnviar = $("#form").serialize();
            //alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                dataType: 'json',
                success: function (datosRecibidos) {
                    $("#modalEspacioCurricular").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id_espacio_curricular").val());
                    app.limpiarModal();
                    app.alertSave();
                },
                error: function (datosRecibidos) {
                    alert('Error al guardar profesor');
                }
            });
        };
        
        app.modificar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=EspacioCurricular";
            var datosEnviar = $("#form").serialize();
            alert(datosEnviar);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modalEspacioCurricular").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id_espacio_curricular").val());
                    app.alertModif();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar");
                    alert(datosRecibidos);
                }
            });
        };
        
        app.actualizarTabla = function (espacio, id) {
            if (id == 0) {
                var html = `<tr>
                                <td data-id_sede="${espacio.id_sede}">${espacio.nombre_sede}(Numero: ${espacio.numero_sede})</td>
                                <td data-id_plan="${espacio.id_plan}">${espacio.nombre_carrera}(Resolucion: ${espacio.resolucion})</td>
                                <td data-id_materia="${espacio.fk_materia}">${espacio.nombre_materia}</td>
                                <td data-id_curso="${espacio.fk_curso}">${espacio.nombre_curso}</td>
                                <td data-anio="${espacio.anio}">${espacio.anio}°</td>
                                <td>
                                     <button type="button" class='btn btn-warning pull-left editar' data-id_espacio="${espacio.id_espacio_curricular}"><span class='glyphicon glyphicon-pencil'></span>Editar</button>
                                     <button type="button" class='btn btn-danger pull-right eliminar' data-id_espacio="${espacio.id_espacio_curricular}"><span class='glyphicon glyphicon-remove'></span>Eliminar </button>
                                </td>
                            </tr>`;
                $("#cuerpoTablaEspacioCurricular").append(html);

            } else {
                var fila = $("#cuerpoTablaEspacioCurricular").find("[data-id_espacio='" + id + "']").parent().parent();
                var html = 
                        `<tr>
                            <td data-id_sede="${$("#selectSede").find(':selected').val()}">${$("#selectSede").find(':selected').text()}</td>
                            <td data-id_plan="${$("#selectPlan").find(':selected').val()}">${$("#selectPlan").find(':selected').text()}</td>
                            <td data-id_materia="${$("#selectMateria").find(':selected').val()}">${$("#selectMateria").find(':selected').text()}</td>
                            <td data-id_curso="${$("#selectCurso").find(':selected').val()}">${$("#selectCurso").find(':selected').text()}</td>
                            <td data-anio="${$("#selectAnio").find(':selected').val()}">${$("#selectAnio").find(':selected').text()}</td>
                            <td>
                                <button type="button" class='btn btn-warning pull-left editar' data-id_espacio="${id}"><span class='glyphicon glyphicon-pencil'></span>Editar</button>
                                <button type="button" class='btn btn-danger pull-right eliminar' data-id_espacio="${id}"><span class='glyphicon glyphicon-remove'></span>Eliminar </button>
                            </td>
                        </tr>`;
                fila.html(html);
            }
        };
        
        app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=EspacioCurricular";
            var datosEnviar = {id_espacio_curricular: id};
            //alert(datosEnviar.id_espacio_curricular);
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    app.alertDelete();
                    app.borrarFila(id);
                },
                error: function (datosRecibidos) {
                    alert('Error al eliminar');
                }
            });
        };
        
        app.borrarFila = function (id) {
            var fila = $("#cuerpoTablaEspacioCurricular").find("[data-id_espacio='" + id + "']").parent().parent().remove();
        };
        
        app.modificarCampos = (button) => {
          
            app.limpiarModal();
            $("#id_espacio_curricular").val($(button).attr('data-id_espacio'));
            
            app.buscarSede();
            setTimeout( () => {
                $("#selectSede").val($(button).parent().parent().children().first().attr('data-id_sede'));
            }, 100);
            
            app.buscarCarrera();
            setTimeout( () => {
                $("#selectPlan").val($(button).parent().parent().children().first().next().attr('data-id_plan'));
                $("#selectPlan").change();
            }, 150);
            
            setTimeout( () => {
                $("#selectAnio").val($(button).parent().parent().children().first().next().next().next().next().attr('data-anio'));
                $("#selectAnio").change();
            }, 200);
            
            setTimeout( () => {
                $("#selectMateria").val($(button).parent().parent().children().first().next().next().attr('data-id_materia'));
            }, 250);
            
            setTimeout( () => {
               $("#selectCurso").val($(button).parent().parent().children().first().next().next().next().attr('data-id_curso')); 
            }, 300);
        };
        
        app.limpiarModal = () => {
            app.habilitadorCampos(false);
            $("#anio").hide();
            $("#materia").hide();
            $("#curso").hide();
            $("#guardar").show();
            $("#borrar").addClass('hidden');
            $("#id_espacio_curricular").val(0);
            $("#selectSede").html('');
            $("#selectPlan").html('');
            $("#selectAnio").html('');
            $("#selectMateria").html('');
            $("#selectCurso").html('');
            $("#form").bootstrapValidator('resetForm', true);  
        };
        
        app.habilitadorCampos = (condicion) => {
            $("#selectSede").prop('disabled', condicion);
            $("#selectPlan").prop('disabled', condicion);
            $("#selectAnio").prop('disabled', condicion);
            $("#selectMateria").prop('disabled', condicion);
            $("#selectCurso").prop('disabled', condicion);
        };
        
        app.init();
    })(TallerAvanzada);
});