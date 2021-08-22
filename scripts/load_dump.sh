sudo docker exec trees-container mysql --user root --password=hawthorn -e "CREATE DATABASE IF NOT EXISTS taynuilttrees"
sudo docker exec -i trees-container mysql --user root --password=hawthorn taynuilttrees < db.dump
