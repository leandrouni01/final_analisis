$(function () {
    var TallerAvanzada = {};
    
    var id = "";
    var duracion = "";
    var plan = "";
     
    (function (app) {
        app.init = function () {
            app.buscar();
            app.listarPlanEstudio();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) { 
                app.limpiarModal()
                app.listarPlanEstudio();
                $("#id").val(0);
                $("#tituloModal").html("Nueva Materia");
                $("#modalMateria").modal({show: true});
            });
            
            $("#guardar").on('click', function (event) {
                event.preventDefault();
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });
            
            $("#combo").change( function(){
               app.listarDuracion(); 
            });
            
            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $("#id").val($(this).attr("data-id_materia"));

                plan = $(this).parent().parent().children().html();
                $("#combo").find(':selected').val($(this).parent().parent().children().html());
                $("#combo").val($(this).parent().parent().children().attr("data-fk_planestudio"));

                $("#semestre").val($(this).parent().parent().children().first().next().html());

                $("#nombre").val($(this).parent().parent().children().first().next().next().html());
                $("#carga_horaria").val($(this).parent().parent().children().first().next().next().next().next().html());

                id = $(this).parent().parent().children().attr("data-fk_planestudio");
                duracion = $(this).parent().parent().children().first().next().next().next().html();
                $("#comboDuracion").append('<option value="' + duracion + '">' + duracion + '</option>');

                app.listarDuracionEdit(duracion, id);

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
            
            $("#salir").on('click', function(e){
               app.listarPlanEstudio(); 
            });
            
            $("#borrar").on('click', function(e) {
                app.eliminar($("#id2").val());
                $("#modalMateria2").modal('hide');
            });
            
            $("#salir2").on('click', function(){
               app.limpiarModal2();               
            });
            
            $("#formMateria").bootstrapValidator({
                excluded: [],
            });
        };
        
        app.listarPlanEstudio = function (id) {  //funcion para listar carreras
            var datosEnviar = {id:id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=planestudio";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (data) {
                    var item = "combo";
                    app.rellenarCombo(data, item);
                },
                error: function () {
                    alert('error buscar carrera');
                }
            });
        };
        
        app.rellenarCombo = function (data, itemRecibido, duracion) {   //funcion para rellenar combo.
            $('#' + itemRecibido).html("");
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");

            $.each(data, function (clave, value) {
                $('#' + itemRecibido).append('<option value="' + value.id_planestudio + '">' + value.nombre + " ( " + value.resolucion + " )" + '</option>');
            });
        };
        
        app.listarDuracion = function(){
          var id = $("#combo").find(':selected').val();                    
          var url = "../../controlador/ruteador/Ruteador.php?accion=listarDuracion&Formulario=planestudio";
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
            $('#' + itemRecibido).prepend("<option value=''>Seleccione</option>");

            for (var i = 1; i <= data.duracion; i++) {
                $('#' + itemRecibido).append('<option value="' + i + '">' + i + '</option>');
            };

        };

        app.listarDuracionEdit = function (duracion, id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=listarDuracion&Formulario=planestudio";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: {id: id},
                success: function (data){
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

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=materia";
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
                linea += '<tr>' +
                        '<td data-fk_planestudio="' + materia.id_planestudio + '">' + materia.nombre_carrera + " ( " + materia.resolucion + " )" + '</td>' +
                        '<td>' + materia.semestre + '</td>' +
                        '<td>' + materia.nombre + '</td>' +
                        '<td>' + materia.anio + '</td>' +
                        '<td>' + materia.carga_horaria + '</td>' +
                        '<td>' +
                        '<button type="button" class="btn btn-sm btn-warning pull-left editar" data-id_materia="' + materia.id_materia + '" data-toggle="tooltip" data-placement="left" title="Editar registro"><span class="glyphicon glyphicon-pencil"></span> Editar</button>' + //data- : crea un metadato de la clave primaria.
                        '<button type="button" class="btn btn-sm btn-danger pull-right eliminar" data-id_materia="' + materia.id_materia + '" data-toggle="tooltip" data-placement="left" title="Eliminar registro"><span class="glyphicon glyphicon-trash"></span> Eliminar</button>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
            });
            $("#cuerpoTabla").html(linea);
        };
        
         app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=materia"
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
                    $("#modalMateria").modal('hide');
                    app.buscar();
                    //app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert('entre en el error del ajax');
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
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=materia";
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
            $("#comboDuracion").val('');
            $("#nombre").val('');
            $("#semestre").val('');
            $("#carga_horaria").val(''); 
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