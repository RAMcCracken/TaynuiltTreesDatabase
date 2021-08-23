sudo docker exec maraidb-container mysql --user root --password=hawthorn -e "CREATE DATABASE IF NOT EXISTS taynuilttrees"
sudo docker exec -i mariadb-container mysql --user root --password=hawthorn taynuilttrees < db.dump
