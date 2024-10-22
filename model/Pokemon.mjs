class Pokemon{
  constructor(data){   
    if(undefined != data.id) { // id = key du pokemon
      this.id = data.id;
    } else {
      this.id = parseInt(    Math.floor(Math.random() * Math.floor(100000))     );
    }
    if(undefined != data.name) { // name = nom du pokemon 
      this.name = data.name;
    } else {
      this.name = "";
    }
    if(undefined != data.type) { // type d'un pokemon
      this.type = data.type;
    } else {
      this.type = "type par défaut";
    }
    if(undefined != data.ability) { // talent d'un pokemon
      this.ability = data.ability;
    } else {
      this.ability = "talent par défaut";
    }
  }
}

export {Pokemon}