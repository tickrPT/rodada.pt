# 🍺 Rodada.pt

Sorteador web em PT-PT para decidir quem paga a rodada, dividir contas, ou sortear equipas.

**Live:** [rodada.pt](https://rodada.pt) · **Stack:** Vite 6 + React 18 + Cloudflare Pages

---

## O que o site faz

Três modos, todos sem app, sem login, sem instalação:

- **🍺 RODADA** — Roleta colorida estilo brutalismo. Adiciona 2-30 amigos, gira, e a roda decide quem paga. Inclui teste de fairness com chi-square e 95% confiança família-wise — clica em 🎯 TESTAR 100× para ver matematicamente que é justo.

- **💳 CARTÕES** — Todos os cartões visíveis em grelha. Um spotlight pulsante salta entre eles em ritmo de roleta — rápido, abrandando — e fixa-se num vencedor. Esse cartão fica com stamp verde "ACEITE". Mecanismo provavelmente uniforme (winner picked first via crypto.getRandomValues).

- **👥 GRUPOS** — Divide 4-50 participantes em 2-6 equipas com 5 contextos temáticos (desporto, escola, trabalho, jogos, festa).

---

## Stack

- **Framework:** React 18 + Vite 6 (single file `src/App.jsx` ~2300 linhas)
- **Hosting:** Cloudflare Pages (auto-deploy on push to `main`)
- **DNS:** Cloudflare nameservers (configurados no Amen.pt)
- **Analytics:** Google Analytics 4 (`G-BQHLGXLG07`)
- **Ads:** Google AdSense (`ca-pub-4528031766044460`)
- **Fonts:** Anton + IBM Plex Mono via Google Fonts CDN
- **Audio:** Web Audio API sintetizada (zero ficheiros)
- **i18n:** Objeto literal `T = { pt:{}, en:{} }`
- **State:** useState + useRef (sem Redux/Zustand)
- **Fairness:** `crypto.getRandomValues()` + Fisher-Yates + Chi-square goodness-of-fit

---

## Deploy (Cloudflare Pages)

> **Atenção:** isto NÃO é GitHub Pages. Não adiciones A records para `185.199.108.x`.
> O deploy é totalmente gerido pelo Cloudflare Pages a partir do repo `tickrPT/rodada.pt`.

### Setup inicial (já feito — só para referência)

1. **Cloudflare Pages → Create application → Connect to Git → `tickrPT/rodada.pt`**
2. Build settings:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node version: 18+ (define em Environment variables: `NODE_VERSION=18`)
3. **Settings → Custom domains → Add `rodada.pt`** (NÃO via DNS CNAME manual — usa a UI do Pages)
4. **DNS no Amen.pt:** nameservers apontam para Cloudflare (não A records GitHub)

### Atualizar o site (workflow no-code)

1. Abre o ficheiro no GitHub
2. Clica no lápis ✏️ Edit
3. Faz a alteração
4. **Commit changes** com mensagem
5. Cloudflare Pages detecta o push, faz build, publica em ~60 segundos
6. Limpa cache do browser para ver

---

## URL parameters (úteis para partilha viral)

| Param      | Exemplo                                 | Função                                                 |
|------------|-----------------------------------------|--------------------------------------------------------|
| `friends`  | `?friends=Miguel,Sara,João`             | Pré-carrega a lista de amigos                          |
| `lang`     | `?lang=en`                              | Força inglês (default: PT)                             |
| `tab`      | `?tab=cartoes`                       | Abre diretamente em Cartões ou Grupos               |
| `winner`   | `?friends=Miguel,Sara&winner=Sara`      | Abre o modal de vencedor imediatamente (replay viral)  |

Exemplo composto:
```
https://rodada.pt/?friends=Miguel,Sara,João,Inês&winner=João&lang=pt
```

→ A Sara perde, ela partilha este link aos amigos, e cada um vê o "momento da derrota" do João instantaneamente. K-factor viral.

---

## Eventos GA tracked

Para tirar relatórios de engagement (e usar como munição em pitch decks futuros de sponsorship):

- `spin` — `{ n_friends }`
- `cartoes_run` — `{ n_friends }`
- `cartoes_done` — `{ n_friends }`
- `share_winner` — `{ mode, channel }` (mode: wheel|cartoes; channel: webshare|whatsapp_fallback)
- `share_image` — `{ mode, method }` (method: native_share|download)
- `share_groups` — `{ theme, channel }`
- `groups_sort` — `{ theme, n_players, n_groups }`
- `groups_reshuffle` — `{ count }`
- `fairness_test` — `{ n, result, k }` (result: fair|anomaly)
- `shame_clear` — `{}`
- `winner_shared_view` — `{ source: "url" }` (alguém abriu via `?winner=X`)
- `guide_click` — `{ source }`

---

## Estrutura

```
rodada.pt/
├── README.md
├── index.html                  ← Meta tags, hreflang, GA, AdSense, structured data
├── package.json                ← Vite 6, React 18
├── vite.config.js
├── src/
│   ├── App.jsx                 ← Todo o app (~2300 linhas)
│   └── main.jsx                ← React entry point
└── public/
    ├── CNAME                   ← rodada.pt (legacy, redundante com Cloudflare)
    ├── favicon.svg
    ├── og.png                  ← 1200×630 para WhatsApp/social preview
    ├── privacidade.html        ← GDPR
    ├── termos.html
    └── jogos-para-decidir.html ← Página SEO (10 jogos clássicos PT, 1350 palavras)
```

---

## Padrões técnicos

- **Crypto random.** Toda a aleatoriedade usa `crypto.getRandomValues()` via wrapper `cryptoRandom()`. Nunca `Math.random()` para fairness.
- **Fisher-Yates shuffle.** Não `arr.sort(() => Math.random() - 0.5)` (esse tem bias mensurável).
- **Chi-square goodness-of-fit.** Para o teste 100×/1000×, usa um único qui-quadrado contra `CHI2_CRIT_95[df-1]`. Multiple-comparisons inflacionaria false alarms até 64% em k=20.
- **Shame board persistido.** localStorage com TTL 6h. Auto-limpa depois da noite. Há botão "limpar" manual.
- **Battery saver.** `bg-orb` animations pausam quando `document.hidden`. CSS variable `--anim-state`.
- **HiDPI canvas.** Render width = `SZ * devicePixelRatio`, scale context, CSS width logical.
- **AudioContext resume.** Chamado antes de tocar para escapar autoplay policy.

---

## Conhecimento operacional

- **Brave Browser bloqueia GA por defeito.** Testa Analytics sempre em Chrome.
- **Cloudflare 403 para bots.** Curl/wget/web-fetch dão 403. Humanos passam normal.
- **AdSense aprovação:** 7-14 dias. Submeter ANTES de ter tráfego (corre em paralelo com marketing).
- **Tráfego = patrocínio.** AdSense paga ~€60-150/mês a 100k sessões. Sponsorship Super Bock/Sagres pode pagar €500-1500/mês.

---

## Roadmap

**Curto prazo:** TikTok viral PT (sexta 21h-23h), WhatsApp grupos, Reddit r/portugal.
**Médio:** AdSense Auto Ads ativos, iterar TikToks, atingir 10k sessões/mês.
**Longo:** Pitch deck a Super Bock/Sagres com screenshots de Analytics.

**Não fazer:** Pro version antes de tráfego. App nativa. Donations/Patreon. Afiliados de apostas.

---

Feito com 🍺 em Portugal.
