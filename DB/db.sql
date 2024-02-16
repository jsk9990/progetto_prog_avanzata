-- MySQL Script generated by MySQL Workbench
-- ven 16 feb 2024, 12:04:28
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Utente`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Utente` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Utente` (
  `id_utente` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(45) NOT NULL,
  `password` VARCHAR(45) NOT NULL,
  `Credito` INT NOT NULL,
  `privilegi` BOOLEAN NOT NULL, 
  `create_time` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_utente`))
COMMENT = 'Tabella dove saranno inseriti tutti i valori degli utenti del sistema';


-- -----------------------------------------------------
-- Table `mydb`.`Grafo`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Grafo` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Grafo` (
  `id_grafo` INT NOT NULL AUTO_INCREMENT,
  `id_utente` INT NOT NULL,
  `nome_grafo` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_grafo`),
  INDEX `id_utente_idx` (`id_utente` ASC) VISIBLE,
  CONSTRAINT `id_utente`
    FOREIGN KEY (`id_utente`)
    REFERENCES `mydb`.`Utente` (`id_utente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Tabella che rappresenta il grafo 		';


-- -----------------------------------------------------
-- Table `mydb`.`Nodi`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Nodi` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Nodi` (
  `id_nodi` INT NOT NULL AUTO_INCREMENT,
  `id_grafo` INT NOT NULL,
  `nodo_nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_nodi`),
  INDEX `id_grafo_idx` (`id_grafo` ASC) VISIBLE,
  CONSTRAINT `id_grafo`
    FOREIGN KEY (`id_grafo`)
    REFERENCES `mydb`.`Grafo` (`id_grafo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Tabella che rappresenta i nodi del grafo \n';


-- -----------------------------------------------------
-- Table `mydb`.`Archi`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Archi` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Archi` (
  `id_archi` INT NOT NULL AUTO_INCREMENT,
  `id_grafo` INT NULL,
  `id_nodo_partenza` INT NOT NULL,
  `id_nodo_arrivo` INT NOT NULL,
  `peso` FLOAT NOT NULL,
  PRIMARY KEY (`id_archi`),
  INDEX `id_grafo_idx` (`id_grafo` ASC) VISIBLE,
  INDEX `id_nodo_partenza_idx` (`id_nodo_partenza` ASC) VISIBLE,
  INDEX `id_nodo_arrivo_idx` (`id_nodo_arrivo` ASC) VISIBLE,
  CONSTRAINT `id_grafo`
    FOREIGN KEY (`id_grafo`)
    REFERENCES `mydb`.`Grafo` (`id_grafo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_nodo_partenza`
    FOREIGN KEY (`id_nodo_partenza`)
    REFERENCES `mydb`.`Nodi` (`id_nodi`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_nodo_arrivo`
    FOREIGN KEY (`id_nodo_arrivo`)
    REFERENCES `mydb`.`Nodi` (`id_nodi`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Tabella che memorizza informazioni sugli archi ';


-- -----------------------------------------------------
-- Table `mydb`.`Richieste`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Richieste` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Richieste` (
  `id_richieste` INT NOT NULL AUTO_INCREMENT,
  `id_utente` INT NOT NULL,
  `id_grafo` INT NOT NULL,
  `descrizione` VARCHAR(255) , 
  `modifiche` JSON NOT NULL,
  `stato_richiesta` ENUM('pendig','accettata', 'rifiutata') NOT NULL, DEFAULT 'pendig',
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_richieste`),
  INDEX `id_utente_idx` (`id_utente` ASC) VISIBLE,
  INDEX `id_grafo_idx` (`id_grafo` ASC) VISIBLE,
  CONSTRAINT `id_utente`
    FOREIGN KEY (`id_utente`)
    REFERENCES `mydb`.`Utente` (`id_utente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_grafo`
    FOREIGN KEY (`id_grafo`)
    REFERENCES `mydb`.`Grafo` (`id_grafo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Tabella che memorizza le richieste fatte sui grafi';


-- -----------------------------------------------------
-- Table `mydb`.`Simulazione`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Simulazione` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Simulazione` (
  `id_simulazione` INT NOT NULL AUTO_INCREMENT,
  `id_grafo` INT NOT NULL,
  `id_utente` INT NOT NULL,
  `start_peso` FLOAT NOT NULL,
  `stop_peso` FLOAT NOT NULL,
  `step` FLOAT NOT NULL,
  `costo` FLOAT NOT NULL,
  `timestamp` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_simulazione`),
  INDEX `id_grafo_idx` (`id_grafo` ASC) VISIBLE,
  INDEX `id_utente_idx` (`id_utente` ASC) VISIBLE,
  CONSTRAINT `id_grafo`
    FOREIGN KEY (`id_grafo`)
    REFERENCES `mydb`.`Grafo` (`id_grafo`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `id_utente`
    FOREIGN KEY (`id_utente`)
    REFERENCES `mydb`.`Utente` (`id_utente`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
COMMENT = 'Tabella per la gestione delle simulazioni ';

SET SQL_MODE = '';
DROP USER IF EXISTS jsk;
SET SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
CREATE USER 'jsk' IDENTIFIED BY 'jsk';

GRANT ALL ON `mydb`.* TO 'jsk';

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;