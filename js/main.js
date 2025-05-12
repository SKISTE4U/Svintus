
function JoinTheGame() {
    let ip = document.querySelector('#SERVER_IP').value
    let name = document.querySelector('#MY_NAME').value
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
function AddCardToHand() {
    let cardsDiv = document.getElementById('your_cards')
    let img = document.createElement('img')
    img.src = 'assets/cards/one_white.png'
    cardsDiv.appendChild(img)
    CardInHandListener()
}
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
function arrangePlayersInSemicircle(playerCount) {
    const container = document.querySelector('#players');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;
    
    container.innerHTML = '';
    
    // Углы для настоящего полукруга (от -90° до +90° относительно центра)
    const startAngle = -Math.PI;  // -90 градусов (крайний левый)
    const endAngle = 0;      // +90 градусов (крайний правый)
    const angleStep = (endAngle - startAngle) / (playerCount - 1 || 1);
  
    for (let i = 0; i < playerCount; i++) {
      const player = document.createElement('div');
      player.className = 'person';
      player.innerHTML = `
      <div class="name">SKiSTE</div>
            <div class="flex_row">
                <div class="cardsAmount">8</div>
                <div class="photo"><img src="assets/person.png" alt=""></div>
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