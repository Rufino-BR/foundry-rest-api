# 🚀 Instruções para Publicar no GitHub

## 📋 Passos para criar o repositório:

### 1. Criar Repositório no GitHub
1. Acesse [GitHub.com](https://github.com)
2. Clique em **"New repository"**
3. Configure:
   - **Name**: `foundry-rest-api`
   - **Description**: `Foundry VTT REST API Module`
   - **Public**
   - **Não inicializar** com README
4. Clique **"Create repository"**

### 2. Conectar e Publicar
```bash
# Adicionar remote
git remote add origin https://github.com/SEU_USUARIO/foundry-rest-api.git

# Publicar código
git branch -M main
git push -u origin main
```

### 3. Criar Release
1. Vá em **"Releases"**
2. Clique **"Create a new release"**
3. Configure:
   - **Tag**: `v1.0.0`
   - **Title**: `Foundry REST API Module v1.0.0`
4. Clique **"Publish release"**

### 4. URL de Instalação
Após o release, use esta URL no Foundry VTT:
```
https://github.com/SEU_USUARIO/foundry-rest-api/releases/latest/download/module.json
```

## 🎯 Como Instalar no Foundry VTT

1. Abra o Foundry VTT
2. **Configurações** → **Gerenciar Módulos**
3. **"Instalar Módulo"**
4. Cole a URL acima
5. Clique **"Instalar"**
6. Ative o módulo

## 📁 Arquivos do Módulo

- `foundry-rest-api.js` - Módulo principal
- `module.json` - Manifesto do módulo
- `README.md` - Documentação
- `LICENSE` - Licença MIT

---

**Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub**
