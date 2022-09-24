import { Favorites } from "./Favorites.js"

export class FavoritesView extends Favorites {
    constructor(root){
        super(root)

         this.tbody = this.root.querySelector('table .fav')

        this.update()
        this.onAdd()
       
    }

    onAdd(){
        const addButton = this.root.querySelector('.search button')

        addButton.addEventListener('click', () => {
            const {value} = this.root.querySelector('.search input')

            this.Add(value)
        }) 
        window.addEventListener('keydown', e =>{
            if(e.key == 'Enter'){
                const {value} = this.root.querySelector('.search input')

                this.Add(value)
            }
        })
    }
   
}