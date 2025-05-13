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