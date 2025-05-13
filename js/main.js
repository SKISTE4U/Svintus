
function JoinTheGame() {
    let ip = document.querySelector('#SERVER_IP').value
    let name = document.querySelector('#MY_NAME').value
    MyName = name
    var handler = new Handler()

    if(ip == '' || name == ''){
        alert('Нету либо сервака, либо имени, перепроверь')
        return
    }
    socket = new WebSocket('ws://'+ip);
    socket.onopen = () => {
        socket.send(JSON.stringify({
            type: 'register',
            name: name,
            image:PickedImage
        }));
    }
    socket.onmessage = (event) => {
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
                arrangePlayersInSemicircle(data['players'])
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
function arrangePlayersInSemicircle(players) {
    const container = document.querySelector('#players');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;

    for (let x = 0; x < players.length; x++) {
        const element = players[x];
        if(element['name'] == MyName){
            players.splice(x,1)
        }
    }
    
    container.innerHTML = '';
    
    // Углы для настоящего полукруга (от -90° до +90° относительно центра)
    const startAngle = -Math.PI;  // -90 градусов (крайний левый)
    const endAngle = 0;      // +90 градусов (крайний правый)
    const angleStep = (endAngle - startAngle) / (players.length - 1 || 1);
    console.log(players.length)
    
    for (let i = 0; i < players.length;i++) {
        console.log('aaa')
        const element = players[i]
        
        const player = document.createElement('div');
        player.className = 'person';
        player.innerHTML = `
        <div class="name">${element['name']}</div>
                <div class="flex_row">
                    <div class="cardsAmount">${element['hand'].length}</div>
                    <div class="photo"><img src="assets/avatars/${element['image']}" alt=""></div>
                </div>`
        container.appendChild(player);
        
        const angle = startAngle + angleStep * i;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        
        player.style.left = `${x - 80}px`;  // 50 = половина ширины игрока
        player.style.top = `${y - 75}px`;   // 75 = половина высоты
        
        // Поворот карт/аватаров к центру
        const degrees = angle * (180/Math.PI);
        //   player.style.transform = `rotate(${degrees}deg)`;
    }
  }