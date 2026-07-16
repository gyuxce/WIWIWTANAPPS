pm2 delete app_aggregrator
pm2 start start.json

sh microservices/run.sh

pm2 dash
