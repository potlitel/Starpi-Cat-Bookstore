const APIURL = 'http://localhost:1337'
let value;
const CatsAPIURL = 'http://localhost:1337/api/cats/'

const form = document.getElementById('form')
const search = document.getElementById('search')
const main = document.getElementById('main')

async function getUser(username) {
    try {
        const {data} = await axios(CatsAPIURL+username+"?populate=raza,perfil_image")
        //data.bio = !!data.bio !== false ? data.bio : 'No description' ;
        console.info(data)
        createUserCard(data)
        //getRepos(username)

    } catch(err) {
        if(err.response.status == 404) {
            createErrorCard('No se ha encontrado ninguna raza de gatos que coincida con el criterio de búsqueda especificado')  
        }
    }     
}

async function getRepos(username){
    try {
        const {data} = await axios(APIURL + username + '/repos?sort=created')

        addReposToCard(data)

    } catch(err){
            createErrorCard('Problem fetching repos')
    }   
}

function createUserCard(user) {
    const cardHTML = `
        <div class="card">
            <div>
             <img src="${APIURL}${user.data.attributes.perfil_image.data.attributes.url}" alt="${user.data.attributes.raza.data.attributes.nombre}" class="avatar">
            </div>
            <div class="user-info">
                <h2>${user.data.attributes.raza.data.attributes.nombre}</h2>
                <p>${user.bio}</p>
                <ul>
                    <li>${user.followers} <strong>Followers</strong></li>
                    <li>${user.following} <strong>Following</strong></li>
                    <li>${user.public_repos} <strong>Repos</strong></li>
                </ul>

            <div id="repos"></div>   
            </div>
        </div>
    `
    main.innerHTML = cardHTML
}

function createErrorCard(msg) {
    const cardHTML = `
        <div class="card">
            <h1>${msg}</h1>
        </div>
    `

    main.innerHTML = cardHTML
}

function addReposToCard(repos) {
    const reposEl = document.getElementById('repos')

    repos.slice(0, 12).forEach(repo => {
            const repoEl = document.createElement('a')
            repoEl.classList.add('repo')
            repoEl.href = repo.html_url
            repoEl.target = '_blank'
            repoEl.innerText = repo.name

            reposEl.appendChild(repoEl)
        
    })

}

form.addEventListener('submit', (e) => {
    e.preventDefault()

    const user = search.value

    if(user) {
        getUser(user)

        search.value = ''
    }

})