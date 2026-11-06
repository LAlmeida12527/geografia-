# Fronteira da Esperança

Jogo curto de Geografia em **HTML, CSS e JavaScript**, pronto para GitHub Pages. A narrativa acompanha Noa, sua mãe Lia e seu irmão Davi, que deixam a vila fictícia de Aurora após uma invasão e buscam proteção além da fronteira.

## Versão para apresentação em sala

O percurso principal prioriza **animações e ações**, com poucas legendas curtas. As cenas avançam automaticamente, sem exigir que o apresentador fique passando falas. A leitura aprofundada, os documentos e a conversa com o professor Ivo são opcionais.

- Invasão em um flashback identificado, com tropas, moradores procurando abrigo e a saída da família.
- Transição exclusiva “De volta ao presente”, com um botão Continuar. Nenhum diálogo aparece por cima dela.
- Exploração para recolher a pasta e buscar água. A família e o militar iniciam suas cenas ao se aproximar.
- Controle da fronteira animado: a pasta é entregue, conferida e devolvida; a barreira é liberada.
- Sequência “Alguns dias depois”: água, organização de um espaço de descanso, atividade para Davi e tentativa de contato com Mara.
- Falas e retratos em uma faixa abaixo da imagem; a caixa não cobre os personagens.

Tempo estimado do percurso: **4–6 minutos**, dependendo da exploração e das pausas. As conversas opcionais podem alongar a experiência. Sem combate, pontuação ou sistemas de fome e dinheiro.

## Jogar

Abra `index.html` após extrair o ZIP inteiro, mantendo `assets/audio/music.js` na mesma estrutura. Não precisa Python, npm, servidor ou compilação.

- WASD ou setas: movimentar.
- E ou Enter: recolher objetos e conversar opcionalmente.
- Cenas: avançam sozinhas; “Próxima cena” adianta um trecho e “Pular esta sequência” encerra a sequência atual.
- Esc ou botão Ⅱ: pausar, inclusive durante as animações.
- Transições de tempo: use “Continuar” ou Enter para retomar. Não desaparecem antes da leitura.
- Conversas opcionais: primeiro toque em E revela a frase; o próximo avança.
- “Abrir pasta”: ler documentos e carta e ampliar a fotografia, fora das cenas.
- ♪ e controle de volume: música opcional. O clique em Iniciar solicita o áudio; se for bloqueado, use ♪.
- Há botões de toque. A tela cheia inclui o cenário e a faixa de diálogo.

As trilhas originais são geradas no navegador. Não dependem de baixar gravações ou de subir arquivos WAV. Sem conexão, o jogo usa fontes locais no lugar das fontes online opcionais.

## Percurso completo (spoilers)

1. Clique em Iniciar. Assista à invasão; avance ou pule se desejar.
2. Na tela “De volta ao presente”, clique em Continuar.
3. Aproxime-se de Lia na praça. A cena indica a casa com varal, a sudoeste.
4. Recolha a pasta diante da porta com E. Uma cena breve mostra a foto; a leitura da carta fica opcional no botão Abrir pasta.
5. Volte à praça e aproxime-se de Lia.
6. Vá ao poço pela parte de baixo e pressione E para encher a cantil.
7. Siga a placa ao norte e aproxime-se de Tomás no portão a nordeste. Falar com Ivo não é obrigatório.
8. Suba pela saída à direita de Tomás.
9. Atravesse a ponte. Ao chegar à barreira, a abordagem militar ocorre automaticamente. Aguarde ou pule a sequência para liberar a passagem.
10. Continue a leste até Sara. Após o acolhimento, a tela “Alguns dias depois” aguarda seu comando.
11. Assista ao cotidiano da família para chegar ao encerramento.

## Publicar no GitHub Pages

Os arquivos já estão no repositório `LAlmeida12527/geografia-`. Em outro repositório, envie os arquivos da raiz e a pasta `assets` inteira, depois escolha **Settings → Pages → Deploy from a branch → main → / (root)**. O link Baixar projeto usa o ZIP do próprio repositório.

## Arquivos e verificação

- `index.html`, `style.css`: interface, faixa de diálogo, pasta e transições.
- `game.js`: exploração, colisões, animações, retratos, missões e cotidiano.
- `assets/audio/music.js`: duas trilhas originais geradas localmente.
- `CREDITOS.md`: relatos e referências que orientaram a ficção.
- `APRESENTACAO.md`: sugestão de fala para o professor.
- `tests/mission.cjs`: teste de lógica opcional, executável com `node tests/mission.cjs`.

Os testes verificam cenas automáticas e puláveis, pausa, transições sem sobreposição, alcance dos objetivos, pasta opcional, barreira e reinício. Usam DOM e Canvas simulados, sem substituir revisão visual e sonora no navegador.

A chegada significa acolhimento inicial, não reconhecimento automático do pedido de refúgio. O abrigo temporário é uma situação específica da ficção; pessoas refugiadas também reconstroem suas vidas em bairros e cidades. O jogo não coleta dados. Recarregar a página reinicia a jornada.
