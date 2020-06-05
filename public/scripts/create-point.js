function populateUFs() { 
    const ufSelect = document.querySelector("select[name=uf]")

    fetch("https://servicodados.ibge.gov.br/api/v1/localidades/estados")
    .then((res) => {return res.json()}) // vai pegar o resultado e transformar em json
    .then( states => {

        for(const state of states){ //vai colocar cada estado em uma variavel separada
            ufSelect.innerHTML += `<option value="${state.id}">${state.nome}</option>`
        }
        
    } )
}

populateUFs()

function getCities(event){
    const citySelect = document.querySelector("select[name=city]")
    const stateInput = document.querySelector("input[name=state]")




    const ufValue = event.target.value
    // o target vai pegar o .querySelector("select[name=uf]") que disparou o evento
    // e o value , vai pegar o valor do estado selecionado Ex: Rio de Janeiro = 33

    const indexOfSelectedState = event.target.selectedIndex
    stateInput.value = event.target.options[indexOfSelectedState].text

    const url = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${ufValue}/municipios`

    citySelect.innerHTML = "<option value>Selecione a cidade</option>"
    citySelect.disabled = true

    fetch(url)
    .then((res) => {return res.json()})// vai pegar o resultado e transformar em json
    .then( cities => {
        
        for(const city of cities){ //vai colocar cada estado em uma variavel separada
            citySelect.innerHTML += `<option value="${city.nome}">${city.nome}</option>`
        }
    
        citySelect.disabled = false
    } )
    
}


document
    .querySelector("select[name=uf]")
    .addEventListener("change", getCities)//vai ou ouvir qualquer evento de mudança
    //Nao colocou a funçao assim = getCities()  , pois nao queremos que execute na hora , e sim somente quando detectar o CHANGE 




// ------------------------------------- Items de Coleta--------------------------------
//pegar todos os li`s

const itemsToCollect = document.querySelectorAll(".items-grid li")

for (const item of itemsToCollect){
    item.addEventListener("click", handleSelectedItem)
}

const collectedItems =  document.querySelector("input[name=items]")

let selectedItems = []

function handleSelectedItem(event){
    const itemLi = event.target

    //acionar ou remover um classe com javascript
    itemLi.classList.toggle("selected")

    const itemsId = itemLi.dataset.id
    //console.log(event.target.dataset.id)
    // console.log('ITEM ID : ', itemId)
    
    //Verificar se existem items selecionados,
    //caso seja verdadeiro pegar os itens selecionados
    const alreadySelected = selectedItems.findIndex(function(item){
        const itemFound = item == itemsId //Isso será true ou false
        return itemFound
    } )

    //Se já estiver selecionado, tirar da selecao
    if(alreadySelected >= 0){
        //tirar da selecao
        const filteredItems = selectedItems.filter( item => {
            const itemIsDifferente = item != itemsId
            return itemIsDifferente
        })
        selectedItems = filteredItems

    }else{
        //Se não tiver selecionado adicionar a selecao
        selectedItems.push(itemsId)
    } 
      


    // console.log('selectedItems: ', selectedItems)
    //atualizar o campo escondido com os itens selecionados
    collectedItems.value = selectedItems

}