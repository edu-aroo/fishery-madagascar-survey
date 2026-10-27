/* =====================================================================
   CONFIGURATION DE L'ENQUÊTE « SUIVI DES PÊCHERIES » — fichier unique à modifier
   ---------------------------------------------------------------------
   • META   : titre, textes d'accueil, contact, logos, photos, URL Apps Script
   • PHOTOS : photos du bandeau, de l'accueil et des sections (avec crédits)
   • LOOP   : boucle « par ressource » (Q14–Q40 répétées pour chaque ressource cochée en Q13)
   • STEPS  : étapes du formulaire et questions. Les étapes marquées
              perMethod: true sont répétées pour chaque ressource.
   Les identifiants (id) deviennent les noms de colonnes dans Google
   Sheets et les noms de variables dans R : ne pas les modifier une fois
   la collecte lancée.

   Types : text, email, tel, textarea, number, year, radio, checkbox, file
   Options :
     other: true   → champ texte quand « Autre » ou « (préciser) » est coché (id_autre)
     groups: [...] → options présentées par groupes (choix multiple)
     unit: 'MGA'   → unité affichée à côté d'un nombre
     showIf        → { q:'q011', eq:'Oui' } | { q:'q017', starts:'Oui' } |
                     { q:'q012', in:[...] } | { q:'q015', ne:'Avant 2020' } |
                     { all:[cond1, cond2] }
   ===================================================================== */

const SURVEY = {
  META: {
  "version": "1.0",
  "title": "Enquête nationale sur le suivi des pêcheries à Madagascar",
  "subtitle": "Inventaire des dispositifs de suivi des pêcheries, de leurs moyens et de leurs contraintes, en vue d'un protocole national harmonisé",
  "organizer": "Fondation pour les Aires Protégées et la Biodiversité de Madagascar (FAPBM), en collaboration avec l’Institut Halieutique et des Sciences Marines (IH.SM) – Université de Toliara",
  "contactName": "Sandra Ranaivomanana",
  "contactEmail": "sandra.ranaivomanana@gmail.com",
  "deadline": "15 Novembre 2026",
  "estimatedTime": "20 à 40 min",
  "appsScriptUrl": "https://script.google.com/macros/s/AKfycbxJOr79AqGn6_Kz7HNaxGC8mREgdEbn2Wp31y0Rt2Uct0QICMVP5FnYFzlHXxRKZpVZHA/exec",
  "logos": [
    {
      "src": "assets/img/logos/ihsm.png",
      "alt": "IH.SM — Université de Toliara",
      "url": "https://ihsm.mg/"
    },
    {
      "src": "assets/img/logos/fapbm.png",
      "alt": "FAPBM",
      "url": "https://www.fapbm.org/en/home/"
    }
  ],
  "intro": [
    "Cette enquête vise à dresser un état des lieux des dispositifs de suivi des pêcheries à Madagascar : ressources suivies, méthodes et variables collectées, moyens humains et financiers, gestion des données et contraintes rencontrées.",
    "Elle s'adresse aux administrations, gestionnaires d'AMP/LMMA, ONG, associations, structures communautaires, instituts de recherche et partenaires impliqués dans le suivi des pêcheries.",
    "Si votre organisation suit plusieurs ressources (poissons, poulpes, crabes…), quelques questions vous seront posées pour chacune d'elles."
  ],
  "draftNote": "Vos réponses sont enregistrées automatiquement sur cet appareil : vous pouvez interrompre la saisie et la reprendre plus tard depuis le même navigateur.",
  
  "privacy": "Les informations recueillies servent uniquement à cette étude. Vos coordonnées ne serviront qu'à vous recontacter si une réponse doit être précisée ; elles ne seront ni publiées ni transmises. Les résultats seront présentés de manière agrégée.",
  "consentLabel": "J'accepte que les informations fournies soient utilisées dans le cadre de cette étude, selon les conditions décrites ci-dessus.",
  "heroPhoto": "peche-pirogues",
  "introPhotos": [
    "peche-morondava-1",
    "peche-filets",
    "peche-nasses"
  ],
  "thanksPhoto": "peche-pirogue",
  "photoCreditNote": "Photographies : Wikimedia Commons (licences CC BY-SA) — auteurs indiqués sur chaque photo."
},

  PHOTOS: [
  {
    "key": "peche-pirogues",
    "src": "assets/img/photos/peche-pirogues.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Fishing_Pirogues_%2828238012392%29.jpg/1280px-Fishing_Pirogues_%2828238012392%29.jpg",
    "caption": "",
    "credit": "Rod Waddington",
    "license": "CC BY-SA 2.0",
    "page": "https://commons.wikimedia.org/wiki/File:Fishing_Pirogues_(28238012392).jpg"
  },
  {
    "key": "peche-morondava-1",
    "src": "assets/img/photos/peche-morondava-1.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Fishing_in_Morondava_2023_01.jpg/1280px-Fishing_in_Morondava_2023_01.jpg",
    "caption": "",
    "credit": "Vaido Otsar",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Fishing_in_Morondava_2023_01.jpg"
  },
  {
    "key": "peche-morondava-2",
    "src": "assets/img/photos/peche-morondava-2.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Fishing_in_Morondava_2023_02.jpg/1280px-Fishing_in_Morondava_2023_02.jpg",
    "caption": "",
    "credit": "Vaido Otsar",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Fishing_in_Morondava_2023_02.jpg"
  },
  {
    "key": "peche-belo",
    "src": "assets/img/photos/peche-belo.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/P%C3%AAche_Belo_sur_mer%2C_Madagascar.jpg/1280px-P%C3%AAche_Belo_sur_mer%2C_Madagascar.jpg",
    "caption": "",
    "credit": "Cactus0625",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:P%C3%AAche_Belo_sur_mer,_Madagascar.jpg"
  },
  {
    "key": "peche-retour",
    "src": "assets/img/photos/peche-retour.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2d/Retour_de_la_p%C3%AAche.jpg/1280px-Retour_de_la_p%C3%AAche.jpg",
    "caption": "",
    "credit": "Laure Borel",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Retour_de_la_p%C3%AAche.jpg"
  },
  {
    "key": "peche-nasses",
    "src": "assets/img/photos/peche-nasses.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Fish_Traps%2C_Madagascar_%28in_Explore%29_-_Flickr_-_Rod_Waddington.jpg/1280px-Fish_Traps%2C_Madagascar_%28in_Explore%29_-_Flickr_-_Rod_Waddington.jpg",
    "caption": "",
    "credit": "Rod Waddington",
    "license": "CC BY-SA 2.0",
    "page": "https://commons.wikimedia.org/wiki/File:Fish_Traps,_Madagascar_(in_Explore)_-_Flickr_-_Rod_Waddington.jpg"
  },
  {
    "key": "peche-filets",
    "src": "assets/img/photos/peche-filets.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/P%C3%AAcheur_%28_pr%C3%A9paration_des_filets_%29.jpg/1280px-P%C3%AAcheur_%28_pr%C3%A9paration_des_filets_%29.jpg",
    "caption": "",
    "credit": "Pascale Bireaud",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:P%C3%AAcheur_(_pr%C3%A9paration_des_filets_).jpg"
  },
  {
    "key": "peche-antsiranana",
    "src": "assets/img/photos/peche-antsiranana.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Two_fisherman_VavaLapasy_Antsiranana_Madagascar.jpg/1280px-Two_fisherman_VavaLapasy_Antsiranana_Madagascar.jpg",
    "caption": "",
    "credit": "TinsRad",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Two_fisherman_VavaLapasy_Antsiranana_Madagascar.jpg"
  },
  {
    "key": "peche-bateaux",
    "src": "assets/img/photos/peche-bateaux.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Fishing_Boats%2C_Madagascar_%2821941981566%29.jpg/1280px-Fishing_Boats%2C_Madagascar_%2821941981566%29.jpg",
    "caption": "",
    "credit": "Rod Waddington",
    "license": "CC BY-SA 2.0",
    "page": "https://commons.wikimedia.org/wiki/File:Fishing_Boats,_Madagascar_(21941981566).jpg"
  },
  {
    "key": "peche-vezo",
    "src": "assets/img/photos/peche-vezo.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d2/Vezo_%C3%A0_la_p%C3%AAche.JPG/1280px-Vezo_%C3%A0_la_p%C3%AAche.JPG",
    "caption": "",
    "credit": "Boosha Afrikaf",
    "license": "CC BY-SA 4.0",
    "page": "https://commons.wikimedia.org/wiki/File:Vezo_%C3%A0_la_p%C3%AAche.JPG"
  },
  {
    "key": "peche-pirogue",
    "src": "assets/img/photos/peche-pirogue.jpg",
    "remote": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Fishing_Pirogue%2C_Madagascar_%2827644458115%29.jpg/1280px-Fishing_Pirogue%2C_Madagascar_%2827644458115%29.jpg",
    "caption": "",
    "credit": "Rod Waddington",
    "license": "CC BY-SA 2.0",
    "page": "https://commons.wikimedia.org/wiki/File:Fishing_Pirogue,_Madagascar_(27644458115).jpg"
  }
],

  LOOP: {
  "source": "q013",
  "label": "Ressource",
  "labelPlural": "ressources",
  "active": {
    "all": [
      {
        "q": "q011",
        "eq": "Oui"
      },
      {
        "q": "q012",
        "in": [
          "Notre organisation même",
          "En collaboration avec d'autres partenaires"
        ]
      }
    ]
  }
},

  STEPS: [
  {
    "key": "A",
    "title": "Identification du répondant",
    "short": "Répondant",
    "questions": [
      {
        "id": "q001",
        "n": 1,
        "label": "Nom et prénom(s) du répondant",
        "type": "text",
        "required": true
      },
      {
        "id": "q002",
        "n": 2,
        "label": "Adresse e-mail professionnelle",
        "type": "email",
        "required": false
      },
      {
        "id": "q003",
        "n": 3,
        "label": "Numéro de téléphone professionnel",
        "type": "tel",
        "required": false
      },
      {
        "id": "q004",
        "n": 4,
        "label": "Type d’organisation / institution",
        "type": "radio",
        "required": true,
        "options": [
          "Administration centrale (ministère)",
          "Administration régionale (DREDD, DRPEB…)",
          "Madagascar National Parks (MNP)",
          "ONG internationale",
          "ONG ou association nationale",
          "Plateforme ou réseau (ex. MIHARI)",
          "Structure communautaire (VOI, association, fédération)",
          "Opérateur privé",
          "Institution de recherche / université",
          "Bailleur / fondation / partenaire technique et financier",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q005",
        "n": 5,
        "label": "Nom de l'organisation / institution",
        "type": "text",
        "required": true
      },
      {
        "id": "q006",
        "n": 6,
        "label": "Fonction / poste du répondant au sein de l'organisation / institution",
        "type": "text",
        "required": true
      }
    ]
  },
  {
    "key": "B",
    "title": "Identification du site",
    "short": "Site d'intervention",
    "questions": [
      {
        "id": "q007",
        "n": 7,
        "label": "Nom du site d'intervention",
        "type": "text",
        "required": true,
        "help": "Ex. : nom de l'AMP, du LMMA, de la baie, du paysage…"
      },
      {
        "id": "q008",
        "n": 8,
        "label": "Catégorie du site",
        "type": "radio",
        "required": false,
        "help": "Si plusieurs statuts s'appliquent, choisissez le principal.",
        "options": [
          "AMP — statut définitif (décret de création)",
          "AMP — en création (protection temporaire)",
          "LMMA — Dina",
          "LMMA — TGRH",
          "LMMA — TGRN",
          "Ne sais pas / Non applicable",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q009",
        "n": 9,
        "label": "Région",
        "type": "radio",
        "required": true,
        "options": [
          "Diana",
          "Sava",
          "Analanjirofo",
          "Atsinanana",
          "Vatovavy",
          "Fitovinany",
          "Atsimo-Atsinanana",
          "Anosy",
          "Androy",
          "Atsimo-Andrefana",
          "Menabe",
          "Melaky",
          "Boeny",
          "Sofia",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q010",
        "n": 10,
        "label": "Rôle de votre organisation sur ce site",
        "type": "radio",
        "required": false,
        "options": [
          "Gestionnaire principal ou délégataire de gestion",
          "Cogestionnaire",
          "Appui technique et/ou financier",
          "Autorité de tutelle / administration",
          "Structure communautaire de base (VOI, association)",
          "Autre"
        ],
        "other": true
      }
    ]
  },
  {
    "key": "C",
    "title": "Information sur le(s) suivi(s) de la pêcherie",
    "short": "Suivi(s) de la pêcherie",
    "questions": [
      {
        "id": "q011",
        "n": 11,
        "label": "Y a-t-il un ou des suivi(s) des pêcheries dans votre site d'intervention ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q012",
        "n": 12,
        "label": "Qui effectue le suivi de la pêcherie dans votre site d'intervention ?",
        "type": "radio",
        "required": true,
        "options": [
          "Notre organisation même",
          "En collaboration avec d'autres partenaires",
          "Autre organisation (préciser)"
        ],
        "other": true,
        "showIf": {
          "q": "q011",
          "eq": "Oui"
        },
        "help": "Si le suivi est réalisé uniquement par une autre organisation, le questionnaire passera directement à la section « Harmonisation »."
      },
      {
        "id": "q013",
        "n": 13,
        "label": "Quelles sont les ressources halieutiques faisant l'objet d'un suivi par votre organisation ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Poissons commerciaux",
          "Poulpes",
          "Crabes",
          "Crevettes",
          "Langoustes",
          "Autre"
        ],
        "other": true,
        "showIf": {
          "q": "q012",
          "in": [
            "Notre organisation même",
            "En collaboration avec d'autres partenaires"
          ]
        },
        "help": "Plusieurs choix possibles. Les sections suivantes seront répétées pour chaque ressource cochée."
      }
    ]
  },
  {
    "key": "C2",
    "perMethod": true,
    "sections": [
      "C"
    ],
    "title": "Historique et méthode de suivi",
    "short": "Historique et méthode",
    "questions": [
      {
        "id": "q014",
        "n": 14,
        "label": "Depuis quelle année votre organisation fait-elle le suivi de cette ressource ?",
        "type": "year",
        "required": false,
        "section": "C"
      },
      {
        "id": "q015",
        "n": 15,
        "label": "En quelle année le suivi de cette ressource s'est-il terminé ?",
        "type": "radio",
        "required": true,
        "section": "C",
        "options": [
          "Avant 2020",
          "2020",
          "2021",
          "2022",
          "2023",
          "2024",
          "2025",
          "2026",
          "Encore en cours"
        ],
        "help": "Si le suivi s'est terminé avant 2020, les questions détaillées sur cette ressource ne seront pas posées."
      },
      {
        "id": "q016",
        "n": 16,
        "label": "Quel(s) type(s) de suivi utilisez-vous ou avez-vous utilisé(s) pour cette ressource ?",
        "type": "checkbox",
        "required": true,
        "section": "C",
        "showIf": {
          "q": "q015",
          "ne": "Avant 2020"
        },
        "groups": [
          {
            "label": "Auprès des pêcheurs",
            "options": [
              "Suivi des captures auprès des pêcheurs",
              "Suivi de la diversité des captures auprès des pêcheurs",
              "Suivi trajectométrie",
              "Enquête socio-économique auprès des pêcheurs"
            ]
          },
          {
            "label": "Auprès des acheteurs / mareyeurs",
            "options": [
              "Suivi des captures auprès des acheteurs/mareyeurs",
              "Suivi de la diversité des captures auprès des acheteurs/mareyeurs",
              "Enquête socio-économique auprès des acheteurs/mareyeurs"
            ]
          }
        ],
        "options": [
          "Suivi des captures auprès des pêcheurs",
          "Suivi de la diversité des captures auprès des pêcheurs",
          "Suivi trajectométrie",
          "Enquête socio-économique auprès des pêcheurs",
          "Suivi des captures auprès des acheteurs/mareyeurs",
          "Suivi de la diversité des captures auprès des acheteurs/mareyeurs",
          "Enquête socio-économique auprès des acheteurs/mareyeurs"
        ]
      },
      {
        "id": "q017",
        "n": 17,
        "label": "La méthode utilisée est-elle basée sur un protocole standardisé publié ou reconnu ?",
        "type": "radio",
        "required": true,
        "section": "C",
        "showIf": {
          "q": "q015",
          "ne": "Avant 2020"
        },
        "options": [
          "Oui, sans modification",
          "Oui, mais adaptée",
          "Non, protocole interne",
          "Ne sait pas"
        ]
      },
      {
        "id": "q018",
        "n": 18,
        "label": "Si oui, précisez le protocole (nom, référence)",
        "type": "text",
        "required": false,
        "section": "C",
        "showIf": {
          "q": "q017",
          "starts": "Oui"
        }
      },
      {
        "id": "q019",
        "n": 19,
        "label": "Quelles parties du protocole ont été modifiées et pourquoi ?",
        "type": "textarea",
        "required": false,
        "section": "C",
        "showIf": {
          "q": "q017",
          "eq": "Oui, mais adaptée"
        }
      }
    ]
  },
  {
    "key": "DE",
    "perMethod": true,
    "sections": [
      "D",
      "E"
    ],
    "showIf": {
      "q": "q015",
      "ne": "Avant 2020"
    },
    "title": "Objectifs et indicateurs halieutiques",
    "short": "Objectifs et indicateurs",
    "questions": [
      {
        "id": "q020",
        "n": 20,
        "label": "Quels sont les principaux objectifs du suivi réalisé ?",
        "type": "checkbox",
        "required": true,
        "section": "D",
        "options": [
          "Caractérisation de la pêcherie",
          "Évaluation de stock",
          "Caractériser et suivre la diversité des ressources halieutiques exploitées",
          "Étude du circuit de commercialisation",
          "Évaluer la contribution de la pêche aux moyens de subsistance des ménages",
          "Analyser la place des femmes et des hommes dans la filière",
          "Suivre les pratiques de pêche et leur durabilité",
          "Fournir des données pour la gestion et la prise de décision",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q021",
        "n": 21,
        "label": "Quelles variables sont mesurées avec cette méthode ?",
        "type": "checkbox",
        "required": true,
        "section": "E",
        "groups": [
          {
            "label": "Sortie de pêche",
            "options": [
              "Date",
              "Marée",
              "Identifiant du pêcheur",
              "Genre du pêcheur",
              "Heure de départ",
              "Heure d'arrivée",
              "Nombre d'heures par sortie",
              "Nombre de sorties"
            ]
          },
          {
            "label": "Zone et habitat",
            "options": [
              "Nom de la zone de pêche fréquentée",
              "Nom de l'habitat fréquenté"
            ]
          },
          {
            "label": "Embarcation et engins",
            "options": [
              "Moyen d'embarcation",
              "Type d'embarcation",
              "Nombre de pirogues",
              "Nombre de pêcheurs à bord",
              "Engin de pêche utilisé",
              "Nombre d'engins de pêche utilisés",
              "Maillage de l'engin"
            ]
          },
          {
            "label": "Captures",
            "options": [
              "Poids total (kg)",
              "Poids par groupe de taxon (ex. poissons, crevettes, calmars, poulpes…) (kg)",
              "Nombre de spécimens par groupe de taxon"
            ]
          },
          {
            "label": "Identification des spécimens",
            "options": [
              "Identification au niveau de l'espèce",
              "Identification au niveau du genre",
              "Identification au niveau de la famille",
              "Identification au niveau du taxon",
              "Nom vernaculaire malagasy des spécimens"
            ]
          },
          {
            "label": "Biométrie",
            "options": [
              "Longueur totale du spécimen",
              "Longueur à la fourche du spécimen",
              "Longueur standard du spécimen",
              "Longueur du manteau du spécimen",
              "Longueur céphalothoracique du spécimen",
              "Longueur de l'abdomen",
              "Catégorisation par gamme de taille (ex. 5–10 cm, 10–15 cm…)",
              "Sexage"
            ]
          },
          {
            "label": "Commercialisation et revenus",
            "options": [
              "Destination du produit",
              "Prix de vente",
              "Revenu brut",
              "Revenu net"
            ]
          },
          {
            "label": "",
            "options": [
              "Autre"
            ]
          }
        ],
        "help": "Cochez toutes les variables relevées.",
        "options": [
          "Date",
          "Marée",
          "Identifiant du pêcheur",
          "Genre du pêcheur",
          "Heure de départ",
          "Heure d'arrivée",
          "Nombre d'heures par sortie",
          "Nombre de sorties",
          "Nom de la zone de pêche fréquentée",
          "Nom de l'habitat fréquenté",
          "Moyen d'embarcation",
          "Type d'embarcation",
          "Nombre de pirogues",
          "Nombre de pêcheurs à bord",
          "Engin de pêche utilisé",
          "Nombre d'engins de pêche utilisés",
          "Maillage de l'engin",
          "Poids total (kg)",
          "Poids par groupe de taxon (ex. poissons, crevettes, calmars, poulpes…) (kg)",
          "Nombre de spécimens par groupe de taxon",
          "Identification au niveau de l'espèce",
          "Identification au niveau du genre",
          "Identification au niveau de la famille",
          "Identification au niveau du taxon",
          "Nom vernaculaire malagasy des spécimens",
          "Longueur totale du spécimen",
          "Longueur à la fourche du spécimen",
          "Longueur standard du spécimen",
          "Longueur du manteau du spécimen",
          "Longueur céphalothoracique du spécimen",
          "Longueur de l'abdomen",
          "Catégorisation par gamme de taille (ex. 5–10 cm, 10–15 cm…)",
          "Sexage",
          "Destination du produit",
          "Prix de vente",
          "Revenu brut",
          "Revenu net",
          "Autre"
        ]
      },
      {
        "id": "q022",
        "n": 22,
        "label": "Si autre, précisez",
        "type": "text",
        "required": true,
        "section": "E",
        "showIf": {
          "q": "q021",
          "eq": "Autre"
        }
      },
      {
        "id": "q023",
        "n": 23,
        "label": "À partir de ces variables, quels sont les indicateurs calculés ?",
        "type": "checkbox",
        "required": true,
        "section": "E",
        "options": [
          "CPUE",
          "VPUE",
          "Biométrie",
          "Diversité",
          "Productivité",
          "Effort de pêche par sortie",
          "Effort de pêche par pêcheur",
          "Effort de pêche par pirogue",
          "Effort de pêche en heures"
        ]
      },
      {
        "id": "q024",
        "n": 24,
        "label": "Comment les données sont-elles enregistrées sur le terrain ?",
        "type": "checkbox",
        "required": true,
        "section": "E",
        "options": [
          "Fiches papier",
          "Application mobile (ex. KoboCollect, ODK Collect…)",
          "GPS",
          "Appareil photo",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q025",
        "n": 25,
        "label": "Quel est le nombre de villages suivis pour cette ressource ?",
        "type": "number",
        "required": true,
        "section": "E",
        "min": 0
      },
      {
        "id": "q026",
        "n": 26,
        "label": "À quelle fréquence les données sont-elles collectées ?",
        "type": "radio",
        "required": true,
        "section": "E",
        "options": [
          "Journalière",
          "Hebdomadaire",
          "Mensuelle",
          "Trimestrielle",
          "Semestrielle",
          "Annuelle"
        ]
      },
      {
        "id": "q027",
        "n": 27,
        "label": "Quels sont les matériels utilisés pour le suivi ?",
        "type": "checkbox",
        "required": true,
        "section": "E",
        "options": [
          "Balance",
          "Ichtyomètre",
          "Appareil photo",
          "GPS",
          "Autre"
        ],
        "other": true
      }
    ]
  },
  {
    "key": "G1",
    "perMethod": true,
    "sections": [
      "G"
    ],
    "showIf": {
      "q": "q015",
      "ne": "Avant 2020"
    },
    "title": "Mise en œuvre du suivi — logistique et collecteurs",
    "short": "Logistique et collecteurs",
    "questions": [
      {
        "id": "q028",
        "n": 28,
        "label": "Quels sont les moyens de déplacement nécessaires pour couvrir l'ensemble des villages suivis ?",
        "type": "checkbox",
        "required": true,
        "section": "G",
        "options": [
          "À pied",
          "Pirogue",
          "Moto",
          "Taxi-brousse",
          "4×4",
          "Vedette"
        ]
      },
      {
        "id": "q029",
        "n": 29,
        "label": "Qui est en charge de la collecte des données sur le terrain ?",
        "type": "checkbox",
        "required": true,
        "section": "G",
        "options": [
          "Agents communautaires",
          "Techniciens",
          "Chercheurs",
          "Socio-organisateurs",
          "Associations"
        ]
      },
      {
        "id": "q030",
        "n": 30,
        "label": "Combien de collecteurs au total pour le suivi de cette ressource ?",
        "type": "number",
        "required": true,
        "section": "G",
        "min": 0
      },
      {
        "id": "q031",
        "n": 31,
        "label": "Les collecteurs de données ont-ils bénéficié d'une formation à la collecte de données ?",
        "type": "radio",
        "required": true,
        "section": "G",
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q032",
        "n": 32,
        "label": "Les collecteurs de données sont-ils rémunérés ?",
        "type": "radio",
        "required": true,
        "section": "G",
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q033",
        "n": 33,
        "label": "Si oui, donnez une fourchette de salaire",
        "type": "radio",
        "required": true,
        "section": "G",
        "showIf": {
          "q": "q032",
          "eq": "Oui"
        },
        "options": [
          "20 000 à 49 000 MGA",
          "50 000 à 99 000 MGA",
          "100 000 à 150 000 MGA",
          "Plus de 150 000 MGA"
        ]
      }
    ]
  },
  {
    "key": "G2",
    "perMethod": true,
    "sections": [
      "G"
    ],
    "showIf": {
      "q": "q015",
      "ne": "Avant 2020"
    },
    "title": "Mise en œuvre du suivi — coûts et partenaires",
    "short": "Coûts et partenaires",
    "questions": [
      {
        "id": "q034",
        "n": 34,
        "label": "Quel type de compensation ou d'incitation reçoivent les pêcheurs / acheteurs participant au suivi ?",
        "type": "checkbox",
        "required": true,
        "section": "G",
        "options": [
          "Volontariat",
          "PPN (produits de première nécessité)",
          "Financière",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q035",
        "n": 35,
        "label": "Si financière, combien reçoivent-ils par pêcheur / acheteur ?",
        "type": "number",
        "required": true,
        "section": "G",
        "min": 0,
        "unit": "MGA",
        "showIf": {
          "q": "q034",
          "eq": "Financière"
        }
      },
      {
        "id": "q036",
        "n": 36,
        "label": "À combien estimez-vous le coût de mise en œuvre (mensuel ou total) de ce suivi ?",
        "type": "radio",
        "required": true,
        "section": "G",
        "options": [
          "2 000 000 à 5 000 000 MGA",
          "5 000 000 à 8 000 000 MGA",
          "8 000 000 à 10 000 000 MGA",
          "10 000 000 à 15 000 000 MGA",
          "Plus de 15 000 000 MGA"
        ]
      },
      {
        "id": "q037",
        "n": 37,
        "label": "Y a-t-il des partenaires ou bailleurs qui contribuent au financement de ce suivi ?",
        "type": "radio",
        "required": true,
        "section": "G",
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q038",
        "n": 38,
        "label": "Si oui, lesquels ?",
        "type": "text",
        "required": true,
        "section": "G",
        "showIf": {
          "q": "q037",
          "eq": "Oui"
        }
      },
      {
        "id": "q039",
        "n": 39,
        "label": "Cette méthode / ce protocole de suivi est-il utilisé par d'autres partenaires ?",
        "type": "radio",
        "required": true,
        "section": "G",
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q040",
        "n": 40,
        "label": "Si oui, lesquels ?",
        "type": "text",
        "required": true,
        "section": "G",
        "showIf": {
          "q": "q039",
          "eq": "Oui"
        }
      }
    ]
  },
  {
    "key": "G",
    "showIf": {
      "all": [
        {
          "q": "q011",
          "eq": "Oui"
        },
        {
          "q": "q012",
          "in": [
            "Notre organisation même",
            "En collaboration avec d'autres partenaires"
          ]
        }
      ]
    },
    "title": "Contraintes de mise en œuvre",
    "short": "Contraintes",
    "questions": [
      {
        "id": "q041",
        "n": 41,
        "label": "Quelles sont les principales contraintes rencontrées lors de la mise en œuvre du / des suivis décrits ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Accessibilité du site",
          "Réticence des pêcheurs / acheteurs suivis",
          "Collaboration avec d'autres partenaires",
          "Coût élevé du matériel",
          "Fiabilité des collecteurs de données",
          "Formation des collecteurs de données",
          "Complexité du dispositif de suivi",
          "Complexité de la fiche de suivi",
          "Autre"
        ]
      },
      {
        "id": "q042",
        "n": 42,
        "label": "Si autre, précisez",
        "type": "text",
        "required": true,
        "showIf": {
          "q": "q041",
          "eq": "Autre"
        }
      }
    ]
  },
  {
    "key": "H",
    "showIf": {
      "all": [
        {
          "q": "q011",
          "eq": "Oui"
        },
        {
          "q": "q012",
          "in": [
            "Notre organisation même",
            "En collaboration avec d'autres partenaires"
          ]
        }
      ]
    },
    "title": "Gestion et stockage des données",
    "short": "Gestion des données",
    "questions": [
      {
        "id": "q043",
        "n": 43,
        "label": "Où les données sont-elles stockées après la collecte ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Excel",
          "Drive",
          "KoboToolbox",
          "Base de données",
          "Serveur institutionnel",
          "Plateforme en ligne",
          "Documents papier",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q044",
        "n": 44,
        "label": "Les données sont-elles partagées avec d’autres institutions / partenaires ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Partiellement",
          "Non"
        ]
      },
      {
        "id": "q045",
        "n": 45,
        "label": "Si oui, avec lesquels ?",
        "type": "textarea",
        "required": true,
        "showIf": {
          "q": "q044",
          "in": [
            "Oui",
            "Partiellement"
          ]
        }
      }
    ]
  },
  {
    "key": "I",
    "title": "Harmonisation et recommandations",
    "short": "Harmonisation",
    "questions": [
      {
        "id": "q046",
        "n": 46,
        "label": "Selon vous, est-il nécessaire d'harmoniser les protocoles de suivi des pêcheries à l'échelle nationale ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non"
        ]
      },
      {
        "id": "q047",
        "n": 47,
        "label": "Justifiez votre réponse",
        "type": "textarea",
        "required": true
      },
      {
        "id": "q048",
        "n": 48,
        "label": "Selon vous, quels critères sont importants pour un protocole national ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Simplicité",
          "Coût abordable",
          "Reproductibilité",
          "Adaptabilité locale",
          "Compatibilité internationale",
          "Autre"
        ],
        "other": true
      },
      {
        "id": "q049",
        "n": 49,
        "label": "Selon vous, quelles sont les étapes à entreprendre pour arriver à une harmonisation des protocoles de suivi des pêcheries à l'échelle nationale ?",
        "type": "checkbox",
        "required": true,
        "options": [
          "Réunions de concertation et de validation",
          "Convention de partage de données",
          "Accord de partenariat",
          "Base de données commune",
          "Uniformisation du protocole de collecte de données",
          "Formation et appui technique de la part des partenaires",
          "Autre"
        ]
      },
      {
        "id": "q050",
        "n": 50,
        "label": "Si autre, précisez",
        "type": "text",
        "required": true,
        "showIf": {
          "q": "q049",
          "eq": "Autre"
        }
      },
      {
        "id": "q051",
        "n": 51,
        "label": "Parmi les variables que vous collectez, lesquelles suggérez-vous de garder pour une harmonisation ?",
        "type": "checkbox",
        "required": true,
        "groups": [
          {
            "label": "Sortie de pêche",
            "options": [
              "Date",
              "Marée",
              "Heure de départ",
              "Heure d'arrivée",
              "Nombre d'heures par sortie",
              "Nombre de sorties"
            ]
          },
          {
            "label": "Zone et habitat",
            "options": [
              "Nom de la zone de pêche fréquentée",
              "Nom de l'habitat fréquenté"
            ]
          },
          {
            "label": "Embarcation et engins",
            "options": [
              "Moyen d'embarcation",
              "Type d'embarcation",
              "Nombre de pirogues",
              "Longueur de la pirogue",
              "Nombre de pêcheurs à bord",
              "Engin de pêche utilisé",
              "Nombre d'engins de pêche utilisés",
              "Maillage de l'engin"
            ]
          },
          {
            "label": "Captures",
            "options": [
              "Poids total (kg)",
              "Poids par groupe de taxon (ex. poissons, crevettes, calmars, poulpes…) (kg)",
              "Nombre de spécimens par groupe de taxon"
            ]
          },
          {
            "label": "Identification des spécimens",
            "options": [
              "Identification au niveau de l'espèce",
              "Identification au niveau du genre",
              "Identification au niveau de la famille",
              "Identification au niveau du taxon",
              "Nom vernaculaire malagasy des spécimens"
            ]
          },
          {
            "label": "Biométrie",
            "options": [
              "Longueur totale du spécimen",
              "Longueur à la fourche du spécimen",
              "Longueur standard du spécimen",
              "Longueur du manteau du spécimen",
              "Longueur céphalothoracique du spécimen",
              "Longueur de l'abdomen",
              "Catégorisation par gamme de taille (ex. 5–10 cm, 10–15 cm…)",
              "Sexage"
            ]
          },
          {
            "label": "Commercialisation et revenus",
            "options": [
              "Destination du produit",
              "Prix de vente",
              "Revenu brut",
              "Revenu net"
            ]
          },
          {
            "label": "",
            "options": [
              "Autre"
            ]
          }
        ],
        "other": true,
        "showIf": {
          "all": [
            {
              "q": "q011",
              "eq": "Oui"
            },
            {
              "q": "q012",
              "in": [
                "Notre organisation même",
                "En collaboration avec d'autres partenaires"
              ]
            }
          ]
        },
        "options": [
          "Date",
          "Marée",
          "Heure de départ",
          "Heure d'arrivée",
          "Nombre d'heures par sortie",
          "Nombre de sorties",
          "Nom de la zone de pêche fréquentée",
          "Nom de l'habitat fréquenté",
          "Moyen d'embarcation",
          "Type d'embarcation",
          "Nombre de pirogues",
          "Longueur de la pirogue",
          "Nombre de pêcheurs à bord",
          "Engin de pêche utilisé",
          "Nombre d'engins de pêche utilisés",
          "Maillage de l'engin",
          "Poids total (kg)",
          "Poids par groupe de taxon (ex. poissons, crevettes, calmars, poulpes…) (kg)",
          "Nombre de spécimens par groupe de taxon",
          "Identification au niveau de l'espèce",
          "Identification au niveau du genre",
          "Identification au niveau de la famille",
          "Identification au niveau du taxon",
          "Nom vernaculaire malagasy des spécimens",
          "Longueur totale du spécimen",
          "Longueur à la fourche du spécimen",
          "Longueur standard du spécimen",
          "Longueur du manteau du spécimen",
          "Longueur céphalothoracique du spécimen",
          "Longueur de l'abdomen",
          "Catégorisation par gamme de taille (ex. 5–10 cm, 10–15 cm…)",
          "Sexage",
          "Destination du produit",
          "Prix de vente",
          "Revenu brut",
          "Revenu net",
          "Autre"
        ]
      },
      {
        "id": "q052",
        "n": 52,
        "label": "Quelles sont vos attentes vis-à-vis d'une éventuelle harmonisation du suivi des pêcheries ?",
        "type": "textarea",
        "required": true
      },
      {
        "id": "q053",
        "n": 53,
        "label": "Souhaitez-vous participer à l'élaboration du protocole national ?",
        "type": "radio",
        "required": true,
        "options": [
          "Oui",
          "Non",
          "Peut-être"
        ]
      },
      {
        "id": "q054",
        "n": 54,
        "label": "Avez-vous d’autres recommandations concernant la mise en place d’un système national harmonisé de suivi des pêcheries ?",
        "type": "textarea",
        "required": true
      }
    ]
  },
  {
    "key": "J",
    "title": "Pièces jointes",
    "short": "Pièces jointes",
    "questions": [
      {
        "id": "q055",
        "n": 55,
        "label": "Si disponible, veuillez joindre un document de projet (protocole, rapport, fiche de suivi, autre document) se rapportant aux suivis mentionnés.",
        "type": "file",
        "required": false,
        "maxFiles": 5,
        "maxMB": 10,
        "help": "Formats acceptés : PDF, Word, Excel, JPG, PNG. 5 fichiers et 10 Mo au total maximum. Les photos sont compressées automatiquement."
      }
    ]
  }
]
};

if (typeof module !== "undefined") module.exports = SURVEY;
