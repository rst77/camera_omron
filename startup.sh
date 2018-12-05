#!/usr/bin/env sh

echo "Garante o start do nginx (localhost:80)"
sudo service nginx start

echo "Faz a limpeza das imagens antigas registradas"
rm -Rf /home/pi/mysql/site/registros/*.png

echo "Configura a variavel de ambiente para rodar o Node"
export PATH=$PATH:~/home/pi/node-v10.13.0-linux-armv6l/bin

echo "Inicia o serviço de reconhecimento de imagem"
cd /home/pi/mysql
nohup node servico.js & > nodejs.log

echo "Abre o navegador"
nohup xdg-open "http://localhost" &