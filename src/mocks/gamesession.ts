import { TypeGameSessionResponse } from "../types/game";

export const _game_full = {
  id: 1,
  id_campaign: 1,
  accusations: [{
    
  }]
} as TypeGameSessionResponse;

export const _game_with_me = {
  "CampaingId": 1,
  "id": 11,
  "isAccusing": false,
  "players": [
    {
      "hash": "9684f74a-3ada-442f-b89e-5252a530e776",
      "name": "Lucas Ribeiro",
      "isKiller": false,
      "alive": true,
      "attributes": [1,2],
      "reasons": [2],
      "suspects_actions": null,
      "winner": false
    },
    {
      "hash": null,
      "name": null,
      "isKiller": true,
      "alive": true,
      "attributes": [
        1,2
      ],
      "reasons": [],
      "suspects_actions": 4,
      "winner": true
    },
    {
      "hash": null,
      "name": null,
      "isKiller": false,
      "alive": true,
      "attributes": [5],
      "reasons": [1],
      "suspects_actions": null,
      "winner": false
    },
    {
      "hash": null,
      "name": null,
      "isKiller": false,
      "alive": true,
      "attributes": [],
      "reasons": [3],
      "suspects_actions": 2,
      "winner": false
    },
    {
      "hash": null,
      "name": null,
      "isKiller": true,
      "alive": true,
      "attributes": [],
      "reasons": [3],
      "suspects_actions": 2,
      "winner": false
    },
    {
      "hash": null,
      "name": null,
      "isKiller": true,
      "alive": true,
      "attributes": [],
      "reasons": [3],
      "suspects_actions": 2,
      "winner": false
    },
  ],
  "accusations": [],
  "investigations": []
}