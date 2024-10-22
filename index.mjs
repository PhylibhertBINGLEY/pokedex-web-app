import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import {Pokemon} from "./model/Pokemon.mjs";

import { PokemonService } from "./model/PokemonService_ArrayImpl.mjs";

let PokemonServiceInstance;

const app = express()
const port = 3001

let typesArray = [];
let abilitiesArray = [];

// chargement des JSON 
fs.readFile('types.json', (err, data) => {
    if (err) throw err;
    typesArray = JSON.parse(data);
});
fs.readFile('abilities.json', (err, data) => {
    if (err) throw err;
    abilitiesArray = JSON.parse(data);
});



//Body-parser is the Node.js body parsing middleware. It is responsible for parsing the incoming request bodies in a middleware before you handle it
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))


/*
View engine est le moteur de vue qu'on utilise. On doit dire ou se trouve les fichiers modèles.
The app.set(name,value) function is used to assigns the setting name to value. You may store any value that you want, but certain names can be used to configure the behavior of the server
*/
app.set('view engine', 'ejs');

//Express uses middleware : the "next" callback is the following middleware in the pipeline. 
//Here, it is the app.use(... res.render('pages/form'...) code.   
app.get('/', (req, res, next) => {
	//nothing to do
	next();
});


/*
La fonction sera appellée dans la requete post. Elle applique PokemonServiceInstance et permet de récupérer les champs que l'on rentre
*/
async function myAwsomcallBack(req, res, next) {

	PokemonServiceInstance
		.addPokemon(req.body.name, req.body.type, req.body.ability)
		.then((strResult) => { console.log(strResult) }) //affiche les resultats des noms, types, talents que l'on rentre

		/** Lignes de test
		 * .then(console.log(req.body.id)) 
		 * .then(console.log(PokemonServiceInstance.getPokemons())) 
		 * .then(console.log(PokemonServiceInstance.getPokemons()[0].type))
		 * .then(console.log(tabPokemon[tabPokemon.length - 1]))
		 */

		.catch((e) => { console.error(`add Pokemon error : ${e}`) });

	let Pokemon = PokemonServiceInstance.getPokemons(); //tableau contenant toutes les pokemons
	const element = Pokemon.find(y => y.name == req.body.name); // on récupére l'élèment qu'on a crée
	let indexElement = Pokemon.indexOf(element); // on récupère l'index de l'élèment qu'on a crée 
	let id = Pokemon[indexElement].id; // on récupère l'id (= key du pokemon)
	let type = Pokemon[indexElement].type; // on récupère le type
	let ability = Pokemon[indexElement].ability; // on récupère l'abilité 

	// on enregistre le pokemen crée dans le fichier texte données.txt
	fs.appendFile('données.txt', "KEY : " + id + " ; " + "NAME : " + req.body.name + " ; " + "TYPE : " + type + " ; " + "ABILITY : " + ability + " ; " + "\n", function (err) { if (err) { console.log('Fichier créé !'); } });

	next();
}

//Permet de créer un pokemon
app.post('/', myAwsomcallBack);


//Permet de supprimer un pokemon
app.post('/delete', async (req, res, next) => {

	let i;
	let Pokemon = PokemonServiceInstance.getPokemons(); //tableau contenant toutes les pokemons, que l'on va maj
	let data = ""; // pour stocker les données maj à réecrire dans données.txt 
	const aSupprimerElement = Pokemon.find(y => y.id === parseInt(req.body.id)); // on récupére l'élèment qu'on veut supprimer 
	let aSupprimerIndex = Pokemon.indexOf(aSupprimerElement); // on récupère l'index de l'élèment à supprimer 

	Pokemon.splice(aSupprimerIndex, 1); // maj du tableau : on retire l'élèment à supprimer du tableau des pokemons, à partir de son index

	/** Lignes de test
	 * console.log(aSupprimerElement); 
	 * console.log(aSupprimerIndex);
	 * console.log(Pokemon);
	 */

	for (i = 0; i < Pokemon.length; i++) { // on va de 0 à (Pokemon.length - 1) car ainsi l'ordre d'écriture reste cohérent : on aura toujours le plus vieille élèment en tête du fichier texte données.txt
		data = data + "KEY : " + Pokemon[i].id + " ; " + "NAME : " + Pokemon[i].name + " ; " + "TYPE : " + Pokemon[i].type + " ; " + "ABILITY : " + Pokemon[i].ability + " ; " + "\n";//on réecrit le contenu souhaité dans la variable data, sachant que le tableau "Pokemon" ne contient plus l'élèment à supprimer
	}

	//on remplace le contenu de données.txt grâce à la variable data
	fs.writeFile('données.txt', data, function (err) { if (err) throw err; console.log('Fichier mis à jour !'); })

	// on supprime la tâche
	PokemonServiceInstance.removePokemon(parseInt(req.body.id))

	res.redirect("/");

})


//Permet de modifier un pokemon
app.post('/update', async (req, res, next) => {

	let i;
	let PokemonArray = PokemonServiceInstance.getPokemons(); //tableau contenant toutes les pokemons, que l'on va maj
	let data = ""; // pour stocker les données maj à réecrire dans données.txt 


	// on va commencer par supprimer l'élèment qu'on veut modifier 
	const modifElement = PokemonArray.find(y => y.id === parseInt(req.body.id)); // on récupére l'élèment qu'on veut modifier (pour supprimer l'élèment dans un premier temps)
	let modifIndex = PokemonArray.indexOf(modifElement); // on récupère l'index de l'élèment à modifier
	PokemonArray.splice(modifIndex, 1); // maj du tableau : on retire l'élèment à modifier du tableau des pokemon, à partir de son index


			// on va ensuite remplacer l'élèment supprimé par un nouvel élèment 
			const newElement = new Pokemon({name: req.body.name, type: req.body.type, ability: req.body.ability});
			PokemonArray.splice(modifIndex, 0, newElement); // on remplace l'élèment supprimé par un nouvel élèment 

			for (i = 0; i < PokemonArray.length; i++) { // on va de 0 à (PokemonArray.length - 1) car ainsi l'ordre d'écriture reste cohérent : on aura toujours le plus vieille élèment en tête du fichier texte données.txt
				data = data + "KEY : " + PokemonArray[i].id + " ; " + "NAME : " + PokemonArray[i].name + " ; " + "TYPE : " + PokemonArray[i].type + " ; " + "ABILITY : " + PokemonArray[i].ability + " ; " + "\n";//on réecrit le contenu souhaité dans la variable data
			}

			//on remplace le contenu de données.txt grâce à la variable data
			fs.writeFile('données.txt', data, function (err) { if (err) throw err; console.log('Fichier mis à jour !'); })


			res.redirect("/");

})


app.use((req, res, next) => {
	res.render('pages/form', { // render permet de gérer ce qui est afficher sur la page 
		list: PokemonServiceInstance.getPokemons(),
		typesArray: typesArray, 
		abilitiesArray: abilitiesArray
	 });
	next();
})


PokemonService
	.create() //On applique la méthode créate qui est une promesse d'objet 
	.then(ts => {
		PokemonServiceInstance = ts; //instanciation de PokemonService
		app.listen(port, () => {
			console.log(`Example app listening at http://localhost:${port}`) // on est obligé de chainer la promesse 
		});
	});


