import sqlite3 # lightweight, serverless database (good for a small project like this)
import requests # making HTTP requests
from bs4 import BeautifulSoup # parsing HTML

# NOTE - Change line 100 if you want players from another region in the game

# set a file for the SQLite data
dbFile = 'playerData.db'

# create a connection to the database
connection = sqlite3.connect(dbFile)
cursor = connection.cursor() # cursor obj to interact with db

# create a table if it does not exist
cursor.execute('''
    CREATE TABLE IF NOT EXISTS players (
        league TEXT,
        team TEXT,
        summoner TEXT,
        role TEXT,
        first_name TEXT,
        last_name TEXT,
        end_date TEXT,
        otherInfo TEXT,
        country TEXT,
        birthday TEXT
    )
''')

# commit changes
connection.commit()

def getOtherInfo(summonerName):
    # navigate to the player's wiki (consider if the player has a summoner name with a space)
    wikiURL = f'https://lol.fandom.com/wiki/{summonerName.replace(" ", "_")}'

    # send a GET request to the URL
    wikiResp = requests.get(wikiURL)

    # if request was successful
    if response.status_code == 200:
        wikiSoup = BeautifulSoup(wikiResp.text, 'html.parser')

        # get country
        countryLabel = wikiSoup.find('td', class_='infobox-label', string='Country of Birth')
        countryValue = countryLabel.find_next('td').text.strip() if countryLabel else 'N/A'

        # get birthday
        birthdayLabel = wikiSoup.find('td', class_='infobox-label', string='Birthday')
        birthdayValue = birthdayLabel.find_next('td').text.strip() if birthdayLabel else 'N/A'

        # FOR DEBUGGING
        print(f"Summoner: {summonerName}, Country of Birth: {countryValue}, Birthday: {birthdayValue}")

        # insert into db
        cursor.execute('''
            INSERT INTO players (league, team, summoner, role, first_name, last_name, end_date, otherInfo, country, birthday)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (league, team, summoner, role, first_name, last_name, end_date, otherInfo, countryValue, birthdayValue))
    else:
        print("Failed to retrieve the HTML content for country and birthday. Response status code:", response.status_code)

# send an HTTP GET request to the URL
response = requests.get("https://docs.google.com/spreadsheets/d/1Y7k5kQ2AegbuyiGwEPsa62e883FYVtHqr6UVut9RC4o/pubhtml#")

# checks if the request was successful
if response.status_code == 200:
    # parse the HTML content 
    soup = BeautifulSoup(response.text, 'html.parser')

    # find all rows in the table body using CSS selectors
    rows = soup.select('table.waffle tbody tr')

    # FOR DEBUGGING
    #print(f"Number of rows to process: {len(rows)}")

    for row in rows:
        # table data containing freezebar-cells just contains gray lines (exclude them)
        if not row.select('td.freezebar-cell'):
            # find all td cells in the current row
            cells = row.find_all('td')

            # extract the text from the cell and strip it
            rowData = [cell.text.strip() for cell in cells]

            # exclude the cell if it is empty
            if any(rowData):
                # these phrases are the beginning of non-player data lines; exclude them
                if "THIS SHEET WAS LAST UPDATED ON:" in rowData[0] or "League" in rowData[0]:
                    continue
                
                # rows need to have at least 8 data values to put into the table
                if len(rowData) >= 8:
                    # unpack the data into individual values
                    league, team, summoner, role, first_name, last_name, end_date, otherInfo = rowData[:8]
                else: 
                    continue

                # CHANGE THIS IF YOU WANT PLAYERS FROM ANOTHER REGION
                if league == "LCS":
                    # get other player info from wiki and input them into the db
                    getOtherInfo(summoner)
    
    # commit changes
    connection.commit()

    # close connection
    connection.close()
else:
    print("Failed to retrieve the HTML content. Response status code:", response.status_code)
