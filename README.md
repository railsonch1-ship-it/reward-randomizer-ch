# 🎲 Reward Randomizer (Android APK & Web)

Aplicativo de rastreamento de hábitos com reforço intermitente (probabilístico) baseado em psicologia comportamental (B.F. Skinner / razão variável).

---

## 🚀 Como gerar e baixar o APK no seu Android pelo GitHub

Este repositório já está **100% configurado** com GitHub Actions (`.github/workflows/build_apk.yml`). Assim que você subir o código para o seu GitHub, o GitHub compilará automaticamente o arquivo `.apk` de instalação para o seu Android!

### Passo 1: Subir o projeto para o seu GitHub

Abra o terminal na pasta deste projeto e execute os comandos:

```bash
# 1. Inicie o git (se ainda não tiver iniciado)
git init

# 2. Adicione todos os arquivos
git add .
git commit -m "feat: Reward Randomizer Android APK project"

# 3. Vincule ao seu repositório no GitHub (substitua pelo link do seu repositório)
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git

# 4. Envie o código
git push -u origin main
```

---

### Passo 2: Baixar o APK gerado automaticamente

1. Acesse o seu repositório no GitHub pelo celular ou computador.
2. Clique na aba **"Actions"** no menu superior do repositório.
3. Você verá o workflow **"Build Android APK"** rodando automaticamente.
4. Quando a execução terminar (cerca de 2 a 3 minutos, com o ícone verde ✔️):
   - Clique na execução finalizada.
   - Na seção inferior **"Artifacts"**, clique em **`RewardRandomizer-Release-APK`** para baixar o arquivo zip com o APK pronto (`app-release.apk`).
5. Se você criar uma tag/release (`git tag v1.0.0 && git push --tags`), o APK também ficará anexado na aba **"Releases"** para download direto!

---

### Passo 3: Instalar no seu Android

1. Abra o arquivo **`app-release.apk`** no seu celular Android.
2. Se o Android perguntar, permita a instalação de aplicativos desta fonte (*"Permitir desta fonte"* ou *"Fontes desconhecidas"*).
3. Toque em **"Instalar"**.
4. Pronto! O ícone do **Reward Randomizer** estará na tela inicial do seu celular.

---

## 🛠️ Como compilar o APK localmente no computador (Opcional)

Se você já tiver o Flutter e o Android Studio instalados na sua máquina:

```bash
cd flutter_project
flutter pub get
flutter build apk --release
```

O APK gerado estará em:
`flutter_project/build/app/outputs/flutter-apk/app-release.apk`

---

## 📱 Funcionalidades do App
- **Lógica de Reforço Intermitente:** Probabilidade personalizável por hábito (ex: 1 em 6 $\approx$ 16,7%).
- **Resultado Claro:** Toda ativação exibe o resultado do sorteio e registra as estatísticas.
- **Edição Completa:** Edição de perguntas, rótulos, ícones FontAwesome, recíproco e recompensas.
- **Modos de Ordenação:** 8 tipos de ordenação e reorganização manual.
- **Material 3:** Suporte a tema escuro, claro e sistema, com paleta de cores original.
