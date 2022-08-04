import { TypeCampaingV1, TypePlayerV1 } from "../types/gamev1";

export const __CAMPAING_V1_HOUSE: TypeCampaingV1 = {
  "id": 1,
  "type": 1,
  "name": "A Casa (V1)",
  "url_image": "https://image.api.playstation.com/vulcan/ap/rnd/202109/2500/vpksb1uf2F8QlvQvokbKO5SL.jpg",
  "map": [3, 3],
  "narrative": "Você ouviu ligou para seu amigo Jhonny e ele não atendeu, você se reuniu com outros integrantes na porta, onde esta Jhonny?",
  "weapons": [
    {
      "id": 1,
      "name": "Faca",
      "clue": "foi esfaqueado",
    },
    {
      "id": 2,
      "name": "Pistola 9mm",
      "clue": "foi encontrado perfurado por balas de calibre 9mm",
    },
    {
      "id": 3,
      "name": "Corda",
      "clue": "foi encontrado com traços de pressão no seu pescoço",
    },
    {
      "id": 4,
      "name": "Travesseiro",
      "clue": "foi encontrado com rosto roxo, sem lesões físicas",
    },
    {
      "id": 5,
      "name": "Saco Plástico",
      "clue": "foi encontrado com rosto roxo, sem lesões físicas",
    },
    {
      "id": 6,
      "name": "Taco de Baiseboll",
      "clue": "foi encontrado com rosto todo desfigurado",
    },
    {
      "id": 7,
      "name": "Taco de Baiseboll",
      "clue": "foi encontrado com furos no pescoço",
    },
  ],
  "objects": [
    {
      "id": 1,
      "name": "Camisa",
      "type": "color",
      "clue": "encontrou pedaços de pano"
    },
    {
      "id": 2,
      "name": "Calça Jeans",
      "type": "color",
      "clue": "encontrou pedaços de pano jeans"
    },
    {
      "id": 3,
      "name": "Meia Xadrez",
      "type": "color",
      "clue": "encontrou pedaços de pano xadrez"
    },
    {
      "id": 4,
      "name": "Óculos",
      "type": null,
      "clue": "encontrou um case de óculos"
    },
    {
      "id": 5,
      "name": "Óculos Escuros",
      "type": null,
      "clue": "encontrou um case de óculos"
    },
    {
      "id": 6,
      "name": "Cachecol",
      "type": "color",
      "clue": "encontrou pedaços de pano"
    },
    {
      "id": 7,
      "name": "Manual de como resolver mistérios",
      "type": null,
      "clue": "encontoru páginas soltas"
    },
    {
      "id": 8,
      "name": "Diário pessoal",
      "type": null,
      "clue": "encontoru páginas de um diário"
    },
    {
      "id": 9,
      "name": "Cartão de crédito",
      "type": null,
      "clue": "encontrou recibo de um posto de gasolina"
    }
  ]
};

export const __JOGADORES__: TypePlayerV1[] = [
  {
    "id": 1,
    "name": "Jhonny",
    "points": 0,
    "is_assassin": false,
    "color": "red",
    "hash": "jhonny",
    "isTurn": true,
    "position": null,
    "weapons": [],
    "objects": [],
  },
  {
    "id": 2,
    "name": "Blaze",
    "points": 0,
    "is_assassin": false,
    "color": "blue",
    "hash": "55d03596-6d66-44c2-9d75-2149cf0908f8",
    "position": null,
    "weapons": [
      {
        "id": 1,
        "name": "Faca",
        "clue": "foi esfaqueado",
      }
    ],
    "objects": [{
      "id": 9,
      "name": "Cartão de crédito",
      "type": null,
      "clue": "encontrou recibo de um posto de gasolina"
    }],
  },
  {
    "id": 3,
    "name": "Jack",
    "points": 0,
    "is_assassin": false,
    "color": "green",
    "hash": "jack",
    "position": null,
    "weapons": [
      {
        "id": 1,
        "name": "Faca",
        "clue": "foi esfaqueado",
      }
    ],
    "objects": [{
      "id": 9,
      "name": "Cartão de crédito",
      "type": null,
      "clue": "encontrou recibo de um posto de gasolina"
    }],
  },
  {
    "id": 4,
    "name": "Will",
    "points": 0,
    "is_assassin": true,
    "color": "#ff00ff",
    "hash": "will",
    "position": null,
    "weapons": [
      {
        "id": 1,
        "name": "Faca",
        "clue": "foi esfaqueado",
      }
    ],
    "objects": [{
      "id": 9,
      "name": "Cartão de crédito",
      "type": null,
      "clue": "encontrou recibo de um posto de gasolina"
    }],
  },
]