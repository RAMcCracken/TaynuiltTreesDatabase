#!/bin/bash
sudo docker run -p 127.0.0.1:3306:3306  --name trees-container -e MARIADB_ROOT_PASSWORD=hawthorn -v ~/Documents/Taynuilt_Trees/db_store:/var/lib/mysql -d mariadb:latest
