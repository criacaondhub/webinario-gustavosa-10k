#!/bin/bash
# Protocolo 10K — atualiza e sobe o stack na VPS (rodar na pasta do repositório).
# Primeiro deploy: criar os secrets antes (ver api/README.md).
# Só site e API são reconstruídos e reiniciados; db e backup ficam como estão
# (imagem do Postgres com digest fixo — reiniciar o banco a cada deploy não faz sentido).
git pull origin main \
  && docker build -t gustavosa-protocolo-10k:latest . \
  && docker build -t gustavosa-protocolo-10k-api:latest ./api \
  && docker stack deploy -c docker-compose.yml gustavosa-protocolo-10k \
  && docker service update --force --image gustavosa-protocolo-10k:latest gustavosa-protocolo-10k_gustavosa-protocolo-10k \
  && docker service update --force --image gustavosa-protocolo-10k-api:latest gustavosa-protocolo-10k_gustavosa-protocolo-10k-api
