# Foundry REST API Module

Um módulo para Foundry Virtual Tabletop que expõe APIs REST para integração externa.

## Instalação

### Via URL (Recomendado)
1. Abra o Foundry VTT
2. Vá em **Configurações** → **Gerenciar Módulos**
3. Clique em **"Instalar Módulo"**
4. Cole a URL: `https://github.com/SEU_USUARIO/foundry-rest-api/releases/latest/download/module.json`
5. Clique em **"Instalar"**

### Manual
1. Baixe o ZIP do release
2. Extraia na pasta `[Foundry VTT]/modules/`
3. Renomeie para `foundry-rest-api`
4. Reinicie o Foundry VTT
5. Ative o módulo

## APIs Disponíveis

- `GET /api/status` - Status do servidor
- `GET /api/actors` - Lista atores
- `GET /api/items` - Lista itens
- `GET /api/scenes` - Lista cenas
- `GET /api/users` - Lista usuários

## Autenticação

Todas as APIs requerem token:
```bash
curl -H "Authorization: Bearer SEU_TOKEN" http://localhost:30000/api/actors
```

## Licença

MIT License
