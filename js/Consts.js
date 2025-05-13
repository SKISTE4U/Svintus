var DEBUG = true
var CardSize = [100,150]
var socket = null
var PickedImage = 'no_user.png'
var MyName = ''
var PickInterval = 100
var MyHandVar = []

var nums_cards = [
    '0_r','1_r','2_r','3_r','4_r','5_r','6_r','7_r',
    '0_b','1_b','2_b','3_b','4_b','5_b','6_b','7_b',
    '0_y','1_y','2_y','3_y','4_y','5_y','6_y','7_y',
    '0_g','1_g','2_g','3_g','4_g','5_g','6_g','7_g',
]
var spec_cards = [
    'hapej_r','hapej_b','hapej_y','hapej_g',
    'hlopkopit_r','hlopkopit_b','hlopkopit_y','hlopkopit_g',
    'perehruk_r','perehruk_b','perehruk_y','perehruk_g',
    'tihohrun_r','tihohrun_b','tihohrun_y','tihohrun_g',
    'zahrapin_r','zahrapin_b','zahrapin_y','zahrapin_g'
]
var gray_cards = [
    'polisvin'
]

var KOLODA_POS = document.querySelector('#koloda').getBoundingClientRect()
var HAND_POS = document.querySelector('#your_cards').getBoundingClientRect()




KOLODA_POS = [KOLODA_POS.left,KOLODA_POS.top]
HAND_POS = [HAND_POS.left+(HAND_POS.width/2),HAND_POS.top+(HAND_POS.height/3)]