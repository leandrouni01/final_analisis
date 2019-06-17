$(function () {
    var TallerAvanzada = {};
    
    (function (app) {
        app.init= function(){
            $("#anio").hide();
            $("#materia").hide();
            $("#curso").hide();
            app.buscarEspacioCurricular();
            app.buscarCarrera();
            app.buscarSede();
            app.bindigs();
        };
        
        app.bindigs= function(){
          $("#agregar_espacio_curricular").on('click',function(){
              $("#modalEspacioCurricular").modal({show:true});
              $("#id_espacio_curricular").val(0);
              $("#tituloModal").html("Agregar espacio curricular");
          });
          
            $("#selectSede").on('change', function () {
                if ($("#selectPlan").find(":selected").val() != 0) {
                    $("#anio").show();
                    app.buscarAnio();
                }
            });
          
            $("#selectPlan").on('change', function () {
                if ($("#selectSede").find(":selected").val() != 0) {
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
                                   <td>${espacio.anio}</td>
                                   <td>
                                       <a class='btn btn-warning pull-left editar' data-id_espacio="${espacio.id_espacio_curricular}"><span class='glyphicon glyphicon-pencil'></span>Editar</a>
                                       <a class='btn btn-danger pull-right eliminar' data-id_espacio="${espacio.id_espacio_curricular}"><span class='glyphicon glyphicon-remove'></span>Eliminar </a>
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
        
        app.init();
    })(TallerAvanzada);
});