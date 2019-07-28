/*
SQLyog Ultimate v9.63 
MySQL - 5.5.5-10.1.31-MariaDB : Database - sistema_sedes
*********************************************************************
*/

/*!40101 SET NAMES utf8 */;

/*!40101 SET SQL_MODE=''*/;

/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
CREATE DATABASE /*!32312 IF NOT EXISTS*/`sistema_sedes` /*!40100 DEFAULT CHARACTER SET utf8 */;

USE `sistema_sedes`;

/*Table structure for table `alumno` */

DROP TABLE IF EXISTS `alumno`;

CREATE TABLE `alumno` (
  `id_alumno` int(11) NOT NULL AUTO_INCREMENT,
  `dni` int(8) NOT NULL,
  `legajo` int(6) DEFAULT NULL,
  `apellido` varchar(70) NOT NULL,
  `nombre` varchar(70) NOT NULL,
  `fk_domicilio` int(11) NOT NULL,
  `telefono` varchar(11) DEFAULT NULL,
  `correo` varchar(40) DEFAULT NULL,
  `estado` int(1) DEFAULT '1',
  PRIMARY KEY (`id_alumno`),
  KEY `fk_domicilio` (`fk_domicilio`),
  CONSTRAINT `alumno_ibfk_1` FOREIGN KEY (`fk_domicilio`) REFERENCES `domicilio` (`id_domicilio`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `alumno` */

insert  into `alumno`(`id_alumno`,`dni`,`legajo`,`apellido`,`nombre`,`fk_domicilio`,`telefono`,`correo`,`estado`) values (1,38307500,1,'Murgo','Leandro',16,'4252267','leandrouni01@gmail.com',1),(2,39081307,2,'Marin','Adrian',17,'4393882','adru_95_arg@hotmail.com',1),(3,38759180,3,'Valenzuela','Luciano',18,'4450865','lucianooo222@gmail.com',1),(4,19030528,4,'Perez','Gabriel',19,'2615961634','juan.gabriel.ps@gmail.com',1);

/*Table structure for table `asignacion` */

DROP TABLE IF EXISTS `asignacion`;

CREATE TABLE `asignacion` (
  `id_asignacion` int(11) NOT NULL AUTO_INCREMENT,
  `fk_espacio_curricular` int(11) DEFAULT NULL,
  `fk_profesor` int(11) DEFAULT NULL,
  `fecha_inicio` varchar(10) DEFAULT NULL,
  `fecha_fin` varchar(20) NOT NULL DEFAULT 'Sin especificar',
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_asignacion`),
  KEY `fk_profesor` (`fk_profesor`),
  KEY `asignacion_ibfk_1` (`fk_espacio_curricular`),
  CONSTRAINT `asignacion_ibfk_1` FOREIGN KEY (`fk_espacio_curricular`) REFERENCES `espacio_curricular` (`id_espacio_curricular`),
  CONSTRAINT `asignacion_ibfk_2` FOREIGN KEY (`fk_profesor`) REFERENCES `profesor` (`id_profesor`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `asignacion` */

insert  into `asignacion`(`id_asignacion`,`fk_espacio_curricular`,`fk_profesor`,`fecha_inicio`,`fecha_fin`,`estado`) values (1,1,1,'01-01-2007','31-12-2019',1);

/*Table structure for table `año` */

DROP TABLE IF EXISTS `año`;

CREATE TABLE `año` (
  `id_año` int(11) NOT NULL AUTO_INCREMENT,
  `numero` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_año`),
  UNIQUE KEY `numero` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `año` */

insert  into `año`(`id_año`,`numero`,`estado`) values (1,1,1),(2,2,1),(3,3,1);

/*Table structure for table `carrera` */

DROP TABLE IF EXISTS `carrera`;

CREATE TABLE `carrera` (
  `id_carrera` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_carrera` varchar(50) CHARACTER SET latin1 NOT NULL,
  `estado_carrera` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_carrera`),
  UNIQUE KEY `nombre_carrera` (`nombre_carrera`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `carrera` */

insert  into `carrera`(`id_carrera`,`nombre_carrera`,`estado_carrera`) values (1,'Analisis de Sistemas',1),(2,'Fotografia',1),(5,'Abogacia',1),(6,'Teatro',1),(8,'Redes y Telecomunicaciones',1),(9,'Arquitectura',1),(10,'Ingenieria Civil',1),(11,'Ingenieria en Mecatronica',1),(12,'Ingenieria Industrial',1),(13,'Astronomia',1),(14,'Gastronomia',1),(15,'Quinesiología',1),(16,'Medicina',1),(17,'Turismo',1),(18,'Higiene y Seguridad',1),(19,'Periodismo',1),(20,'Tecnico en Hemoterapia',1),(21,'Psicología',1),(22,'Radiología',1);

/*Table structure for table `correlativas` */

DROP TABLE IF EXISTS `correlativas`;

CREATE TABLE `correlativas` (
  `fk_plan_de_estudios` int(11) NOT NULL,
  `fk_materia` int(11) NOT NULL,
  `fk_correlativa` int(11) NOT NULL,
  `estado_correlativa` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`fk_plan_de_estudios`,`fk_materia`,`fk_correlativa`),
  UNIQUE KEY `fk_plan_de_estudios_fk_materia_fk_correlativa` (`fk_plan_de_estudios`,`fk_materia`,`fk_correlativa`),
  KEY `fk_materia` (`fk_materia`),
  KEY `fk_correlativa` (`fk_correlativa`),
  CONSTRAINT `correlativas_ibfk_1` FOREIGN KEY (`fk_plan_de_estudios`) REFERENCES `plan_de_estudios` (`id_plan`),
  CONSTRAINT `correlativas_ibfk_2` FOREIGN KEY (`fk_materia`) REFERENCES `materia` (`id_materia`),
  CONSTRAINT `correlativas_ibfk_3` FOREIGN KEY (`fk_correlativa`) REFERENCES `materia` (`id_materia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `correlativas` */

insert  into `correlativas`(`fk_plan_de_estudios`,`fk_materia`,`fk_correlativa`,`estado_correlativa`) values (1,4,5,1),(1,4,6,1),(1,4,12,1),(1,6,28,1),(1,7,4,1),(1,7,8,1),(1,7,11,1),(1,9,4,1),(1,15,16,1),(1,18,12,1),(1,20,7,1),(3,34,33,1),(4,19,31,1),(6,35,40,1),(6,37,40,1),(6,39,35,1),(6,39,37,1);

/*Table structure for table `curso` */

DROP TABLE IF EXISTS `curso`;

CREATE TABLE `curso` (
  `id_curso` int(10) NOT NULL AUTO_INCREMENT,
  `fk_sede` int(11) DEFAULT NULL,
  `fk_plan_de_estudios` int(11) DEFAULT NULL,
  `nombre_curso` varchar(10) NOT NULL,
  `anio_curso` int(1) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_curso`),
  UNIQUE KEY `fk_sede_fk_plan_de_estudios_nombre_curso_anio_curso` (`fk_sede`,`fk_plan_de_estudios`,`nombre_curso`,`anio_curso`),
  KEY `fk_sede` (`fk_sede`),
  KEY `fk_plan_de_estudios` (`fk_plan_de_estudios`),
  CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`fk_sede`) REFERENCES `sede` (`id_sede`),
  CONSTRAINT `curso_ibfk_2` FOREIGN KEY (`fk_plan_de_estudios`) REFERENCES `plan_de_estudios` (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

/*Data for the table `curso` */

insert  into `curso`(`id_curso`,`fk_sede`,`fk_plan_de_estudios`,`nombre_curso`,`anio_curso`,`estado`) values (1,9,1,'1°A',1,1),(2,9,1,'1°B',1,1),(3,9,1,'1°C',1,1),(4,9,1,'2°A',2,1);

/*Table structure for table `domicilio` */

DROP TABLE IF EXISTS `domicilio`;

CREATE TABLE `domicilio` (
  `id_domicilio` int(11) NOT NULL AUTO_INCREMENT,
  `calle_domicilio` varchar(60) NOT NULL,
  `numero_domicilio` int(11) NOT NULL,
  `fk_localidad` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_domicilio`),
  KEY `fk_localidad` (`fk_localidad`),
  CONSTRAINT `domicilio_ibfk_1` FOREIGN KEY (`fk_localidad`) REFERENCES `localidad` (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8;

/*Data for the table `domicilio` */

insert  into `domicilio`(`id_domicilio`,`calle_domicilio`,`numero_domicilio`,`fk_localidad`,`estado`) values (11,'Roca',214,4,1),(12,'Dr. Moreno',325,2,1),(13,'Rodriguez',248,1,1),(14,'Godoy Cruz',521,1,0),(15,'San Martin',4526,5,1),(16,'Juan de Dios Videla',752,1,1),(17,'Republica de Siria',665,4,1),(18,'Manuel A. Saez',2996,7,1),(19,'Olaya Pescara de Tomba',1029,4,1);

/*Table structure for table `espacio_curricular` */

DROP TABLE IF EXISTS `espacio_curricular`;

CREATE TABLE `espacio_curricular` (
  `id_espacio_curricular` int(11) NOT NULL AUTO_INCREMENT,
  `fk_materia` int(11) DEFAULT NULL,
  `fk_curso` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_espacio_curricular`),
  KEY `fk_materia` (`fk_materia`),
  KEY `fk_curso` (`fk_curso`),
  CONSTRAINT `espacio_curricular_ibfk_1` FOREIGN KEY (`fk_materia`) REFERENCES `materia` (`id_materia`),
  CONSTRAINT `espacio_curricular_ibfk_2` FOREIGN KEY (`fk_curso`) REFERENCES `curso` (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

/*Data for the table `espacio_curricular` */

insert  into `espacio_curricular`(`id_espacio_curricular`,`fk_materia`,`fk_curso`,`estado`) values (1,4,1,1),(2,19,2,1);

/*Table structure for table `horarios` */

DROP TABLE IF EXISTS `horarios`;

CREATE TABLE `horarios` (
  `id_horario` int(11) NOT NULL AUTO_INCREMENT,
  `fk_espacio_curricular` int(11) DEFAULT NULL,
  `fk_modulo_inicio` int(11) DEFAULT NULL,
  `fk_modulo_fin` int(11) NOT NULL,
  `ciclo_lectivo_horario` int(5) NOT NULL,
  `dia_horario` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_horario`),
  UNIQUE KEY `fk_profesor_2` (`fk_modulo_inicio`,`fk_modulo_fin`,`dia_horario`,`ciclo_lectivo_horario`,`fk_espacio_curricular`),
  KEY `fk_modulo_fin` (`fk_modulo_fin`),
  KEY `ciclo_lectivo_horario` (`ciclo_lectivo_horario`),
  KEY `fk_espacio_curricular` (`fk_espacio_curricular`),
  CONSTRAINT `horarios_ibfk_4` FOREIGN KEY (`fk_modulo_inicio`) REFERENCES `modulos` (`id_modulo`),
  CONSTRAINT `horarios_ibfk_5` FOREIGN KEY (`fk_modulo_fin`) REFERENCES `modulos` (`id_modulo`),
  CONSTRAINT `horarios_ibfk_6` FOREIGN KEY (`fk_espacio_curricular`) REFERENCES `espacio_curricular` (`id_espacio_curricular`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `horarios` */

insert  into `horarios`(`id_horario`,`fk_espacio_curricular`,`fk_modulo_inicio`,`fk_modulo_fin`,`ciclo_lectivo_horario`,`dia_horario`,`estado`) values (1,1,1,7,2019,'Jueves',1);

/*Table structure for table `localidad` */

DROP TABLE IF EXISTS `localidad`;

CREATE TABLE `localidad` (
  `id_localidad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_localidad` varchar(30) CHARACTER SET latin1 NOT NULL,
  `fk_provincia` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_localidad`),
  UNIQUE KEY `nombre_localidad_fk_provincia` (`nombre_localidad`,`fk_provincia`),
  KEY `fk_provincia` (`fk_provincia`),
  CONSTRAINT `localidad_ibfk_1` FOREIGN KEY (`fk_provincia`) REFERENCES `provincia` (`id_provincia`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `localidad` */

insert  into `localidad`(`id_localidad`,`nombre_localidad`,`fk_provincia`,`estado`) values (1,'Capital',1,1),(2,'Las Heras',1,1),(3,'Maipu',1,1),(4,'Godoy Cruz',1,1),(5,'Tunuyan',1,1),(6,'Lujan de Cuyo',1,1),(7,'Guaymallen',1,1),(8,'Junin',1,1),(9,'Tupungato',1,1),(10,'San Rafael',1,1),(11,'San Carlos',1,1),(12,'Rivadavia',1,1),(15,'Santa Rosa',1,1),(16,'Lavalle',1,1),(17,'San Martin',1,1),(19,'General Albear',1,1),(20,'Malargüe',1,1),(21,'La Paz',1,1),(22,'Palermo',10,1),(23,'Tigre',10,1),(24,'La Boca',10,1),(25,'Capital Federal',10,1),(26,'La Plata',10,1),(27,'Miramar',10,1);

/*Table structure for table `materia` */

DROP TABLE IF EXISTS `materia`;

CREATE TABLE `materia` (
  `id_materia` int(11) NOT NULL AUTO_INCREMENT,
  `fk_plan_de_estudio` int(11) DEFAULT NULL,
  `anio` int(11) NOT NULL,
  `nombre_materia` varchar(50) CHARACTER SET latin1 NOT NULL,
  `semestre` varchar(30) CHARACTER SET latin1 NOT NULL,
  `carga_horaria` int(11) NOT NULL,
  `estado_materia` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_materia`),
  UNIQUE KEY `fk_plan_de_estudio` (`fk_plan_de_estudio`,`nombre_materia`),
  CONSTRAINT `materia_ibfk_1` FOREIGN KEY (`fk_plan_de_estudio`) REFERENCES `plan_de_estudios` (`id_plan`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `materia` */

insert  into `materia`(`id_materia`,`fk_plan_de_estudio`,`anio`,`nombre_materia`,`semestre`,`carga_horaria`,`estado_materia`) values (4,1,1,'Programacion I','anual',124,1),(5,1,1,'Logica','anual',12,1),(6,1,1,'Algebra','primer semestre',24,1),(7,1,1,'Practica Profesional I','anual',10,1),(8,1,1,'Analisis de Sistemas','segundo semestre',2,1),(9,1,2,'Programacion II','anual',1235,1),(11,1,1,'Arquitectura de las Computadoras','anual',152,1),(12,1,1,'Ingles','anual',1245,1),(13,1,1,'Comunicacion, Comprension y Produccion de Textos','anual',70,1),(14,1,1,'Sistemas Administrativos Aplicados','anual',60,1),(15,1,2,'Analisis Matematico','segundo semestre',25,1),(16,1,2,'Matematica Discreta','primer semestre',214,1),(17,1,2,'Comunicaciones y Redes','anual',142,1),(18,1,2,'Ingles Tecninco I','anual',142,1),(19,4,1,'Fotografia','anual',142,1),(20,1,2,'Practica Profesional II','anual',142,1),(21,1,2,'Base de Datos I','anual',1245,1),(28,1,1,'Ninguna','anual',0,1),(29,2,1,'Ninguna','anual',0,1),(30,3,1,'Ninguna','anual',0,1),(31,4,1,'Ninguna','anual',0,1),(32,5,1,'Ninguna','anual',0,1),(33,3,1,'Redes I','anual',123,1),(34,3,2,'Redes II','anual',321,1),(35,6,1,'Programacion 1','anual',120,1),(36,6,1,'Logica','primer semestre',60,1),(37,6,1,'Matematica','anual',80,1),(38,6,1,'Comprension','segundo semestre',80,1),(39,6,2,'Programacion 2','anual',120,1),(40,6,1,'Ninguna','primer semestre',20,1),(52,6,1,'Arquitectura','primer semestre',15,1),(53,6,1,'Ingles','anual',20,1),(55,6,2,'Ingles 2','anual',23,1),(56,7,5,'Derecho','anual',5000,1),(57,1,3,'Programacion 3','anual',123,1);

/*Table structure for table `modulos` */

DROP TABLE IF EXISTS `modulos`;

CREATE TABLE `modulos` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `hora_modulo` varchar(50) NOT NULL DEFAULT '0',
  `estado_modulo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_modulo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

/*Data for the table `modulos` */

insert  into `modulos`(`id_modulo`,`hora_modulo`,`estado_modulo`) values (1,'19:30',1),(2,'20:10',1),(3,'20:50',1),(4,'21:30',1),(5,'22:10',1),(6,'22:50',1),(7,'23:30',1);

/*Table structure for table `pais` */

DROP TABLE IF EXISTS `pais`;

CREATE TABLE `pais` (
  `id_pais` int(5) NOT NULL AUTO_INCREMENT,
  `nombre_pais` varchar(20) CHARACTER SET latin1 NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_pais`),
  UNIQUE KEY `nombre` (`nombre_pais`)
) ENGINE=InnoDB AUTO_INCREMENT=62 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `pais` */

insert  into `pais`(`id_pais`,`nombre_pais`,`estado`) values (1,'Argentina',1),(2,'Brasil',1),(3,'Paraguay',1),(37,'Peru',1),(39,'Chile',1),(40,'Uruguay',1),(41,'Mexico',1),(43,'Bolivia',1),(48,'Francia',1),(49,'Inglaterra',1),(54,'Canada',1),(55,'Colombia',1),(57,'China',1),(58,'Alemania',1),(60,'Costa Rica',1),(61,'España',1);

/*Table structure for table `plan_de_estudios` */

DROP TABLE IF EXISTS `plan_de_estudios`;

CREATE TABLE `plan_de_estudios` (
  `id_plan` int(11) NOT NULL AUTO_INCREMENT,
  `fk_carrera` int(11) DEFAULT NULL,
  `resolucion` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `horas_catedra` int(11) NOT NULL,
  `horas_reloj` int(11) NOT NULL,
  `duracion` tinyint(4) NOT NULL,
  `estado_plan` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_plan`),
  UNIQUE KEY `resolucion` (`resolucion`),
  KEY `fk_carrera` (`fk_carrera`),
  CONSTRAINT `fk_carrera` FOREIGN KEY (`fk_carrera`) REFERENCES `carrera` (`id_carrera`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `plan_de_estudios` */

insert  into `plan_de_estudios`(`id_plan`,`fk_carrera`,`resolucion`,`fecha`,`horas_catedra`,`horas_reloj`,`duracion`,`estado_plan`) values (1,1,4589,'1997-04-12',1234,4123,3,1),(2,6,1246,'1998-05-23',1423,4562,3,1),(3,8,3214,'1996-10-24',1425,4256,3,1),(4,2,12536,'2018-11-15',1352,6325,3,1),(5,8,321,'1996-10-24',1425,4256,3,1),(6,1,2040,'2019-02-26',2900,3000,3,1),(7,5,1425,'2019-02-28',5000,4900,5,1),(8,2,2154,'2019-03-07',1,2,5,1);

/*Table structure for table `postgrado` */

DROP TABLE IF EXISTS `postgrado`;

CREATE TABLE `postgrado` (
  `id_postgrado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_postgrado` varchar(70) NOT NULL,
  `fk_titulo` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_postgrado`),
  UNIQUE KEY `nombre_postrgrado` (`nombre_postgrado`,`fk_titulo`),
  KEY `fk_titulo` (`fk_titulo`),
  CONSTRAINT `postgrado_ibfk_1` FOREIGN KEY (`fk_titulo`) REFERENCES `titulo` (`id_titulo`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8;

/*Data for the table `postgrado` */

insert  into `postgrado`(`id_postgrado`,`nombre_postgrado`,`fk_titulo`,`estado`) values (1,'Ninguno',1,1),(7,'Ninguno',2,1),(8,'Ninguno',3,1),(11,'Ninguno',5,1),(12,'Ninguno',6,1),(13,'Ninguno',7,1),(14,'Ninguno',8,1),(16,'Ninguno',9,1),(17,'Posgrado Experto en Big Data',1,1),(18,'Master en Data Managment',1,1),(19,'Master en Ingenieria de Software',2,1),(20,'Master en Tecnologías de la Informacion',2,1),(21,'Master en Gestion de Operaciones',3,1),(22,'Magister en Administracion de Sistemas',3,1),(23,'Magister en Administracion de Sistemas',5,1),(24,'Master en Ingenieria de Software',5,1),(25,'Master en Automatizacion Industrial',6,1),(26,'Master en Hidraulica Urbana',6,1),(27,'Master en Arquitectura y Urbanismo',7,1),(28,'Master en Arq. Diseño e Innovacion',7,1),(29,'Posgrado en Comunicacion Politica',8,1),(30,'Posgrado en Comunicacion Industrial',8,1),(31,'Master en Psicologia Infanto-juvenil',9,1),(32,'Master en Psicologia Cognitiva',9,1);

/*Table structure for table `pre_inscripcion` */

DROP TABLE IF EXISTS `pre_inscripcion`;

CREATE TABLE `pre_inscripcion` (
  `id_pre_inscripcion` int(11) NOT NULL AUTO_INCREMENT,
  `fk_plan` int(11) NOT NULL,
  `fk_sede` int(11) DEFAULT NULL,
  `fk_alumno` int(11) NOT NULL,
  `anio` int(4) DEFAULT NULL,
  `documentacion` varchar(10) NOT NULL,
  `estado` int(1) DEFAULT '1',
  PRIMARY KEY (`id_pre_inscripcion`),
  KEY `fk_plan` (`fk_plan`),
  KEY `fk_alumno` (`fk_alumno`),
  KEY `fk_sede` (`fk_sede`),
  CONSTRAINT `pre_inscripcion_ibfk_1` FOREIGN KEY (`fk_plan`) REFERENCES `plan_de_estudios` (`id_plan`),
  CONSTRAINT `pre_inscripcion_ibfk_2` FOREIGN KEY (`fk_alumno`) REFERENCES `alumno` (`id_alumno`),
  CONSTRAINT `pre_inscripcion_ibfk_3` FOREIGN KEY (`fk_sede`) REFERENCES `sede` (`id_sede`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `pre_inscripcion` */

insert  into `pre_inscripcion`(`id_pre_inscripcion`,`fk_plan`,`fk_sede`,`fk_alumno`,`anio`,`documentacion`,`estado`) values (1,1,NULL,1,2019,'Completa',1);

/*Table structure for table `profesor` */

DROP TABLE IF EXISTS `profesor`;

CREATE TABLE `profesor` (
  `id_profesor` int(11) NOT NULL AUTO_INCREMENT,
  `cuil` varchar(13) DEFAULT NULL,
  `nombre_profesor` varchar(70) NOT NULL,
  `apellido_profesor` varchar(70) NOT NULL,
  `fk_titulo` int(11) DEFAULT NULL,
  `fk_postgrado` int(11) DEFAULT NULL,
  `fk_domicilio` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_profesor`),
  KEY `fk_titulo` (`fk_titulo`),
  KEY `fk_postgrado` (`fk_postgrado`),
  KEY `fk_domicilio` (`fk_domicilio`),
  CONSTRAINT `profesor_ibfk_2` FOREIGN KEY (`fk_titulo`) REFERENCES `titulo` (`id_titulo`),
  CONSTRAINT `profesor_ibfk_3` FOREIGN KEY (`fk_postgrado`) REFERENCES `postgrado` (`id_postgrado`),
  CONSTRAINT `profesor_ibfk_4` FOREIGN KEY (`fk_domicilio`) REFERENCES `domicilio` (`id_domicilio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

/*Data for the table `profesor` */

insert  into `profesor`(`id_profesor`,`cuil`,`nombre_profesor`,`apellido_profesor`,`fk_titulo`,`fk_postgrado`,`fk_domicilio`,`estado`) values (1,'23-20123321-6','Alberto','Cortez',3,NULL,11,1);

/*Table structure for table `provincia` */

DROP TABLE IF EXISTS `provincia`;

CREATE TABLE `provincia` (
  `id_provincia` int(5) NOT NULL AUTO_INCREMENT,
  `nombre_provincia` varchar(20) CHARACTER SET latin1 NOT NULL,
  `fk_pais` int(5) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_provincia`),
  UNIQUE KEY `nombre_provincia` (`nombre_provincia`,`fk_pais`),
  KEY `fk_pais` (`fk_pais`),
  CONSTRAINT `provincia_ibfk_1` FOREIGN KEY (`fk_pais`) REFERENCES `pais` (`id_pais`)
) ENGINE=InnoDB AUTO_INCREMENT=40 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `provincia` */

insert  into `provincia`(`id_provincia`,`nombre_provincia`,`fk_pais`,`estado`) values (1,'Mendoza',1,1),(2,'San Luis',1,1),(3,'San Juan',1,1),(4,'Cordoba',1,1),(7,'Rio Negro',1,1),(8,'Misiones',1,1),(9,'Corrientes',1,1),(10,'Buenos Aires',1,1),(11,'Entre Rios',1,1),(12,'Jujuy',1,1),(13,'Chubut',1,1),(14,'La Pampa',1,1),(16,'Santa Cruz',1,1),(17,'Tierra del Fuego',1,1),(18,'Chaco',1,1),(19,'Formosa',1,1),(20,'La Rioja',1,1),(21,'Neuquén',1,1),(24,'Salta',1,1),(25,'Santiago del Estero',1,1),(26,'Tucumán',1,1),(27,'Santiago',39,1),(28,'Valparaiso',39,1),(29,'Tarapaca',39,1),(30,'Antofagasta',39,1),(31,'Atacama',39,1),(32,'Coquimbo',39,1),(33,'Libertador O\'Higgins',39,1),(34,'Maule',39,1),(35,'Concepcion',39,1),(36,'Araucania',39,1),(37,'Magallanes',39,1),(38,'Los Rios',39,1),(39,'Arica y Parinacota',39,1);

/*Table structure for table `sede` */

DROP TABLE IF EXISTS `sede`;

CREATE TABLE `sede` (
  `id_sede` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_sede` varchar(30) CHARACTER SET latin1 DEFAULT NULL,
  `numero_sede` int(11) DEFAULT NULL,
  `telefono_sede` int(11) DEFAULT NULL,
  `fk_domicilio` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_sede`),
  UNIQUE KEY `numero_sede_fk_domicilio` (`numero_sede`,`fk_domicilio`),
  KEY `fk_domicilio` (`fk_domicilio`),
  CONSTRAINT `sede_ibfk_1` FOREIGN KEY (`fk_domicilio`) REFERENCES `domicilio` (`id_domicilio`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

/*Data for the table `sede` */

insert  into `sede`(`id_sede`,`nombre_sede`,`numero_sede`,`telefono_sede`,`fk_domicilio`,`estado`) values (7,'Godoy Cruz',1236,4246237,11,1),(8,'Las Heras',5296,153478155,12,1),(9,'Ciudad',6598,4286173,13,1),(10,'Malargüe',41258,4256314,15,1);

/*Table structure for table `titulo` */

DROP TABLE IF EXISTS `titulo`;

CREATE TABLE `titulo` (
  `id_titulo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_titulo` varchar(70) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_titulo`),
  UNIQUE KEY `nombre_titulo` (`nombre_titulo`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

/*Data for the table `titulo` */

insert  into `titulo`(`id_titulo`,`nombre_titulo`,`estado`) values (1,'Licenciado en Base de Datos',1),(2,'Programador',1),(3,'Ingeniero en Sistemas',1),(5,'Tecnico en Analisis y Programacion de Sistemas',1),(6,'Ingeniero Civil',1),(7,'Arquitecto',1),(8,'Tecnico en Telecomunicaciones',1),(9,'Psicologo',1);

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
