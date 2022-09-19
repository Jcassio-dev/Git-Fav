import { GithubUser } from "./GithubUsers.js"


export class Favorites{
    constructor(root){
        this.root = document.querySelector(root)

        this.load()
    }
 

    load() {
        this.entries = JSON.parse(localStorage.getItem(`@github-favorites:`)) || []

    }
    save(){
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
    }

    async Add(username){
        try{
        const userExist = this.entries.find(entry => entry.login.toUpperCase() === username.toUpperCase())

        if(userExist){
            throw new Error('Usuário já cadastrado')
        }
        const user = await GithubUser.search(username)

        if(user.login === undefined){
            throw new Error('Este usuário não existe')
        }

        this.entries = [user, ...this.entries]

        this.update()
        this.save()
        }catch(error){
            alert(error.message)
        }
    }
    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }
}

