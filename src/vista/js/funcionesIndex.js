$(function () {
    var TallerAvanzada = {};

    (function (app) {
        app.init = function () {
            
            app.bindings();
            
        };

        app.bindings = function () {
            
            $("#iniciarSesion").on('click', function(e){
                $("#modal").modal({show: true});
            });
            
            $("#registrarse").on('click', function (e) {
                $("#modal2").modal({show: true});
            });

            $("#entrar").on('click', function (event) {
                event.preventDefault();
                app.comprobarSesion();

            });
            
            $("#registrar").on('click', function (event) {
                event.preventDefault();
                app.registrarPersona();

            });

            $("#formSesion").bootstrapValidator({
                excluded: [],
            });
            
            $("#formLogin").bootstrapValidator({
                excluded: [],
            });

        };

        app.comprobarSesion = function () {
            var url = "controlador/ruteador/RuteadorSesion.php";
            $.ajax({
                data: $("#formSesion").serialize() ,
                method: 'post',
                url: url,
                dataType: 'json',
                success: function (data) {
                     var valor = parseInt(data);
                     
                    if (valor === 0) {
                        alert('Ingreso correctamente');
                        window.location = "index.html";
                    }
                    
                    if (valor === 1){
                        alert('Contraseña Incorrecta');
                        $("#password").val('');
                    } 
                    
                    if(valor === 2){
                        alert('El usuario NO existe');
                        $("#usuario").val('');
                        $("#password").val('');
                    }
                },
                error: function () {
                    alert('Hubo un error al combrobar la sesion');
                   // window.location = "index.html";
                }
            });
        };
        
        app.registrarPersona = function () {

            var url = "controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Login";

            // variable que toma todos los datos del formulario
            var datosEnviar = $('#formLogin').serialize();

            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function (datosRecibidos) {
                    var valor = parseInt(datosRecibidos);
                    if (valor === 0) {
                        alert("ya existe este usuario");
                    }
                    
                    //La clave no era correcta
                    if (valor === 1) {
                        alert("Revisa tu correo");
                    }

                },
                error: function (datosRecibidos) {
                    var valor = parseInt(datosRecibidos);
                    alert("viene con el error");
                    alert(datosRecibidos);
                }
            });
        };
        

        app.init();

    })(TallerAvanzada);
});




