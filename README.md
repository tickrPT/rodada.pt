# 🍺 Rodada.pt

Site pronto a publicar. Segue os 4 passos abaixo, **não precisas de instalar nada no computador**.

---

## 📦 O que está aqui dentro

```
rodada-site/
├── .github/workflows/deploy.yml   ← Faz deploy automático
├── public/
│   ├── CNAME                       ← Diz ao GitHub que o domínio é rodada.pt
│   ├── favicon.svg                 ← Ícone 🍺
│   ├── privacidade.html            ← Política de privacidade (necessária para AdSense)
│   └── termos.html                 ← Termos de utilização
├── src/
│   ├── App.jsx                     ← Toda a Rodada
│   └── main.jsx                    ← Entry point
├── index.html                      ← Meta tags + placeholders para Analytics e AdSense
├── package.json                    ← Dependências
└── vite.config.js                  ← Configuração do build
```

---

## 🚀 PASSO 1 — Criar repositório no GitHub (3 min)

1. Vai a [github.com/new](https://github.com/new)
2. Repository name: **`rodada-site`**
3. **Public** (importante — GitHub Pages grátis exige público)
4. **NÃO marques nada** (sem README, sem .gitignore, sem license)
5. Clica **Create repository**

Vais ver uma página com instruções. Ignora-as. Vais para o próximo passo.

---

## 📂 PASSO 2 — Fazer upload dos ficheiros (5 min)

1. Na página do repositório vazio, clica **"uploading an existing file"** (link a meio da página)
2. **Arrasta TODOS os ficheiros desta pasta** (`rodada-site`) para a área de upload
   - **IMPORTANTE:** arrasta o **conteúdo** da pasta, não a pasta em si
   - Verifica que vês `index.html`, `package.json`, `src/`, `public/`, `.github/` na lista
3. No campo "Commit changes" escreve: `primeira versao`
4. Clica **Commit changes**

⏳ Aguarda 30 segundos. Aparece no canto superior, ao lado do nome do repo, um botão ⚙ **Actions** com um círculo amarelo (a construir) que passa a verde ✓ (pronto).

---

## ⚙️ PASSO 3 — Activar GitHub Pages (2 min)

1. No repositório, vai a **Settings** (último separador no topo)
2. Menu lateral esquerdo → **Pages**
3. **Source** → escolhe **GitHub Actions**
4. Aparece o aviso "Your site is being deployed". Espera 1-2 min.
5. Refresh à página. Aparece em cima: **"Your site is live at https://SEU_USER.github.io/rodada-site/"**

Abre esse link e confirma que o site funciona.

---

## 🌐 PASSO 4 — Apontar o domínio rodada.pt (10 min + espera DNS)

### 4A — No Amen.pt

1. Login em **amen.pt** → painel de gestão do domínio **rodada.pt**
2. Procura "Gestão DNS" ou "Zona DNS"
3. **Apaga** todos os registos A, AAAA e CNAME existentes que apontem para outros sítios
4. **Adiciona estes 5 registos** exactamente assim:

   | Tipo | Nome | Valor |
   |------|------|-------|
   | A | @ | 185.199.108.153 |
   | A | @ | 185.199.109.153 |
   | A | @ | 185.199.110.153 |
   | A | @ | 185.199.111.153 |
   | CNAME | www | SEU_USER.github.io |

   (substitui `SEU_USER` pelo teu username GitHub)

5. Guarda. DNS demora 15 min - 24h a propagar (geralmente <1h em .pt).

### 4B — No GitHub

1. Volta a **Settings → Pages** no repositório
2. **Custom domain** → escreve `rodada.pt` → **Save**
3. Aguarda a verificação automática (~5 min). Vês um ✓ verde.
4. Marca a checkbox **Enforce HTTPS** quando estiver disponível (até 1 hora depois)

🎉 **`https://rodada.pt` está online.**

---

## 🔄 Como actualizar o site no futuro

Sempre que quiseres mudar algo (ex: actualizar texto, adicionar feature):

1. No GitHub, abre o ficheiro que queres mudar
2. Clica no lápis ✏️ (Edit)
3. Faz a alteração → **Commit changes**
4. Aguarda 1-2 min. O GitHub Actions reconstrói e publica automaticamente.

---

## 💰 PRÓXIMOS PASSOS — Monetização

### Já hoje (depois do site estar live):

#### Google Analytics — 5 min
1. Vai a [analytics.google.com](https://analytics.google.com)
2. Criar conta + property "Rodada"
3. Copia o ID que aparece (formato `G-XXXXXXXXXX`)
4. No GitHub, abre `index.html`, **descomenta o bloco do Analytics** (apaga as linhas `<!--` e `-->` à volta), substitui `G-XXXXXXXXXX` pelo teu ID
5. Commit. Em 5 min vês "Realtime" a registar visitas.

#### Google AdSense — 5 min
1. Vai a [adsense.google.com](https://adsense.google.com)
2. Adiciona site `rodada.pt`, escolhe Portugal/EUR
3. Copia o snippet de validação (formato `ca-pub-XXXXXXXXXXXXXXXX`)
4. No GitHub, abre `index.html`, **descomenta o bloco do AdSense**, substitui o ID
5. Commit
6. Volta ao AdSense → **Request review**
7. ⏳ Espera 7-14 dias por email

### Enquanto AdSense revê (2 semanas):

- **Grava 1 TikTok/Reel hoje à noite** com amigos no bar. Texto sobreposto: *"sempre o mesmo a pagar 😭 rodada.pt"*. Hashtags: `#cervejas #portugal #amigos`
- **Manda nos teus grupos de WhatsApp** com a frase: *"olha, fiz isto, gira a roda no bar para decidir quem paga 🍺 rodada.pt"*
- **Post no Reddit r/portugal** — título: *"Fiz um site para decidir quem paga a rodada quando saímos com amigos"*

---

## ⚠️ Imagem og.png para preview do WhatsApp

A preview do link no WhatsApp precisa de uma imagem 1200×630. Quando o site estiver no ar:

1. Abre `https://rodada.pt` no computador
2. Faz print da página
3. Recorta a 1200×630 (usa [iloveimg.com/crop-image](https://iloveimg.com/crop-image))
4. Guarda como `og.png`
5. No GitHub: pasta `public/` → **Add file → Upload files** → arrasta `og.png` → commit

Sem isto, as partilhas no WhatsApp ficam sem imagem.

---

**Feito.** Qualquer dúvida, volta a perguntar.
