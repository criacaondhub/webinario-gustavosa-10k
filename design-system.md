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
| `accent-hover` | `#B6751F` | `bg-accent-hover` | Hover dos CTAs |

> Hierarquia entre `text`, `heading` e `muted` (todos navy) vem de **tamanho e peso**, não de cor.

### Marca-texto (destaques do H1)
Definido pelo usuário: trechos destacados ("passo a passo", "10 mil seguidores até o fim do ano") em `heading` peso 700 com marca-texto `accent` atrás. Receita (utilitário `highlight`): faixa `accent` cobrindo os ~45% inferiores da linha, com `box-decoration-break: clone` para quebrar corretamente entre linhas.

**Contrastes medidos (WCAG)**

| Par | Contraste | Resultado |
|---|---|---|
| `heading` sobre `background` | 13,6:1 | ✅ AA/AAA |
| `heading` sobre `accent` (CTA) | 7,1:1 | ✅ AA |
| `heading` sobre `accent-hover` (CTA hover) | 3,85:1 | ✅ só texto grande → CTA em 20px/700 |
| `accent` sobre `background` | 1,91:1 | ❌ não usar como texto |
| `accent-hover` sobre `background` | 3,53:1 | ⚠️ só texto grande / ícones |
| `text` (navy) sobre `background` | 13,6:1 | ✅ AA/AAA |

**Regras de uso**
- Texto dos botões sobre `accent`: `heading` (`#0E2A47`). Nunca branco sobre `accent`.
- `accent` só como **fundo** (CTAs, marca-texto) ou em elementos decorativos/ícones com `aria-hidden`.
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
Usos previstos: lista "O que você vai ver" no Hero, nota sobreposta na foto ("Dr. Gustavo Sá · Nutrólogo · 280 mil seguidores").

---

## 2. Tipografia

Fonte: **Futura PT** via Adobe Fonts (kit `gup0mrx`).
Import no topo de `src/index.css`: `@import url("https://use.typekit.net/gup0mrx.css");`

| Família | Token | Classe | Pesos disponíveis | Uso |
|---|---|---|---|---|
| `futura-pt` | `--font-sans` | `font-sans` (padrão do `body`) | 400, 700 (+ itálico) | Títulos, texto corrido |
| `futura-pt-condensed` | `--font-condensed` | `font-condensed` | 400, 500, 700, 800 (+ itálico) | CTAs, rótulos em caixa-alta, faixa de data |

> Não usar `font-medium`/`font-semibold` com `font-sans` — o kit só tem 400 e 700 para `futura-pt` (o navegador sintetizaria).

### Escala

| Token | Tamanho | Line-height | Peso | Uso |
|---|---|---|---|---|
| `text-display` | `clamp(2rem, 1.4rem + 2.2vw, 3.125rem)` | 1.1 | 400 (trechos destacados 700) | H1 do Hero |
| `text-headline` | `clamp(1.875rem, 1.4rem + 2vw, 3rem)` | 1.1 | 700 | Nome "Dr. Gustavo Sá" |
| `text-statement` | `clamp(1.25rem, 1.1rem + 0.6vw, 1.625rem)` | 1.3 | 400 / 700 | Fecho da dobra 2 |
| `text-lead` | `clamp(1.125rem, 1.05rem + 0.35vw, 1.3125rem)` | 1.5 | 400 | H2 do Hero |
| `text-body` | `1.0625rem` (17px) | 1.6 | 400 | Bio, itens da lista |
| `text-meta` | `0.9375rem` (15px) | 1.5 | 400 | Microcopy, rodapé |
| `text-label` | `0.875rem` (14px) | 1.2 | 500–700 condensed, caixa-alta, `tracking-label` (0.08em) | Rótulo "QUEM VAI TE MOSTRAR ISSO:", faixa de data, "Vagas limitadas" |
| `text-cta` | `1.25rem` (20px) | 1.1 | 700 condensed, caixa-alta, `tracking-label` | Botões (20px/700 = texto grande para WCAG, necessário no hover) |

---

## 3. Espaçamentos e Grid

| Token | Mobile | Desktop (`lg` ≥ 1024px) | Classes |
|---|---|---|---|
| Container máximo | 1440px | 1440px | `max-w-page mx-auto` |
| Padding lateral | 20px | 64px | `px-gutter lg:px-gutter-lg` |
| Padding vertical das seções | 64px | 112px | `py-section lg:py-section-lg` |
| Gap do grid | 24px | 48px | `gap-grid lg:gap-grid-lg` |

### Grids das seções (desktop)

- **Hero:** `lg:grid-cols-[1.12fr_0.88fr]` — texto à esquerda, retrato à direita; `lg:min-h-screen`. A coluna da foto encosta na borda direita da viewport (sangra para fora do container). No mobile a foto é **ocultada** (igual à referência) e o texto fica centralizado.
- **Dobra 2:** `lg:grid-cols-[0.8fr_1.2fr]` — foto à esquerda (sangra até a borda esquerda), texto à direita. No mobile a foto aparece no topo, em largura total.
- **Rodapé:** `lg:grid-cols-3` — logo · crédito · data/hora/plataforma. Centralizado no mobile.

### Componentes
- **CTA:** altura mínima 56px, padding `px-8`, `rounded-full`, `bg-accent text-heading font-condensed text-cta uppercase`, hover `bg-accent-hover` + ícone de seta com leve deslocamento. Touch target ≥ 44px.
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
