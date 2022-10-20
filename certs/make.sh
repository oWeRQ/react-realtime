#!/bin/sh

DOMAIN="$1"
openssl req -x509 -nodes -new -sha256 -days 1024 -newkey rsa:2048 -keyout $DOMAIN.key -out $DOMAIN.pem -subj "/C=US/CN=Example-Root-CA"
openssl x509 -outform pem -in $DOMAIN.pem -out $DOMAIN.crt
