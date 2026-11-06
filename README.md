# Fronteira da Esperança

RPG 2D curto de Geografia sobre guerra, deslocamento, fronteiras e busca por proteção. **HTML, CSS e JavaScript. Sem Python, npm ou compilação.**

## Abrir

Extraia o ZIP e abra `index.html` no navegador. A pasta `assets/audio` já está no repositório. Mantenha-a junto dos arquivos se baixar o ZIP. O jogo e a música funcionam offline; apenas a tipografia online é opcional.

- WASD ou setas: andar.
- E ou Enter: interagir. Durante a digitação, o primeiro toque revela a frase e o seguinte avança.
- Esc: pausar durante exploração; fechar a pasta durante a inspeção.
- Botões de toque em telas pequenas.
- ♪: ligar/desligar áudio. Controle de volume sob o jogo.
- “Abrir pasta”: reler documentos e carta e ampliar a fotografia depois da coleta.
- “Relatos reais e créditos”: consultar a pesquisa que orientou a ficção.

Clique em Iniciar para começar o flashback e permitir áudio. Se o navegador bloquear o som, use o botão ♪. Cada fala aguarda leitura; não avança sozinha. A introdução é identificada como FLASHBACK e termina com DE VOLTA AO PRESENTE. Pode ser pulada. Duração aproximada: 8–12 minutos, dependendo da leitura. Sem combate ou cronômetro.

## Publicar no GitHub Pages

1. Crie um repositório e envie `index.html`, `style.css`, `game.js`, a pasta **assets inteira**, `README.md`, `APRESENTACAO.md` e `CREDITOS.md` para a raiz.
2. Em **Settings → Pages**, selecione **Deploy from a branch**.
3. Escolha **main** e **/ (root)**, depois **Save**.
4. Aguarde o GitHub exibir a URL.

“Baixar projeto” aponta para o ZIP do próprio repositório, incluindo as pastas automaticamente. Não precisa enviar `.git` nem `.openai`. Todos os caminhos são relativos.

## Arquivos

- `index.html`: interface, diálogos e inspeção da pasta.
- `style.css`: layout e apresentação adaptável.
- `game.js`: mapas, colisões, missão, flashback, retratos e digitação.
- `assets/audio/music.js`: gera as duas trilhas originais localmente, sem baixar arquivos de música.
- `CREDITOS.md`: pesquisa, distinção entre ficção e fatos e créditos musicais.
- `APRESENTACAO.md`: roteiro de apresentação.

A pasta `dist`, quando presente no checkout de desenvolvimento, é uma cópia preparada para hospedagem. O ZIP já contém os arquivos diretamente na raiz.

## História e roteiro completo (spoilers)

Noa é filho de Lia e irmão de Davi. A família foge após uma invasão militar à vila fictícia de Aurora.

1. Leia a introdução, que mostra a entrada das tropas, a família procurando abrigo e a saída de casa. Cada frase pode ser revelada com E antes de avançar.
2. Procure Lia na praça, à direita do poço.
3. Vá à casa com varal, no canto inferior esquerdo. Recolha a pasta diante da porta. A pasta aberta sobre a mesa contém os documentos, a carta da tia Mara e a foto do aniversário de Davi. Selecione cada objeto para ampliar; use “Voltar à pasta aberta”. Depois clique em “Guardar a pasta”.
4. Volte a Lia e converse.
5. Encha a cantil no poço, aproximando-se pela parte de baixo. Converse com Ivo sobre a estrada da escola interditada. Depois fale com Tomás no canto superior direito para confirmar a rota.
6. Siga ao norte pela estrada à direita de Tomás.
7. No segundo mapa, cruze a ponte e fale com Duarte, antes da barreira. A família acompanha seu caminho.
8. Leia a abordagem e examine a pasta. A conversa seguinte libera a passagem.
9. Procure Sara, de roupa clara, diante do posto, para concluir.

A chegada representa acolhimento inicial, não aprovação automática de refúgio. O jogo recomeça ao recarregar a página e não coleta dados.

## Verificação

A sequência de missão, inspeção, digitação, barreira, alcance dos objetivos, conclusão e reinício foi verificada em teste automatizado de lógica com DOM/Canvas simulados. Isso não substitui revisão visual ou audição no navegador. Neste ambiente, a ferramenta de navegador estava indisponível.

## Atualização desta versão

A invasão mostra coluna militar, disparos, incêndios, impactos, poeira e moradores correndo para abrigo. Não há combate controlado pelo jogador. A opção de reduzir movimento do sistema remove o tremor de câmera. Os retratos de diálogo foram preservados. A fotografia foi redesenhada em 384 × 256 pixels, com os três familiares e o bolo de seis anos de Davi. A preparação exige água e informação de rota antes da partida.
