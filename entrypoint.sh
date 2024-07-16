#!/bin/sh

# Adiciona a entrada ao /etc/hosts
echo "127.0.0.1 $HOST" >> /etc/hosts
sudo sh -c 'echo "$HOST" >> /etc/hosts'
exec "$@"