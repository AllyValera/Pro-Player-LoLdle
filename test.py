# TEST FILE TO SEE CONTENTS OF SQLITE DATABASE

import sqlite3

# SQLite database file
db_file = 'playerData.db'

# create a connection to db
connection = sqlite3.connect(db_file)
cursor = connection.cursor() #cursor obj to interact with db

# fetch all rows from the table
cursor.execute('SELECT * FROM players')
rows = cursor.fetchall()

# get all LCS members from the NA tab
#cursor.execute("SELECT * FROM players WHERE league = 'LCS'")
#rows = cursor.fetchall()

# print data
for row in rows:
    print(row)

# close connection
connection.close()