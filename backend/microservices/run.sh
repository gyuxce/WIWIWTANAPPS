pm2 delete 62dolphin
cd microservices/Dolphin/bin/ && pm2 start start.json  
cd ../../../

pm2 delete 62goldfish
cd microservices/Goldfish/bin/ && pm2 start start.json 
cd ../../../


pm2 delete 62sailfish
cd microservices/Sailfish/bin/ && pm2 start start.json 

cd ../../../

pm2 delete 62Sardine
cd microservices/Sardine/bin/ && pm2 start start.json 
cd ../../../
