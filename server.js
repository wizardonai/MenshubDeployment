import { createConnection } from "mysql";
import express from "express";
import multer from "multer";
import jwt from "jsonwebtoken";
import { validate } from "deep-email-validator";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import nodemailer from "nodemailer";
sharp.cache({ files: 0 });

let connection = "";

const ip = "http://172.20.10.3";
// const ip = "http://192.168.1.129";
const porta = ":6969";
const url = ip + porta;

const { json, urlencoded } = bodyParser;
const server = express();
const secretKey = "CaccaPoopShitMierda";

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../server/image/products");
	},
	filename: function (req, file, cb) {
		const nome = req.body.nome;
		const prezzo = req.body.prezzo;
		const filename = nome + "_" + prezzo + path.extname(file.originalname);
		cb(null, filename);
	},
});

const storage2 = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, "../server/image/products");
	},
	filename: function (req, file, cb) {
		const id = req.body.id;
		const filename = id + path.extname(file.originalname);
		cb(null, filename);
	},
});

const upload = multer({ storage: storage });
const upload2 = multer({ storage: storage2 });

const transporter = nodemailer.createTransport({
	service: "hotmail",
	auth: {
		user: "menshub@outlook.it",
		pass: "lucaching69#[!",
	},
});

function connetti() {
	connection = createConnection({
		host: "localhost",
		user: "root",
		password: "",
	});
	connection.connect(function (err) {
		if (err) throw new Error(err);
		console.log("Connected!");
		connection.changeUser({ database: "menshub" }, () => {
			if (err) throw new Error(err);
		});
	});
}
connetti();

// server.use(
// 	cors({
// 		origin: "http://127.0.0.1:6969",
// 	})
// );
server.use(cors());
server.use(json());
server.use(express.json());
server.use(urlencoded({ extended: false }));

//deploy react
const reactRoutes = [
	"/home",
	"/cart",
	"/profile",
	"/profile/:page",
	"/product/:id",
	"/changepwd/:token",
	"/auth",
];

server.use("/image", express.static("./image"));
server.use(express.static("../cliente/build"));
server.use(reactRoutes, express.static("../cliente/build"));

server.post("/request/products", (req, res) => {
	let token = req.headers.authorization;
	let idm_utente = "";
	res.header("Access-Control-Allow-Origin", "*");

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			console.log("Token non valido");
			res.send("Token non valido");
			res.end();
		} else {
			try {
				const queryPromise = new Promise((resolve, reject) => {
					checkMensaCancellata(decoded.id, resolve);
				});

				queryPromise.then((ris) => {
					if (ris == false) {
						res.send("Mensa preferita cancellata");
						res.end();
					} else {
						idm_utente = decoded.id_mensa;

						connection.query(
							"SELECT * FROM prodotti where id_mensa=" +
								idm_utente +
								" ORDER BY nome",
							(err, result) => {
								if (err) throw new Error(err);
								res.send(result);
								res.end();
							}
						);
					}
				});
			} catch (error) {
				res.status(500).send("Errore del server");
				res.end();
			}
		}
	});
});

server.post("/request/mense", (req, res) => {
	let query = `SELECT * FROM mense WHERE verificato = 1;`;
	connection.query(query, (err, result) => {
		if (err) throw new Error(err);
		if (result.length > 0) {
			res.send(result);
			res.end();
		} else {
			res.send("nessuna mensa trovata");
			res.end();
		}
	});
});

server.post("/request/mensa", (req, res) => {
	let token = req.headers.authorization;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			try {
				const queryPromise = new Promise((resolve, reject) => {
					checkMensaCancellata(decoded.id, resolve);
				});

				queryPromise.then((ris) => {
					if (ris == false) {
						res.send("Mensa preferita cancellata");
						res.end();
					} else {
						let id_mensa = decoded.id_mensa;
						let query = `SELECT * FROM mense WHERE id=${id_mensa};`;

						connection.query(query, (err, result) => {
							if (err) throw new Error(err);

							if (result.length > 0) {
								res.send(result);
							} else {
								res.send("Mensa non trovata");
							}
							res.end();
						});
					}
				});
			} catch (error) {
				res.status(500).send("Errore del server");
				res.end();
			}
		}
	});
});

server.post("/insert/mensa", (req, res) => {
	const { nome, indirizzo, regione, provincia, comune, cap, email, telefono } =
		req.body;

	const query = `INSERT INTO mense (nome, indirizzo, regione, provincia, comune, cap, email, telefono) VALUES ('${nome}', '${indirizzo}', '${regione}', '${provincia}', '${comune}', ${cap}, '${email}', '${telefono}')`;

	// Esegui la query
	connection.query(query, (error, result) => {
		if (error) {
			console.error("Errore durante l'esecuzione della query:", error);
			res.status(500).json("Internal server error");
			return;
		}
		res.status(200).json(result.insertId);
	});
});

server.post("/modify/mensa", (req, res) => {
	let token = req.headers.authorization;
	let id_mensa = req.body.id_mensa;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			let query = `UPDATE utenti SET id_mensa=${id_mensa} WHERE id=${decoded.id};`;

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				const token = jwt.sign(
					{
						id: decoded.id,
						nome: decoded.nome,
						cognome: decoded.cognome,
						email: decoded.email,
						id_mensa: id_mensa,
					},
					secretKey,
					{ expiresIn: "1h" }
				);

				res.json({ token: token });
				res.send();
				res.end();
			});
		}
	});
});

server.post("/request/categories", (req, res) => {
	let query = `SELECT * FROM categorie;`;
	connection.query(query, (err, result) => {
		if (err) throw new Error(err);

		if (result.length > 0) {
			res.send(result);
			res.end();
		} else {
			res.send("nessuna categoria trovata");
			res.end();
		}
	});
});

server.post("/request/allergens", (req, res) => {
	let query = `SELECT * FROM allergeni;`;
	connection.query(query, (err, result) => {
		if (err) throw new Error(err);

		if (result.length > 0) {
			res.send(result);
			res.end();
		} else {
			res.send("Nessun allergene trovato");
			res.end();
		}
	});
});

server.post("/send/cart", (req, res) => {
	let token = req.headers.authorization;
	let id_utente = "";
	res.header("Access-Control-Allow-Origin", "*");
	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			try {
				const queryPromise = new Promise((resolve, reject) => {
					checkMensaCancellata(decoded.id, resolve);
				});

				queryPromise.then((ris) => {
					if (ris == false) {
						res.send("Mensa preferita cancellata");
						res.end();
					} else {
						id_utente = decoded.id;

						let data = req.body.carrello;

						let query = `INSERT INTO ordini (id_mensa, data, stato_ordine, id_utente) VALUES (${data[0].id_mensa}, NOW(), 'attivo', ${id_utente});`;

						connection.query(query, (err, result) => {
							if (err) throw new Error(err);

							const id_ordine = result.insertId;

							let prodottiOrdiniQuery = `INSERT INTO prodotti_ordini (id_prodotto, id_ordine, quantita) VALUES`;

							data.forEach((item, index) => {
								prodottiOrdiniQuery += ` (${item.id}, ${id_ordine}, ${item.quantita})`;
								if (index !== data.length - 1) prodottiOrdiniQuery += ",";
							});

							connection.query(prodottiOrdiniQuery, (err, result) => {
								if (err) throw new Error(err);
								res.send("Ordine aggiunto");
								res.end();
							});
						});
					}
				});
			} catch (error) {
				res.status(500).send("Errore del server");
				res.end();
			}
		}
	});
});

server.post("/register/user", async function (req, res) {
	const {
		nome,
		cognome,
		email,
		password,
		confirm_password,
		cliente,
		id_mensa,
	} = req.body;
	if (!email || !password) {
		// return res.status(400).send({
		// 	message: "email o password mancante.",
		// });
		res.send("Email o password mancante!");
		res.end();
	}
	if (password !== confirm_password) {
		// return res.status(400).send({
		// 	message: "le password non combaciano.",
		// });
		res.send("Le password non combaciano!");
		res.end();
	}
	//controllo che la mail non sia già presente NON FUNZIONA NON CONCATENA EMAIL
	let query = `SELECT * FROM utenti WHERE email="${email}";`;
	connection.query(query, (err, result) => {
		if (err) throw new Error(err);
		if (result.length > 0) {
			res.send("email già presente");
			res.end;
		}
	});

	const { valid, reason, validators } = await validate(email);
	let queryInsertUser;
	if (valid) {
		queryInsertUser = `INSERT INTO UTENTI (nome,cognome,email,password,id_mensa,cliente) VALUES('${nome}','${cognome}','${email}','${password}',${id_mensa},${cliente});`;
		console.log("caca" + queryInsertUser);
		connection.query(queryInsertUser, (err, result) => {
			if (err) throw new Error(err);
			if (result) {
				res.send("Registrazione avvenuta con successo");
				res.end;
			}
		});
	} else {
		res.send("Email non valida!");
		res.end();
	}
});

server.post("/login/user", async function (req, res) {
	let email = req.body.email;
	let password = req.body.password;

	const { valid, reason, validators } = await validate(email);

	if (valid) {
		let query = `SELECT * FROM utenti WHERE email="${email}" AND password="${password}";`;

		connection.query(query, (err, result) => {
			if (err) throw new Error(err);

			if (result.length === 1) {
				//bisogna creare tutti i dati di sessione per aprire la sessione con l'utente appunto

				if (result[0].id_mensa == null) {
					const token = jwt.sign(
						{
							id: result[0].id,
							nome: result[0].nome,
							cognome: result[0].cognome,
							email: result[0].email,
							id_mensa: 0,
						},
						secretKey,
						{ expiresIn: "1h" }
					);

					res.json({ token: token, message: "Mensa preferita cancellata" });
					res.send();
					res.end();
				} else {
					const token = jwt.sign(
						{
							id: result[0].id,
							nome: result[0].nome,
							cognome: result[0].cognome,
							email: result[0].email,
							id_mensa: result[0].id_mensa,
						},
						secretKey,
						{ expiresIn: "1h" }
					);

					let tipo = result[0].cliente;

					res.json({ token: token, tipo: tipo });
					res.send();
					res.end();
				}
			} else {
				res.send("Utente non trovato");
				res.end();
			}
		});
	} else {
		// return res.status(400).send({
		// 	message: "Please provide a valid email address.",
		// 	reason: validators[reason].reason,
		// });
		res.send("Email non valida!");
		res.end();
	}
});

server.post("/request/profile", (req, res) => {
	let token = req.headers.authorization;
	if (!token) {
		res.send("Token non trovato");
		res.end();
	} else {
		jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
			if (err) {
				res.send("Token non valido");
				res.end();
			} else {
				try {
					const queryPromise = new Promise((resolve, reject) => {
						checkMensaCancellata(decoded.id, resolve);
					});

					queryPromise.then((ris) => {
						if (ris == false) {
							res.send("Mensa preferita cancellata");
							res.end();
						} else {
							res.send(decoded);
							res.end();
						}
					});
				} catch (error) {
					res.status(500).send("Errore del server");
					res.end();
				}
			}
		});
	}
});

server.post("/recover/password", (req, res) => {
	let email = req.body.email;

	let query = `SELECT * FROM utenti WHERE email="${email}";`;

	connection.query(query, (err, result) => {
		if (err) throw new Error(err);

		if (result.length > 0) {
			const token = jwt.sign(
				{
					id: result[0].id,
					nome: result[0].nome,
					cognome: result[0].cognome,
					email: result[0].email,
					id_mensa: result[0].id_mensa,
				},
				secretKey,
				{ expiresIn: "1h" }
			);

			let link = url + "/changepwd/" + token;
			transporter.sendMail(
				{
					from: "menshub@outlook.it",
					to: email,
					subject: "Cambio password",
					text: "Ciao, ecco il link per cambiare la tua password: [link]",
					html:
						'<p>Ciao,</p><p>Ecco il <a href="' +
						link +
						'">link</a> per cambiare la tua password.</p>',
				},
				(error, info) => {
					if (error) {
						console.log("Errore durante l'invio dell'email:", error);
					} else {
						console.log("Email inviata con successo:", info.response);
					}
				}
			);

			res.send("Email inviata con successo");
			res.end();
		} else {
			res.send("Email non trovata");
			res.end();
		}
	});
});

server.post("/change/password", (req, res) => {
	let token = req.headers.authorization;
	let id_utente = null;
	let old_psw = req.body.old_psw;
	let new_psw = req.body.new_psw;
	let confirm_new_psw = req.body.confirm_new_psw;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			console.log("Token non valido");
			res.send("Token non valido");
			res.end();
			return;
		} else {
			try {
				const queryPromise = new Promise((resolve, reject) => {
					checkMensaCancellata(decoded.id, resolve);
				});

				queryPromise.then((ris) => {
					if (ris == false) {
						res.send("Mensa preferita cancellata");
						res.end();
					} else {
						id_utente = decoded.id;

						if (old_psw != null) {
							//cambio password
							let query_check_old_psw;
							query_check_old_psw = `select password from utenti where id=${id_utente};`;
							connection.query(query_check_old_psw, (err, result) => {
								if (err) {
									res.send(err);
									res.end();
									return;
								}
								if (result.length > 0) {
									console.log("Vecchia password" + result[0].password);
									if (
										result[0].password === old_psw &&
										new_psw === confirm_new_psw
									) {
										let query_set_new_password = `update utenti set password = ${new_psw} where id=${id_utente};`;
										connection.query(query_set_new_password, (err, result) => {
											if (err) {
												res.send(err);
												res.end();
												return;
											}
											if (result) {
												res.send("Password cambiata con successo");
												res.end();
												return;
											}
										});
									} else {
										res.send("Le password non combaciano");
										res.end();
										return;
									}
								}
							});
						} else {
							//resetta password
							if (new_psw === confirm_new_psw) {
								let query_reset_password = `update utenti set password =${new_psw} where id=${id_utente};`;
								connection.query(query_reset_password, (err, result) => {
									if (err) {
										res.send(err);
										res.end();
										return;
									}
									if (result) {
										res.send("Password cambiata con successo");
										res.end();
										return;
									}
								});
							} else {
								res.send("Le password non combaciano");
								res.end();
								return;
							}
						}
					}
				});
			} catch (error) {
				res.status(500).send("Errore del server");
				res.end();
			}
		}
	});
});

server.post("/delete/user", (req, res) => {
	let token = req.headers.authorization;
	let password = req.body.password;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			let query = `SELECT * FROM utenti WHERE id=${decoded.id} AND password="${password}";`;

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				if (result.length > 0) {
					let cliente = result[0].cliente;

					console.log(cliente);

					if (cliente == 1) {
						query = `DELETE FROM utenti WHERE id=${decoded.id};`;
					} else {
						query = `SELECT * FROM utenti WHERE cliente=0 AND id_mensa=${decoded.id_mensa};`;
					}

					console.log(query);

					connection.query(query, (err, result) => {
						if (err) throw new Error(err);

						console.log(result.length);

						if (cliente == 0 && result.length == 1) {
							query = "DELETE FROM utenti WHERE id=" + decoded.id + ";";

							connection.query(query, (err, result) => {
								if (err) throw new Error(err);
								query = `DELETE FROM mense WHERE id=${decoded.id_mensa};`;

								connection.query(query, (err, result) => {
									if (err) throw new Error(err);
									res.send("Mensa eliminata");
									res.end();
								});
							});
						} else if (cliente == 0 && result.length > 1) {
							query = "DELETE FROM utenti WHERE id=" + decoded.id + ";";

							connection.query(query, (err, result) => {
								if (err) throw new Error(err);
								res.send("Utente eliminato");
								res.end();
							});
						} else {
							res.send("Utente eliminato");
							res.end();
						}
					});
				} else {
					res.send("Password errata");
					res.end();
				}
			});
		}
	});
});

server.post("/delete/mensa", (req, res) => {
	let token = req.headers.authorization;
	let password = req.body.password;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			let query = `SELECT * FROM utenti WHERE id=${decoded.id} AND password="${password}";`;

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				if (result.length > 0) {
					let cliente = result[0].cliente;

					if (cliente == 0) {
						let query = `DELETE FROM utenti WHERE id_mensa=${decoded.id_mensa} AND cliente=0;`;

						connection.query(query, (err, result) => {
							if (err) throw new Error(err);

							let query = `DELETE FROM mense WHERE id=${decoded.id_mensa};`;

							connection.query(query, (err, result) => {
								if (err) throw new Error(err);
								res.send("Mensa eliminata");
								res.end();
							});
						});
					} else {
						res.send("Non sei autorizzato a cancellare la mensa");
						res.end();
					}
				} else {
					res.send("Password errata");
					res.end();
				}
			});
		}
	});
});

server.post("/request/orders", (req, res) => {
	let token = req.headers.authorization;
	let id_utente = "";

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			try {
				const queryPromise = new Promise((resolve, reject) => {
					checkMensaCancellata(decoded.id, resolve);
				});

				queryPromise.then((ris) => {
					if (ris == false) {
						res.send("Mensa preferita cancellata");
						res.end();
					} else {
						id_utente = decoded.id;
						let id_mensa = decoded.id_mensa;

						let query = `SELECT id_ordine, stato_ordine, data, id_prodotto, quantita 
                FROM ordini AS o
								JOIN prodotti_ordini AS po ON o.id = po.id_ordine
								WHERE id_utente="${id_utente}" AND id_mensa = ${id_mensa}
								ORDER BY o.data, po.id_ordine;`;

						connection.query(query, (err, result) => {
							if (err) throw new Error(err);

							let orders = [];
							let currentOrder = null;

							result.forEach((row) => {
								if (!currentOrder || currentOrder.id_ordine !== row.id_ordine) {
									currentOrder = {
										id_ordine: row.id_ordine,
										stato_ordine: row.stato_ordine,
										data: row.data,
										prodotti: [],
									};
									orders.push(currentOrder);
								}

								currentOrder.prodotti.push({
									id: row.id_prodotto,
									quantita: row.quantita,
								});
							});

							if (orders.length > 0) {
								res.send(orders);
							} else {
								res.send("L'utente non ha ordini attivi");
							}
							res.end();
						});
					}
				});
			} catch (error) {
				res.status(500).send("Errore del server");
				res.end();
			}
		}
	});
});

server.post("/producer/get/products", (req, res) => {
	let token = req.headers.authorization;
	let id_mensa = "";

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			id_mensa = decoded.id_mensa;
			connection.query(
				"SELECT * FROM prodotti where id_mensa=" +
					id_mensa +
					" ORDER BY categoria, nome",
				(err, result) => {
					if (err) throw new Error(err);
					res.header("Access-Control-Allow-Origin", "*");
					res.send(result);
					res.end();
				}
			);
		}
	});
});

server.post("/producer/get/top10Products", (req, res) => {
	let token = req.headers.authorization;
	let periodo = req.body.periodo;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			let id_mensa = decoded.id_mensa;
			let query = `SELECT id_prodotto, p.nome, SUM(quantita) AS num_acquisti
                  FROM prodotti_ordini AS po
                  JOIN ordini AS o ON po.id_ordine = o.id
                  JOIN prodotti AS p ON po.id_prodotto = p.id `;

			switch (periodo) {
				case "1G":
					query += `WHERE o.id_mensa = ${id_mensa} AND DATE(o.data) = CURDATE()`;
					break;
				case "1S":
					query += ` WHERE o.id_mensa = ${id_mensa} AND DATE(o.data) >= CURDATE() - INTERVAL 1 WEEK`;
					break;
				case "1M":
					query += `WHERE o.id_mensa = ${id_mensa} AND DATE(o.data) >= CURDATE() - INTERVAL 1 MONTH`;
					break;
				case "3M":
					query += `WHERE o.id_mensa = ${id_mensa} AND DATE(o.data) >= CURDATE() - INTERVAL 3 MONTH`;
					break;
				case "6M":
					query += `WHERE o.id_mensa = ${id_mensa} AND DATE(o.data) >= CURDATE() - INTERVAL 6 MONTH`;
					break;
				case "1A":
					query += `WHERE o.id_mensa = ${id_mensa} AND DATE(o.data) >= CURDATE() - INTERVAL 1 YEAR`;
					break;
			}

			query += ` GROUP BY id_prodotto
                ORDER BY num_acquisti DESC
                LIMIT 10`;
			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				if (result.length > 0) {
					res.send(result);
				} else {
					res.send("Non sono presenti prodotti");
				}
				res.end();
			});
		}
	});
});

server.post("/producer/get/stats", (req, res) => {
	let token = req.headers.authorization;
	let periodo = req.body.periodo;

	jwt.verify(token.replace("Bearer ", ""), secretKey, async (err, decoded) => {
		if (err) {
			console.log(err);
			res.send("Token non valido");
			res.end();
		} else {
			let id_mensa = decoded.id_mensa;
			let query = "";
			let ris = [];
			let promises = [];
			switch (periodo) {
				case "1G":
					query = `
            SELECT DATE(data) AS periodo, SUM(quantita) AS vendite
            FROM ordini
            JOIN prodotti_ordini ON ordini.id = prodotti_ordini.id_ordine
            WHERE id_mensa = ${id_mensa}
              AND data = CURDATE()
              AND stato_ordine = 'completato'
            GROUP BY periodo
            ORDER BY periodo;
          `;

					console.log(query);

					connection.query(query, (err, result) => {
						if (err) throw new Error(err);

						if (result.length > 0) {
							const formattedResult = result.map((row) => ({
								periodo: new Date(row.periodo).toLocaleDateString("it-IT"),
								vendite: row.vendite,
							}));
							console.log(formattedResult);
							res.send(formattedResult);
						} else {
							res.send("Non sono presenti dati");
						}
						res.end();
					});

					break;
				case "1S":
					const oneDay = 1000 * 60 * 60 * 24;

					for (let i = 6; i >= 0; i--) {
						const currentDate = new Date();
						const endDate = new Date(currentDate.getTime() - i * oneDay);
						const periodo = `${endDate.toISOString().split("T")[0]}`;

						const promise = new Promise((resolve, reject) => {
							const query = `
                  SELECT SUM(quantita) AS vendite
                  FROM prodotti_ordini
                  WHERE id_ordine IN (
                    SELECT id
                    FROM ordini
                    WHERE id_mensa = ${id_mensa}
                    AND DATE(data) = '${endDate.toISOString().split("T")[0]}'
                    AND stato_ordine = 'completato'
                  )
                `;

							connection.query(query, (err, result) => {
								if (err) reject(err);
								resolve({ result: result, periodo: periodo }); // Risultato della query e periodo corrente
							});
						});

						promises.push(promise);
					}

					Promise.all(promises)
						.then((results) => {
							ris = results.map(({ result, periodo }) => {
								const vendite =
									result.length > 0 && result[0].vendite
										? result[0].vendite
										: 0;
								return { vendite: vendite, periodo: periodo };
							});

							res.send(ris);
							res.end();
						})
						.catch((err) => {
							console.error(err);
							res.send("Errore nel recupero dei dati");
							res.end();
						});

					break;
				case "1M":
					const fourDays = 1000 * 60 * 60 * 24 * 4;

					for (let i = 7; i >= 0; i--) {
						const currentDate = new Date();
						const endDate = new Date(currentDate.getTime() - i * fourDays);
						const startDate = new Date(endDate.getTime() - fourDays);
						const periodo = `${startDate.toISOString().split("T")[0]} - ${
							endDate.toISOString().split("T")[0]
						}`;

						const promise = new Promise((resolve, reject) => {
							const query = `
                  SELECT SUM(quantita) AS vendite
                  FROM prodotti_ordini
                  WHERE id_ordine IN (
                    SELECT id
                    FROM ordini
                    WHERE id_mensa = ${id_mensa}
                    AND DATE(data) > '${startDate.toISOString().split("T")[0]}'
                    AND DATE(data) <= '${endDate.toISOString().split("T")[0]}'
                    AND stato_ordine = 'completato'
                  )
                `;

							console.log(query);

							connection.query(query, (err, result) => {
								if (err) reject(err);
								resolve({ result: result, periodo: periodo });
							});
						});

						promises.push(promise);
					}

					Promise.all(promises)
						.then((results) => {
							ris = results.map(({ result, periodo }) => {
								const vendite =
									result.length > 0 && result[0].vendite
										? result[0].vendite
										: 0;
								return { vendite: vendite, periodo: periodo };
							});

							res.send(ris);
							res.end();
						})
						.catch((err) => {
							console.error(err);
							res.send("Errore nel recupero dei dati");
							res.end();
						});

					break;
				case "3M":
					const twoWeeks = 1000 * 60 * 60 * 24 * 7 * 2;

					for (let i = 6; i >= 0; i--) {
						const currentDate = new Date();
						const endDate = new Date(currentDate.getTime() - i * twoWeeks);
						const startDate = new Date(endDate.getTime() - twoWeeks);
						const periodo = `${startDate.toISOString().split("T")[0]} - ${
							endDate.toISOString().split("T")[0]
						}`;

						const promise = new Promise((resolve, reject) => {
							const query = `
                  SELECT SUM(quantita) AS vendite
                  FROM prodotti_ordini
                  WHERE id_ordine IN (
                    SELECT id
                    FROM ordini
                    WHERE id_mensa = ${id_mensa}
                    AND DATE(data) > '${startDate.toISOString().split("T")[0]}'
                    AND DATE(data) <= '${endDate.toISOString().split("T")[0]}'
                    AND stato_ordine = 'completato'
                  )
                `;

							connection.query(query, (err, result) => {
								if (err) reject(err);
								resolve({ result: result, periodo: periodo });
							});
						});

						promises.push(promise);
					}

					Promise.all(promises)
						.then((results) => {
							ris = results.map(({ result, periodo }) => {
								const vendite =
									result.length > 0 && result[0].vendite
										? result[0].vendite
										: 0;
								return { vendite: vendite, periodo: periodo };
							});
							res.send(ris);
							res.end();
						})
						.catch((err) => {
							console.error(err);
							res.send("Errore nel recupero dei dati");
							res.end();
						});

					break;
				case "6M":
					const threeWeeks = 1000 * 60 * 60 * 24 * 7 * 3;

					for (let i = 8; i >= 0; i--) {
						const currentDate = new Date();
						const endDate = new Date(currentDate.getTime() - i * threeWeeks); // Data corrente meno i giorni necessari per ottenere una data precedente di 3 settimane
						const startDate = new Date(endDate.getTime() - threeWeeks); // 3 settimane prima della data di fine
						const periodo = `${startDate.toISOString().split("T")[0]} - ${
							endDate.toISOString().split("T")[0]
						}`;

						const promise = new Promise((resolve, reject) => {
							const query = `
                  SELECT SUM(quantita) AS vendite
                  FROM prodotti_ordini
                  WHERE id_ordine IN (
                    SELECT id
                    FROM ordini
                    WHERE id_mensa = ${id_mensa}
                    AND DATE(data) > '${startDate.toISOString().split("T")[0]}'
                    AND DATE(data) <= '${endDate.toISOString().split("T")[0]}'
                    AND stato_ordine = 'completato'
                  )
                `;

							connection.query(query, (err, result) => {
								if (err) reject(err);
								resolve({ result: result, periodo: periodo }); // Risultato della query e periodo corrente
							});
						});

						promises.push(promise);
					}

					Promise.all(promises)
						.then((results) => {
							ris = results.map(({ result, periodo }) => {
								const vendite =
									result.length > 0 && result[0].vendite
										? result[0].vendite
										: 0;
								return { vendite: vendite, periodo: periodo };
							});
							res.send(ris);
							res.end();
						})
						.catch((err) => {
							console.error(err);
							res.send("Errore nel recupero dei dati");
							res.end();
						});

					break;
				case "1A":
					query = `
            SELECT DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL t.n MONTH), '%m/%y') AS periodo,
                   COALESCE(SUM(po.quantita), 0) AS vendite
            FROM (SELECT 0 AS n UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11) AS t
            LEFT JOIN ordini o ON YEAR(o.data) = YEAR(DATE_SUB(CURDATE(), INTERVAL t.n MONTH)) AND MONTH(o.data) = MONTH(DATE_SUB(CURDATE(), INTERVAL t.n MONTH)) AND o.id_mensa = ${id_mensa}
            LEFT JOIN prodotti_ordini po ON o.id = po.id_ordine
            AND o.stato_ordine = 'completato'
            GROUP BY YEAR(DATE_SUB(CURDATE(), INTERVAL t.n MONTH)), MONTH(DATE_SUB(CURDATE(), INTERVAL t.n MONTH))
            ORDER BY YEAR(DATE_SUB(CURDATE(), INTERVAL t.n MONTH)), MONTH(DATE_SUB(CURDATE(), INTERVAL t.n MONTH));
          `;

					connection.query(query, (err, result) => {
						if (err) throw new Error(err);

						if (result.length > 0) {
							res.send(result);
						} else {
							res.send("Non sono presenti dati");
						}
						res.end();
					});
					break;
				default:
					res.send("Periodo non valido");
					res.end();
					break;
			}
		}
	});
});

server.post("/producer/get/orders", (req, res) => {
	let token = req.headers.authorization;
	let id_utente = "";

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			id_utente = decoded.id;

			let query = `SELECT id as id_ordine, id_utente, stato_ordine, ora_consegna, pagato, num_prodotti, tot_prezzo  
                  FROM ordini AS o
                  JOIN (SELECT id_ordine, SUM(quantita) AS num_prodotti FROM prodotti_ordini GROUP BY id_ordine) AS po ON o.id = po.id_ordine
                  JOIN (SELECT id_ordine, SUM(p.prezzo) AS tot_prezzo FROM prodotti_ordini AS po JOIN prodotti AS p ON po.id_prodotto = p.id GROUP BY id_ordine) AS pp ON o.id = pp.id_ordine
                  WHERE id_mensa = ${id_utente}`;

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				let orders = [];

				result.forEach((row) => {
					orders.push({
						id_ordine: row.id_ordine,
						id_utente: row.id_utente,
						stato_ordine: row.stato_ordine,
						ora_consegna: row.ora_consegna,
						pagato: row.pagato,
						num_prodotti: row.num_prodotti,
						tot_prezzo: row.tot_prezzo,
					});
				});

				if (orders.length > 0) {
					res.send(orders);
				} else {
					res.send("Non sono presenti ordini");
				}
				res.end();
			});
		}
	});
});

server.post("/producer/get/orders/completed", (req, res) => {
	let token = req.headers.authorization;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			let id_utente = decoded.id;
			let query = `SELECT id as id_ordine, id_utente, stato_ordine, data, ora_consegna, pagato, num_prodotti, tot_prezzo  
                  FROM ordini AS o
                  JOIN (SELECT id_ordine, SUM(quantita) AS num_prodotti FROM prodotti_ordini GROUP BY id_ordine) AS po ON o.id = po.id_ordine
                  JOIN (SELECT id_ordine, SUM(p.prezzo) AS tot_prezzo FROM prodotti_ordini AS po JOIN prodotti AS p ON po.id_prodotto = p.id GROUP BY id_ordine) AS pp ON o.id = pp.id_ordine
                  WHERE o.id_mensa = ${id_utente} AND o.stato_ordine = 'completato'`;

			console.log(query);

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				if (result.length > 0) {
					res.send(result);
				} else {
					res.send("Ordine non trovato");
				}
				res.end();
			});
		}
	});
});

server.post("/producer/get/order", (req, res) => {
	let token = req.headers.authorization;
	let id_ordine = req.body.id_ordine;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			let query = `SELECT po.id_prodotto, po.quantita, p.nome, p.categoria, p.prezzo, p.indirizzo_img
                  FROM prodotti_ordini AS po
                  JOIN prodotti AS p ON po.id_prodotto = p.id
                  WHERE po.id_ordine = ${id_ordine};`;

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				let products = [];

				result.forEach((row) => {
					products.push({
						id_prodotto: row.id_prodotto,
						quantita: row.quantita,
						nome: row.nome,
						categoria: row.categoria,
						indirizzo_img: row.indirizzo_img,
						prezzo: row.prezzo,
					});
				});

				if (products.length > 0) {
					res.send(products);
				} else {
					res.send("Non sono presenti prodotti per questo ordine");
				}
				res.end();
			});
		}
	});
});

server.post("/producer/change/order", (req, res) => {
	let token = req.headers.authorization;
	let id_ordine = req.body.id_ordine;
	let stato_ordine = req.body.stato_ordine;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			if (stato_ordine === "finito") {
				let query = `SELECT id_prodotto, quantita FROM prodotti_ordini WHERE id_ordine = ${id_ordine};`;

				connection.query(query, (err, result) => {
					if (err) throw new Error(err);

					result.forEach((row) => {
						let query = `UPDATE prodotti SET nacq = nacq + ${row.quantita} WHERE id = ${row.id_prodotto};`;

						connection.query(query, (err, result) => {
							if (err) throw new Error(err);
						});
					});
				});
			}

			let query = `UPDATE ordini SET stato_ordine = '${stato_ordine}' WHERE id = ${id_ordine};`;

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				res.send("Stato ordine modificato");
				res.end();
			});
		}
	});
});

server.post("/producer/delete/order", (req, res) => {
	let token = req.headers.authorization;
	let id_ordine = req.body.id_ordine;

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			res.send("Token non valido");
			res.end();
		} else {
			let query = `DELETE FROM ordini WHERE id = ${id_ordine};`;

			connection.query(query, (err, result) => {
				if (err) throw new Error(err);

				res.send("Ordine eliminato");
				res.end();
			});
		}
	});
});

server.post("/producer/edit/product", (req, res) => {
	const { id, nome, descrizione, allergeni, prezzo, categoria, disponibile } =
		req.body;

	let query = `
				UPDATE prodotti
				SET nome = '${nome}',
					descrizione = '${descrizione}',
					allergeni = '${allergeni}',
					prezzo = '${prezzo}',
					categoria = '${categoria}',
					disponibile = '${disponibile}'
				WHERE id = '${id}';`;

	connection.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		} else {
			res.send("Prodotto modificato");
			res.end();
		}
	});
});

//serve id del prodotto nella req per caricare immagine
//richiesta da fare con form-data
server.post(
	"/producer/editWithImg/product",
	upload2.single("image"),
	(req, res) => {
		const { id, nome, descrizione, allergeni, prezzo, categoria, disponibile } =
			req.body;

		let cartella = "../server/image/products";
		let fileDaEliminare = "";
		let pathFileDaEliminare = "";
		const estensioneFile = req.file.filename.split(".").pop();

		const queryPromise = new Promise((resolve, reject) => {
			fs.readdir(cartella, (err, files) => {
				if (err) {
					console.error("Errore durante la lettura della cartella:", err);
					return;
				}

				let query = "SELECT indirizzo_img FROM prodotti WHERE id = " + id + ";";

				connection.query(query, (err, result) => {
					if (err) {
						console.log(err);
						reject(err);
					}
					pathFileDaEliminare = result[0].indirizzo_img.split("/").pop();

					fileDaEliminare = files.find((file) => file === pathFileDaEliminare);

					if (fileDaEliminare) {
						resolve(fileDaEliminare);
					} else {
						reject("File non trovato.");
						console.log("File non trovato.");
					}
				});
			});
		});

		queryPromise
			.then((fileDaEliminare) => {
				const estensioneFileVecchio = fileDaEliminare.split(".").pop();

				if (estensioneFileVecchio != estensioneFile) {
					let cartella = "../server/image/products";
					const pathImg = cartella + "/" + fileDaEliminare;

					fs.unlink(pathImg, (err) => {
						if (err) {
							console.error(
								`Errore durante l'eliminazione del file ${fileDaEliminare}: ${err}`
							);
							// Gestisci l'errore come preferisci
						} else {
							console.log(
								`Il file ${fileDaEliminare} è stato eliminato con successo`
							);
						}
					});
				}
				let query = `
				UPDATE prodotti
				SET nome = '${nome}',
					descrizione = '${descrizione}',
					allergeni = '${allergeni}',
					prezzo = '${prezzo}',
					categoria = '${categoria}',
					disponibile = '${disponibile}',
					indirizzo_img= 'products/${id}.webp'
				WHERE id = '${id}';`;

				connection.query(query, (err, result) => {
					if (err) {
						console.error(err);
						res.send(err);
						res.end();
					}
				});

				const cartella = "../server/image/products";

				fs.readdir(cartella, (err, files) => {
					if (err) {
						console.error("Errore durante la lettura della cartella:", err);
						return;
					}
					const filenameConEstensione = id + "." + estensioneFile;
					let cartella = "../server/image/products/";
					let fileDaConvertire = files.find(
						(file) => file === filenameConEstensione
					);

					if (fileDaConvertire) {
						sharp(cartella + fileDaConvertire)
							.toFormat("webp")
							.toFile(
								cartella + filenameConEstensione.replace(/\.[^/.]+$/, ".webp")
							)
							.then((info) => {
								fs.unlink(cartella + fileDaConvertire, (err) => {
									if (err) {
										console.error(
											`Errore durante l'eliminazione del file ${fileDaConvertire}: ${err}`
										);
									}
								});
							})
							.catch((err) => {
								console.error("Error converting to WebP:", err);
							});
					} else {
						console.log("File non trovato.");
					}
				});

				res.send("Prodotto modificato");
				res.end();
			})
			.catch((error) => {
				console.log(error);
				res.send("Errore modifica");
				res.end();
			});
	}
);

//richiesta da fare con form-data
server.post("/producer/add/product", upload.single("image"), (req, res) => {
	const { nome, descrizione, allergeni, prezzo, categoria, disponibile } =
		req.body;

	let token = req.headers.authorization;
	let id_utente = "";

	jwt.verify(token.replace("Bearer ", ""), secretKey, (err, decoded) => {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		} else {
			id_utente = decoded.id;

			const estensioneFile = req.file.filename.split(".").pop();

			const queryPromise = new Promise((resolve, reject) => {
				let query = `SELECT id_mensa FROM utenti WHERE id="${id_utente};"`;
				connection.query(query, (err, results) => {
					if (err) {
						console.log(err);
						reject(err);
					} else {
						resolve(results);
					}
				});
			});

			queryPromise
				.then((results) => {
					let id_prodotto = "";
					const id_mensa = results[0].id_mensa;

					const queryPromise2 = new Promise((resolve, reject) => {
						let query = `insert into prodotti (nome,descrizione,allergeni,prezzo,categoria,indirizzo_img,disponibile,nacq,id_mensa) VALUES('${nome}','${descrizione}','${allergeni}','${prezzo}','${categoria}','','${disponibile}','0','${id_mensa}');`;

						connection.query(query, (err, result) => {
							if (err) {
								console.error(err);
								reject(err);
							} else {
								id_prodotto = result.insertId;
								resolve(results);
							}
						});
					});

					queryPromise2
						.then((results) => {
							let query = `update prodotti SET indirizzo_img= 'products/${id_prodotto}.webp' WHERE nome='${nome}' AND descrizione='${descrizione}' AND prezzo='${prezzo}';`;

							connection.query(query, (err, result) => {
								if (err) throw new Error(err);

								const cartella = "../server/image/products";

								fs.readdir(cartella, (err, files) => {
									if (err) {
										console.error(
											"Errore durante la lettura della cartella:",
											err
										);
										return;
									}
									const filenameConEstensione =
										nome + "_" + prezzo + "." + estensioneFile;
									const cartella = "../server/image/products/";
									let fileDaConvertire = files.find(
										(file) => file === filenameConEstensione
									);

									if (fileDaConvertire) {
										sharp(cartella + fileDaConvertire)
											.toFormat("webp")
											.toFile(
												cartella +
													filenameConEstensione.replace(/\.[^/.]+$/, ".webp")
											)
											.then((info) => {
												fs.unlink(cartella + fileDaConvertire, (err) => {
													if (err) {
														console.error(
															`Errore durante l'eliminazione del file ${fileDaConvertire}: ${err}`
														);
													} else {
														renameImage(nome + "_" + prezzo, id_prodotto);
													}
												});
											})
											.catch((err) => {
												console.error("Error converting to WebP:", err);
											});
									} else {
										console.log("File non trovato.");
									}
								});
							});
						})
						.catch((error) => {
							console.log(error);
						});
				})
				.catch((error) => {
					console.log(error);
				});

			res.header("Access-Control-Allow-Origin", "*");
			res.send("Prodotto aggiunto con successo");
			res.end();
		}
	});
});

server.post("/producer/delete/product", (req, res) => {
	const { id } = req.body;

	let query = `DELETE from prodotti WHERE id = '${id}';`;
	let fileDaEliminare = "";

	connection.query(query, (err, result) => {
		if (err) {
			console.log(err);
			res.send(err);
			res.end();
		} else {
			let cartella = "../server/image/products";

			const queryPromise = new Promise((resolve, reject) => {
				fs.readdir(cartella, (err, files) => {
					if (err) {
						console.error("Errore durante la lettura della cartella:", err);
						return;
					}

					fileDaEliminare = files.find((file) => file.startsWith(id + "."));

					if (fileDaEliminare) {
						resolve(fileDaEliminare);
					} else {
						reject("File non trovato.");
						console.log("File non trovato.");
					}
				});
			});

			queryPromise
				.then((fileDaEliminare) => {
					const pathImg = cartella + "/" + fileDaEliminare;

					fs.unlink(pathImg, (err) => {
						if (err) {
							console.error(
								`Errore durante l'eliminazione del file ${fileDaEliminare}: ${err}`
							);
							// Gestisci l'errore come preferisci
						} else {
							console.log(
								`Il file ${fileDaEliminare} è stato eliminato con successo`
							);
						}
					});

					res.send("Prodotto eliminato");
					res.end();
				})
				.catch((error) => {
					console.log(error);
					res.send("Errore eliminazione");
					res.end();
				});
		}
	});
});

function renameImage(nome_file, id_prodotto) {
	const cartella = "../server/image/products";
	const nomeFileSenzaEstensione = nome_file;

	// Leggi tutti i file nella cartella
	fs.readdir(cartella, (err, files) => {
		if (err) {
			console.error("Errore durante la lettura della cartella:", err);
			return;
		}

		// Cerca il file senza estensione nella lista dei file
		const fileDaRinominare = files.find((file) =>
			file.startsWith(nomeFileSenzaEstensione)
		);

		if (fileDaRinominare) {
			const estensioneFile = path.extname(fileDaRinominare);
			const percorsoCompletoAttuale = path.join(cartella, fileDaRinominare);
			const nuovoNomeFileConEstensione = id_prodotto + estensioneFile; // Sostituisci con il nuovo nome e l'estensione desiderati
			const percorsoCompletoNuovo = path.join(
				cartella,
				nuovoNomeFileConEstensione
			);

			// Rinomina il file
			fs.rename(percorsoCompletoAttuale, percorsoCompletoNuovo, (err) => {
				if (err) {
					console.error("Errore durante il cambio nome del file:", err);
				}
			});
		} else {
			console.log("File non trovato.");
		}
	});
}

function checkMensaCancellata(id, resolve) {
	let query = `SELECT * FROM utenti WHERE id=${id};`;
	console.log(query);
	connection.query(query, (err, result) => {
		if (err) throw new Error(err);
		if (result[0].id_mensa == null) {
			console.log("Mensa cancellata");
			resolve(false);
		} else {
			resolve(true);
		}
	});
}

const port = 6969;
server.listen(port, () => {
	console.log("http://localhost:" + port);
});
