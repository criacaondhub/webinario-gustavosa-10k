# Design System — Protocolo 10K · Dr. Gustavo Sá

Landing page do webinário gratuito **Protocolo 10K** (19h00 · Google Meet). Estrutura espelhada da LP de referência `escola.endometriose.med.br/webinario`: Hero (texto à esquerda, foto à direita) → Quem vai te mostrar isso (foto à esquerda, texto à direita) → Rodapé. Sem formulário: todos os CTAs abrem o grupo de WhatsApp (`CONFIG.GROUP_URL`).

Todos os tokens abaixo estão declarados no `@theme {}` de `src/index.css` e viram classes utilitárias do Tailwind v4 (ex.: `bg-background`, `text-heading`, `px-gutter`, `max-w-page`, `text-display`).

---

## 1. Tokens de Cor

Valores definidos pelo usuário em `tokens-cor.txt`.

| Token | Valor | Classe | Uso |
|---|---|---|---|
| `background` | `#F6F7F9` | `bg-background` | Fundo base da página (Hero, rodapé) |
| `background-section` | `#FAFAFA` | `bg-background-section` | Fundo de seção alternada (dobra 2) |
| `text` | `#0E2A47` | `text-text` | Texto corrido (parágrafos, bio, microcopy) — navy, definido pelo usuário (o `#C5C5C5` original reprovava contraste) |
| `heading` | `#0E2A47` | `text-heading` | Títulos (`h1`, `h2`), nome, ênfases em negrito |
| `muted` | `#0E2A47` | `text-muted` | Texto secundário (faixa de data, rótulos) |
| `accent` | `#F2A541` | `bg-accent` / `text-accent` | CTAs, destaques do H1, ícones |
| `accent-hover` | `#B6751F` | `bg-accent-hover` / `text-accent-hover` | Ícones da faixa do evento e ponto de "Vagas limitadas" (o hover do CTA é escala, não cor) |
| `secondary` | `#3D6E9E` | `bg-secondary` | Azul claro dos marcadores (círculo do check, check em branco — 5,35:1). Definido pelo usuário ("azul mais claro") |

> Hierarquia entre `text`, `heading` e `muted` (todos navy) vem de **tamanho e peso**, não de cor.

### Destaques do H1
Definido pelo usuário: "passo a passo" e "até o fim do ano" em **700 `heading`**; "10 mil seguidores" em **700 `accent`** (amarelo). ⚠️ `accent` sobre `background` = 1,91:1 — abaixo do mínimo de 3:1 para texto grande; o Lighthouse do Agente 3 vai apontar. Alternativa compatível: `accent-hover` (`#B6751F`, 3,53:1).

**Contrastes medidos (WCAG)**

| Par | Contraste | Resultado |
|---|---|---|
| `heading` sobre `background` | 13,6:1 | ✅ AA/AAA |
| `heading` sobre `accent` (CTA) | 7,1:1 | ✅ AA |
| `heading` sobre `accent-hover` | 3,85:1 | ✅ só texto grande |
| `accent` sobre `background` | 1,91:1 | ❌ não usar como texto |
| `accent-hover` sobre `background` | 3,53:1 | ⚠️ só texto grande / ícones |
| `text` (navy) sobre `background` | 13,6:1 | ✅ AA/AAA |

**Regras de uso**
- Texto dos botões sobre `accent`: `heading` (`#0E2A47`). Nunca branco sobre `accent`.
- `accent` como **fundo** (CTAs) e, por decisão do usuário, no destaque "10 mil seguidores" do H1 ou em elementos decorativos/ícones com `aria-hidden`.
- Seleção de texto (`::selection`): fundo `accent` com texto `heading` (7,1:1) em toda a página. Definido pelo usuário.
- Bordas finas de divisão (faixa de data, linha do fecho): `heading` com 15% de opacidade → `border-heading/15`.

### Surface e Border — Glassmorphism

Definido pelo usuário como "estilo glassmorphism". Valores técnicos para fundo claro:

| Token | Valor | Classe |
|---|---|---|
| `surface` | `rgb(255 255 255 / 0.55)` | `bg-surface` |
| `surface-strong` | `rgb(255 255 255 / 0.75)` | `bg-surface-strong` |
| `border` | `rgb(255 255 255 / 0.7)` | `border-border` |
| `border-subtle` | `rgb(14 42 71 / 0.08)` | `border-border-subtle` |

Receita do cartão glass (utilitário `glass` em `src/index.css`):
```css
background: var(--color-surface);
backdrop-filter: blur(16px) saturate(140%);
border: 1px solid var(--color-border);
box-shadow: 0 1px 0 0 rgb(255 255 255 / 0.6) inset, 0 12px 32px -12px rgb(14 42 71 / 0.18);
```
Uso do glass: nota sobreposta na foto ("Dr. Gustavo Sá · Nutrólogo · 280 mil seguidores").

---

## 2. Tipografia

Fonte: **Futura PT** via Adobe Fonts (kit `gup0mrx`).
Import no topo de `src/index.css`: `@import url("https://use.typekit.net/gup0mrx.css");`

| Família | Token | Classe | Pesos disponíveis | Uso |
|---|---|---|---|---|
| `futura-pt` | `--font-sans` | `font-sans` (padrão do `body`) | 400, 700 (+ itálico) | **Família única da página**: títulos, textos, rótulos, CTAs |

> `futura-pt-condensed` vem no kit, mas **não é usada** (decisão do usuário: padronizar tudo em `futura-pt`).

> Não usar `font-medium`/`font-semibold` com `font-sans` — o kit só tem 400 e 700 para `futura-pt` (o navegador sintetizaria).

### Escala

| Token | Tamanho | Line-height | Peso | Uso |
|---|---|---|---|---|
| `text-display` | `clamp(2rem, 1.4rem + 2.2vw, 3.125rem)` | 1.0 | 400 (destaques 700) | H1 do Hero |
| `text-headline` | `clamp(1.875rem, 1.4rem + 2vw, 3rem)` | 1.1 | 700 | Nome "Dr. Gustavo Sá" |
| `text-statement` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)` | 1.3 | 400 / 700 | Fecho da dobra 2 |
| `text-lead` | `clamp(1.125rem, 1.05rem + 0.35vw, 1.3125rem)` | 1.5 | 400, tracking -0.02em | H2 do Hero |
| `text-body` | `1.0625rem` (17px) | 1.6 | 400 | Bio, itens da lista |
| `text-meta` | `0.9375rem` (15px) | 1.5 | 400 (700 em "Vagas limitadas") | Faixa de data (caixa normal, `futura-pt`), "Vagas limitadas", rodapé |
| `text-label` | `0.875rem` (14px) | 1.2 | 700 `futura-pt`, caixa-alta, `tracking-label` (0.04em) | Rótulos curtos ("O QUE VOCÊ VAI VER:", "QUEM VAI TE MOSTRAR ISSO:") |
| `text-cta` | `1rem` (16px); mobile `clamp(0.75rem, 3.4vw, 1rem)` | 1.2 | 700 `futura-pt`, caixa-alta, tracking 0.02em | Botões — **sempre numa linha só** (`whitespace-nowrap`), sem quebra (decisão do usuário) |

---

## 3. Espaçamentos e Grid

**Regra de espaçamento replicada integralmente da LP de referência** (escola.endometriose.med.br/webinario), por decisão do usuário. Container de **1280px**, igual à referência (decisão do usuário, substitui os 1440px do Agente 1).

### Tokens

| Token | Valor | Classes |
|---|---|---|
| `xs` | 8px | `gap-xs`, `p-xs`… |
| `sm` | 12px | `gap-sm`, `py-sm`… |
| `md` | 16px | `mt-md`, `gap-md`, `p-md`… |
| `lg` | 24px | `mb-lg`, `px-lg`… |
| `xl` | 32px | `gap-x-xl`, `bottom-xl`… |
| `gutter` / `gutter-lg` | 20px / 32px | `px-gutter lg:px-gutter-lg` |
| `section` / `section-lg` | 40px / 80px | `py-section lg:py-section-lg` |
| `grid` / `grid-lg` | 24px / 32px | `gap-grid lg:gap-grid-lg` |
| Container | 1280px | `max-w-page mx-auto` |

### Ritmo da primeira dobra (idêntico à referência)

| Elemento | Espaçamento |
|---|---|
| Coluna de texto | `pt-[clamp(1.75rem,4vw,3rem)]` · `pb-section`; desktop `pt-[clamp(2.5rem,5vw,4.5rem)]` · `pb-section-lg` · `pl-gutter-lg` · `pr-[clamp(2rem,4vw,3.5rem)]`. Alinhada ao topo (não centralizada) |
| Logo | largura `clamp(11.5rem, 26vw, 20rem)` |
| Faixa do evento | `mt-md` · `mb-[clamp(2rem,4vw,3rem)]` · `py-sm` · itens `gap-x-sm` (desktop `gap-x-xl`) · ícone `gap-xs` |
| H1 | `mb-lg` |
| Texto de apoio | `mb-[clamp(1.75rem,3vw,2.5rem)]` · `max-w-[54ch]` |
| Microcopy abaixo do CTA | `mt-md` · `max-w-[48ch]` · `text-meta` · 2 linhas |
| CTA | `w-full max-w-[27rem]` · `justify-between` (texto à esquerda, seta na ponta direita) · `min-h-[60px]` · `py-md` · mobile `px-sm gap-sm`, desktop `px-lg gap-md` |
| Nota sobre a foto | `bottom-xl left-xl` · `px-lg py-md` |

### Grids das seções (desktop)

- **Hero:** `lg:grid-cols-[1.12fr_0.88fr]` — texto à esquerda, retrato à direita; `lg:min-h-screen`. A coluna da foto encosta na borda direita da viewport (sangra para fora do container). No mobile a foto é **ocultada** (igual à referência) e o texto fica centralizado.
- **Dobra 2:** `lg:grid-cols-[0.8fr_1.2fr]` — foto à esquerda (sangra até a borda esquerda), texto à direita. No mobile a foto aparece no topo, em largura total.
- **Dobra 2 (`About`):** fundo `background-section`; rótulo "QUEM VAI TE MOSTRAR ISSO:" em `text-statement` 400; nome em `text-headline` 700 (`mt-xs`); bio `text-body` `max-w-[62ch]` `mb-md`; fecho `text-statement` com linha acima (`border-t`, `pt-lg`, `max-w-[46ch]`); CTA. Coluna de texto `py-section lg:py-section-lg` · `lg:pl-[clamp(2rem,4vw,3.5rem)]` · `lg:pr-gutter-lg`. Foto `aspect-[6/5] sm:aspect-[16/9]`, altura total no desktop.
- **Rodapé:** `lg:grid-cols-3` — logo · crédito · data/hora/plataforma. Centralizado no mobile.

### Componentes
- **CTA:** altura mínima 60px, padding `p-md` / `sm:px-lg`, `rounded-lg` (8px), `bg-accent text-heading font-sans font-bold text-cta uppercase`, hover com **escala** (`scale 1.04`, `active` 0.98, 200ms; desligado com `prefers-reduced-motion`) + ícone de seta com leve deslocamento — sem troca de cor. Touch target ≥ 44px.
- **Raio de borda:** cartões glass `rounded-2xl` (16px). Imagens: **sem** raio.

---

## 4. Imagens

Arquivos em `public/assets/`. Referenciar sem barra inicial: `src="assets/arquivo.ext"`.

| Arquivo | Seção | Posicionamento | Tamanho sugerido | Status |
|---|---|---|---|---|
| `logo-positivo.svg` | Hero (topo) | Acima da faixa de data, alinhado à esquerda no desktop e centralizado no mobile; largura `clamp(11.5rem, 26vw, 20rem)` | vetor | ✅ |
| `logo-negativo.svg` | — (reserva para fundo escuro) | — | vetor | ✅ |
| `gustavo-retrato.webp` | Hero (coluna direita) | `object-cover object-top`, altura total da seção, sangra até a borda direita; nota glass sobreposta no canto inferior: "Dr. Gustavo Sá · Nutrólogo · 280 mil seguidores" | 1200 × 1600 px (3:4) | ⚠️ PENDENTE — placeholder |
| `gustavo-ambiente.webp` | Dobra 2 (coluna esquerda) | `object-cover object-top`, altura total da seção, sangra até a borda esquerda | 1200 × 1400 px (6:7) | ⚠️ PENDENTE — placeholder |

**Regras**
- Sem container retangular com borda ao redor e sem `border-radius` nas fotos.
- Sem sombra nem filtro nas fotos; a profundidade vem dos elementos glass sobrepostos.
- Placeholder enquanto a foto não chega: bloco `bg-heading/5` com rótulo, nome do arquivo e dimensões (mesmo padrão da referência), trocado automaticamente pela imagem quando o arquivo existir.
- Formato final: `.webp`, com `width`/`height` declarados; `loading="lazy"` apenas na foto da dobra 2.
