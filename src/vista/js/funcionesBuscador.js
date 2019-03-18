$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            app.listarCarrera();
            app.bindings();

        };

        app.bindings = function () {

            $("#btnBuscar").on('click', function (event) {  //Evento para el Click del boton buscarProfesor
                $("#tituloModal").html("Correlativas");
                
                app.buscar();
              
            });

            $("#form").bootstrapValidator({
                excluded: [],
            });
        };

        app.listarCarrera = function (id) {  //funcion para listar carreras
            var datosEnviar = {id: id};
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=carrera";
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    var item = "comboCarrera";
                    app.rellenarCombo(datosRecibidos, item);
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
                $('#' + itemRecibido).append('<option value="' + value.id_carrera + '">' + value.nombre + '</option>');
            });
            $("#comboCarrera").change(function () {
                app.listarPlanEstudio();
            });
        };


        app.listarPlanEstudio = function () {
            var fk_carrera = $("#comboCarrera").find(':selected').val();
            var url = "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=buscador";
            var datosEnviar = {fk_carrera: fk_carrera};
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    var item = "comboPlanE";
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
                $('#' + itemRecibido).append('<option value="' + value.id_planestudio + '">' + value.resolucion + '</option>');
            });
            $("#comboPlanE").change(function () {
               // app.listarCorrelativa();
            });
        };


        app.buscar = function () {//funcion para buscar un profesor por criterio
            //alert("entre en buscar");
            var id_carrera = $("#comboCarrera").find(':selected').val();
            var id_planestudio = $("#comboPlanE").find(':selected').val();
            var nombre = $("#txtBusqueda").val();
            var url = "../../controlador/ruteador/Ruteador.php?accion=buscar&Formulario=buscador";
            var datosEnviar = {nombre: nombre, id_planestudio: id_planestudio, id_carrera: id_carrera};
            //alert(" valor buscado:" + datosEnviar.buscar);
            if (id_planestudio == 0 || nombre == 0) {
                alert("¡ERROR AL BUSCAR!");
            } else{
                $.ajax({
                    url: url,
                    method: 'POST',
                    dataType: 'json',
                    data: datosEnviar,
                    success: function (datosRecibidos) {
                        alert("BUSQUEDA EXITOSA");
                        $("#modalBuscador").modal({show: true});
                        app.rellenarTabla(datosRecibidos);
                    },
                    error: function (datosRecibidos) {
                        alert("¡ERROR AL BUSCAR!");

                    }
                });
            }

        };

        app.rellenarTabla = function (data) {//funcion para rellenar la tabla
            var linea = "";
            $.each(data, function (clave, materia) {
                linea += '<tr>' +
                        '<td>' + materia.nombre + '</td>' +
                        '<td>' + materia.semestre + '</td>' +
                        '<td>' + materia.carga_horaria + '</td>' +
                        '</tr>';
            });
            $("#cuerpoTabla").html(linea);
        };



        app.init();

    })(TallerAvanzada);
});
