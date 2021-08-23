# TaynuiltTreesDatabase
By Rhona McCracken and Darren Caldwell

## Setup and Usage
1. Install both Docker and Docker-Compose for your operating system:

* Engine - https://docs.docker.com/engine/install/
* Compose - https://docs.docker.com/compose/install/

2. Clone the git repo

3. Navigate to the root folder of the repo and create a `.env` file and populate it with the following, replacing "***" with your own password:
```
DB_HOST="mariadb-container"
DB_USER="root"
DB_PWD="***"
DB_NAME="taynuilttrees"
```

4. run `sudo docker-compose up` to initialize the project.

5. From the root directory run `./scripts/load_dump.sh` to populate the database with example data and the schema.

6. Get coding!

The front-end development server will be available at `localhost:21451` in your browser. Changes to both back and front end code are automatically applied to the running containers.
