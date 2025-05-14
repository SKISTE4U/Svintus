function CanPlayThisCard(card) {
    /* Take card name without .png */
    let current_card = document.querySelector('#current_card').src.split('/').at(-1).split('.')[0]
    let current_card_name = current_card.split('_')[0]
    let current_card_color = current_card.split('_')[1]
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

function PlayebleCardsHighlight() {
    let cards = document.querySelector('#your_cards').querySelectorAll('img')
    for (let x = 0; x < cards.length; x++) {
        const element = cards[x].src.split('/').at(-1).split('.')[0];
        cards[x].removeAttribute('class')
        if(LastPlayed.length > 1){
            LastPlayed = []
        }
        if(LastPlayed.length > 0){
            console.log('dfsfd')
            if(checkStringInArray(element,LastPlayed)['found']){
                cards[x].classList.add('can_play')
            }
            else{
                cards[x].classList.add('cannot_play')
            }
            continue
        }
        if(CanPlayThisCard(element)){
            cards[x].classList.add('can_play')
        }
        else{
            cards[x].classList.add('cannot_play')
        }
    }
}
function HighlightOnlyOneCard(element) {
    let cards = document.querySelector('#your_cards').querySelectorAll('img')
    for (let x = 0; x < cards.length; x++) {
        cards[x].removeAttribute('class')
        cards[x].classList.add('cannot_play')
    }
    element.removeAttribute('class')
    element.classList.add('can_play')
}

function CheckNeedToTakeCard() {
    let current_card = document.querySelector('#current_card').src.split('/').at(-1).split('.')[0]
}

function CanPlayMore() {
    let cards = document.querySelector('#your_cards').querySelectorAll('img')
    for (let x = 0; x < cards.length; x++) {
        const element = cards[x].src.split('/').at(-1).split('.')[0];
        let temp = checkStringInArray(element,LastPlayed)
        if(CanPlayAfterDouble){
            PlayebleCardsHighlight()
            CanPlayAfterDouble = false
            return true
        }
        if(temp['found']){
            CanPlayAfterDouble = true
            return true
        }
        
    }
}

function play_card(e){
    let card = e.currentTarget
    let card_name = card.src.split('/').at(-1)
    try{
        card_name = card_name.split('.')[0]
    }
    catch{}
    LastPlayed.push(card_name)
    if(CanPlayThisCard(card_name) && !Polisvin){
        console.log('Сыграл - '+card_name)
        animateToCenter(card,500)
        document.getElementById('current_card').src = 'assets/cards/'+card_name+'.png'
        send_message('play_card',{card:card_name,next_turn:false})
        
        if(card_name == 'polisvin'){
            let color_picker = document.querySelector('.color_picker')
            color_picker.style.display = 'flex'
            color_picker.style.animation = 'ColorPickerShow .5s forwards cubic-bezier(1,2.06,.54,.83)'
            Polisvin = true
        }
    }
    else{
        if(Polisvin){
            $('#current_card').notify("Сначала выберите цвет", {position:'bottom center'});
        }
        else{
            $('#current_card').notify("Вы не можете сыграть эту карту", {position:'bottom center'});
        }
    }
    if(CanPlayMore()){
        can_play_more = true
        $.notify('Вы можете сделать еще один ход','success')
    }
    else{
        PlayebleCardsHighlight()
        can_play_more = false
        $.notify('Ход закончился')
        LastPlayed = []
    }
    send_message('update_all',{'gg':'gg'})
}

function PolisvinPickColor(color, sendMessage = true) {
    document.getElementById('current_card').src = 'assets/cards/polisvin_'+color+'.png'
    Polisvin = false
    let color_picker = document.querySelector('.color_picker')
    color_picker.style.animation = 'ColorPickerRemove .5s forwards cubic-bezier(.63,-0.61,.9,.79)'
    setTimeout(() => {
        color_picker.style.display = 'none'
    }, 500);
    if(!can_play_more){
        PlayebleCardsHighlight()
    }
    animateColorPicker(color)
    if(sendMessage){
        send_message('polisvin',{"color":color})
    }
    
}
function take_card() {
    let random_int = randint(0,100)
    let picked_image = ''
    // # 40 спец карт - 35%
    // # 8 серых - 7% 
    // # 64 цифр - 58%
    if(random_int < 70){
        picked_image = choice(nums_cards)
        // img.src = 'assets/cards/'+choice(self.cards_num)+'_'+choice(colors)+'.png'
    }
    else if (random_int >= 70 && random_int < 90){
        picked_image = choice(spec_cards)
        // img.src = 'assets/cards/'+choice(self.spec_cards)+'_'+choice(colors)+'.png'
    }
    else{
        picked_image = choice(gray_cards)
        // img.src = 'assets/cards/'+choice(gray_cards)+'.png'
    }
    AddCardToHand(picked_image)
    CardInHandListener()
    animateCardFromTo(picked_image,KOLODA_POS,HAND_POS,500)
    send_message('take_card',{'taked_card':picked_image})
    setTimeout(function () {
        for (let x = 0; x < hand.querySelector('img').length; x++) {
            const element = hand.querySelector('img')[x];
            if(CanPlayThisCard(element.src.split('/').at(-1).split('.')[0])){
                break
            }
            else{
                take_card()
            }
        }
    },200)
    send_message('update_all',{'gg':'gg'})
}

function clearHand() {
    document.querySelector('#your_cards').innerHTML = ''
}

// function takeCard() {
//     PlayebleCardsHighlight()
//     AddCardToHand('0_r')
//     CardInHandListener()
// }

function AddCardToHand(card_name) {
    let hand = document.querySelector('#your_cards')
    let img = document.createElement('img')
    img.src = 'assets/cards/'+card_name+'.png'
    img.addEventListener('click', play_card)
    
    animateCardFromTo(card_name,KOLODA_POS,HAND_POS,500)
    setTimeout(function(){
        hand.appendChild(img)
        CardInHandListener()
        PlayebleCardsHighlight()
    },350)
    send_message('update_all',{'gg':'gg'})
}

function go_turn(turn, players) {
    let temp = ['circle','rect','triangle','cross']
    document.querySelector('.turn').querySelector('img').src = 'assets/turn_'+choice(temp)+'.png'
    let needed_player = players[turn]['name']
    if(needed_player == MyName){
        animateElementTo(document.querySelector('.turn'),document.querySelector('#your_cards'))
    }
    else{
        let persons = document.querySelectorAll('.person')
        for (let x = 0; x < persons.length; x++) {
            const element = persons[x];
            console.group('Turn')
            console.log(element.querySelector('.name').innerHTML)
            console.log(needed_player)
            console.groupEnd()
            if(element.querySelector('.name').innerHTML == needed_player){
                animateElementTo(document.querySelector('.turn'),element)
            }
        }
    }
    
}

function change_turn_around(turnaround) {
    let div = document.querySelector('.turn_around')
    if(turnaround){
        div.querySelector('img').src = 'assets/rotate.png'
        div.style.animation = 'turn_around_true 2s forwards'
    }
    else{
        div.querySelector('img').src = 'assets/rotate_flip.png'
        div.style.animation = 'turn_around_false 2s forwards'
    }
}