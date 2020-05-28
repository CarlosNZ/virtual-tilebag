import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import gspread
from oauth2client.service_account import ServiceAccountCredentials
import datetime

print("Connecting to Database...")
# Use a service account for Database
cred = credentials.Certificate('virtual-tilebag-credentials.json')
firebase_admin.initialize_app(cred)

db = firestore.client()

games_ref = db.collection('games')
games = games_ref.stream()

output = []

print("Retrieving game data...")

for game in games:
    game_dic = game.to_dict()
    timestamp = game_dic["startTime"].strftime("%m/%d/%Y %H:%M:%S")
    racks = ", ".join(game_dic["racks"])
    if racks == ", ":
        racks = ""
    row = [timestamp, game.id, ", ".join(
        game_dic["players"]), racks, "".join(game_dic["tileBag"])]
    output.append(row)
    # print(u'{} => {}'.format(game.id, game.to_dict()))

output.sort()
# print(output)

print("Connecting to Spreadsheet...")
# Authenticate with Sheets API
scope = ['https://spreadsheets.google.com/feeds',
         'https://www.googleapis.com/auth/drive']

creds = ServiceAccountCredentials.from_json_keyfile_name(
    'virtual-tilebag-credentials.json', scope)

client = gspread.authorize(creds)
worksheet = client.open('Virtual Tilebag database').sheet1

print("Writing data to Spreadsheet...")
worksheet.update('A1:E1', [["Game started", "GameID",
                            "Players", "Racks", "Tilebag"]])

worksheet.update('A2:E'+str(len(output)+1), output)

print("Done!")
