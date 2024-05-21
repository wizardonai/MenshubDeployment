create database menshub;

use menshub;

CREATE TABLE `allergeni` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` varchar(255) NOT NULL
);

INSERT INTO
  `allergeni` (`nome`)
VALUES
  ('glutine'),
  ('latticini'),
  ('uova'),
  ('soia'),
  ('sesamo'),
  ('noci'),
  ('sedano'),
  ('senape'),
  ('aglio'),
  ('frutta a guscio'),
  ('pesce'),
  ('arachidi'),
  ('lupino'),
  ('molluschi');

CREATE TABLE `categorie` (
  `id` int(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `nome` varchar(255) NOT NULL,
  `indirizzo_img` varchar(255) NOT NULL
);

INSERT INTO
  `categorie` (`nome`, `indirizzo_img`)
VALUES
  ('antipasto', 'categories/antipasto.webp'),
  ('primo', 'categories/primo.webp'),
  ('secondo', 'categories/secondo.webp'),
  ('contorno', 'categories/contorno.webp'),
  ('dolce', 'categories/dolce.webp'),
  ('bibita', 'categories/bibita.webp');

CREATE TABLE `mense` (
  `id` int(11) AUTO_INCREMENT primary key,
  `nome` varchar(50) NOT NULL,
  `indirizzo` varchar(100) NOT NULL,
  `regione` varchar(100) NOT NULL,
  `provincia` VARCHAR(100) NOT NULL,
  `comune` VARCHAR(100) NOT NULL,
  `cap` INT NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefono` varchar(20) NOT NULL,
  `verificato` tinyint(1) NOT NULL DEFAULT 0 
);

INSERT INTO
  `mense` (`id`, `nome`, `indirizzo`,`regione`,`provincia`,`comune`,`cap`,`email`,`telefono`, `verificato`)
VALUES
  (1, 'Mensa Planck', 'Via Franchini, 2','Veneto','Treviso','Villorba',31020,'mensaplanck@gmail.com','3285574653', 1);


CREATE TABLE `utenti` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `nome` varchar(50) NOT NULL,
  `cognome` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `id_mensa` int(11) DEFAULT NULL,
  `cliente` tinyint(1) NOT NULL
);
ALTER TABLE
  `utenti`
ADD
  CONSTRAINT `utenti_ibfk_1` FOREIGN KEY (`id_mensa`) REFERENCES `mense` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;

INSERT INTO `utenti` (`id`, `nome`, `cognome`, `email`, `password`, `id_mensa`, `cliente`) VALUES
(1, 'Simone', 'Lapomarda', 'simolapomarda@gmail.com', 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3', 1, 1);


CREATE TABLE `ordini` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `id_mensa` int(11),
  `data` datetime DEFAULT NULL,
  `ora_consegna` time DEFAULT '00:00:00',
  `stato_ordine` varchar(255) DEFAULT NULL,
  `pagato` tinyint(1) DEFAULT 0,
  `id_utente` int(11) 
);

ALTER TABLE
  `ordini`
ADD
  CONSTRAINT `fk_ordini_utenti` FOREIGN KEY (`id_utente`) REFERENCES `utenti` (`id`)
  ON DELETE SET NULL ON UPDATE CASCADE,
ADD
  CONSTRAINT `ordini_ibfk_1` FOREIGN KEY (`id_mensa`) REFERENCES `mense` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (5679, 1, '2024-01-25 15:37:01', 'in corso', 1, '14:00:00', 1),
  (5680, 1, '2024-01-26 10:15:00', 'in corso', 1, '12:30:00', 1),
  (5681, 1, '2024-01-27 12:30:00', 'da fare', 1, '11:45:00', 0),
  (5682, 1, '2024-01-28 18:45:00', 'in corso', 1, '17:00:00', 1),
  (5683, 1, '2024-01-29 14:20:00', 'da fare', 1, '13:15:00', 0),
  (5684, 1, '2024-01-30 09:00:00', 'in corso', 1, '20:00:00', 1),
  (5685, 1, '2024-01-31 16:10:00', 'da fare', 1, '09:30:00', 0),
  (5686, 1, '2024-02-01 11:45:00', 'in corso', 1, '15:45:00', 1),
  (5687, 1, '2024-02-02 13:55:00', 'da fare', 1, '18:20:00', 0),
  (5688, 1, '2024-02-03 17:30:00', 'da fare', 1, '16:00:00', 1);

-- Gennaio 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6000, 1, '2023-01-01 08:00:00', 'completato', 1, '12:30:00', 1),
  (6001, 1, '2023-01-08 09:15:00', 'completato', 1, '13:00:00', 1),
  (6002, 1, '2023-01-15 10:30:00', 'completato', 1, '13:30:00', 1),
  (6003, 1, '2023-01-22 11:45:00', 'completato', 1, '14:00:00', 1),
  (6004, 1, '2023-01-29 12:00:00', 'completato', 1, '14:30:00', 1);

-- Febbraio 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6005, 1, '2023-02-05 13:15:00', 'completato', 1, '12:45:00', 1),
  (6006, 1, '2023-02-12 14:30:00', 'completato', 1, '13:15:00', 1),
  (6007, 1, '2023-02-19 15:45:00', 'completato', 1, '13:45:00', 1),
  (6008, 1, '2023-02-26 16:00:00', 'completato', 1, '14:00:00', 1);

-- Marzo 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6009, 1, '2023-03-05 17:15:00', 'completato', 1, '12:30:00', 1),
  (6010, 1, '2023-03-12 18:30:00', 'completato', 1, '13:00:00', 1),
  (6011, 1, '2023-03-19 19:45:00', 'completato', 1, '13:30:00', 1),
  (6012, 1, '2023-03-26 20:00:00', 'completato', 1, '14:00:00', 1);

-- Aprile 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6013, 1, '2023-04-02 08:00:00', 'completato', 1, '12:45:00', 1),
  (6014, 1, '2023-04-09 09:15:00', 'completato', 1, '13:15:00', 1),
  (6015, 1, '2023-04-16 10:30:00', 'completato', 1, '13:45:00', 1),
  (6016, 1, '2023-04-23 11:45:00', 'completato', 1, '14:00:00', 1),
  (6017, 1, '2023-04-30 12:00:00', 'completato', 1, '14:30:00', 1);

-- Maggio 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6018, 1, '2023-05-07 13:15:00', 'completato', 1, '12:45:00', 1),
  (6019, 1, '2023-05-14 14:30:00', 'completato', 1, '13:15:00', 1),
  (6020, 1, '2023-05-21 15:45:00', 'completato', 1, '13:45:00', 1),
  (6021, 1, '2023-05-28 16:00:00', 'completato', 1, '14:00:00', 1);

-- Giugno 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6022, 1, '2023-06-04 17:15:00', 'completato', 1, '12:30:00', 1),
  (6023, 1, '2023-06-11 18:30:00', 'completato', 1, '13:00:00', 1),
  (6024, 1, '2023-06-18 19:45:00', 'completato', 1, '13:30:00', 1),
  (6025, 1, '2023-06-25 20:00:00', 'completato', 1, '14:00:00', 1);

-- Luglio 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6026, 1, '2023-07-02 08:00:00', 'completato', 1, '12:45:00', 1),
  (6027, 1, '2023-07-09 09:15:00', 'completato', 1, '13:15:00', 1),
  (6028, 1, '2023-07-16 10:30:00', 'completato', 1, '13:45:00', 1),
  (6029, 1, '2023-07-23 11:45:00', 'completato', 1, '14:00:00', 1),
  (6030, 1, '2023-07-30 12:00:00', 'completato', 1, '14:30:00', 1);

-- Agosto 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6031, 1, '2023-08-06 13:15:00', 'completato', 1, '12:45:00', 1),
  (6032, 1, '2023-08-13 14:30:00', 'completato', 1, '13:15:00', 1),
  (6033, 1, '2023-08-20 15:45:00', 'completato', 1, '13:45:00', 1),
  (6034, 1, '2023-08-27 16:00:00', 'completato', 1, '14:00:00', 1);

-- Settembre 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6035, 1, '2023-09-03 17:15:00', 'completato', 1, '12:30:00', 1),
  (6036, 1, '2023-09-10 18:30:00', 'completato', 1, '13:00:00', 1),
  (6037, 1, '2023-09-17 19:45:00', 'completato', 1, '13:30:00', 1),
  (6038, 1, '2023-09-24 20:00:00', 'completato', 1, '14:00:00', 1);

-- Ottobre 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6039, 1, '2023-10-01 08:00:00', 'completato', 1, '12:45:00', 1),
  (6040, 1, '2023-10-08 09:15:00', 'completato', 1, '13:15:00', 1),
  (6041, 1, '2023-10-15 10:30:00', 'completato', 1, '13:45:00', 1),
  (6042, 1, '2023-10-22 11:45:00', 'completato', 1, '14:00:00', 1),
  (6043, 1, '2023-10-29 12:00:00', 'completato', 1, '14:30:00', 1);

-- Novembre 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6044, 1, '2023-11-05 13:15:00', 'completato', 1, '12:45:00', 1),
  (6045, 1, '2023-11-12 14:30:00', 'completato', 1, '13:15:00', 1),
  (6046, 1, '2023-11-19 15:45:00', 'completato', 1, '13:45:00', 1),
  (6047, 1, '2023-11-26 16:00:00', 'completato', 1, '14:00:00', 1);

-- Dicembre 2023
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6048, 1, '2023-12-03 17:15:00', 'completato', 1, '12:30:00', 1),
  (6049, 1, '2023-12-10 18:30:00', 'completato', 1, '13:00:00', 1),
  (6050, 1, '2023-12-17 19:45:00', 'completato', 1, '13:30:00', 1),
  (6051, 1, '2023-12-24 20:00:00', 'completato', 1, '14:00:00', 1),
  (6052, 1, '2023-12-31 12:00:00', 'completato', 1, '14:30:00', 1);

-- Gennaio 2024 
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6053, 1, '2024-01-07 13:15:00', 'completato', 1, '12:45:00', 1),
  (6054, 1, '2024-01-14 14:30:00', 'completato', 1, '13:15:00', 1),
  (6055, 1, '2024-01-21 15:45:00', 'completato', 1, '13:45:00', 1),
  (6056, 1, '2024-01-28 16:00:00', 'completato', 1, '14:00:00', 1);

-- Febbraio 2024
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6057, 1, '2024-02-04 17:15:00', 'completato', 1, '12:30:00', 1),
  (6058, 1, '2024-02-11 18:30:00', 'completato', 1, '13:00:00', 1),
  (6059, 1, '2024-02-18 19:45:00', 'completato', 1, '13:30:00', 1),
  (6060, 1, '2024-02-25 20:00:00', 'completato', 1, '14:00:00', 1);

-- Marzo 2024
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6061, 1, '2024-03-03 08:00:00', 'completato', 1, '12:45:00', 1),
  (6062, 1, '2024-03-10 09:15:00', 'completato', 1, '13:15:00', 1),
  (6063, 1, '2024-03-17 10:30:00', 'completato', 1, '13:45:00', 1),
  (6064, 1, '2024-03-24 11:45:00', 'completato', 1, '14:00:00', 1),
  (6065, 1, '2024-03-31 12:00:00', 'completato', 1, '14:30:00', 1);

-- Aprile 2024
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6066, 1, '2024-04-07 13:15:00', 'completato', 1, '12:45:00', 1),
  (6067, 1, '2024-04-14 14:30:00', 'completato', 1, '13:15:00', 1),
  (6068, 1, '2024-04-21 15:45:00', 'completato', 1, '13:45:00', 1),
  (6069, 1, '2024-04-28 16:00:00', 'completato', 1, '14:00:00', 1);

-- Maggio 2024
INSERT INTO ordini (id, id_mensa, data, stato_ordine, id_utente, ora_consegna, pagato)
VALUES
  (6070, 1, '2024-05-05 17:15:00', 'completato', 1, '12:30:00', 1),
  (6071, 1, '2024-05-12 18:30:00', 'completato', 1, '13:00:00', 1),
  (6072, 1, '2024-05-19 19:45:00', 'completato', 1, '13:30:00', 1),
  (6073, 1, '2024-05-26 20:00:00', 'completato', 1, '14:00:00', 1);


CREATE TABLE `prodotti` (
  `id` int(11) AUTO_INCREMENT PRIMARY KEY,
  `nome` varchar(100) NOT NULL,
  `descrizione` text NOT NULL,
  `allergeni` varchar(255) NOT NULL,
  `prezzo` decimal(10, 2) NOT NULL,
  `categoria` varchar(50) NOT NULL,
  `indirizzo_img` varchar(255) NOT NULL,
  `disponibile` tinyint(1) NOT NULL,
  `nacq` int(11) NOT NULL,
  `id_mensa` int(11)
);

ALTER TABLE
  `prodotti`
ADD
  CONSTRAINT `prodotti_ibfk_1` FOREIGN KEY (`id_mensa`) REFERENCES `mense` (`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;

  INSERT INTO
  `prodotti` (
    `nome`,
    `descrizione`,
    `allergeni`,
    `prezzo`,
    `categoria`,
    `indirizzo_img`,
    `disponibile`,
    `nacq`,
    `id_mensa`
  )
VALUES
  (
    'Paninazzo',
    'Panino con la mortadella',
    'glutine, sesamo',
    4.50,
    'secondo',
    'products/paninomortazza.webp',
    1,
    7,
    1
  ),
  (
    'Carbonara',
    'Pasta alla carbonara',
    'uova, latticini, glutine',
    8.90,
    'primo',
    'products/carbonara.webp',
    1,
    14,
    1
  ),
  (
    'Cotoletta con le patatine',
    'Cotoletta di pollo accompagnata da delle patatine fritte',
    'uova, glutine, latticini, soia, sesamo',
    11.20,
    'secondo',
    'products/cotoletta.webp',
    1,
    8,
    1
  ),
  (
    'Spaghetti all arrabbiata',
    'Piatto di spaghetti condito con pomodoro e peperoncino',
    'glutine, aglio, peperoncino',
    8.90,
    'primo',
    'products/spaghettiArrabbiata.webp',
    1,
    6,
    1
  ),
  (
    'Panna cotta',
    'Panna cotta condita con caramello e granella di nocciola',
    'latticini, uova, gelatina, frutta a guscio',
    4.50,
    'dolce',
    'products/pannacotta.webp',
    1,
    11,
    1
  ),
  (
    'Insalata',
    'Insalata, salsa yogurt e aceto balsamico',
    'glutine, latticini, noci, soia, sedano, uova',
    7.30,
    'contorno',
    'products/insalata.webp',
    1,
    15,
    1
  ),
  (
    'Tar tar di manzo',
    'Carne di manzo di alta qualità. 100% Made in Italy',
    ' glutine, uova, senape, cipolla, latticini',
    6.40,
    'antipasto',
    'products/tartare.webp',
    1,
    10,
    1
  );

CREATE TABLE `prodotti_ordini` (
  `id_prodotto` int(11) NOT NULL,
  `id_ordine` int(11) NOT NULL,
  `quantita` int(11) NOT NULL,
  primary key(`id_prodotto`,`id_ordine`)
);


ALTER TABLE
  `prodotti_ordini`
ADD
  CONSTRAINT `prodotti_ordini_ibfk_1` FOREIGN KEY (`id_prodotto`) REFERENCES `prodotti` (`id`) ON DELETE CASCADE,
ADD
  CONSTRAINT `prodotti_ordini_ibfk_2` FOREIGN KEY (`id_ordine`) REFERENCES `ordini` (`id`) ON DELETE CASCADE;


INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 5679, 2),
  (2, 5679, 1),
  (5, 5679, 1),
  (6, 5679, 2),
  (7, 5679, 1),
  (1, 5680, 1),
  (3, 5680, 4),
  (5, 5680, 3),
  (6, 5680, 1),
  (7, 5680, 1),
  (1, 5681, 2),
  (2, 5681, 6),
  (3, 5681, 1),
  (4, 5681, 1),
  (5, 5681, 1),
  (6, 5681, 2),
  (7, 5681, 1),
  (1, 5682, 1),
  (2, 5682, 1),
  (6, 5682, 1),
  (7, 5682, 3),
  (1, 5683, 3),
  (2, 5683, 1),
  (3, 5683, 1),
  (4, 5683, 2),
  (5, 5683, 1),
  (6, 5683, 1),
  (7, 5683, 1),
  (1, 5684, 1),
  (2, 5684, 1),
  (4, 5684, 1),
  (5, 5684, 4),
  (6, 5684, 1),
  (7, 5684, 1),
  (1, 5685, 5),
  (2, 5685, 1),
  (3, 5685, 1),
  (6, 5685, 1),
  (7, 5685, 1),
  (1, 5686, 1),
  (2, 5686, 1),
  (3, 5686, 1),
  (4, 5686, 1),
  (3, 5687, 1),
  (4, 5687, 6),
  (5, 5687, 1),
  (6, 5687, 1),
  (7, 5687, 1),
  (1, 5688, 1),
  (2, 5688, 1),
  (3, 5688, 1),
  (7, 5688, 1);

  -- Gennaio 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6000, 2),
  (2, 6000, 1),
  (5, 6000, 1),
  (6, 6000, 2),
  (7, 6000, 1),
  (1, 6001, 1),
  (3, 6001, 4),
  (5, 6001, 3),
  (6, 6001, 1),
  (7, 6001, 1),
  (1, 6002, 2),
  (2, 6002, 6),
  (3, 6002, 1),
  (4, 6002, 1),
  (5, 6002, 1),
  (6, 6002, 2),
  (7, 6002, 1),
  (1, 6003, 1),
  (2, 6003, 1),
  (6, 6003, 1),
  (7, 6003, 3),
  (1, 6004, 3),
  (2, 6004, 1),
  (3, 6004, 1),
  (4, 6004, 2),
  (5, 6004, 1),
  (6, 6004, 1),
  (7, 6004, 1);

  -- Febbraio 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6005, 2),
  (2, 6005, 1),
  (5, 6005, 1),
  (6, 6005, 2),
  (7, 6005, 1),
  (1, 6006, 1),
  (3, 6006, 4),
  (5, 6006, 3),
  (6, 6006, 1),
  (7, 6006, 1),
  (1, 6007, 2),
  (2, 6007, 6),
  (3, 6007, 1),
  (4, 6007, 1),
  (5, 6007, 1),
  (6, 6007, 2),
  (7, 6007, 1),
  (1, 6008, 1),
  (2, 6008, 1),
  (6, 6008, 1),
  (7, 6008, 3);

  -- Marzo 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6009, 2),
  (2, 6009, 1),
  (5, 6009, 1),
  (6, 6009, 2),
  (7, 6009, 1),
  (1, 6010, 1),
  (3, 6010, 4),
  (5, 6010, 3),
  (6, 6010, 1),
  (7, 6010, 1),
  (1, 6011, 2),
  (2, 6011, 6),
  (3, 6011, 1),
  (4, 6011, 1),
  (5, 6011, 1),
  (6, 6011, 2),
  (7, 6011, 1),
  (1, 6012, 1),
  (2, 6012, 1),
  (6, 6012, 1),
  (7, 6012, 3);

  -- Aprile 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6013, 2),
  (2, 6013, 1),
  (5, 6013, 1),
  (6, 6013, 2),
  (7, 6013, 1),
  (1, 6014, 1),
  (3, 6014, 4),
  (5, 6014, 3),
  (6, 6014, 1),
  (7, 6014, 1),
  (1, 6015, 2),
  (2, 6015, 6),
  (3, 6015, 1),
  (4, 6015, 1),
  (5, 6015, 1),
  (6, 6015, 2),
  (7, 6015, 1),
  (1, 6016, 1),
  (2, 6016, 1),
  (6, 6016, 1),
  (7, 6016, 3),
  (1, 6017, 3),
  (2, 6017, 1),
  (3, 6017, 1),
  (4, 6017, 2),
  (5, 6017, 1),
  (6, 6017, 1),
  (7, 6017, 1);

  -- Maggio 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6018, 2),
  (2, 6018, 1),
  (5, 6018, 1),
  (6, 6018, 2),
  (7, 6018, 1),
  (1, 6019, 1),
  (3, 6019, 4),
  (5, 6019, 3),
  (6, 6019, 1),
  (7, 6019, 1),
  (1, 6020, 2),
  (2, 6020, 6),
  (3, 6020, 1),
  (4, 6020, 1),
  (5, 6020, 1),
  (6, 6020, 2),
  (7, 6020, 1),
  (1, 6021, 1),
  (2, 6021, 1),
  (6, 6021, 1),
  (7, 6021, 3);

  -- Giugno 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6022, 2),
  (2, 6022, 1),
  (5, 6022, 1),
  (6, 6022, 2),
  (7, 6022, 1),
  (1, 6023, 1),
  (3, 6023, 4),
  (5, 6023, 3),
  (6, 6023, 1),
  (7, 6023, 1),
  (1, 6024, 2),
  (2, 6024, 6),
  (3, 6024, 1),
  (4, 6024, 1),
  (5, 6024, 1),
  (6, 6024, 2),
  (7, 6024, 1),
  (1, 6025, 1),
  (2, 6025, 1),
  (6, 6025, 1),
  (7, 6025, 3);

  -- Luglio 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6026, 2),
  (2, 6026, 1),
  (5, 6026, 1),
  (6, 6026, 2),
  (7, 6026, 1),
  (1, 6027, 1),
  (3, 6027, 4),
  (5, 6027, 3),
  (6, 6027, 1),
  (7, 6027, 1),
  (1, 6028, 2),
  (2, 6028, 6),
  (3, 6028, 1),
  (4, 6028, 1),
  (5, 6028, 1),
  (6, 6028, 2),
  (7, 6028, 1),
  (1, 6029, 1),
  (2, 6029, 1),
  (6, 6029, 1),
  (7, 6029, 3);

  -- Agosto 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6030, 2),
  (2, 6030, 1),
  (5, 6030, 1),
  (6, 6030, 2),
  (7, 6030, 1),
  (1, 6031, 1),
  (3, 6031, 4),
  (5, 6031, 3),
  (6, 6031, 1),
  (7, 6031, 1),
  (1, 6032, 2),
  (2, 6032, 6),
  (3, 6032, 1),
  (4, 6032, 1),
  (5, 6032, 1),
  (6, 6032, 2),
  (7, 6032, 1),
  (1, 6033, 1),
  (2, 6033, 1),
  (6, 6033, 1),
  (7, 6033, 3);

  -- Settembre 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6034, 2),
  (2, 6034, 1),
  (5, 6034, 1),
  (6, 6034, 2),
  (7, 6034, 1),
  (1, 6035, 1),
  (3, 6035, 4),
  (5, 6035, 3),
  (6, 6035, 1),
  (7, 6035, 1),
  (1, 6036, 2),
  (2, 6036, 6),
  (3, 6036, 1),
  (4, 6036, 1),
  (5, 6036, 1),
  (6, 6036, 2),
  (7, 6036, 1),
  (1, 6037, 1),
  (2, 6037, 1),
  (6, 6037, 1),
  (7, 6037, 3);

  -- Ottobre 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6038, 2),
  (2, 6038, 1),
  (5, 6038, 1),
  (6, 6038, 2),
  (7, 6038, 1),
  (1, 6039, 1),
  (3, 6039, 4),
  (5, 6039, 3),
  (6, 6039, 1),
  (7, 6039, 1),
  (1, 6040, 2),
  (2, 6040, 6),
  (3, 6040, 1),
  (4, 6040, 1),
  (5, 6040, 1),
  (6, 6040, 2),
  (7, 6040, 1),
  (1, 6041, 1),
  (2, 6041, 1),
  (6, 6041, 1),
  (7, 6041, 3);

  -- Novembre 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6042, 2),
  (2, 6042, 1),
  (5, 6042, 1),
  (6, 6042, 2),
  (7, 6042, 1),
  (1, 6043, 1),
  (3, 6043, 4),
  (5, 6043, 3),
  (6, 6043, 1),
  (7, 6043, 1),
  (1, 6044, 2),
  (2, 6044, 6),
  (3, 6044, 1),
  (4, 6044, 1),
  (5, 6044, 1),
  (6, 6044, 2),
  (7, 6044, 1),
  (1, 6045, 1),
  (2, 6045, 1),
  (6, 6045, 1),
  (7, 6045, 3);

  -- Dicembre 2023
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6046, 2),
  (2, 6046, 1),
  (5, 6046, 1),
  (6, 6046, 2),
  (7, 6046, 1),
  (1, 6047, 1),
  (3, 6047, 4),
  (5, 6047, 3),
  (6, 6047, 1),
  (7, 6047, 1),
  (1, 6048, 2),
  (2, 6048, 6),
  (3, 6048, 1),
  (4, 6048, 1),
  (5, 6048, 1),
  (6, 6048, 2),
  (7, 6048, 1),
  (1, 6049, 1),
  (2, 6049, 1),
  (6, 6049, 1),
  (7, 6049, 3),
  (1, 6050, 3),
  (2, 6050, 1),
  (3, 6050, 1),
  (4, 6050, 2),
  (5, 6050, 1),
  (6, 6050, 1),
  (7, 6050, 1),
  (1, 6051, 1),
  (2, 6051, 1),
  (6, 6051, 1),
  (7, 6051, 3),
  (1, 6052, 3),
  (2, 6052, 1),
  (3, 6052, 1),
  (4, 6052, 2),
  (5, 6052, 1),
  (6, 6052, 1),
  (7, 6052, 1);

  -- Gennaio 2024
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6053, 2),
  (2, 6053, 1),
  (5, 6053, 1),
  (6, 6053, 2),
  (7, 6053, 1),
  (1, 6054, 1),
  (3, 6054, 4),
  (5, 6054, 3),
  (6, 6054, 1),
  (7, 6054, 1),
  (1, 6055, 2),
  (2, 6055, 6),
  (3, 6055, 1),
  (4, 6055, 1),
  (5, 6055, 1),
  (6, 6055, 2),
  (7, 6055, 1),
  (1, 6056, 1),
  (2, 6056, 1),
  (6, 6056, 1),
  (7, 6056, 3);

  -- Febbraio 2024
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6057, 2),
  (2, 6057, 1),
  (5, 6057, 1),
  (6, 6057, 2),
  (7, 6057, 1),
  (1, 6058, 1),
  (3, 6058, 4),
  (5, 6058, 3),
  (6, 6058, 1),
  (7, 6058, 1),
  (1, 6059, 2),
  (2, 6059, 6),
  (3, 6059, 1),
  (4, 6059, 1),
  (5, 6059, 1),
  (6, 6059, 2),
  (7, 6059, 1),
  (1, 6060, 1),
  (2, 6060, 1),
  (6, 6060, 1),
  (7, 6060, 3);

  -- Marzo 2024
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6061, 2),
  (2, 6061, 1),
  (5, 6061, 1),
  (6, 6061, 2),
  (7, 6061, 1),
  (1, 6062, 1),
  (3, 6062, 4),
  (5, 6062, 3),
  (6, 6062, 1),
  (7, 6062, 1),
  (1, 6063, 2),
  (2, 6063, 6),
  (3, 6063, 1),
  (4, 6063, 1),
  (5, 6063, 1),
  (6, 6063, 2),
  (7, 6063, 1),
  (1, 6064, 1),
  (2, 6064, 1),
  (6, 6064, 1),
  (7, 6064, 3);

  -- Aprile 2024
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6065, 2),
  (2, 6065, 1),
  (5, 6065, 1),
  (6, 6065, 2),
  (7, 6065, 1),
  (1, 6066, 1),
  (3, 6066, 4),
  (5, 6066, 3),
  (6, 6066, 1),
  (7, 6066, 1),
  (1, 6067, 2),
  (2, 6067, 6),
  (3, 6067, 1),
  (4, 6067, 1),
  (5, 6067, 1),
  (6, 6067, 2),
  (7, 6067, 1),
  (1, 6068, 1),
  (2, 6068, 1),
  (6, 6068, 1),
  (7, 6068, 3);

  -- Maggio 2024
INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita)
VALUES
  (1, 6069, 2),
  (2, 6069, 1),
  (5, 6069, 1),
  (6, 6069, 2),
  (7, 6069, 1),
  (1, 6070, 1),
  (3, 6070, 4),
  (5, 6070, 3),
  (6, 6070, 1),
  (7, 6070, 1),
  (1, 6071, 2),
  (2, 6071, 6),
  (3, 6071, 1),
  (4, 6071, 1),
  (5, 6071, 1),
  (6, 6071, 2),
  (7, 6071, 1),
  (1, 6072, 1),
  (2, 6072, 1),
  (6, 6072, 1),
  (7, 6072, 3);
