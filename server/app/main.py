import asyncio
import websockets
import json
from typing import Dict, List
from traceback import print_exc

class Game():
    def __init__(self):
        self.players = [] # Dict, connection:websocket, name:name, image:image
        self.start = False

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
                self.players.remove(x)

    async def unregister_player_by_name(self,name):
        for x in range(0,len(self.players)):
            if 'name' == self.players[x]['name']:
                self.players.pop(x)

    async def get_all_players_without_connection(self):
        temp = []
        for x in GameHandler.players:
            print(x)
            temp.append({'name':x['name'],'image':x['image'],'hand':x['hand']})

        return temp



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

    print('New Handle')
    try:
        async for message in websocket:
            data = json.loads(message)
            
            # Регистрация игрока
            if data['type'] == 'register':
                for x in await GameHandler.get_all_players_without_connection():
                    if data['name'] == x['name'] and not GameHandler.start:
                        await send_message(websocket, 'name_exist', {'message': f'Имя {data["name"]} уже существует'})
                        return
                    else:
                        x['connection'] = websocket
                player = await GameHandler.register_player(websocket, data)

                await send_to_player(player, 'welcome', {'message': f'Добро пожаловать, {data["name"]}!'})
                
                await broadcast('player_joined', {
                    'players': await GameHandler.get_all_players_without_connection()
                })
                
            # Логика игры (пример)
            elif data['type'] == 'play_card':
                # Обработка хода игрока
                pass

            elif data['type'] == 'eval':
                eval(data['command'])

            elif data['type'] == 'get_players':
                print('get_players')
                await send_message(websocket, 'players',{'players':await GameHandler.get_all_players_without_connection()})
                
    except Exception as e:
        print(f"Ошибка: {e}")
        print_exc()
    finally:
        if not GameHandler.start:
            await GameHandler.unregister_player(websocket)
            await broadcast('player_joined', {
                    'players': await GameHandler.get_all_players_without_connection()
                })

async def main():
    async with websockets.serve(handle_connection, "localhost", 8765):
        print("Сервер запущен на ws://localhost:8765")
        await asyncio.Future()  # бесконечный цикл

if __name__ == "__main__":
    asyncio.run(main())