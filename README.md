# Fronteira da Esperança

Pequeno RPG 2D de exploração para um trabalho de Geografia. Feito inteiramente em **HTML, CSS e JavaScript**, sem Python, sem instalação e sem compilação.

## Abrir e jogar

Abra `index.html` no navegador. Use **WASD ou setas** para andar, **E ou Enter** para interagir/avançar diálogos e **Esc** para pausar. Há botões de toque em telas menores. O som é opcional e começa desligado.

Duração aproximada: 5–10 minutos. Não há combate, cronômetro ou penalidades.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie `index.html`, `style.css`, `game.js` e este README para a raiz do repositório.
3. Em **Settings → Pages**, selecione **Deploy from a branch**.
4. Selecione **main** e **/ (root)** e clique em **Save**.
5. Aguarde o GitHub exibir o endereço do seu jogo.

Não é necessário Node, npm ou servidor. Os arquivos de jogo usam caminhos relativos. A fonte online é opcional: sem conexão, o navegador usa fontes locais e o jogo continua funcionando. O botão de baixar o projeto requer também o ZIP na mesma pasta; você pode retirá-lo do HTML se não quiser hospedar o ZIP.

## Estrutura da entrega

- `index.html` — interface, tela inicial, diário e caixas de diálogo.
- `style.css` — apresentação e layout adaptável.
- `game.js` — mapas, pixel art original, animação, colisões, diálogos e missão.
- `APRESENTACAO.md` — roteiro curto para apresentar em sala.
- `fronteira-da-esperanca.zip` — cópia para baixar (quando hospedada).

## História e objetivo

Noa vive na vila fictícia de Aurora, atingida por uma guerra. Antes de buscar proteção, ajuda Lia e seu filho a recuperar os documentos da família. Depois conversa com Tomás sobre a rota do vale, atravessa a fronteira e chega ao posto de acolhimento de Sara.

O conteúdo aborda guerra, deslocamento interno, fronteiras, refúgio e acolhimento, sem quiz. Documentos facilitam identificação, mas não são apresentados como condição para pedir proteção. O professor Ivo explica a diferença entre deslocamento interno e busca de refúgio.

## Roteiro completo (com spoilers)

1. Inicie e avance as duas falas de Noa.
2. Vá até Lia na praça, à direita do poço, e converse.
3. Vá à casa com varal no canto inferior esquerdo. Interaja com os documentos no chão, diante da porta.
4. Volte a Lia e entregue os documentos.
5. Converse com Tomás junto ao portão no canto superior direito.
6. Suba pela estrada à direita de Tomás até a saída ao norte.
7. No segundo mapa, siga para a direita pela ponte e converse com Sara, diante do posto.
8. Avance o diálogo para ver a conclusão. Você pode reiniciar na tela final.

O jogo recomeça ao recarregar a página. Não coleta dados nem envia informações a servidores. Lugares e personagens são fictícios. A chegada ao posto encerra o protótipo; o reconhecimento jurídico de refúgio não é simulado.
