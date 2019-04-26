<?php

interface DbSentencias {

    //Pais
    const LISTAR_PAISES = "SELECT nombre_pais,id_pais FROM pais WHERE estado=1 ORDER BY nombre_pais;";
    const INSERTAR_PAIS = "INSERT INTO pais(nombre_pais) VALUE(?);";
    const BUSCAR_ULTIMO_PAIS = "SELECT nombre_pais,id_pais FROM pais WHERE estado=1 AND id_pais=(SELECT MAX(id_pais) FROM pais);";
    const ACTUALIZAR_PAIS = "UPDATE pais SET nombre_pais= ? WHERE id_pais= ?;";
    const ELIMINAR_PAIS = "UPDATE pais SET estado=0 WHERE id_pais=?;";
    const BUSCAR_PAIS = "SELECT nombre_pais,id_pais FROM pais WHERE estado=1 AND nombre_pais LIKE '?%' ORDER BY nombre_pais;";
    //Provincia
    const LISTAR_PROVINCIAS = "SELECT id_provincia,nombre_provincia,fk_pais,nombre_pais FROM provincia INNER JOIN pais ON (fk_pais = id_pais) WHERE provincia.estado=1 ORDER BY nombre_pais,nombre_provincia;";
    const INSERTAR_PROVINCIA = "INSERT INTO provincia(nombre_provincia,fk_pais) VALUES (?,?);";
    const BUSCAR_ULTIMA_PROVINCIA = "SELECT id_provincia,nombre_provincia,fk_pais,nombre_pais FROM provincia INNER JOIN pais ON (fk_pais=id_pais) WHERE id_provincia=(SELECT MAX(id_provincia)FROM provincia);";
    const ACTUALIZAR_PROVINCIA = "UPDATE provincia SET nombre_provincia=?,fk_pais=? WHERE id_provincia=?;";
    const ELIMINAR_PROVINCIA = "UPDATE provincia SET estado=0 WHERE id_provincia=?;";
    const BUSCAR_PROVINCIA= "SELECT id_provincia,nombre_provincia,fk_pais,nombre_pais FROM provincia INNER JOIN pais ON (fk_pais = id_pais) WHERE provincia.estado=1 AND nombre_provincia LIKE '?%' OR nombre_pais LIKE '?%' ORDER BY nombre_pais,nombre_provincia;";
    //Localidad
    const LISTAR_LOCALIDADES= "SELECT id_localidad,nombre_localidad,fk_provincia,nombre_provincia,fk_pais,nombre_pais FROM localidad INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) WHERE localidad.estado=1 ORDER BY nombre_localidad,nombre_provincia,nombre_pais;";
    const LISTAR_PROV= "SELECT id_provincia,nombre_provincia FROM provincia WHERE fk_pais=?;";
    const INSERTAR_LOCALIDAD = "INSERT INTO localidad(nombre_localidad,fk_provincia) VALUES (?,?);";
    const BUSCAR_ULTIMA_LOCALIDAD = "SELECT id_localidad,nombre_localidad,fk_provincia,nombre_provincia,fk_pais,nombre_pais FROM localidad INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) WHERE localidad.estado=1 AND id_localidad=(SELECT MAX(id_localidad) FROM localidad);";
    const ACTUALIZAR_LOCALIDAD = "UPDATE localidad SET fk_provincia=?,nombre_localidad=? WHERE id_localidad=?;";
    const ELIMINAR_LOCALIDAD = "UPDATE localidad SET estado=0 WHERE id_localidad=?;";
    const BUSCAR_LOCALIDAD = "SELECT id_localidad,nombre_localidad,fk_provincia,nombre_provincia,fk_pais,nombre_pais FROM localidad INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) WHERE localidad.estado=1 AND nombre_localidad LIKE '?%' OR nombre_provincia LIKE '?%' OR nombre_pais LIKE '?%' ORDER BY nombre_localidad,nombre_provincia,nombre_pais;";
    //Domicilio
    const INSERTAR_DOMICILIO = "INSERT INTO domicilio(calle_domicilio,numero_domicilio,fk_localidad) VALUES (?,?,?);";
    const ACTUALIZAR_DOMICILIO = "UPDATE domicilio SET calle_domicilio=?,numero_domicilio=?,fk_localidad=? WHERE id_domicilio=?;";
    const ELIMINAR_DOMICILIO = "UPDATE domicilio SET estado=0 WHERE id_domicilio=?;";
    const BUSCAR_ULTIMO_DOMICILIO= "SELECT calle_domicilio,numero_domicilio,id_domicilio FROM domicilio WHERE id_domicilio=(SELECT MAX(id_domicilio) FROM domicilio);";
    //Sede
    const LISTAR_LOC = "SELECT nombre_localidad,id_localidad FROM localidad WHERE estado=1 AND fk_provincia=?;";
    const LISTAR_SEDES = "SELECT id_sede,nombre_sede,numero_sede,telefono_sede,fk_domicilio,calle_domicilio,numero_domicilio,fk_localidad,nombre_localidad,fk_provincia,nombre_provincia,fk_pais,nombre_pais FROM sede INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) WHERE sede.estado=1;";
    const INSERTAR_SEDE= "INSERT INTO sede(nombre_sede,numero_sede,telefono_sede,fk_domicilio) VALUES (?,?,?,(SELECT MAX(id_domicilio) FROM domicilio));";
    const BUSCAR_ULTIMA_SEDE = "SELECT id_sede,nombre_sede,numero_sede,telefono_sede,fk_domicilio,calle_domicilio,numero_domicilio,fk_localidad,nombre_localidad,fk_provincia,nombre_provincia,fk_pais,nombre_pais FROM sede INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) WHERE sede.estado=1 AND id_sede=(SELECT MAX(id_sede) FROM sede);";
    const ACTUALIZAR_SEDE= "UPDATE sede SET nombre_sede=?,numero_sede=?,telefono_sede=? WHERE id_sede=?;";
    const ELIMINAR_SEDE= "UPDATE sede SET estado=0 WHERE id_sede=?;";
    const BUSCARDOR_SEDES = "SELECT id_sede,nombre_sede,numero_sede,telefono_sede,fk_domicilio,calle_domicilio,numero_domicilio,fk_localidad,nombre_localidad,fk_provincia,nombre_provincia,fk_pais,nombre_pais FROM sede INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) WHERE sede.estado=1 AND nombre_sede LIKE '?%' OR numero_sede LIKE '?%';";
    //Carrera
    const LISTAR_CARRERAS = "SELECT nombre_carrera,id_carrera FROM carrera WHERE estado_carrera=1;";
    const INSERTAR_CARRERA= "INSERT INTO carrera(nombre_carrera) VALUE(?);";
    const BUSCAR_ULTIMA_CARRERA= "SELECT nombre_carrera,id_carrera FROM carrera WHERE estado_carrera=1 AND id_carrera=(SELECT MAX(id_carrera)FROM carrera);";
    const ACTUALIZAR_CARRERA = "UPDATE carrera SET nombre_carrera= ? WHERE id_carrera= ?;";
    const ELIMINAR_CARRERA = "UPDATE carrera SET estado_carrera=0 WHERE id_carrera=?;";
    const BUSCAR_CARRERA = "SELECT carrera.* FROM carrera WHERE carrera.nombre_carrera LIKE '?%' AND carrera.estado_carrera = 1";
    //Titulo
    const LISTAR_TITULOS= "SELECT titulo.* FROM titulo WHERE estado=1 ORDER BY nombre_titulo;";
    const INSERTAR_TITULO= "INSERT INTO titulo(nombre_titulo) VALUE (?);";
    const BUSCAR_ULTIMO_TITULO= "SELECT titulo.* FROM titulo WHERE estado=1 AND id_titulo=(SELECT MAX(id_titulo) FROM titulo);";
    const ACTUALIZAR_TITULO = "UPDATE titulo SET nombre_titulo=? WHERE id_titulo=?;";
    const ELIMINAR_TITULO = "UPDATE titulo SET estado=0 WHERE id_titulo=?;";
    const BUSCAR_TITULOS = "SELECT titulo.* FROM titulo WHERE estado=1 AND nombre_titulo LIKE '?%' ORDER BY nombre_titulo";
    //Postgrado
    const LISTAR_POSTGRADOS= "SELECT postgrado.*,nombre_titulo FROM postgrado INNER JOIN titulo ON (fk_titulo=id_titulo) WHERE postgrado.estado=1 ORDER BY nombre_postgrado;";
    const INSERTAR_POSTGRADO= "INSERT INTO postgrado(nombre_postgrado,fk_titulo) VALUE (?,?);";
    const BUSCAR_ULTIMO_POSTGRADO= "SELECT postgrado.*,nombre_titulo FROM postgrado INNER JOIN titulo ON (fk_titulo=id_titulo) WHERE postgrado.estado=1 AND id_postgrado=(SELECT MAX(id_postgrado) FROM postgrado);";
    const ACTUALIZAR_POSTGRADO= "UPDATE postgrado SET nombre_postgrado=?,fk_titulo=? WHERE id_postgrado=?;";
    const ELIMINAR_POSTGRADO = "UPDATE postgrado SET estado=0 WHERE id_postgrado=?;";
    const BUSCAR_POSGRADOS = "SELECT postgrado.*,nombre_titulo FROM postgrado INNER JOIN titulo ON (fk_titulo=id_titulo) WHERE postgrado.estado=1 AND `nombre_postgrado` LIKE '?%' ORDER BY nombre_postgrado";
    const BUSCAR_POST = "SELECT postgrado.* FROM postgrado WHERE postgrado.fk_titulo = ?";
    //Profesor
    const LISTAR_PROFESORES= "SELECT profesor.*, domicilio.*, localidad.*, provincia.*, pais.*, titulo.*, postgrado.* FROM profesor INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) INNER JOIN titulo ON(fk_titulo=id_titulo) INNER JOIN postgrado ON (fk_postgrado=id_postgrado) WHERE profesor.`estado`=1;";
    const INSERTAR_PROFESOR= "INSERT INTO profesor(cargo_profesor,nombre_profesor,apellido_profesor,fk_titulo,fk_postgrado,fk_domicilio,dni_profesor) VALUES(?,?,?,?,?,(SELECT MAX(id_domicilio) FROM domicilio),?);";
    const BUSCAR_ULTIMO_PROFESOR= "SELECT profesor.*, domicilio.*, localidad.*, provincia.*, pais.*, titulo.*, postgrado.* FROM profesor INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) INNER JOIN titulo ON(fk_titulo=id_titulo) INNER JOIN postgrado ON (fk_postgrado=id_postgrado) WHERE profesor.`estado`=1 AND id_profesor=(SELECT MAX(id_profesor) FROM profesor);";
    const ACTUALIZAR_PROFESOR= "UPDATE profesor SET cargo_profesor=?,nombre_profesor=?,apellido_profesor=?,fk_titulo=?,fk_postgrado=?,fk_domicilio=?,dni_profesor=? WHERE id_profesor=?;";
    const ELIMINAR_PROFESOR= "UPDATE profesor SET estado=0 WHERE id_profesor=?;";
    const BUSCADOR_PROFESOR= "SELECT profesor.*, domicilio.*, localidad.*, provincia.*, pais.*, titulo.*, postgrado.* FROM profesor INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) INNER JOIN titulo ON(fk_titulo=id_titulo) INNER JOIN postgrado ON (fk_postgrado=id_postgrado) WHERE profesor.`estado`=1 AND nombre_profesor LIKE '?%' OR apellido_profesor LIKE '?%' OR dni_profesor LIKE '?%';"; 
    //Curso
    const LISTAR_CURSOS= "SELECT curso.*,nombre_sede,numero_sede,resolucion,nombre_carrera FROM curso INNER JOIN sede ON(fk_sede=id_sede) INNER JOIN plan_de_estudios ON (fk_plan_de_estudios=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) WHERE curso.estado=1;";
    const INSERTAR_CURSO= "INSERT INTO curso(fk_sede,fk_plan_de_estudios,nombre_curso,anio_curso) VALUES (?,?,?,?);";
    const BUSCAR_ULTIMO_CURSO= "SELECT curso.*,nombre_sede,numero_sede,resolucion,nombre_carrera FROM curso INNER JOIN sede ON(fk_sede=id_sede) INNER JOIN plan_de_estudios ON (fk_plan_de_estudios=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) WHERE curso.estado=1 AND id_curso=(SELECT MAX(id_curso) FROM curso);";
    const ACTUALIZAR_CURSO= "UPDATE curso SET fk_sede=?,fk_plan_de_estudios=?,nombre_curso=?,anio_curso=? WHERE id_curso=?;";
    const ELIMINAR_CURSO= "UPDATE curso SET estado=0 WHERE id_curso=?;";
    const BUSCADOR_CURSOS = "SELECT curso.*,nombre_sede,numero_sede,resolucion,nombre_carrera FROM curso INNER JOIN sede ON(fk_sede=id_sede) INNER JOIN plan_de_estudios ON (fk_plan_de_estudios=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) WHERE curso.estado=1 AND nombre_curso LIKE '?%' OR nombre_carrera LIKE '?%'";
    const BUSCAR_CURSO= "SELECT nombre_curso,id_curso FROM curso WHERE fk_sede=? AND fk_plan_de_estudios=? AND anio_curso=? AND estado=1;";
    //Horario
    const LISTAR_HORARIOS= "SELECT horarios.*,nombre_profesor,apellido_profesor,id_plan,id_sede,materia.anio,nombre_carrera,resolucion,nombre_materia,nombre_sede,numero_sede,nombre_curso,inicio.hora_modulo AS hora_inicio,fin.hora_modulo AS hora_fin FROM horarios INNER JOIN profesor ON (fk_profesor=id_profesor) INNER JOIN materia ON (fk_materia=id_materia) INNER JOIN plan_de_estudios ON (fk_plan_de_estudio=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN curso ON (fk_curso=id_curso) INNER JOIN sede ON (fk_sede=id_sede) INNER JOIN modulos AS inicio ON (fk_modulo_inicio=inicio.id_modulo) INNER JOIN modulos AS fin ON (fk_modulo_fin=fin.id_modulo) WHERE horarios.estado=1 AND profesor.cargo_profesor ='Titular';";
    const LISTAR_TITULARES= "SELECT profesor.*, domicilio.*, localidad.*, provincia.*, pais.*, titulo.*, postgrado.* FROM profesor INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) INNER JOIN titulo ON(fk_titulo=id_titulo) INNER JOIN postgrado ON (fk_postgrado=id_postgrado) WHERE profesor.`estado`=1 AND profesor.cargo_profesor='Titular';";
    const LISTAR_MODULOS_INICIO = "SELECT id_modulo, hora_modulo FROM sistema_sedes.modulos WHERE estado_modulo = 1 AND hora_modulo != '23:30';";
    const BUSCAR_MODULOS_FIN = "SELECT id_modulo, hora_modulo FROM sistema_sedes.modulos WHERE estado_modulo = 1 AND id_modulo > ?;";
    const INSERTAR_HORARIO= "INSERT INTO horarios(fk_profesor,fk_materia,fk_modulo_inicio,fk_modulo_fin,fk_curso,dia_horario,ciclo_lectivo_horario) VALUES(?,?,?,?,?,?,?);";
    const BUSCAR_ULTIMO_HORARIO= "SELECT horarios.*,nombre_profesor,apellido_profesor,id_plan,id_sede,materia.anio,nombre_carrera,resolucion,nombre_materia,nombre_sede,numero_sede,nombre_curso,inicio.hora_modulo AS hora_inicio,fin.hora_modulo AS hora_fin FROM horarios INNER JOIN profesor ON (fk_profesor=id_profesor) INNER JOIN materia ON (fk_materia=id_materia) INNER JOIN plan_de_estudios ON (fk_plan_de_estudio=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN curso ON (fk_curso=id_curso) INNER JOIN sede ON (fk_sede=id_sede) INNER JOIN modulos AS inicio ON (fk_modulo_inicio=inicio.id_modulo) INNER JOIN modulos AS fin ON (fk_modulo_fin=fin.id_modulo) WHERE horarios.estado=1 AND id_horario=(SELECT MAX(id_horario) FROM horarios);";
    const ACTUALIZAR_HORARIO= "UPDATE horarios SET fk_profesor=?,fk_materia=?,inicio_horario=?,fin_horario=?,fk_curso=?,dia_horario=?,ciclo_lectivo_horario=? WHERE id_horario=?;";
    const ELIMINAR_HORARIO= "UPDATE horarios SET estado=0 WHERE id_horario=?;";
    const VERIFICAR_HORARIO_TOMADO= "SELECT EXISTS(SELECT horarios.* FROM horarios WHERE fk_materia=? AND fk_modulo_inicio=? AND fk_modulo_fin=? AND fk_curso=? AND dia_horario=? AND ciclo_lectivo_horario=? AND estado=1) AS existe;";
    const VERIFICAR_HORARIO_SOLAPADO_PROFESOR= "SELECT EXISTS(SELECT horarios.* FROM horarios WHERE fk_profesor=? AND ((fk_modulo_inicio<? AND fk_modulo_fin>=?) OR (fk_modulo_fin>? AND fk_modulo_inicio<=?)) AND dia_horario=? AND ciclo_lectivo_horario=? AND estado=1) AS existe;";
    const VERIFICAR_HORARIO_SOLAPADO_CURSO= "SELECT EXISTS(SELECT horarios.* FROM horarios WHERE fk_curso=? AND ((fk_modulo_inicio<? AND fk_modulo_fin>=?) OR (fk_modulo_fin>? AND fk_modulo_inicio<=?)) AND dia_horario=? AND ciclo_lectivo_horario=? AND estado=1) AS existe;";
    const BUSCADOR_HORARIOS = "SELECT horarios.*,nombre_profesor,apellido_profesor,id_plan,id_sede,materia.anio,nombre_carrera,resolucion,nombre_materia,nombre_sede,numero_sede,nombre_curso,inicio.hora_modulo AS hora_inicio,fin.hora_modulo AS hora_fin FROM horarios INNER JOIN profesor ON (fk_profesor=id_profesor) INNER JOIN materia ON (fk_materia=id_materia) INNER JOIN plan_de_estudios ON (fk_plan_de_estudio=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN curso ON (fk_curso=id_curso) INNER JOIN sede ON (fk_sede=id_sede) INNER JOIN modulos AS inicio ON (fk_modulo_inicio=inicio.id_modulo) INNER JOIN modulos AS fin ON (fk_modulo_fin=fin.id_modulo) WHERE horarios.estado=1 AND nombre_curso LIKE '?%' OR nombre_materia LIKE '?%' OR nombre_profesor LIKE '?%'";    
    //Horario Suplente
    const LISTAR_HORARIOS_SUPLENTES="SELECT horario_suplente.*,fk_plan_de_estudio,nombre_carrera,resolucion,nombre_materia,nombre_sede,numero_sede,nombre_curso,titular.nombre_profesor AS nombre_titular,titular.apellido_profesor AS apellido_titular,suplente.nombre_profesor AS nombre_suplente,suplente.apellido_profesor AS apellido_suplente FROM horario_suplente INNER JOIN materia ON (fk_materia=id_materia) INNER JOIN plan_de_estudios ON (fk_plan_de_estudio=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN curso ON (fk_curso=id_curso) INNER JOIN sede ON (horario_suplente.fk_sede=id_sede)INNER JOIN profesor AS titular ON (fk_titular=titular.`id_profesor`)INNER JOIN profesor AS suplente ON (fk_suplente=suplente.`id_profesor`) WHERE estado_horario_suplente=1";
    const BUSCAR_SUPLENTES="SELECT profesor.*, domicilio.*, localidad.*, provincia.*, pais.*, titulo.*, postgrado.* FROM profesor INNER JOIN domicilio ON (fk_domicilio=id_domicilio) INNER JOIN localidad ON (fk_localidad=id_localidad) INNER JOIN provincia ON (fk_provincia=id_provincia) INNER JOIN pais ON (fk_pais=id_pais) INNER JOIN titulo ON(fk_titulo=id_titulo) INNER JOIN postgrado ON (fk_postgrado=id_postgrado) WHERE profesor.`estado`=1 AND profesor.cargo_profesor='Suplente'";
    const BUSCAR_TITULARES="SELECT DISTINCT (horarios.fk_profesor),nombre_profesor,apellido_profesor FROM horarios INNER JOIN profesor ON (fk_profesor=id_profesor) WHERE horarios.ciclo_lectivo_horario=? AND horarios.estado=1";
    const BUSCAR_SEDES="SELECT DISTINCT (id_sede),nombre_sede,numero_sede FROM horarios INNER JOIN curso ON (fk_curso=id_curso)INNER JOIN sede ON (fk_sede=id_sede)WHERE horarios.fk_profesor=? AND horarios.estado=1";
    const BUSCAR_CURSOS="SELECT DISTINCT (id_curso),nombre_curso FROM horarios INNER JOIN curso ON (fk_curso=id_curso) WHERE fk_sede=? AND horarios.estado=1";
    const BUSCAR_PLANES="SELECT DISTINCT (id_plan),nombre_carrera,resolucion FROM horarios INNER JOIN materia ON (fk_materia=id_materia) INNER JOIN plan_de_estudios ON (fk_plan_de_estudio=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) WHERE horarios.fk_profesor=? AND horarios.estado=1";
    const BUSCAR_MATERIAS_HORARIOS_SUPLENTES="SELECT DISTINCT (id_materia),nombre_materia FROM horarios INNER JOIN materia ON (fk_materia=id_materia) WHERE fk_plan_de_estudio=? AND horarios.estado=1";
    const INSERTAR_HORARIO_SUPLENTE="INSERT INTO horario_suplente(fk_titular,fk_suplente,fk_sede,fk_materia,fk_ciclo_lectivo,fk_curso,fecha_inicio,fecha_fin) VALUES(?,?,?,?,?,?,?,?)";
    const BUSCAR_ULTIMO_HORARIO_SUPLENTE= "SELECT horario_suplente.*,fk_plan_de_estudio,nombre_carrera,resolucion,nombre_materia,nombre_sede,numero_sede,nombre_curso,titular.nombre_profesor AS nombre_titular,titular.apellido_profesor AS apellido_titular,suplente.nombre_profesor AS nombre_suplente,suplente.apellido_profesor AS apellido_suplente FROM horario_suplente INNER JOIN materia ON (fk_materia=id_materia) INNER JOIN plan_de_estudios ON (fk_plan_de_estudio=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN curso ON (fk_curso=id_curso) INNER JOIN sede ON (horario_suplente.fk_sede=id_sede)INNER JOIN profesor AS titular ON (fk_titular=titular.`id_profesor`)INNER JOIN profesor AS suplente ON (fk_suplente=suplente.`id_profesor`) WHERE estado_horario_suplente=1 AND id_horario_suplente=(SELECT MAX(id_horario_suplente) FROM horario_suplente);";
    const ACTUALIZAR_HORARIO_SUPLENTE="UPDATE horario_suplente SET fk_titular=,fk_suplente=?,fk_sede=?,fk_materia=?,fk_ciclo_lectivo=?,fk_curso=?,fecha_inicio=?,fecha_fin=? WHERE id_horario_suplente=?";    
    const ELIMINAR_HORARIO_SUPLENTE="UPDATE horario_suplente SET estado_horario_suplente=0 WHERE id_horario_suplente=?";
    const VERIFICAR_HORARIO_SUPLENTE="SELECT EXISTS(SELECT horario_suplente.* FROM horario_suplente WHERE fk_suplente=? AND ((fecha_inicio<=? AND fecha_fin>?) OR (fecha_fin>=? AND fecha_inicio<?)) AND fk_ciclo_lectivo=? )AS existe;";
    const BUSCADOR_HORARIO_SUPLENTE="SELECT horario_suplente.*,nombre_carrera,resolucion,nombre_materia,nombre_sede,numero_sede,nombre_curso,titular.nombre_profesor AS nombre_titular,titular.apellido_profesor AS apellido_titular,suplente.nombre_profesor AS nombre_suplente,suplente.apellido_profesor AS apellido_suplente FROM horario_suplente INNER JOIN materia ON (fk_materia=id_materia) INNER JOIN plan_de_estudios ON (fk_plan_de_estudio=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN curso ON (fk_curso=id_curso) INNER JOIN sede ON (fk_sede=id_sede) INNER JOIN profesor AS titular ON (fk_titular=titular.`id_profesor`) INNER JOIN profesor AS suplente ON (fk_suplente=suplente.`id_profesor`) WHERE estado_horario_suplente=1 AND nombre_curso LIKE '?%' OR nombre_materia LIKE '?%' OR nombre_profesor LIKE '?%' OR nombre_suplente LIKE '?%'";    
    //Plan de Estudios
    const LISTAR_PLAN_DE_ESTUDIOS= "SELECT plan_de_estudios.*,carrera.`nombre_carrera` FROM plan_de_estudios INNER JOIN carrera ON (fk_carrera=id_carrera) WHERE estado_plan=1;";
    const INSERTAR_PLAN_DE_ESTUDIOS= "INSERT INTO plan_de_estudios(fk_carrera,resolucion,fecha,horas_catedra,horas_reloj,duracion) VALUES (?,?,?,?,?,?);";
    const ACTUALIZAR_PLAN= "UPDATE plan_de_estudios SET fk_carrera=?,resolucion=?,fecha=?,horas_catedra=?,horas_reloj=?,duracion=? WHERE id_plan=?;";
    const BUSCAR_ULTIMO_PLAN= "SELECT plan_de_estudios.*,carrera.nombre_carrera FROM plan_de_estudios INNER JOIN carrera ON (fk_carrera=id_carrera) WHERE id_plan=(SELECT MAX(id_plan)FROM plan_de_estudios);";
    const ELIMINAR_PLAN= "UPDATE plan_de_estudios SET estado_plan=0 WHERE id_plan=?;";
    const BUSCAR_PLANESTUDIO = "SELECT plan_de_estudios.*,carrera.`nombre_carrera` FROM plan_de_estudios INNER JOIN carrera ON (fk_carrera=id_carrera) WHERE estado_plan=1 AND carrera.nombre_carrera LIKE '?%' OR plan_de_estudios.resolucion LIKE '?%';";
    //Materia
    const LISTAR_MATERIAS= "SELECT materia.*,plan_de_estudios.`fk_carrera`,plan_de_estudios.`resolucion`,carrera.`nombre_carrera` FROM materia INNER JOIN plan_de_estudios ON(fk_plan_de_estudio=id_plan) INNER JOIN carrera ON(fk_carrera=id_carrera) WHERE estado_materia=1 ORDER BY nombre_carrera,resolucion,semestre,nombre_materia;";
    const INSERTAR_MATERIA ="INSERT INTO materia(fk_plan_de_estudio,anio,nombre_materia,semestre,carga_horaria) VALUES (?,?,?,?,?);";
    const BUSCAR_ULTIMA_MATERIA= "SELECT materia.*,plan_de_estudios.`fk_carrera`,plan_de_estudios.`resolucion`,carrera.`nombre_carrera` FROM materia INNER JOIN plan_de_estudios ON(fk_plan_de_estudio=id_plan) INNER JOIN carrera ON(fk_carrera=id_carrera) WHERE estado_materia=1 and id_materia=(SELECT MAX(id_materia)FROM materia WHERE estado_materia=1);";
    const ACTUALIZAR_MATERIA= "UPDATE materia SET fk_plan_de_estudio=?,anio=?,nombre_materia=?,semestre=?,carga_horaria=? WHERE id_materia=?;";
    const ELIMINAR_MATERIA= "UPDATE materia SET estado_materia=0 WHERE id_materia=?;";
    const BUSCAR_PLAN = "SELECT duracion,id_plan FROM plan_de_estudios WHERE id_plan=?;";
    const BUSCAR_MATERIAS= "SELECT nombre_materia,id_materia,anio FROM materia WHERE fk_plan_de_estudio=? ORDER BY anio,nombre_materia;";
    const BUSCAR_MATERIA= "SELECT materia.*,plan_de_estudios.`fk_carrera`,plan_de_estudios.`resolucion`,carrera.`nombre_carrera` FROM materia INNER JOIN plan_de_estudios ON(fk_plan_de_estudio=id_plan) INNER JOIN carrera ON(fk_carrera=id_carrera) WHERE estado_materia=1 AND nombre_materia LIKE '?%' OR nombre_carrera LIKE '?%' ORDER BY nombre_carrera,resolucion,semestre,nombre_materia;";
    //Correlativas
    const LISTAR_CORRELATIVAS= "SELECT nombre_carrera,resolucion,materia_1.`nombre_materia`,correlativa.`nombre_materia` AS nombre_correlativa,materia_1.`id_materia`,correlativa.`id_materia` AS id_correlativa,fk_plan_de_estudios FROM correlativas INNER JOIN plan_de_estudios ON (fk_plan_de_estudios=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN materia AS materia_1 ON (fk_materia=materia_1.id_materia) INNER JOIN materia AS correlativa ON (fk_correlativa=correlativa.id_materia) WHERE estado_correlativa=1 ORDER BY nombre_carrera,resolucion,materia_1.nombre_materia,correlativa.nombre_materia;";
    const INSERTAR_CORRELATIVA= "INSERT INTO correlativas(fk_plan_de_estudios,fk_materia,fk_correlativa) VALUES (?,?,?);";
    const ACTUALIZAR_CORRELATIVA= "UPDATE correlativas SET fk_correlativa=? WHERE fk_plan_de_estudios=? AND fk_materia=? AND fk_correlativa=?;";
    const ELIMINAR_CORRELATIVA= "UPDATE correlativas SET estado_correlativa=0 WHERE fk_plan_de_estudios=? AND fk_materia=? AND fk_correlativa=?;";
    const BUSCAR_CORRELATIVAS= "SELECT anio,nombre_materia,fk_plan_de_estudio,nombre_carrera,resolucion,semestre,carga_horaria FROM correlativas INNER JOIN materia ON fk_correlativa=id_materia INNER JOIN plan_de_estudios ON fk_plan_de_estudio=id_plan INNER JOIN carrera ON fk_carrera=id_carrera WHERE estado_correlativa=1 AND fk_materia=? AND fk_plan_de_estudios=?;";
    const BUSCAR_MATERIA_2 = "SELECT nombre_materia,id_materia,anio FROM materia WHERE fk_plan_de_estudio=? AND id_materia!=? AND anio<=? ORDER BY anio,nombre_materia;";
    const BUSCAR_CORRELATIVA= "SELECT nombre_carrera,resolucion,materia_1.`nombre_materia`,correlativa.`nombre_materia` AS nombre_correlativa,materia_1.`id_materia`,correlativa.`id_materia` AS id_correlativa,fk_plan_de_estudios FROM correlativas INNER JOIN plan_de_estudios ON (fk_plan_de_estudios=id_plan) INNER JOIN carrera ON (fk_carrera=id_carrera) INNER JOIN materia AS materia_1 ON (fk_materia=materia_1.id_materia) INNER JOIN materia AS correlativa ON (fk_correlativa=correlativa.id_materia) WHERE estado_correlativa=1 AND nombre_carrera LIKE '?%' OR materia_1.nombre_materia LIKE '?%' ORDER BY nombre_carrera,resolucion,materia_1.nombre_materia,correlativa.nombre_materia;";
}
