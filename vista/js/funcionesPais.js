$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.buscar();
            app.bindings();
        };

        app.bindings = function () {
            $("#agregar").on('click', function (event) {
                $("#id").val(0);
                $("#tituloModal").html("Nuevo Pais ");
                $("#modal").modal({show: true});
            });

            $("#guardar").on('click', function (event) {
                event.preventDefault();
                if ($("#id").val() == 0) {
                    app.guardar();
                } else {
                    app.modificar();
                }
            });

            $("#cuerpoTabla").on('click', '.editar', function (event) {
                $("#id").val($(this).attr("data-id"));
                $("#nombre").val($(this).parent().parent().children().html());
                $("#tituloModal").html("Editar");
                $("#modal").modal({show: true})
            });

            $("#cuerpoTabla").on('click', '.eliminar', function () {
                app.eliminar($(this).attr("data-id"));
            });

            $("#form").bootstrapValidator({
                excluded: [],
            });

        };

        app.buscar = function () { //esta funcion lista todas las carreras
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=pais";
            $.ajax({
                url: url,
                method: 'GET',
                dataType: 'json',
                success: function (datosRecibidos) {
                    app.rellenarTabla(datosRecibidos);
                },
                error: function () {
                    alert('error buscar ');
                }
            });
          
        };
        
        
        app.rellenarTabla = function (data) {//funcion para rellenar la tabla carrera
            //alert("Entre en rellenar tabla");
            var linea = "";
            $.each(data, function (clave, pais ) {
                linea += '<tr>' +
                        '<td>' + pais.nombre + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + pais.id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' + //data- : crea un metadato de la clave primaria.
                        '<a class="pull-right eliminar" data-id="' + pais.id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' + //metadato: informacion adicional de los datos. 
                        '</td>' +
                        '</tr>';
            });
            $("#cuerpoTabla").html(linea);
        };


        app.guardar = function () {
            var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=pais";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar");
                    alert(datosRecibidos);
                }
            });
        };


        app.modificar = function () {

            var url = "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=pais";
            var datosEnviar = $("#form").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    $("#modal").modal('hide');
                    app.actualizarTabla(datosRecibidos, $("#id").val());
                    app.limpiarModal();
                },
                error: function (datosRecibidos) {
                    alert("Error en guardar");
                    alert(datosRecibidos);
                }
            });
        };


        app.actualizarTabla = function (pais, id) {
            if (id == 0) {
                var html = '<tr>' +
                        '<td>' + pais.nombre + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + pais.id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id="' + pais.id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>' +
                        '</tr>';
                $("#cuerpoTabla").append(html);
            } else {
                //Modifico un Pais existente, busco la fila.
                var fila = $("#cuerpoTabla").find("a[data-id='" + id + "']").parent().parent();
                var html = '<td>' + $("#nombre").val() + '</td>' +
                        '<td>' +
                        '<a class="pull-left editar" data-id="' + id + '"><span class="glyphicon glyphicon-pencil"></span>Editar</a>' +
                        '<a class="pull-right eliminar" data-id="' + id + '"><span class="glyphicon glyphicon-remove"></span>Eliminar</a>' +
                        '</td>';
                fila.html(html);
            }
        };
        
        
       app.eliminar = function (id) {
            var url = "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=pais";
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
            var fila = $("#cuerpoTabla").find("a[data-id='" + id + "']").parent().parent().remove();
        };

        app.limpiarModal = function () {//funcion para limpiar el modal
            $("#id").val(0);
            $("#nombre").val('');
        };




        app.init();

    })(TallerAvanzada);
});


