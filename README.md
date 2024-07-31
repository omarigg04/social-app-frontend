# Login System

## Angular, Node, and MySQL

1. Navigate to backend/config/config.json and change the password to your MySQL password.

```json
{
  "host": "localhost",
  "user": "root",
  "database": "posts",
  "password": "< password >"
}
```

# IMPORTANT 
To run this project npm 16.20.2 is needed 

use nvm to change npm version to 16:
``` bash
nvm use 16

```

Notes: 
- Render this repo in vercel without probelms
- For development purposes the host is localhost but this will need to be updated if you decide to deploy the application. By Default, MySQL gives the user 'root' with all privileges. You can simply change this to another user if desired. In this application we named our database 'posts', however, if you went with a different name this will need to be changed.

2. cd backend
3. \$ npm install
4. \$ npm start
5. cd ../frontend
6. \$ npm install
7. \$ npm start
