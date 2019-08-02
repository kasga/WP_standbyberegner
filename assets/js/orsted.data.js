(function($){
    "use strict";

    window.z_DATA = [
      {
          title : "Lyd og billede",
          sub_header : "Mange hjem har både fladskærme, DVD-afspillere og DAB-radioer, og meget af udstyret står på standby alle døgnets timer.",
          acc_title : "Hvordan kan du se, om noget står på standby?",
          acc_body : "Du kan kende dine standby-apparater på, at de har et display eller en rød/grøn diode, der lyser konstant. Det betyder, at de altid er klar til brug. Transformere og opladere bruger også strøm, når de er tilsluttet en tændt stikkontakt.",
          question : "Hvor mange af disse maskiner og apparater står på standby i dit hjem?",
          options : [
              {
                  title : "Tv under 5 år (vælg antal)",
                  value : 16
              },
              {
                  title : "Tv over 5 år (vælg antal)",
                  value : 172
              },
              {
                  title : "Tv-boks (vælg antal)",
                  value : 231
              },
              {
                  title : "DVD (vælg antal)",
                  value : 13
              },
              {
                  title : "Musikanlæg med bluetooth eller trådløs streaming for eksempel SONOS (hver højtaler/bridge tæller som 1) (vælg antal)",
                  value : 88
              },
              {
                  title : "Docking station til musikafspilning (vælg antal)",
                  value : 17,
                  modalTitle: 'Hvad er en docking station?',
                  modalDescription: 'En docking station er en musikafspiller, hvor du kan tilslutte din telefon og lade den op samtidig med, at du afspiller musik.',
                  modalImg: 'assets/img/dock.png'
              },
              {
                  title : "Musikanlæg under 5 år (vælg antal)",
                  value : 29
              },
              {
                  title : "Musikanlæg over 5 år (vælg antal) ",
                  value : 90
              },
              {
                  title : "DAB-radio (vælg antal)",
                  value : 3
              },
              {
                  title : "Clockradio (vælg antal) ",
                  value : 41
              },
              {
                  title : "Spillekonsol PS4 (vælg antal)",
                  value : 130
              },
              {
                  title : "Spillekonsol Wii U (vælg antal)",
                  value : 7
              },
              {
                  title : "Spillekonsol X-box One (vælg antal)",
                  value : 290
              }
          ]
      },
      {
          title : "It og tilbehør",
          sub_header : "I de fleste hjem er der en eller flere computere og ofte også en masse tilbehør. Hvis det hele altid står på standby, kan det blive en stor post på elregningen.",
          acc_title : "",
          acc_body : "",
          question : "Hvor mange af disse maskiner og apparater står på standby i dit hjem?",
          options : [
              {
                  title : "Bærbar computer (vælg antal)",
                  value : 7
              },
              {
                  title : "Stationær computer (vælg antal)",
                  value : 148
              },
              {
                  title : "Oplader til mobil og tablet (vælg antal)",
                  value : 10
              },
              {
                  title : "Printer, scanner (vælg antal)",
                  value : 12
              },
              {
                  title : "Router, modem, ADSL (vælg antal)",
                  value : 140
              }
          ]
      },
      {
          title : "Madlavning",
          sub_header : "De fleste køkkener er i dag fyldt med små og store hjælpere, der trækker strøm – også når de ikke er i brug.",
          acc_title : "",
          acc_body : "",
          question : "Hvor mange af disse maskiner og apparater står på standby i dit hjem?",
          options : [
              {
                  title : "Mikrobølge- og miniovn med display (vælg antal)",
                  value : 34
              },
              {
                  title : "Espresso- og kaffemaskine med display (vælg antal)",
                  value : 2
              },
              {
                  title : "Opvaskemaskine med display (vælg antal)",
                  value : 27
              }
          ]
      },
      {
          title : "Belysning",
          sub_header : "Hvis dit udstyr til belysning bruger 12 volts pærer, så bruger det en transformer. En transformer bruger strøm, selvom lyset ikke er tændt.",
          acc_title : "",
          acc_body : "",
          question : "Har du nogle transformere, der altid sidder i et tændt stik?",
          options : [
              {
                  title : "Halogen bord- eller standerlampe med transformer (vælg antal)",
                  value : 9
              },
          ]
      },
      {
          title : "Vask",
          sub_header : "Hvis din vaskemaskine, tørretumbler eller opvaskemaskine er mere end et par år gammel og har display, bruger den sandsynligvis strøm på at vise, at den er klar til brug.",
          acc_title : "",
          acc_body : "",
          question : "Hvor mange af disse maskiner og apparater står på standby i dit hjem?",
          options : [
              {
                  title : "Vaskemaskine med display (vælg antal)",
                  value : 19
              },
              {
                  title : "Tørretumbler med display (vælg antal)",
                  value : 19
              },
              {
                  title : "Kombineret vaskemaskine/tørretumbler med display (vælg antal)",
                  value : 18
              }
          ]
      },
      {
          title : "Småapparater",
          sub_header : "Der findes en del mindre apparater, som det er rart at have fuldt opladet og klar til brug – altid. Men det koster at have dem siddende i opladeren døgnet rundt.",
          acc_title : "",
          acc_body : "",
          question : "Hvor mange af disse maskiner og apparater er mere eller mindre konstant i oplader i dit hjem?",
          options : [
              {
                  title : "Barbermaskine (vælg antal)",
                  value : 29
              },
              {
                  title : "Elektrisk tandbørste (vælg antal)",
                  value : 12
              },
              {
                  title : "Hårtrimmer (vælg antal)",
                  value : 6
              },
              {
                  title : "Ministøvsuger, håndstøvsuger (vælg antal)",
                  value : 63
              },
              {
                  title : "Robotstøvsuger (vælg antal)",
                  value : 59
              },
              {
                  title : "Elevationsseng (pr. motorenhed) (vælg antal)",
                  value : 73
              },
              {
                  title : "Elværktøj med oplader (for eksempel boremaskine, hækkeklipper) (vælg antal)",
                  value : 39
              }
          ]
      },
  ];

})(jQuery);
