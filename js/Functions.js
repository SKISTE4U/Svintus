class Handler {
    welcome(){
        document.querySelector('#login').style.animation = 'opacity_low .3s forwards'
        setTimeout(function(){
            document.querySelector('#login').style.display = 'none'
        },300)
    }
}