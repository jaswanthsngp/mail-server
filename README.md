# Mail Application
Enables users to send mails between them

## Functinalities

- Signup => Takes name, username and password
    - usernames are all unique, might throw an error for that
- Login => Takes username and password
    - returns token on success
- Fetch list of mails => Sender and Subject of all the emails recieved by the user, recent ones first
- Fetch a complete mail => Sender, subject and body of the mail
- Create a new mail => Sender, reciever, subject, body, cc, bcc
- Delete a mail => Don't show that to reciever again

## Database

Users
| Field | Type |
|-------|------|
| id | SERIAL PRIMARY KEY |
| Name | String |
| Password | Hash Value |
| mailId | String, Unique |
| token | UUID |
| expiry | DATE |

Mails
| Field | Type |
|-------|------|
| id | SERIAL PRIMARY KEY |
| subject | VARCHAR |
| body | VARCHAR |
| sender | INT FK users.id |
| reciever | INT FK users.id |
| cc | INT FK users.id |
| bcc | INT FK users.id |

Recieved
| Field | Type | 
|-------|------|
| user | INT FK users.id |
| mail | INT FK mails.id |
UNIQUE KEY composite(user, mail)

## Future Scope
- Migrate the DB to MongoDB
- Facilitate users to send mails to any ID over the internet.
