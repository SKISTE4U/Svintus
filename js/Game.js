function CanPlayThisCard(card) {
    /* Take card name without .png */
    let current_card = document.querySelector('#current_card').src.split('/').at(-1).split('.')[0]
    let current_card_name = current_card.split('_')[0]
    let current_card_color = current_card.split('_')[1]
    console.log(card)
    
    if(card == 'polisvin'){
        return true
    }
    let taked_card_name = card.split('_')[0]
    let taked_card_color = card.split('_')[1]
    if(taked_card_color == current_card_color){
        return true
    }
    if(taked_card_name == current_card_name){
        return true
    }
    return false
}

function CanPlayTwoCards(card) {
    let cards = document.querySelector('#your_cards').querySelectorAll('img')
    for (let x = 0; x < cards.length; x++) {
        const element = cards[x];
        let name = element.src.split('/').at(-1).split('.')[0]
        if(card == name){
            return true
        }
    }
    return false
}

function PlayebleCardsHighlight() {
    let cards = document.querySelector('#your_cards').querySelectorAll('img')
    for (let x = 0; x < cards.length; x++) {
        const element = cards[x].src.split('/').at(-1).split('.')[0];
        cards[x].removeAttribute('class')
        console.log(element)
        if(CanPlayThisCard(element)){
            cards[x].classList.add('can_play')
        }
        else{
            cards[x].classList.add('cannot_play')
        }
    }
}

function CheckNeedToTakeCard() {
    let current_card = document.querySelector('#current_card').src.split('/').at(-1).split('.')[0]
}

function play_card(e){
    let card = e.currentTarget
    let card_name = card.src.split('/').at(-1)
    try{
        card_name = card_name.split('.')[0]
    }
    catch{}
    if(CanPlayThisCard(card_name)){
        console.log('Сыграл - '+card_name)
        animateToCenter(card,500)
        document.getElementById('current_card').src = 'assets/cards/'+card_name+'.png'
        PlayebleCardsHighlight()
    }
    else{
        $.notify("Вы не можете сыграть эту карту");
    }
    
}
function clearHand() {
    document.querySelector('#your_cards').innerHTML = ''
}

function takeCard() {
    PlayebleCardsHighlight()
    AddCardToHand('0_r')
    CardInHandListener()
}

function AddCardToHand(card_name) {
    let hand = document.querySelector('#your_cards')
    let img = document.createElement('img')
    img.src = 'assets/cards/'+card_name+'.png'
    img.addEventListener('click', play_card)
    hand.appendChild(img)
    animateCardFromTo(card_name,KOLODA_POS,HAND_POS,500)
    PlayebleCardsHighlight()
}