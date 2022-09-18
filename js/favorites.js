export class GithubUser{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`


        return fetch(endpoint).then(data => data.json()).then(
            ({login, name, public_repos, followers}) => ({
                login,
                name,
                public_repos,
                followers
            }))
    }
    
}


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
    update(){
       this.deleteAllTr()
        
        this.verifyTd()

        this.entries.forEach(user => {
            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de ${user.name}`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = `/${user.login}`
            row.querySelector('.public_repos').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers    

            row.querySelector('.remove').onclick = ()=>{
                const isOk = confirm(`Tem certeza que deseja deletar ${user.name}?`)
                if(isOk){
                this.delete(user)
                }
            }


            this.tbody.append(row)
        })
        

    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `  
        <tr>
        <td class="user">
                <img src="https://github.com/maykbrito.png" alt="Imagem de maykbrito">
                <a href="https://github.com/maykbrito">
                <p>Mayk Brito</p>
                <span>/maykbrito</span>
            </a>
        </td>
        <td class="public_repos">193</td>
        <td class="followers">34324</td>
        <td>
        <button class="remove">Remover</button>
        </td>
    </tr>`

    return tr

    }

    deleteAllTr(){


        this.tbody.querySelectorAll('tr').forEach( tr =>{
            tr.remove()
        })
    }
    verifyTd(){
        const noFav = this.root.querySelector('.noFav')
        
        this.entries.length == 0 ? noFav.classList.remove('hidden') : noFav.classList.add('hidden')
    }
}