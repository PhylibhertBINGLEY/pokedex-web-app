import {Pokemon} from "./Pokemon.mjs";


class PokemonService{
	constructor(data){ 
		this.array = new Array();
	}
	
	//the array implementation is not async but we must stick to the interface
	static async create(){ 
		//Nothing more to do, here
		return new PokemonService();
	}

	//the array implementation is not async but we must stick to the interface
    // méthode permettant de créer un pokemon
	async addPokemon(name, type, ability){
        let newPokemon = new Pokemon({name: name, type: type , ability: ability});
        if (newPokemon !== undefined) {
            this.array.push(newPokemon);
            console.log("just created a Pokemon" + newPokemon);
        } else {
            throw new Error("cannot find Pokemon of id ${id}");
        }
	}

	//the array implementation is not async but we must stick to the interface
    // méthode permettant de supprimer un pokemon
	async removePokemon(id){	
		let indice = -1
        for (let k = 0; k < this.array.length; k++) {
            if (this.array[k].id == id) {
                indice = k
            }
        }
        if (indice != -1) {
            this.array.splice(indice, 1)
            console.log("cannot find Pokemon of id : " + id)
        }
        else {
            console.log("Erreur")
        }
	}

    // méthode qui permet de retourner la liste des pokemons enregistrés 
	getPokemons(){
		return this.array;
	}

}

export {PokemonService}
