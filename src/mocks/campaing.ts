export const _campaing_1 = {
  "name" : "AP lucão",
  "id": 1,
  "year": 2022,
  "narrative": "Você foi convidado para uma partida de jogos no ap do {usuario}, la a luz se apagou, alguém derrubou a mesa e ouviram alguém ser assassinado no banheiro com {arma}",
  "urlImage": "https://www.suvinil.com.br/img/default/inspiration/articles/48/3.jpg",
  "narrative_changes": [ 
    {
      "tag": "{usuario}",
      "values": [
        "Lucas", "Kendão", "Josy"
      ]
    },
    {
      "tag": "{arma}",
      "values": [
        "Faca", "Colher", "Consolo vibrador DK 2000"
      ]
    }
  ],
  "suspects_actions": [ 
    "Foi você quem acendeu a luz",
    "Você Estava próximo do interruptor",
    "Foi você o ultimo a sair do fundos dos quartos",
    "Você estava assubiando durante o escuro",
    "Você estava perto das facas da cozinha, mexendo",
    "Você foi o ultimo a ir no banheiro"
  ],
  "reasons": [
    "Você veio com vontade de descolar uma comida grátis",
    "Você estava ansioso por algum motivo em particular",
    "VocÊ não gosta do hóspede e veio com intuito de terminar a amizade",
    "Você está apaixonado pelo hóspede da casa",
    "Sua mãe esta muito doente e estava precisando se distrair",
    "Tem alguém da mesa que você gosta muito mas tem medo de confessar"
  ],
  "investigations": [ 
    {
      "id": 1,
      "name": "Checar o corpo no banheiro",
      "risk": 0,
      "results": {
        "hasDeath": {
          "message": "Aos entrarem no banheiro, entre eles estava um silecio inquietador, derrepente alguém apagou a luz e pode ouvir as vozes de {USUARIO} sendo esfaqueado"
        },
        "hasNoDeath": {
          "message": "Ao investigarem o corpo, perceberam que nos ultimos esforços o corpo segurou a roupa preta do {ASSASSINO}"
        }
      }
    },
    {
      "id": 2,
      "name": "Investigar a porta de entrada",
      "risk": 0,
      "results": {
        "hasDeath": {
          "message": "Alguém fechou a porta por fora e pode ouvir trancar a porta e lutarem la fora, abriram a porta e descobriram que {USUARIO} estava morto e os outros dois descansados"
        },
        "hasNoDeath": {
          "message": "Ao sairem la fora, perceberam que a alguém deixou uma faca escondida ao lado de fora com sangue, marcado seu nome {ASSASSINO}"
        }
      }
    },
    {
      "id": 3,
      "name": "Checar os outros quartos",
      "risk": 0,
      "results": {
        "hasDeath": {
          "message": "Ao conferirem os quartos, pode se ouvir gritos e uma porta sendo batida fortemente, ao verem descobriram {USUARIO} com o pescoço quebrado e os outros dois discutindo la dentro"
        },
        "hasNoDeath": {
          "message": "Ao investigarem os quartos, {ASSASSINO} foi atrás deles em uma tentativa falha de pega-los de surpresa com a distração dos outros jogadores"
        }
      }
    },
    {
      "id": 4,
      "name": "Checar escadaria",
      "risk": 10,
      "results": {
        "hasDeath": {
          "message": "Ao sairem para fora indo até a escadaria do apartamento, {USUARIO} foi empuraddo pelas escadas a baixo."
        },
        "hasNoDeath": {
          "message": "Ao sairem para fora indo até a escadaria, {USUARIO} foi tentado jogar fora, porém com reflexos agéis conseguiu se safar e olhar para trás e ver o {ASSASSINO}"
        }
      }
    },
    {
      "id": 5,
      "name": "Checar janelas dos quartos",
      "risk": 10,
      "results": {
        "hasDeath": {
          "message": "Ao olharem para janela, alguém mencionou ver algo la em baixo, quando {USUARIO} foi ver, ele foi empurrado para baixo e quebrou seu pescoço"
        },
        "hasNoDeath": {
          "message": "Ao olharem pela janela, {USUARIO} foi empurrado, porém conseguiu se segurar na ponta, olhou para cima e viu {ASSASSINO} e gritou por ajuda, alguém chegou a tempo de salva-lo"
        }
      }
    }
  ]
}

export const _fake_investigation = [ 
  {
    "id": 1,
    "name": "Checar o corpo no banheiro",
    "risk": 0,
    "results": {
      "hasDeath": {
        "message": "Aos entrarem no banheiro, entre eles estava um silecio inquietador, derrepente alguém apagou a luz e pode ouvir as vozes de {USUARIO} sendo esfaqueado"
      },
      "hasNoDeath": {
        "message": "Ao investigarem o corpo, perceberam que nos ultimos esforços o corpo segurou a roupa preta do {ASSASSINO}"
      }
    }
  },
  {
    "id": 2,
    "name": "Investigar a porta de entrada",
    "risk": 0,
    "results": {
      "hasDeath": {
        "message": "Alguém fechou a porta por fora e pode ouvir trancar a porta e lutarem la fora, abriram a porta e descobriram que {USUARIO} estava morto e os outros dois descansados"
      },
      "hasNoDeath": {
        "message": "Ao sairem la fora, perceberam que a alguém deixou uma faca escondida ao lado de fora com sangue, marcado seu nome {ASSASSINO}"
      }
    }
  },
  {
    "id": 3,
    "name": "Checar os outros quartos",
    "risk": 0,
    "results": {
      "hasDeath": {
        "message": "Ao conferirem os quartos, pode se ouvir gritos e uma porta sendo batida fortemente, ao verem descobriram {USUARIO} com o pescoço quebrado e os outros dois discutindo la dentro"
      },
      "hasNoDeath": {
        "message": "Ao investigarem os quartos, {ASSASSINO} foi atrás deles em uma tentativa falha de pega-los de surpresa com a distração dos outros jogadores"
      }
    }
  },
  {
    "id": 4,
    "name": "Checar escadaria",
    "risk": 10,
    "results": {
      "hasDeath": {
        "message": "Ao sairem para fora indo até a escadaria do apartamento, {USUARIO} foi empuraddo pelas escadas a baixo."
      },
      "hasNoDeath": {
        "message": "Ao sairem para fora indo até a escadaria, {USUARIO} foi tentado jogar fora, porém com reflexos agéis conseguiu se safar e olhar para trás e ver o {ASSASSINO}"
      }
    }
  },
  {
    "id": 5,
    "name": "Checar janelas dos quartos",
    "risk": 10,
    "results": {
      "hasDeath": {
        "message": "Ao olharem para janela, alguém mencionou ver algo la em baixo, quando {USUARIO} foi ver, ele foi empurrado para baixo e quebrou seu pescoço"
      },
      "hasNoDeath": {
        "message": "Ao olharem pela janela, {USUARIO} foi empurrado, porém conseguiu se segurar na ponta, olhou para cima e viu {ASSASSINO} e gritou por ajuda, alguém chegou a tempo de salva-lo"
      }
    }
  }
]