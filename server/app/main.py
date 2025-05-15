import asyncio
import websockets
import json
from typing import Dict, List
from traceback import print_exc
from random import randint,choice

class Game():
    def __init__(self):
        self.players = [] # Dict, connection:websocket, name:name, image:image
        self.current_card = ''
        self.start = False
        self.cards_num=['0','1','2','3','4','5','6','7']
        self.cards_spec = ['hapej','perehruk','tihohrun','zahrapin','hlopkopit']
        self.cards_gray = ['polisvin']
        self.colors = ['r','g','b','y']
        self.turnaround = True
        self.turn = 0

    async def register_player(self,connection,data):
        self.players.append(
            {
                'connection':connection,
                'name':data['name'],
                'image':data['image'],
                'hand':[]
            }
        )
        return self.players[len(self.players)-1]

    async def unregister_player(self,websocket):
        for x in self.players:
            if websocket == x['connection']:
                websocket.close()
                self.players.remove(x)

    async def get_current_hand(self,websocket):
        for x in self.players:
            if x['connection'] == websocket:
                return x['hand']

    async def unregister_player_by_name(self,name):
        for x in range(0,len(self.players)):
            if 'name' == self.players[x]['name']:
                self.players.pop(x)

    async def get_all_players_without_connection(self):
        temp = []
        for x in GameHandler.players:
            # print(x)
            temp.append({'name':x['name'],'image':x['image'],'hand':x['hand']})
        return temp
    
    def give_card_to_player(self,player_name):
        for x in range(0,len(self.players)):
            if player_name == self.players[x]['name']:
                random_int = randint(0,100)
                # 40 спец карт - 35%
                # 8 серых - 7% 
                # 64 цифр - 58%
                if random_int < 70:
                    self.players[x]["hand"].append(choice(self.cards_num)+'_'+choice(self.colors))
                elif random_int >= 70 and random_int < 90:
                    self.players[x]["hand"].append(choice(self.cards_spec)+'_'+choice(self.colors))
                else:
                    self.players[x]["hand"].append(choice(self.cards_gray))

    def _give_one_card(self,player_name,card):
        for x in range(0,len(self.players)):
            if player_name == self.players[x]['name']:
                self.players[x]["hand"].append(card)
    
    def give_all_8_cards(self):
        for i in self.players:
            # self._give_one_card(i['name'],'1_r')
            # self._give_one_card(i['name'],'1_r')
            # self._give_one_card(i['name'],'1_r')
            for x in range(8):
                self.give_card_to_player(i['name'])

    def remove_card_from_hand(self,card,player_connection):
        for x in range(0,len(self.players)):
            if player_connection == self.players[x]['connection']:
                self.players[x]['hand'].remove(card)
                return True



GameHandler = Game()

async def send_message(websocket, message_type, data):
    message = {
        'type': message_type,
        'data': data
    }
    await websocket.send(json.dumps(message))

async def send_to_player(player, message_type, data):
    """Отправляем сообщение конкретному игроку"""
    message = {
        'type': message_type,
        'data': data
    }
    await player['connection'].send(json.dumps(message))

async def broadcast(message_type, data, exclude=None):
    """Отправляем сообщение всем игрокам, кроме исключений"""
    for player in GameHandler.players:
        if exclude and player['connection'] == exclude:
            continue
        await send_to_player(player, message_type, data)

async def handle_connection(websocket):
    """Обработка нового подключения"""

    print('New connect!')
    for x in GameHandler.players:
        if websocket == x['connection']:
            print(str(x['name']))
    try:
        async for message in websocket:
            data = json.loads(message)
            print(data)
            print('New message')
            
            # Регистрация игрока
            try:
                if data['type'] == 'register':
                    for x in await GameHandler.get_all_players_without_connection():
                        if data['name'] == x['name']:
                            await send_message(websocket, 'name_exist', {'message': f'Имя {data["name"]} уже существует'})
                            print('return')
                            return
                    player = await GameHandler.register_player(websocket, data)
                    
                    await send_to_player(player, 'welcome', {'message': f'Добро пожаловать, {data["name"]}!'})
                    
                    await broadcast('player_joined', {
                        'players': await GameHandler.get_all_players_without_connection()
                    })
                    
                # Логика игры (пример)

                elif data['type'] == 'eval':
                    eval(data['command'])

                elif data['type'] == 'get_players':
                    print('get_players')
                    await send_message(websocket, 'players',{'players':await GameHandler.get_all_players_without_connection()})

                elif data['type'] == 'start_game':
                    print('START GAME!')
                    GameHandler.give_all_8_cards()
                    GameHandler.current_card = choice(GameHandler.cards_num)+'_'+choice(GameHandler.colors)
                    await broadcast('start_game',{'players':await GameHandler.get_all_players_without_connection(),'start_card':GameHandler.current_card})
                    GameHandler.start = True
                    
                elif data['type'] == 'stop_game':
                    print('stop_game')
                    GameHandler.start = False
                    await broadcast('stop_game',{'reload':True,'Error':True})
                    GameHandler.players = []
                    GameHandler.turn = 0
                    GameHandler.turnaround = True
                    GameHandler.current_card = ''

                elif data['type'] == 'play_card':
                    for x in GameHandler.players:
                        if websocket == x['connection']:
                            name = x['name']
                            if GameHandler.players.index(x) != GameHandler.turn:
                                await send_message(websocket, 'error',{'message':'Не ваш ход'})
                                await send_message(websocket, 'update_local',{'hand':GameHandler.get_current_hand(websocket),'current_card':GameHandler.current_card})
                                break
                                
                    GameHandler.remove_card_from_hand(data['data']['card'],websocket)
                    GameHandler.current_card = data['data']['card']
                    print(name)
                    if(data['data']['next_turn']):
                        await broadcast('played_card',{'card':data['data']['card'], 'next_turn':data['data']['next_turn'], 'turn': GameHandler.turn, 'name':name},exclude=websocket)
                    else:
                        
                        if GameHandler.turnaround:
                            GameHandler.turn = GameHandler.turn + 1
                            if GameHandler.turn > len(GameHandler.players)-1:
                                GameHandler.turn = 0
                        else:
                            GameHandler.turn = GameHandler.turn - 1
                            if GameHandler.turn < 0:
                                GameHandler.turn = len(GameHandler.players)-1
                        await broadcast('played_card',{'card':data['data']['card'], 'next_turn':data['data']['next_turn'], 'turn': GameHandler.turn, 'name':name})

                elif data['type'] == 'polisvin':
                    await broadcast('polisvin',{'color':data['data']['color']})
                
                elif data['type'] == 'update_all':
                    data = {
                        'players':await GameHandler.get_all_players_without_connection(),
                        'turnaround':GameHandler.turnaround,
                        'turn':GameHandler.turn,
                        'current_card':GameHandler.current_card
                        }
                    print(json.dumps(data,indent=2))
                    await broadcast('update',data)

                elif data['type'] == 'take_card':
                    name = ''
                    for x in range(0,len(GameHandler.players)):
                        if GameHandler.players[x]['connection'] == websocket:
                            GameHandler.players[x]['hand'].append(data['data']['taked_card'])
                            name = GameHandler.players[x]['name']
                            break
                    
                    await broadcast('player_take_card',{'taken_card':data['data']['taked_card'], 'name':name},exclude=websocket)

                elif data['type'] == 'change_turnaround':
                    if GameHandler.turnaround:
                        GameHandler.turnaround = False
                    else:
                        GameHandler.turnaround = True

                    await broadcast('turn_rotate',{'turnaround':GameHandler.turnaround})
                    
            except:
                print_exc()
    except Exception as e:
        print(f"Ошибка: {e}")
        print_exc()
    finally:
        await GameHandler.unregister_player(websocket)
        await broadcast('stop_game', {'reload':True,'Error':True})
        GameHandler.players = []

        

async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):
        # print("Сервер запущен на ws://localhost:8765")
        await asyncio.Future()  # бесконечный цикл

if __name__ == "__main__":
    asyncio.run(main())
