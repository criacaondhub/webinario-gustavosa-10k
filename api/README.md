# API — Protocolo 10K

Recebe o formulário de inscrição (pop-up da LP) e serve o painel `/dash`. Roda no mesmo stack do site
(`docker-compose.yml` na raiz), com Postgres e backup diário.

```
https://dr.gustavosa.com.br/protocolo-10k        → gustavosa-protocolo-10k      (nginx, site)
https://dr.gustavosa.com.br/protocolo-10k/api/*  → gustavosa-protocolo-10k-api  (este serviço)
                                                   └── db (Postgres, rede interna) ← backup
```

## Primeiro deploy

Os três segredos são criados **uma vez**, à mão, na VPS (no manager do Swarm).
Nenhum deles vai para o git.

```sh
# 1. Senha do Postgres (aleatória — ninguém precisa digitá-la)
openssl rand -hex 24 | tr -d '\n' | docker secret create protocolo10k_db_password -

# 2. Segredo que assina a sessão do /dash
openssl rand -hex 32 | tr -d '\n' | docker secret create protocolo10k_session_secret -

# 3. Hash da senha do /dash (nunca a senha em texto)
printf '%s' 'COLE_AQUI_O_HASH' | docker secret create protocolo10k_dash_password_hash -
```

O hash do passo 3 é gerado a partir da senha com:

```sh
cd api && npm run hash-password -- "a senha"
```

Depois, na pasta do repositório, rode `./build.sh` — ele faz o pull, gera as duas imagens
(site e API), faz o deploy do stack `gustavosa-protocolo-10k` e força a atualização dos dois serviços.
Nos deploys seguintes é só rodar o `./build.sh` de novo. Na primeira subida a API
cria a tabela `inscricoes` sozinha (e espera o banco ficar pronto, se ele subir depois).

### Conferir

- `https://dr.gustavosa.com.br/protocolo-10k/api/health` → `{"ok":true,"schema":true}`
- Enviar uma inscrição de teste pelo site e vê-la em `https://dr.gustavosa.com.br/protocolo-10k/dash/`

## Operação

**Trocar a senha do /dash** — secrets são imutáveis no Swarm:

```sh
npm run hash-password -- "nova senha"          # gera o hash
docker secret rm protocolo10k_dash_password_hash  # exige o serviço parado ou o stack removido
printf '%s' 'NOVO_HASH' | docker secret create protocolo10k_dash_password_hash -
```

**Backups** — um `.sql.gz` por dia no volume `backups`, guardando 7 dias:

```sh
docker exec -it $(docker ps -qf name=gustavosa-protocolo-10k_backup) ls -lh /backups
```

**Restaurar** um backup:

```sh
docker exec -i $(docker ps -qf name=gustavosa-protocolo-10k_db) sh -c \
  'gunzip | psql -U protocolo10k -d protocolo10k' < protocolo10k-AAAA-MM-DD_HHMM.sql.gz
```

## Variáveis

| Variável | Uso |
|---|---|
| `PGHOST`, `PGUSER`, `PGDATABASE`, `PGPASSWORD_FILE` | Conexão com o Postgres (ou `DATABASE_URL`) |
| `DASH_USER` | Usuário do /dash (`nd-protocolo`) |
| `DASH_PASSWORD_HASH_FILE` | Hash scrypt da senha do /dash |
| `DASH_SESSION_SECRET_FILE` | Segredo da sessão |
| `PORT` | Porta HTTP (padrão `3001`) |

Toda variável de segredo aceita a forma `NOME` (valor direto, útil em dev via `api/.env`)
ou `NOME_FILE` (caminho de um Docker secret).

## Desenvolvimento local

```sh
cp .env.example .env   # preencha DATABASE_URL e os DASH_*
npm install
npm run dev            # http://localhost:3001
```

No site, `npm run dev` na raiz já repassa `/protocolo-10k/api` para cá — o formulário da LP
e o painel (`http://localhost:5173/protocolo-10k/dash/`) passam a usar esta API local.

## LGPD

- Cada inscrição grava `consentimento_em` e `politica_versao` (prova do consentimento — art. 8º).
  Ao alterar o texto da política, atualize `version` em `src/config/privacy.ts`.
- Pedido de exclusão do titular: botão de lixeira na linha do lead no `/dash` (exclusão definitiva).
  Os backups diários guardam 7 dias — o dado some deles nesse prazo.
