$(function(){
    var TallerAvanzada = {};
    
    (function(app){
        app.init= function (){
            app.buscarProvincias();
            app.buscarPaises();
            app.bindings();
        };
        
        app.bindings = function(){
            $("#agregarProvincia").on('click',function(){
                $("#id").val(0);
                $("#tituloModal").html("Agregar Provincia");
                $("#modalProvincia").modal({show:true});
                $("#accion").html("Guardar");
            });
            
            $("#accion").on("click",function(){
                if($("#accion").html()=="Guardar"){
                    if($("#id").val()==0){
                        app.guardarProvincia();
                    }else{
                        app.editarProvincia();
                    }
                }else{
                    app.eliminarProvincia();
                }
            });
            
            $("#cuerpoTablaProvincia").on('click','.editar',function(){
                $("#tituloModal").html("Editar provincia");
                $("#id").val($(this).attr("data-id_provincia"));
                $("#modalProvincia").modal({show:true});
                //alert($(this).parent().parent().children().first().next().attr("data-fk_pais"));
                $("#selectPais").find("option[value="+$(this).parent().parent().children().first().next().attr("data-fk_pais")+"]").prop("selected","true");
                $("#nombreProvincia").val($(this).parent().parent().children().first().html());
                $("#accion").html("Guardar");
            });
            
            $("#cuerpoTablaProvincia").on("click",".eliminar",function(){
                $("#fieldsetProvincia").attr("disabled","true");
                $("#tituloModal").html("¿Esta seguro que desea eliminar esta provincia?");
                $("#id").val($(this).attr("data-id_provincia"));
                $("#modalProvincia").modal({show:true});
                $("#selectPais").find("option[value="+$(this).parent().parent().children().first().next().attr("data-fk_pais")+"]").prop("selected","true");
                $("#nombreProvincia").val($(this).parent().parent().children().first().html());
                $("#accion").html("Eliminar");
            });
            
            $("#cuerpoTablaProvincia").on("click",".ver",function(){
                $("#fieldsetProvincia").attr("disabled","true");
                $("#tituloModal").html("Ver provincia");
                $("#id").val($(this).attr("data-id_provincia"));
                $("#modalProvincia").modal({show:true});
                $("#selectPais").find("option[value="+$(this).parent().parent().children().first().next().attr("data-fk_pais")+"]").prop("selected","true");
                $("#nombreProvincia").val($(this).parent().parent().children().first().html());
                $("#accion").hide();
            });
            
            $("#modalProvincia").on('hide.bs.modal', function () {
                app.limpiarModal();
            });
        };
        
        app.guardarProvincia= function(){
          var url = "../../controlador/ruteador/Ruteador.php?accion=agregar&Formulario=Provincia";
          var datosEnviar= $("#formProvincia").serialize();
          $.ajax({
              url:url,
              method: 'POST',
              dataType: 'json',
              data: datosEnviar,
              success: function(datosRecibidos){
                  app.actualizarTabla(datosRecibidos,$("#id").val());
                  $("#modalProvincia").modal('hide');
              },
              error: function(datosRecibidos){
                  alert("Error al guardar provincia");
                  alert(datosRecibidos);
              }
          });
        };
        
        app.editarProvincia = function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=modificar&Formulario=Provincia";
            var datosEnviar= $("#formProvincia").serialize();
            //alert(datosEnviar);
            $.ajax({
                url:url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success : function(datosRecibidos){
                    app.actualizarTabla(datosRecibidos,$("#id").val());
                    $("#modalProvincia").modal('hide');
                },
                error: function(datosRecibidos){
                    alert("Error al editar provincia");
                    alert(datosRecibidos);
                }
            })
        };
        
        app.actualizarTabla= function(datosProvincia,id){
            var html= "";
            if(id==0){
                html= "<tr>\n\
                             <td>"+datosProvincia.nombre_provincia+"</td>\n\
                             <td data-fk_pais='"+datosProvincia.fk_pais+"'>"+datosProvincia.nombre_pais+"</td>\n\
                             <td><a class='ver' data-id_provincia='"+datosProvincia.id_provincia+"'><span class='glyphicon glyphicon-info-sign'></span>Ver</a><a class='eliminar' data-id_provincia='"+datosProvincia.id_provincia+"'><span class='glyphicon glyphicon-remove'></span>Eliminar</a><a class='editar' data-id_provincia='"+datosProvincia.id_provincia+"'><span class='glyphicon glyphicon-pencil'></span>Editar</a></td>\n\
                        </tr>";
                $("#cuerpoTablaProvincia").append(html);
            }else{
                var fila= $("#cuerpoTablaProvincia").find("a[data-id_provincia='"+id+"']").parent().parent();
                html = "<td>"+$("#nombreProvincia").val()+"</td>\n\
                        <td data-fk_pais='"+$("#selectPais").find(":selected").val()+"'>"+$("#selectPais").find(":selected").html()+"</td>\n\
                        <td><a class='ver' data-id_provincia='"+id+"'><span class='glyphicon glyphicon-info-sign'></span>Ver</a><a class='eliminar' data-id_provincia='"+id+"'><span class='glyphicon glyphicon-remove'></span>Eliminar</a><a class='editar' data-id_provincia='"+id+"'><span class='glyphicon glyphicon-pencil'></span>Editar</a></td>";
                fila.html(html);
            }
        };
        
        app.eliminarProvincia= function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=eliminar&Formulario=Provincia";
            var datosEnviar= $("#formProvincia").serialize();
            $.ajax({
                url: url,
                method: 'POST',
                dataType: 'json',
                data: datosEnviar,
                success: function(){
                    app.eliminarFila($("#id").val());
                    $("#modalProvincia").modal("hide");
                },
                error: function(){
                    alert("Error al eliminar provincia");
                }
            });
        };
        
        app.eliminarFila= function(id){
            $("#cuerpoTablaProvincia").find("a[data-id_provincia='"+id+"']").parent().parent().remove();
        };
        
        app.buscarProvincias= function(){
            
          var url= "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Provincia";
          $.ajax({
              url: url,
              method: 'GET',
              dataType: 'json',
              success: function(datosRecibidos){
                  app.rellenarTabla(datosRecibidos);
              },
              error: function(datosRecibidos){
                    alert("Error al buscar provincias");
                    alert(datosRecibidos);
              }
          })
        };
        app.rellenarTabla= function(datosProvincia){
            var html = "";
            $.each(datosProvincia,function(clave,provincia){
                html += "<tr>\n\
                             <td>"+provincia.nombre_provincia+"</td>\n\
                             <td data-fk_pais='"+provincia.fk_pais+"'>"+provincia.nombre_pais+"</td>\n\
                             <td><a class='ver' data-id_provincia='"+provincia.id_provincia+"'><span class='glyphicon glyphicon-info-sign'></span>Ver</a><a class='eliminar' data-id_provincia='"+provincia.id_provincia+"'><span class='glyphicon glyphicon-remove'></span>Eliminar</a><a class='editar' data-id_provincia='"+provincia.id_provincia+"'><span class='glyphicon glyphicon-pencil'></span>Editar</a></td>\n\
                        </tr>";
            });
            $("#cuerpoTablaProvincia").html(html);
        };
        app.buscarPaises = function(){
            var url= "../../controlador/ruteador/Ruteador.php?accion=listar&Formulario=Pais";
            $.ajax({
                url:url,
                method: 'GET',
                dataType: 'json',
                success: function(datosRecibidos){
                    app.rellenarPaises(datosRecibidos);
                },
                error: function(datosRecibidos){
                    alert("Error al buscar paises");
                    alert(datosRecibidos);
                }
            })
        };
        app.rellenarPaises = function(datosPais){
            var html= "<option value=0>Seleccione un pais</option>";
            $.each(datosPais, function (clave, pais) {
                html += "<option value='"+pais.id_pais+"'>"+pais.nombre_pais+"</option>";
            });
            $("#selectPais").html(html);
        };
        
        app.limpiarModal = function(){
          $("#nombreProvincia").val("");
          $("#selectPais").find("option[value=0]").prop("selected","true");
          $("#fieldsetProvincia").removeAttr("disabled");
          $("#accion").show();
        };
        
        app.init();
    })(TallerAvanzada);
});