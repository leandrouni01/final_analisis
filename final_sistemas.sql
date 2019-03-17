-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Versión del servidor:         10.1.31-MariaDB - mariadb.org binary distribution
-- SO del servidor:              Win32
-- HeidiSQL Versión:             10.1.0.5464
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;


-- Volcando estructura de base de datos para sistema_sedes
CREATE DATABASE IF NOT EXISTS `sistema_sedes` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `sistema_sedes`;

-- Volcando estructura para tabla sistema_sedes.año
CREATE TABLE IF NOT EXISTS `año` (
  `id_año` int(11) NOT NULL AUTO_INCREMENT,
  `numero` int(11) DEFAULT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_año`),
  UNIQUE KEY `numero` (`numero`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Volcando datos para la tabla sistema_sedes.año: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `año` DISABLE KEYS */;
REPLACE INTO `año` (`id_año`, `numero`, `estado`) VALUES
	(1, 1, 1),
	(2, 2, 1),
	(3, 3, 1);
/*!40000 ALTER TABLE `año` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.carrera
CREATE TABLE IF NOT EXISTS `carrera` (
  `id_carrera` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_carrera` varchar(50) CHARACTER SET latin1 NOT NULL,
  `estado_carrera` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_carrera`),
  UNIQUE KEY `nombre_carrera` (`nombre_carrera`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Volcando datos para la tabla sistema_sedes.carrera: ~5 rows (aproximadamente)
/*!40000 ALTER TABLE `carrera` DISABLE KEYS */;
REPLACE INTO `carrera` (`id_carrera`, `nombre_carrera`, `estado_carrera`) VALUES
	(1, 'Analisis', 1),
	(2, 'Fotografia', 1),
	(5, 'Abogacia', 1),
	(6, 'Teatro', 1),
	(8, 'Redes', 1);
/*!40000 ALTER TABLE `carrera` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.correlativas
CREATE TABLE IF NOT EXISTS `correlativas` (
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

-- Volcando datos para la tabla sistema_sedes.correlativas: ~17 rows (aproximadamente)
/*!40000 ALTER TABLE `correlativas` DISABLE KEYS */;
REPLACE INTO `correlativas` (`fk_plan_de_estudios`, `fk_materia`, `fk_correlativa`, `estado_correlativa`) VALUES
	(1, 4, 5, 1),
	(1, 4, 6, 1),
	(1, 4, 12, 1),
	(1, 6, 28, 1),
	(1, 7, 4, 1),
	(1, 7, 8, 1),
	(1, 7, 11, 1),
	(1, 9, 4, 1),
	(1, 15, 16, 1),
	(1, 18, 12, 1),
	(1, 20, 7, 1),
	(3, 34, 33, 1),
	(4, 19, 31, 1),
	(6, 35, 40, 1),
	(6, 37, 40, 1),
	(6, 39, 35, 1),
	(6, 39, 37, 1);
/*!40000 ALTER TABLE `correlativas` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.curso
CREATE TABLE IF NOT EXISTS `curso` (
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

-- Volcando datos para la tabla sistema_sedes.curso: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `curso` DISABLE KEYS */;
REPLACE INTO `curso` (`id_curso`, `fk_sede`, `fk_plan_de_estudios`, `nombre_curso`, `anio_curso`, `estado`) VALUES
	(1, 9, 1, '1A', 1, 1),
	(2, 9, 1, '1B', 1, 1),
	(3, 9, 1, '1C', 1, 1),
	(4, 9, 1, '2°A', 2, 1);
/*!40000 ALTER TABLE `curso` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.domicilio
CREATE TABLE IF NOT EXISTS `domicilio` (
  `id_domicilio` int(11) NOT NULL AUTO_INCREMENT,
  `calle_domicilio` varchar(60) NOT NULL,
  `numero_domicilio` int(11) NOT NULL,
  `fk_localidad` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_domicilio`),
  UNIQUE KEY `calle_domicilio_numero_domicilio_fk_localidad` (`calle_domicilio`,`numero_domicilio`,`fk_localidad`),
  KEY `fk_localidad` (`fk_localidad`),
  CONSTRAINT `domicilio_ibfk_1` FOREIGN KEY (`fk_localidad`) REFERENCES `localidad` (`id_localidad`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla sistema_sedes.domicilio: ~7 rows (aproximadamente)
/*!40000 ALTER TABLE `domicilio` DISABLE KEYS */;
REPLACE INTO `domicilio` (`id_domicilio`, `calle_domicilio`, `numero_domicilio`, `fk_localidad`, `estado`) VALUES
	(9, 'Vecindad', 1, 1, 1),
	(10, 'Silent Street', 23, 2, 0),
	(11, 'Roca', 214, 4, 1),
	(12, 'Dr. Moreno', 325, 2, 1),
	(13, 'Rodriguez', 248, 1, 1),
	(14, 'Godoy Cruz', 521, 1, 0),
	(15, 'San Martin', 4526, 5, 1);
/*!40000 ALTER TABLE `domicilio` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.horarios
CREATE TABLE IF NOT EXISTS `horarios` (
  `id_horario` int(11) NOT NULL AUTO_INCREMENT,
  `fk_profesor` int(11) DEFAULT NULL,
  `fk_materia` int(11) DEFAULT NULL,
  `inicio_horario` time NOT NULL,
  `fin_horario` time NOT NULL,
  `fk_curso` int(11) DEFAULT NULL,
  `dia_horario` enum('Lunes','Martes','Miercoles','Jueves','Viernes','Sabado') NOT NULL,
  `ciclo_lectivo_horario` int(5) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_horario`),
  UNIQUE KEY `fk_profesor_2` (`fk_profesor`,`inicio_horario`,`fin_horario`,`dia_horario`,`ciclo_lectivo_horario`),
  KEY `fk_profesor` (`fk_profesor`),
  KEY `fk_materia` (`fk_materia`),
  KEY `fk_curso` (`fk_curso`),
  CONSTRAINT `horarios_ibfk_1` FOREIGN KEY (`fk_profesor`) REFERENCES `profesor` (`id_profesor`),
  CONSTRAINT `horarios_ibfk_2` FOREIGN KEY (`fk_materia`) REFERENCES `materia` (`id_materia`),
  CONSTRAINT `horarios_ibfk_3` FOREIGN KEY (`fk_curso`) REFERENCES `curso` (`id_curso`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla sistema_sedes.horarios: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `horarios` DISABLE KEYS */;
REPLACE INTO `horarios` (`id_horario`, `fk_profesor`, `fk_materia`, `inicio_horario`, `fin_horario`, `fk_curso`, `dia_horario`, `ciclo_lectivo_horario`, `estado`) VALUES
	(1, 6, 4, '21:30:00', '22:30:00', 1, 'Lunes', 2008, 1),
	(2, 7, 5, '20:30:00', '20:40:00', 1, 'Lunes', 2008, 1),
	(3, 6, 4, '21:30:00', '22:30:00', 1, 'Lunes', 2018, 1);
/*!40000 ALTER TABLE `horarios` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.localidad
CREATE TABLE IF NOT EXISTS `localidad` (
  `id_localidad` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_localidad` varchar(30) CHARACTER SET latin1 NOT NULL,
  `fk_provincia` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_localidad`),
  UNIQUE KEY `nombre_localidad_fk_provincia` (`nombre_localidad`,`fk_provincia`),
  KEY `fk_provincia` (`fk_provincia`),
  CONSTRAINT `localidad_ibfk_1` FOREIGN KEY (`fk_provincia`) REFERENCES `provincia` (`id_provincia`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Volcando datos para la tabla sistema_sedes.localidad: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `localidad` DISABLE KEYS */;
REPLACE INTO `localidad` (`id_localidad`, `nombre_localidad`, `fk_provincia`, `estado`) VALUES
	(1, 'Capital', 1, 1),
	(2, 'Las Heras', 1, 1),
	(3, 'Maipu', 1, 1),
	(4, 'Godoy Cruz', 1, 1),
	(5, 'Tunuyan', 1, 1),
	(6, 'Lujan', 1, 1);
/*!40000 ALTER TABLE `localidad` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.materia
CREATE TABLE IF NOT EXISTS `materia` (
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

-- Volcando datos para la tabla sistema_sedes.materia: ~35 rows (aproximadamente)
/*!40000 ALTER TABLE `materia` DISABLE KEYS */;
REPLACE INTO `materia` (`id_materia`, `fk_plan_de_estudio`, `anio`, `nombre_materia`, `semestre`, `carga_horaria`, `estado_materia`) VALUES
	(4, 1, 1, 'Programacion I', 'anual', 124, 1),
	(5, 1, 1, 'Logica', 'anual', 12, 1),
	(6, 1, 1, 'Algebra', 'primer semestre', 24, 1),
	(7, 1, 1, 'Practica Profesional I', 'anual', 10, 1),
	(8, 1, 1, 'Analisis de Sistemas', 'segundo semestre', 2, 1),
	(9, 1, 2, 'Programacion II', 'anual', 1235, 1),
	(11, 1, 1, 'Arquitectura de las Computadoras', 'anual', 152, 1),
	(12, 1, 1, 'Ingles', 'anual', 1245, 1),
	(13, 1, 1, 'Comunicacion, Comprension y Produccion de Textos', 'anual', 70, 1),
	(14, 1, 1, 'Sistemas Administrativos Aplicados', 'anual', 60, 1),
	(15, 1, 2, 'Analisis Matematico', 'segundo semestre', 25, 1),
	(16, 1, 2, 'Matematica Discreta', 'primer semestre', 214, 1),
	(17, 1, 2, 'Comunicaciones y Redes', 'anual', 142, 1),
	(18, 1, 2, 'Ingles Tecninco I', 'anual', 142, 1),
	(19, 4, 1, 'Fotografia', 'anual', 142, 1),
	(20, 1, 2, 'Practica Profesional II', 'anual', 142, 1),
	(21, 1, 2, 'Base de Datos I', 'anual', 1245, 1),
	(28, 1, 1, 'Ninguna', 'anual', 0, 1),
	(29, 2, 1, 'Ninguna', 'anual', 0, 1),
	(30, 3, 1, 'Ninguna', 'anual', 0, 1),
	(31, 4, 1, 'Ninguna', 'anual', 0, 1),
	(32, 5, 1, 'Ninguna', 'anual', 0, 1),
	(33, 3, 1, 'Redes I', 'anual', 123, 1),
	(34, 3, 2, 'Redes II', 'anual', 321, 1),
	(35, 6, 1, 'Programacion 1', 'anual', 120, 1),
	(36, 6, 1, 'Logica', 'primer semestre', 60, 1),
	(37, 6, 1, 'Matematica', 'anual', 80, 1),
	(38, 6, 1, 'Comprension', 'segundo semestre', 80, 1),
	(39, 6, 2, 'Programacion 2', 'anual', 120, 1),
	(40, 6, 1, 'Ninguna', 'primer semestre', 20, 1),
	(52, 6, 1, 'Arquitectura', 'primer semestre', 15, 1),
	(53, 6, 1, 'Ingles', 'anual', 20, 1),
	(55, 6, 2, 'Ingles 2', 'anual', 23, 1),
	(56, 7, 5, 'Derecho', 'anual', 5000, 1),
	(57, 1, 3, 'Programacion 3', 'anual', 123, 1);
/*!40000 ALTER TABLE `materia` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.modulos
CREATE TABLE IF NOT EXISTS `modulos` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `hora_modulo` varchar(50) NOT NULL DEFAULT '0',
  `estado_modulo` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id_modulo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla sistema_sedes.modulos: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `modulos` DISABLE KEYS */;
REPLACE INTO `modulos` (`id_modulo`, `hora_modulo`, `estado_modulo`) VALUES
	(1, '19:30', 1),
	(2, '20:10', 1),
	(3, '20:50', 1),
	(4, '21:30', 1),
	(5, '22:10', 1),
	(6, '22:50', 1),
	(7, '23:30', 1);
/*!40000 ALTER TABLE `modulos` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.pais
CREATE TABLE IF NOT EXISTS `pais` (
  `id_pais` int(5) NOT NULL AUTO_INCREMENT,
  `nombre_pais` varchar(20) CHARACTER SET latin1 NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_pais`),
  UNIQUE KEY `nombre` (`nombre_pais`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Volcando datos para la tabla sistema_sedes.pais: ~15 rows (aproximadamente)
/*!40000 ALTER TABLE `pais` DISABLE KEYS */;
REPLACE INTO `pais` (`id_pais`, `nombre_pais`, `estado`) VALUES
	(1, 'Argentina', 1),
	(2, 'Brasil', 1),
	(3, 'Paraguay', 1),
	(37, 'Peru', 1),
	(39, 'Chile', 1),
	(40, 'Uruguay', 1),
	(41, 'Mexico', 1),
	(43, 'Bolivia', 1),
	(46, 'Hawai', 1),
	(48, 'Francia', 1),
	(49, 'Inglaterra', 1),
	(54, 'Canada', 1),
	(55, 'Colombia', 1),
	(57, 'China', 1),
	(58, 'Alemania', 1);
/*!40000 ALTER TABLE `pais` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.plan_de_estudios
CREATE TABLE IF NOT EXISTS `plan_de_estudios` (
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

-- Volcando datos para la tabla sistema_sedes.plan_de_estudios: ~8 rows (aproximadamente)
/*!40000 ALTER TABLE `plan_de_estudios` DISABLE KEYS */;
REPLACE INTO `plan_de_estudios` (`id_plan`, `fk_carrera`, `resolucion`, `fecha`, `horas_catedra`, `horas_reloj`, `duracion`, `estado_plan`) VALUES
	(1, 1, 4589, '1997-04-12', 1234, 4123, 3, 1),
	(2, 6, 1246, '1998-05-23', 1423, 4562, 3, 1),
	(3, 8, 3214, '1996-10-24', 1425, 4256, 3, 1),
	(4, 2, 12536, '2018-11-15', 1352, 6325, 3, 1),
	(5, 8, 321, '1996-10-24', 1425, 4256, 3, 1),
	(6, 1, 2040, '2019-02-26', 2900, 3000, 3, 1),
	(7, 5, 1425, '2019-02-28', 5000, 4900, 5, 1),
	(8, 2, 2154, '2019-03-07', 1, 2, 5, 1);
/*!40000 ALTER TABLE `plan_de_estudios` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.postgrado
CREATE TABLE IF NOT EXISTS `postgrado` (
  `id_postgrado` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_postgrado` varchar(70) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_postgrado`),
  UNIQUE KEY `nombre_postrgrado` (`nombre_postgrado`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla sistema_sedes.postgrado: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `postgrado` DISABLE KEYS */;
REPLACE INTO `postgrado` (`id_postgrado`, `nombre_postgrado`, `estado`) VALUES
	(1, 'Master en Base de datos', 1),
	(2, 'Ninguno', 1),
	(3, 'Encontrar a Cherryl', 1),
	(4, 'Regañar al chabo', 1);
/*!40000 ALTER TABLE `postgrado` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.profesor
CREATE TABLE IF NOT EXISTS `profesor` (
  `id_profesor` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_profesor` varchar(70) NOT NULL,
  `apellido_profesor` varchar(70) NOT NULL,
  `fk_titulo` int(11) DEFAULT NULL,
  `fk_postgrado` int(11) DEFAULT NULL,
  `fk_domicilio` int(11) DEFAULT NULL,
  `dni_profesor` int(11) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_profesor`),
  UNIQUE KEY `dni_profesor` (`dni_profesor`),
  KEY `fk_titulo` (`fk_titulo`),
  KEY `fk_postgrado` (`fk_postgrado`),
  KEY `fk_domicilio` (`fk_domicilio`),
  CONSTRAINT `profesor_ibfk_2` FOREIGN KEY (`fk_titulo`) REFERENCES `titulo` (`id_titulo`),
  CONSTRAINT `profesor_ibfk_3` FOREIGN KEY (`fk_postgrado`) REFERENCES `postgrado` (`id_postgrado`),
  CONSTRAINT `profesor_ibfk_4` FOREIGN KEY (`fk_domicilio`) REFERENCES `domicilio` (`id_domicilio`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla sistema_sedes.profesor: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `profesor` DISABLE KEYS */;
REPLACE INTO `profesor` (`id_profesor`, `nombre_profesor`, `apellido_profesor`, `fk_titulo`, `fk_postgrado`, `fk_domicilio`, `dni_profesor`, `estado`) VALUES
	(6, 'Profesor', 'Jirafales', 7, 4, 9, 12457896, 1),
	(7, 'Harry', 'Mason', 6, 3, 10, 12569847, 0),
	(8, '2', 'Cortez', 3, 1, 14, 0, 0);
/*!40000 ALTER TABLE `profesor` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.provincia
CREATE TABLE IF NOT EXISTS `provincia` (
  `id_provincia` int(5) NOT NULL AUTO_INCREMENT,
  `nombre_provincia` varchar(20) CHARACTER SET latin1 NOT NULL,
  `fk_pais` int(5) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_provincia`),
  UNIQUE KEY `nombre_provincia` (`nombre_provincia`,`fk_pais`),
  KEY `fk_pais` (`fk_pais`),
  CONSTRAINT `provincia_ibfk_1` FOREIGN KEY (`fk_pais`) REFERENCES `pais` (`id_pais`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_spanish_ci;

-- Volcando datos para la tabla sistema_sedes.provincia: ~7 rows (aproximadamente)
/*!40000 ALTER TABLE `provincia` DISABLE KEYS */;
REPLACE INTO `provincia` (`id_provincia`, `nombre_provincia`, `fk_pais`, `estado`) VALUES
	(1, 'Mendoza', 1, 1),
	(2, 'San Luis', 1, 1),
	(3, 'San Juan', 1, 1),
	(4, 'Cordoba', 1, 1),
	(7, 'Rio Negro', 1, 1),
	(8, 'Misiones', 1, 1),
	(9, 'Corrientes', 1, 1);
/*!40000 ALTER TABLE `provincia` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.sede
CREATE TABLE IF NOT EXISTS `sede` (
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

-- Volcando datos para la tabla sistema_sedes.sede: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `sede` DISABLE KEYS */;
REPLACE INTO `sede` (`id_sede`, `nombre_sede`, `numero_sede`, `telefono_sede`, `fk_domicilio`, `estado`) VALUES
	(7, 'Godoy Cruz', 1236, 4246237, 11, 1),
	(8, 'Las Heras', 5296, 153478155, 12, 1),
	(9, 'Ciudad', 6598, 4286173, 13, 1),
	(10, 'Malargúe', 41258, 4256314, 15, 1);
/*!40000 ALTER TABLE `sede` ENABLE KEYS */;

-- Volcando estructura para tabla sistema_sedes.titulo
CREATE TABLE IF NOT EXISTS `titulo` (
  `id_titulo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_titulo` varchar(70) NOT NULL,
  `estado` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`id_titulo`),
  UNIQUE KEY `nombre_titulo` (`nombre_titulo`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;

-- Volcando datos para la tabla sistema_sedes.titulo: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `titulo` DISABLE KEYS */;
REPLACE INTO `titulo` (`id_titulo`, `nombre_titulo`, `estado`) VALUES
	(1, 'Licenciado en Base de Datos', 1),
	(2, 'Programador', 1),
	(3, 'Ingeniero en Sistemas', 1),
	(5, 'Tecnico en Analisis y Programacion de Sistemas', 1),
	(6, 'Detective', 1),
	(7, 'Profesor de la vecindad', 1);
/*!40000 ALTER TABLE `titulo` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
