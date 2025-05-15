function send_message(type,data) {
    socket.send(JSON.stringify({
            type: type,
            data: data
        }))
}

function OnLoadBodyEvent() {
    // Image picker for start game
    let image_picker = document.querySelector('.image_picker')
    let available_images = [
        'avatar1.jpeg','baba.jpg','frog.webp',
        'minion.jpg','motobike.jpg','ok.jpg',
        'podslushano.jpg','skeleton.jpg','spongebob.jpg',
        'wolf.jpg','ok1.jpeg','ok2.jpg',
        'ok3.webp','ok4.gif','cat.gif',
        'goat.gif','monkey.gif','avatar.gif',
        'cat2.gif','skeleton.gif','cat3.gif',
        'woman.gif','porn.gif','poop.gif',
        'man.gif','anime.gif','kaneki.gif',
        'tomato.gif','dick.gif','dick1.gif'
    ]
    for (let x = 0; x < available_images.length; x++) {
        const element = available_images[x];
        let img = document.createElement('img')
        img.setAttribute('onclick','pick_image(this)')
        img.src = 'assets/avatars/'+element
        image_picker.appendChild(img)
    }
}

function JoinTheGame() {
    let ip = document.querySelector('#SERVER_IP').value
    let name = document.querySelector('#MY_NAME').value
    MyName = name
    var handler = new Handler()

    if(ip == '' || name == ''){
        alert('Нету либо сервака, либо имени, перепроверь')
        return
    }
    window.socket = new WebSocket('ws://'+ip);
    window.socket.onclose = () => {
        alert('Произошел разрыв соеденения, перезапускаю страницу')
        location.reload()
    }
    window.socket.onerror = () => {
        alert('Произошла какая то ошибка в подключении по протоколу, перезапускаю страницу')
        location.reload()
    }
    window.socket.onopen = () => {
        window.socket.send(JSON.stringify({
            type: 'register',
            name: name,
            image:PickedImage
        }));
    }
    window.socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Получено:', message);
        
        switch(message.type) {
            case 'too_much_players':
                alert('Слишком много игроков');
                break;
            case 'welcome':
                handler.welcome()
                break
            case 'player_joined':
                // document.querySelector('#loading').querySelector('span').innerHTML = 'Кол-во игроков: '+message.data['total_players']
                console.log(message)
                document.querySelector('.loading_players').innerHTML = ''
                for (let x = 0; x < message['data']['players'].length; x++) {
                    const element = message['data']['players'][x];
                    let div = document.createElement('div')
                    div.classList.add('loading_player')
                    div.innerHTML = `
                    <img src="assets/avatars/${element.image}" alt="">
                 <span>${element.name}</span>
                    `
                    document.querySelector('.loading_players').appendChild(div)
                }
                break;
            // Другие типы сообщений...
            case 'name_exist':
                alert('Такое имя уже занято, придумай другое')
                break
            case 'start_game':
                console.log('start_game')
                document.querySelector('#loading').style.animation = 'opacity_low .3s forwards'
                setTimeout(function(){
                    document.querySelector('#loading').style.display = 'none'
                },300)
                let data = message['data']
                document.getElementById('current_card').src = 'assets/cards/'+data['start_card']+'.png'
                console.log(data)
                for (let x = 0; x < data['players'].length; x++) {
                    const element = data['players'][x];
                    console.log(element)
                    if(element['name'] == MyName){
                        clearHand()
                        let temp = PickInterval
                        for (let i = 0; i < element['hand'].length; i++) {
                            const card = element['hand'][i];
                            MyHandVar.push(card)
                            setTimeout(function () {
                                AddCardToHand(card)
                                CardInHandListener()
                            },temp)
                            temp = temp + PickInterval
                            console.log(card)
                        }
                        break
                    }
                    
                }
                let players = SortPlayers(data['players'])
                arrangePlayersInSemicircle(players)
                break
                
            case 'stop_game':
                console.log(message['data']['reload'])
                if(message['data']['reload']){
                    if(message['data']['Error']){
                        console.log()
                        alert('Произошла ошибка (Кто то отключился от игры)')
                    }
                    location.reload()
                }
                break

            case 'played_card':
                let current_card = document.querySelector('#current_card')
                current_card.src = 'assets/cards/'+message['data']['card']+'.png'
                animatePlayedCardFromAnotherPlayer(message['data']['card'],message['data']['name'])
                PlayebleCardsHighlight()
                break

            case 'polisvin':
                // let current_card = document.querySelector('#current_card')
                // current_card.src = 'assets/cards/polisvin_'+message['data']['color']+'.png'
                PolisvinPickColor(message['data']['color'], false)
                PlayebleCardsHighlight()
                break

            case 'player_take_card':
                animatePlayedCardFromAnotherPlayer('backflip',message['data']['name'],false)
                break

            case 'update':
                let all_persons = document.querySelector('#players').querySelectorAll('.person')
                document.querySelector('#current_card').src = 'assets/cards/'+message['data']['current_card']+'.png'
                current_turn = message['data']['turn']
                go_turn(current_turn,message['data']['players'])
                for (let x = 0; x < message['data']['players'].length; x++) {
                    const data = message['data']['players'][x];
                    for (let i = 0; i < all_persons.length; i++) {
                        const person = all_persons[i];
                        if(data['name'] == person.querySelector('.name').innerHTML){
                            person.querySelector('.cardsAmount').innerHTML = message['data']['players'][x]['hand'].length
                        }
                        else{
                            document.querySelector('#your_cards').innerHTML = ''
                            for (let y = 0; y < data['hand'].length; y++) {
                                const element = data['hand'][y];
                                AddCardToHand(element)
                            }
                        }
                        
                    }
                }
                break
            case 'error':
                $.notify(message['data']['message'])
                send_message('update_all',{'dummy':'dummy'})
                break

            case 'update_local':
                let hand = message['data']['hand']
                document.querySelector('#your_cards').innerHTML = ''
                for (let y = 0; y < data['hand'].length; y++) {
                    const element = data['hand'][y];
                    AddCardToHand(element)
                }
                document.querySelector('#current_card').src = 'assets/cards/'+message['data']['current_card']+'.png'
        }
    };
}

function CardInHandListener() {
    let cardsDiv = document.getElementById('your_cards')
    let width = cardsDiv.clientWidth - CardSize[1]
    let cards = cardsDiv.querySelectorAll('img')
    let cardsAmount = cards.length
    let margin = 0

    for (let x = 0; x < cards.length; x++) {
        const element = cards[x];
        element.style.marginLeft = margin +'px'
        margin = margin + (width/cardsAmount)
    }
}
// function AddCardToHand() {
//     let cardsDiv = document.getElementById('your_cards')
//     let img = document.createElement('img')
//     img.src = 'assets/cards/one_white.png'
//     cardsDiv.appendChild(img)
//     CardInHandListener()
// }
function pick_image(picked_element) {
    console.log('df')
    let all_images = document.querySelector('#login').querySelectorAll('img')
    for (let x = 0; x < all_images.length; x++) {
        const element = all_images[x];
        if(element.classList.contains('picked_image')){
            element.classList.remove('picked_image')
        }
    }
    picked_element.classList.add('picked_image')
    let name = picked_element.src.split('/').at(-1)
    PickedImage = name
}
