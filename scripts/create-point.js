//o document query vai pegar o campozinho select, que vai listar os estados
// p nao pegar qualquer select eu coloco o name = uf para ele pegar o que 
// precisamos
// a notação que ta como segundo argumento do EventListener é o mesmo que
// fazer um function(...) de função anonima, mas é outro tipo de escrita

/*document.querySelector("select[name = uf]").addEventListener("change", () => {
    console.log("mudei")
})*/

function populateUFs(){
    const ufSelect = document.querySelector("select[name = uf]");
    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((res) => {return res.json()}) // aqui estamos pegando e retornando como um json, para conseguir acessar campos
    // o parenteses do (res) é desnecessario por ser só 1 parametro, assim como o {} do return 
    .then( states => { 
        // for each
        for(state of states){
            //usando o inner html para conseguirmos alterar o query select
            // pego la em cima pela query, e o += é p deixar primeiro o
            // "selecione estado" que é o padrão, e add na lista o resto pego pelo fetch
            ufSelect.innerHTML += `<option value= "${state.id}"> ${state.nome} </option>`
        }
    })
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")
    // o target mostra de onde veio o evento, e o value vai pegar o id do item selecionado no select
    const ufValue = event.target.value
    // input foi criado p não ficar aquele dado na url
    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text
    citySelect.innerHTML = "<option value> Selecione a Cidade</option>"
    citySelect.disabled = true
    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`
    fetch(url)
    .then((res) => {return res.json()})
    .then( cities => { 
        
        for(city of cities){
            citySelect.innerHTML += `<option value= "${city.nome}"> ${city.nome} </option>`
        }
        citySelect.disabled = false
    })
}

document.querySelector("select[name = uf]")
    // o get cities como segundo parametro faz c que cada vez que change
    // ele faça a função, se eu tivesse colocado getCities() com parenteses
    // ele iria já execultar, mas querermos que ele espere
    .addEventListener("change", getCities)

const collectedItems = document.querySelector("input[name=items]")
let selectedItems = [];

function handleSelectedItem(event){
    const itemLi = event.target
    // adicionar ou remover uma classe, para quando clicar no item
    // utilizando o classList permite que use as classes de forma mais simples
    // ao inves do toggle poderia ser .add ou .remove mas o toggle faz isso
    itemLi.classList.toggle("selected")

    const itemId = itemLi.dataset.id
    const alreadySelected = selectedItems.findIndex( item =>{
        // essa função vai iterar pelo array procurando o elemento igual,
        // p permitir que o findIndex dê o index
        return item == itemId
    })

    if(alreadySelected >= 0){
        // nesse caso ele já esta na seleção e foi clicado novamente, então precisamos retirar
        const filteredItems = selectedItems.filter( item => {
            // essa função vai iterar pela outra, e no final devolve um array novo
            // para filteredItems, só com o que vai continuar
            return item != itemId // como o que vai retornar true é tudo o que não é o que foi selecionado de novo, filtra    
        })
        selectedItems = filteredItems
    }else{
        // nesse caso o elemento nao esta no array
        selectedItems.push(itemId)
    }
    // atualiza sempre ao fim p pegar so o que foi selecionado
    collectedItems.value = selectedItems
    
}
// Itens de coleta, precisamos adicionar evento a todos os itens
const itemsToCollect = document.querySelectorAll(".items-grid li")
for (item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem);
}



