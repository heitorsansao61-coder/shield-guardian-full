

# Transformar NanoShield em App Nativo Android (APK)

## O que vamos fazer

Configurar o projeto para gerar um APK usando **Capacitor**, que transforma seu app web em um app nativo Android.

## Etapas

### 1. Instalar Capacitor no projeto
- Adicionar as dependencias: `@capacitor/core`, `@capacitor/cli`, `@capacitor/android`
- Inicializar o Capacitor com as configuracoes do projeto

### 2. Configurar o Capacitor
- Criar arquivo `capacitor.config.ts` com:
  - ID do app: `app.lovable.41c1a8cedfe6465eadea7a6782cf3cbf`
  - Nome: `shield-guardian-full`
  - Servidor apontando para o preview para hot-reload durante desenvolvimento

### 3. O que voce precisa fazer no seu computador

Depois que eu fizer as mudancas, voce vai precisar:

1. **Exportar o projeto** para o GitHub (botao "Export to Github" no Lovable)
2. **Clonar o repositorio** no seu computador: `git clone <url-do-repo>`
3. **Instalar dependencias**: `npm install`
4. **Adicionar Android**: `npx cap add android`
5. **Atualizar dependencias nativas**: `npx cap update android`
6. **Compilar o projeto**: `npm run build`
7. **Sincronizar**: `npx cap sync`
8. **Rodar no emulador ou celular**: `npx cap run android`

**Requisito**: Voce precisa ter o **Android Studio** instalado no computador para gerar o APK.

Para mais detalhes, leia o guia completo no blog do Lovable sobre desenvolvimento mobile com Capacitor.

---

**Secao tecnica**

- Dependencias adicionadas: `@capacitor/core`, `@capacitor/cli` (dev), `@capacitor/android`
- Arquivo criado: `capacitor.config.ts` com server URL apontando para sandbox preview
- O app continuara funcionando normalmente no navegador; o Capacitor apenas adiciona a camada nativa

