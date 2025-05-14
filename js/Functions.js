class Handler {
    welcome(){
        document.querySelector('#login').style.animation = 'opacity_low .3s forwards'
        setTimeout(function(){
            document.querySelector('#login').style.display = 'none'
        },300)
    }
}
function test() {
    console.log('gg')
}

function randint(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function choice(arr) {
    return arr[randint(0,arr.length-1)]
}

function animateCardFromTo(card_name, from, to, duration = 500, container = window, callback) {
    // Получаем начальные координаты элемента

    let img = document.createElement('img')
    img.style.position = 'fixed';

    img.src = 'assets/cards/'+card_name+'.png'

    img.style.left = `${from[0]}px`;
    img.style.top = `${from[1]}px`;
    img.style.transform = 'none';
    img.style.transition = 'none';
    img.style.width = CardSize[0]+'px'
    img.style.height = CardSize[1]+'px'
    img.style.zIndex = 999
    img.style.animation = 'opacity_low 1s forwards'

    document.body.appendChild(img)


    const startRect = img.getBoundingClientRect();
    
    // Определяем параметры контейнера
    let containerWidth, containerHeight, containerLeft, containerTop;
    
    if (container === window) {
        containerWidth = container.innerWidth;
        containerHeight = container.innerHeight;
        containerLeft = 0;
        containerTop = 0;
    } else {
        const containerRect = container.getBoundingClientRect();
        containerWidth = containerRect.width;
        containerHeight = containerRect.height;
        containerLeft = containerRect.left;
        containerTop = containerRect.top;
    }
    
    // Вычисляем конечные координаты (центр контейнера)
    const targetX = to[0]
    const targetY = to[1]
    
    // Начальные координаты элемента
    const startX = startRect.left;
    const startY = startRect.top;
    
    // Вычисляем разницу для анимации
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    
    // var img = document.createElement('img')
    // img.src = element.src
    // img.style.position = 'fixed';
    // img.style.left = `${startX}px`;
    // img.style.top = `${startY}px`;
    // img.style.transform = 'none';
    // img.style.transition = 'none';
    // document.body.appendChild(img)
    // img.classList.add('card')
    // element.remove()
    // img.style.animation = 'opacity_low 2s forwards'
    // CardInHandListener()

    // Время начала анимации
    const startTime = performance.now();
    
    // Функция анимации
    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Используем cubic-bezier для плавности
        const easing = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Применяем трансформацию
        img.style.transform = `translate(${deltaX * easing}px, ${deltaY * easing}px)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Анимация завершена
            img.remove()
            
            
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animate);
}

function animateToCenter(element, duration = 500, container = window, callback) {
    // Получаем начальные координаты элемента
    const startRect = element.getBoundingClientRect();
    
    // Определяем параметры контейнера
    let containerWidth, containerHeight, containerLeft, containerTop;
    
    if (container === window) {
        containerWidth = container.innerWidth;
        containerHeight = container.innerHeight;
        containerLeft = 0;
        containerTop = 0;
    } else {
        const containerRect = container.getBoundingClientRect();
        containerWidth = containerRect.width;
        containerHeight = containerRect.height;
        containerLeft = containerRect.left;
        containerTop = containerRect.top;
    }
    
    // Вычисляем конечные координаты (центр контейнера)
    const targetX = containerLeft + (containerWidth / 2) - (startRect.width / 2);
    const targetY = containerTop + (containerHeight / 2) - (startRect.height / 2);
    
    // Начальные координаты элемента
    const startX = startRect.left;
    const startY = startRect.top;
    
    // Сохраняем оригинальные стили
    const originalStyle = {
        position: element.style.position,
        left: element.style.left,
        top: element.style.top,
        transform: element.style.transform,
        transition: element.style.transition
    };
    
    // Устанавливаем временные стили для анимации
    
    // Вычисляем разницу для анимации
    const deltaX = targetX - startX;
    const deltaY = targetY - startY;
    
    var img = document.createElement('img')
    img.src = element.src
    img.style.position = 'fixed';
    img.style.left = `${startX}px`;
    img.style.top = `${startY}px`;
    img.style.transform = 'none';
    img.style.transition = 'none';
    document.body.appendChild(img)
    img.classList.add('card')
    element.remove()
    img.style.animation = 'opacity_low 2s forwards'
    CardInHandListener()

    // Время начала анимации
    const startTime = performance.now();
    
    // Функция анимации
    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Используем cubic-bezier для плавности
        const easing = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Применяем трансформацию
        img.style.transform = `translate(${deltaX * easing}px, ${deltaY * easing}px)`;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Анимация завершена
            img.remove()
            
            
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animate);
}

function animateElementTo(element, which_turn_element, duration = 500, container = window, callback) {
    // Получаем текущие computed стили элемента
    const computedStyle = window.getComputedStyle(element);
    
    // Парсим текущие значения left и top (учитываем, что они могут быть 'auto' или содержать 'px')
    const startX = parseFloat(computedStyle.left) || 0;
    const startY = parseFloat(computedStyle.top) || 0;
    
    // Определяем параметры контейнера
    let containerWidth, containerHeight, containerLeft, containerTop;
    
    if (container === window) {
        containerWidth = container.innerWidth;
        containerHeight = container.innerHeight;
        containerLeft = 0;
        containerTop = 0;
    } else {
        const containerRect = container.getBoundingClientRect();
        containerWidth = containerRect.width;
        containerHeight = containerRect.height;
        containerLeft = containerRect.left;
        containerTop = containerRect.top;
    }
    
    // Вычисляем конечные координаты относительно текущей позиции элемента
    const targetRect = which_turn_element.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    
    // Разница между текущей позицией и целевой
    // const deltaX = (targetRect.left - elementRect.left) + (targetRect.width - elementRect.width) / 2;
    // const deltaY = (targetRect.top - elementRect.top) + (targetRect.height - elementRect.height) / 2;
    // const deltaX = (targetRect.left - elementRect.left);
    const deltaX = (targetRect.left - elementRect.left) - elementRect.width;
    const deltaY = (targetRect.top - elementRect.top);
    
    // Время начала анимации
    const startTime = performance.now();
    
    // Функция анимации
    function animate(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Используем cubic-bezier для плавности
        const easing = progress < 0.5 
            ? 4 * progress * progress * progress 
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;
        
        // Применяем трансформацию относительно начальной позиции
        element.style.left = (startX + deltaX * easing) + 'px';
        element.style.top = (startY + deltaY * easing) + 'px';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            if (typeof callback === 'function') {
                callback();
            }
        }
    }
    
    // Запускаем анимацию
    requestAnimationFrame(animate);
}

function animateColorPicker(color) {
    let div = document.createElement('div')

    div.style.position = 'absolute'
    div.style.borderRadius = '50%'
    div.style.zIndex = -1
    div.style.left = (window.innerWidth / 2) - 20+'px'
    div.style.top = (window.innerHeight / 2) - 20+'px'
    div.style.width = 40+'px'
    div.style.height = 40+'px'
    div.style.animation = 'opacity_and_scale_up 1.5s forwards'
    // div.style.animation = 'opacity_and_scale_up 1.5s infinite'

    if(color == 'r'){
        div.style.background = 'radial-gradient(circle,rgba(42, 123, 155, 0) 0%, rgb(237, 83, 83) 50%, transparent 70%, rgba(237, 221, 83, 0) 100%)'
    }
    else if(color == 'b'){
        div.style.background = 'radial-gradient(circle,rgba(42, 123, 155, 0) 0%, rgb(83, 137, 237) 50%, transparent 70%, rgba(237, 221, 83, 0) 100%)'
    }
    else if(color == 'y'){
        div.style.background = 'radial-gradient(circle,rgba(42, 123, 155, 0) 0%, rgba(237, 221, 83, 1) 50%, transparent 70%, rgba(237, 221, 83, 0) 100%)'
    }
    else if(color == 'g'){
        div.style.background = 'radial-gradient(circle,rgba(42, 123, 155, 0) 0%, rgb(101, 237, 83) 50%, transparent 70%, rgba(237, 221, 83, 0) 100%)'
    }


    document.body.appendChild(div)
    setTimeout(function () {
        div.remove()
    },1500)
}

function checkStringInArray(str, arr) {
    const count = arr.filter(item => item === str).length;
    
    if (count > 0) {
      return { found: true, count: count };
    } else {
      return { found: false, count: 0 };
    }
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

function animatePlayedCardFromAnotherPlayer(played_card, player, fromPlayer = true) {
    console.log(played_card)
    console.log(player)
    let players = document.querySelector('#players').querySelectorAll('.person')
    for (let x = 0; x < players.length; x++) {
        const element = players[x];
        if (element.querySelector('.name').innerHTML == player){
            let startPos = element.getBoundingClientRect()
            let endPos = document.querySelector('#current_card').getBoundingClientRect()
            if(fromPlayer){
                animateCardFromTo(played_card,[startPos.left,startPos.top],[endPos.left,endPos.top])
            }
            else{
                animateCardFromTo(played_card,[endPos.left,endPos.top],[startPos.left,startPos.top])
            }
        }
    }
}