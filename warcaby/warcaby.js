class warcaby extends Phaser.Scene {
  constructor() {
    super({ key: "warcaby" });
  }

  init(data) {
    this.cameras.main.setBackgroundColor("#0fffff");
  }

  preload() {
    this.load.image("background", "./assets/background.png");
  }

  create(data) {
    scene = this;
    this.background = this.add.sprite(0, 0, "background");
    this.background = this.add.sprite(0, 0, "background");
    let { width, height } = this.sys.game.canvas;
    this.background.x = width / 2;
    this.background.y = height / 2;
    const scaleX = width / this.background.width;
    const scaleY = height / this.background.height;
    this.background.setScale(scaleX, scaleY);

    // Tworzenie koła
    var colors = [kolory.white, kolory.black];

    offsetX = (this.sys.game.config.width - 8 * tileSize) / 2;
    offsetY = (this.sys.game.config.height - 8 * tileSize) / 2;

    // zmienna do funkcji usun obiekty, chyba lepiej to przesunąć poza funkcję create ale na tą chwilę zostaje

    for (var row = 0; row < 8; row++) {
      for (var col = 0; col < 8; col++) {
        var colorIndex = (row + col) % 2;
        var color = colors[colorIndex];

        var graphics = this.add.graphics({
          x: col * tileSize + offsetX,
          y: row * tileSize + offsetY,
        });

        graphics.fillStyle(color, 1);
        graphics.fillRect(0, 0, tileSize, tileSize);
      }
    }

    /////////////////////////////////////////////////////////////////////////////
    ///////////////////////////player/////////////////////////////////////////////

    withPlayerText = this.add.text(
      1020,
      this.sys.game.config.height - 84 - 22,
      "gracz: " + wybor_gracza,
      {
        fontFamily: "Arial",
        fontSize: "60px", // Zmiana rozmiaru czcionki na "84px"
        color: "#ffffff",
      }
    );

    // Start timera
    this.time.addEvent({
      delay: 1000, // Opóźnienie w milisekundach (1000ms = 1s)
      callback: function () {
        if (czy_czas_stop === false) {
          updateTime();
        }
      }, //funkcja timera wywoływana co czas powyżej
      callbackScope: this,
      loop: true, // Zapętlenie zdarzenia
    });
    //////////////////////////////////////////////////////////////////////////

    var button = this.add
      .text(1100, 50, "Usun wszystko", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
      })
      .setBackgroundColor("#000000")
      .setPadding(10)
      .setInteractive(); // Ustawienie przycisku jako interaktywnego

    // Obsługa kliknięcia przycisku
    button.on("pointerdown", function () {
      usunWszystkieObiekty();
      usunObiektZTabeli(ramka_moves);
      usunObiektZTabeli(obiektyNaPlanszy_ramki);
      blokada_po_jednym_kliku = 0;
      odblokuj_NE_2skok = 1;
      odblokuj_NW_2skok = 1;
      odblokuj_SE_2skok = 1;
      odblokuj_SW_2skok = 1;

      // Tutaj możesz umieścić kod reakcji na kliknięcie przycisku
    });

    var button = this.add
      .text(1100, 100, "nowa gra", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
      })
      .setBackgroundColor("#000000")
      .setPadding(10)
      .setInteractive(); // Ustawienie przycisku jako interaktywnego

    // Obsługa kliknięcia przycisku
    button.on("pointerdown", function () {
      // Od_nowa();
      jeszcze_raz();

      // Tutaj możesz umieścić kod reakcji na kliknięcie przycisku
    });

    var button = this.add
      .text(1100, 150, "pokaz bicie", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
      })
      .setBackgroundColor("#000000")
      .setPadding(10)
      .setInteractive(); // Ustawienie przycisku jako interaktywnego

    // Obsługa kliknięcia przycisku
    button.on("pointerdown", function () {
      // show_posible_moves_kierunek_wolny(memo[0], memo[1], wybor_gracza);

      sprawdzaj_dla_kazdego(wybor_gracza);
      rysuj_pionki_do_wybrania();
    });

    var button = this.add
      .text(1100, 200, "zmiana gracza", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
      })
      .setBackgroundColor("#000000")
      .setPadding(10)
      .setInteractive(); // Ustawienie przycisku jako interaktywnego

    // Obsługa kliknięcia przycisku
    button.on("pointerdown", function () {
      blokada_po_jednym_kliku = 0;
      odblokuj_NE_2skok = 1;
      odblokuj_NW_2skok = 1;
      odblokuj_SE_2skok = 1;
      odblokuj_SW_2skok = 1;
      zmiana_gracza();

      // Tutaj możesz umieścić kod reakcji na kliknięcie przycisku
    });

    var button = this.add
      .text(1100, 250, "kto wygral", {
        fontFamily: "Arial",
        fontSize: 24,
        color: "#ffffff",
      })
      .setBackgroundColor("#000000")
      .setPadding(10)
      .setInteractive(); // Ustawienie przycisku jako interaktywnego

    // Obsługa kliknięcia przycisku
    button.on("pointerdown", function () {
      sprawdz_czy_jest_w_tabeli(1);
      sprawdz_czy_jest_w_tabeli(2);

      // Tutaj możesz umieścić kod reakcji na kliknięcie przycisku
    });

    ////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////klikanie na kazdy(rysowanie)/////////////////////////

    var circle = [];
    var graphics = [];
    var bet = 0;
    var niebieskie = [];

    for (var a = 0; a < 8 * 8; a++) {
      // Używamy arrow function, aby zachować kontekst this
      ((a) => {
        var col = a % 8;
        var row = Math.floor(a / 8);

        if ((row + col) % 2 !== 0) {
          circle[a] = new Phaser.Geom.Circle(
            col * 80 + offsetX + tileSize / 2,
            row * 80 + offsetY + tileSize / 2,
            30
          );

          niebieskie.push([row, col]);

          graphics[a] = this.add.graphics(); // Tutaj this odnosi się do oczekiwanego obiektu sceny
          graphics[a].fillStyle(kolory.black, 1); //kolorowanie jest na czarno nie wiem czy tu nie powinny być zamiast kółek prostokąty
          graphics[a].fillCircleShape(circle[a]);
          graphics[a].setInteractive(circle[a], Phaser.Geom.Circle.Contains);

          // Obsługa zdarzenia kliknięcia na obiekcie graficznym (Click tu jest)
          ////////////////////////////////////////////////////////////////////////
          //////////////OBSŁUGA KLIKÓW////////////////////////////////////////////
          ////////////////////////////////////////////////////////////////////////
          graphics[a].on("pointerdown", () => {
            if (czy_blokowac_pola_wyb === 0) {
              //TEN WARÓNEK NIE POZWALA KLIKNĄĆ ZANIM ANIMACJA SIĘ NIE WYKONA
              if (board[row][col] === wybor_gracza || board[row][col] === 0) {
                if (blokada_po_jednym_kliku === 0) {
                  //TEN WARÓNEK (DO CELOWO BĘDZIE OGRANICZAŁ ZMIANĘ PIONKA GDY BĘDZIE MUSIAŁ ZBIĆ KOLEJNY ELEMENT)
                  if (
                    jest_bicie === 1 &&
                    board_pionki_zbijaki[row][col] === 1
                  ) {
                    rysowanie_w_odpowiednim_punkcie_prostoka(scene, row, col);
                    na_Click(row, col);
                  }
                  if (jest_bicie === 1 && board[row][col] === 0) {
                    rysowanie_w_odpowiednim_punkcie_prostoka(scene, row, col);
                    na_Click(row, col);
                  }
                  if (jest_bicie === 0) {
                    rysowanie_w_odpowiednim_punkcie_prostoka(scene, row, col);
                    na_Click(row, col);
                  }
                } else {
                  if (board_move_posibility[row][col] === 1) {
                    rysowanie_w_odpowiednim_punkcie_prostoka(scene, row, col);

                    na_Click(row, col);
                    // blokada_po_jednym_kliku = 0;
                  }
                }
              }
            }
          });
        }
      })(a); // Przekazujemy a do arrow function
    }
  }

  ////////////końcowka create

  update(time, delta) {
    // updateTime();
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////ZMIENNE(glob)///////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

export default warcaby;

var scene;

var tileSize = 80;

var offsetX;
var offsetY;

let obiektyNaPlanszy_ramki = [];
let obiektyNaPlanszy = [];

let timerText;
let timeElapsed = 15;
let czyja_kolej = true;

var kolory = {
  red: 0xff0000,
  green: 0x00ff00,
  blue: 0x0000ff,
  black: 0x000000,
  white: 0xffffff,
  purple: 0xff99ff,
};
var memo = [];

var kolorPionka01 = kolory.red;
var kolorPionka02 = kolory.blue;

var board_new = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [2, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var board_czy_damka_new = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var board = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];

var board_czy_damka = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var board_move_posibility = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var board_pionki_zbijaki = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var board_pionki_posible_moves = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];

var ramka_moves = [];

var functionsToCall = [];

let mem_move_czy_damka = 0;
let mem_board_new_move = 0;

let czy_blokowac_pola_wyb = 0;
let blokada_po_jednym_kliku = 0;

let wybor_gracza = 0;
let zmiana_now = false;
let czas_kolejki = 15;
let czy_czas_stop = true;

let odblokuj_NW_2skok = 1;
let odblokuj_NE_2skok = 1;
let odblokuj_SW_2skok = 1;
let odblokuj_SE_2skok = 1;

let ma_jeden_ruch = 0;
let ile_skokow = 0;

let withPlayerText;

let jest_bicie = 0;

let wielkosc_ekranu = 720;

////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////Funkcje(glob)//////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function check_czy_damka(wiersz, kolumna) {
  if (board_czy_damka[wiersz][kolumna] === 0) {
    return true;
  } else {
    return false;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function show_posible_moves_nowy(wiersz, kolumna) {
  let tab1 = [];
  let tab2 = [];
  let indexXtab1 = 0;
  let indexXtab2 = 0;
  let indexPoczWierszTab1 = 0;
  let indexPoczKolumnaTab1 = 0;

  let indexPoczWierszTab2 = 0;
  let indexPoczKolumnaTab2 = 0;

  let nrwTab1 = 0;
  let nrwTab2 = 0;

  let b = kolumna;

  let ilosc_kafli_lg = 0;
  let ilosc_kafli_ld = 0;

  let ile_iteracji = 0;
  if (wiersz + kolumna <= 7) {
    ilosc_kafli_lg = wiersz + kolumna + 1;
  } else {
    ilosc_kafli_lg = 7 - (wiersz + kolumna - 7) + 1;
  }

  if (wiersz - kolumna > 0) {
    ilosc_kafli_ld = 8 - (wiersz - kolumna);
  } else {
    ilosc_kafli_ld = 8 - (kolumna - wiersz);
  }
  let pomocnicza01 = ilosc_kafli_lg - 1;
  let pomocnicza02 = 0;
  let pomocnicza03 = 0;

  if (wiersz + kolumna > 7) {
    pomocnicza02 = wiersz + kolumna - 7;
    pomocnicza01 = 7;
    pomocnicza03 = 8 - ilosc_kafli_lg;
  }
  ile_iteracji = 0;

  indexPoczWierszTab1 = pomocnicza01;
  indexPoczKolumnaTab1 = pomocnicza02;

  for (let a = pomocnicza01; a >= pomocnicza03; a--) {
    if (a != wiersz) {
      tab1.push(board[a][pomocnicza02]);
    } else {
      tab1.push("X");
      indexXtab1 = ile_iteracji;
      nrwTab1 = ile_iteracji;
    }
    pomocnicza02++;
    ile_iteracji++;
  }

  let pom_01 = 0;
  let pom_02 = 0;
  pom_01 = wiersz - kolumna; //pierwsza w dół prawo (do połowy)
  if (pom_01 < 0) {
    indexPoczWierszTab2 = 0;
    indexPoczKolumnaTab2 = kolumna - wiersz;
  } else {
    indexPoczWierszTab2 = pom_01;
    indexPoczKolumnaTab2 = pom_02;
  }

  ile_iteracji = 0;
  if (wiersz - kolumna >= 0) {
    pom_01 = wiersz - kolumna;
    for (let a = pom_01; a < pom_01 + ilosc_kafli_ld; a++) {
      if (a != wiersz) {
        tab2.push(board[a][pom_02]);
      } else {
        tab2.push("X");
        indexXtab2 = ile_iteracji;
        nrwTab2 = ile_iteracji;
      }
      ile_iteracji++;

      pom_02++;
    }
  } else {
    pom_02 = kolumna - wiersz;
    for (let b = 0; b < ilosc_kafli_ld; b++) {
      if (b != wiersz) {
        tab2.push(board[b][pom_02]);
      } else {
        tab2.push("X");
        indexXtab2 = ile_iteracji;
        nrwTab2 = ile_iteracji;
      }
      ile_iteracji++;

      pom_02++;
    }
  }

  /////////////////////////kierunki cztery badanie pol//////////////////////////////////
  let przypadki = [];

  let tablNW = [];
  let tablNE = [];

  let tablNW_posibility_move = [];
  let tablNE_posibility_move = [];

  let tablSW = [];
  let tablSE = [];

  let tablSW_posibility_move = [];
  let tablSE_posibility_move = [];

  if (nrwTab2 > 0) {
    for (let a = nrwTab2 - 1; a >= 0; a--) {
      tablNW.push(tab2[a]);
    }
    for (let a = nrwTab2 + 1; a < tab2.length; a++) {
      tablSE.push(tab2[a]);
    }
  } else {
    for (let a = nrwTab2 + 1; a < tab2.length; a++) {
      tablSE.push(tab2[a]);
    }
  }

  if (nrwTab1 > 0) {
    for (let a = nrwTab1 - 1; a >= 0; a--) {
      tablSW.push(tab1[a]);
    }
    for (let a = nrwTab1 + 1; a < tab1.length; a++) {
      tablNE.push(tab1[a]);
    }
  } else {
    for (let a = nrwTab1 + 1; a < tab1.length; a++) {
      tablNE.push(tab1[a]);
    }
  }

  ///////////pionek///////////////

  zmienWartosciNaJednaLiczbe(board_move_posibility, 0);

  let gracz_nr = board[wiersz][kolumna];

  if (board_czy_damka[wiersz][kolumna] === 1) {
    tablNE_posibility_move = performOperationsOnArray_damka(tablNE, gracz_nr);
    tablNW_posibility_move = performOperationsOnArray_damka(tablNW, gracz_nr);
    tablSE_posibility_move = performOperationsOnArray_damka(tablSE, gracz_nr);
    tablSW_posibility_move = performOperationsOnArray_damka(tablSW, gracz_nr);

    if (ma_jeden_ruch === 0) {
      tablNE_posibility_move = poprawka_do_drugiego_bicia_damki(
        performOperationsOnArray_damka(tablNE, gracz_nr)
      );
      tablNW_posibility_move = poprawka_do_drugiego_bicia_damki(
        performOperationsOnArray_damka(tablNW, gracz_nr)
      );
      tablSE_posibility_move = poprawka_do_drugiego_bicia_damki(
        performOperationsOnArray_damka(tablSE, gracz_nr)
      );
      tablSW_posibility_move = poprawka_do_drugiego_bicia_damki(
        performOperationsOnArray_damka(tablSW, gracz_nr)
      );
    }
  } else {
    if (gracz_nr === 1) {
      tablNE_posibility_move = performOperationsOnArray_pionek(
        tablNE,
        gracz_nr,
        0
      );
      tablNW_posibility_move = performOperationsOnArray_pionek(
        tablNW,
        gracz_nr,
        0
      );
      tablSE_posibility_move = performOperationsOnArray_pionek(
        tablSE,
        gracz_nr,
        1
      );
      tablSW_posibility_move = performOperationsOnArray_pionek(
        tablSW,
        gracz_nr,
        1
      );
    }
    if (gracz_nr === 2) {
      tablNE_posibility_move = performOperationsOnArray_pionek(
        tablNE,
        gracz_nr,
        1
      );
      tablNW_posibility_move = performOperationsOnArray_pionek(
        tablNW,
        gracz_nr,
        1
      );
      tablSE_posibility_move = performOperationsOnArray_pionek(
        tablSE,
        gracz_nr,
        0
      );
      tablSW_posibility_move = performOperationsOnArray_pionek(
        tablSW,
        gracz_nr,
        0
      );
    }
  }
  if (odblokuj_NE_2skok === 1) {
    zmiana_w_tablicy_posible_moves(
      wiersz,
      0,
      kolumna,
      1,
      tablNE_posibility_move
    );
  }
  if (odblokuj_NW_2skok === 1) {
    zmiana_w_tablicy_posible_moves(
      wiersz,
      0,
      kolumna,
      0,
      tablNW_posibility_move
    );
  }
  if (odblokuj_SE_2skok === 1) {
    zmiana_w_tablicy_posible_moves(
      wiersz,
      1,
      kolumna,
      1,
      tablSE_posibility_move
    );
  }
  if (odblokuj_SW_2skok === 1) {
    zmiana_w_tablicy_posible_moves(
      wiersz,
      1,
      kolumna,
      0,
      tablSW_posibility_move
    );
  }

  rysuj_posible_moves();
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////
function zeruj_do_pierwszego() {
  if (
    odblokuj_NE_2skok === 0 &&
    odblokuj_NW_2skok === 0 &&
    odblokuj_SE_2skok === 0 &&
    odblokuj_SW_2skok === 0
  ) {
    odblokuj_NE_2skok = 1;
    odblokuj_NW_2skok = 1;
    odblokuj_SE_2skok = 1;
    odblokuj_SW_2skok = 1;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function zmienWartosciNaJednaLiczbe(tablica, wartosc) {
  tablica.forEach((row) => {
    row.forEach((element, index) => {
      row[index] = wartosc;
    });
  });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function na_tablice_1(wiersz, kolumna) {
  var a = Math.floor(kolumna / 2) + wiersz * 4;
  return a;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////po punkcie z tablicy zwraca index tablicy//////////////////////////////////

function na_tablice_2(tablica) {
  var a = Math.floor(tablica[1] / 2) + tablica[0] * 4;
  return a;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////// po numerze indexu zwraca pozycje///////////////////////////////

function na_tablice_1_to_2(nr) {
  var przes = Math.floor(nr / 4) % 2;
  var col = (nr % 4) * 2 + 1 - przes;
  var row = Math.floor(nr / 4);

  return [row, col];
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////
wybor_gracza = 1;
function updateTime() {
  if (wybor_gracza === 0) {
    return;
  } else {
    // timerText.setText("Ruch za: " + timeElapsed);
    timeElapsed--;
  }

  if (timeElapsed < 0 || zmiana_now === true) {
    timeElapsed = czas_kolejki; // Resetuj czas, jeśli spadnie poniżej zera
    zmiana_now = false;
    if (wybor_gracza === 2) {
      wybor_gracza = 1;
      // timerText.setPosition(40, wielkosc_ekranu - 84);
      withPlayerText.setPosition(1020, 600);
      withPlayerText.setTint(`${kolory.red}`);
      withPlayerText.setText("gracz: " + wybor_gracza);

      pokaz_pionki_zbijajace(1);

      return;
    }
    if (wybor_gracza === 1) {
      wybor_gracza = 2;
      // timerText.setPosition(40, 44);

      withPlayerText.setPosition(1020, 600);
      withPlayerText.setTint(`${kolory.blue}`);
      withPlayerText.setText("gracz: " + wybor_gracza);

      pokaz_pionki_zbijajace(2);

      return;
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

function usunWszystkieObiekty() {
  obiektyNaPlanszy.forEach((obiekt) => {
    obiekt.destroy();
  });

  obiektyNaPlanszy = [];
}
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
function rysowanie_w_odpowiednim_punkcie_prostoka(scene, wiersz, kolumna) {
  const x = kolumna * 80 + offsetX + tileSize / 2;
  const y = (wiersz + 1) * 80 + offsetY - tileSize / 2;

  if (board[wiersz][kolumna] > 0) {
    memo = [];
    memo[0] = wiersz;
    memo[1] = kolumna;
  } else {
    if (board_move_posibility[wiersz][kolumna] === 1) {
      memo[2] = wiersz;
      memo[3] = kolumna;
    } else {
      memo = [];
    }
  }

  let shape = new Phaser.Geom.Circle(x, y, 30);

  const graphics = scene.add.graphics(); // Tutaj scene.add oznacza, że dodajemy grafikę do sceny
  graphics.lineStyle(4, kolory.green, 1);
  graphics.strokeRect(x - 40, y - 40, tileSize, tileSize);
  if (obiektyNaPlanszy_ramki.length > 0) {
    obiektyNaPlanszy_ramki[0].destroy();
    obiektyNaPlanszy_ramki = [];
  }

  obiektyNaPlanszy_ramki.push(graphics);
  if (board_move_posibility[wiersz][kolumna] === 1) {
    move_to_place_pionek(scene, 0, memo[0], memo[1], memo[2], memo[3], 0);
  }
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function rysowanie_damki(scene, wiersz, kolumna, gracz_nr) {
  const x = kolumna * 80 + offsetX + tileSize / 2;
  const y = (wiersz + 1) * 80 + offsetY - tileSize / 2;
  let kolor_pionka = kolory.green;
  if (gracz_nr === 1) {
    kolor_pionka = kolorPionka01;
  } else {
    kolor_pionka = kolorPionka02;
  }

  // Pełne kółko (zewnętrzna część)
  const shape = new Phaser.Geom.Circle(x, y, 30); // promień 30
  const graphics = scene.add.graphics();
  graphics.fillStyle(kolor_pionka, 1);
  graphics.fillCircleShape(shape);

  // Wewnętrzne kółko (dziurka)
  const holeShape = new Phaser.Geom.Circle(x, y, 15); // mniejszy promień
  const holeGraphics = scene.add.graphics();
  holeGraphics.fillStyle(kolory.white, 1); // biały kolor
  holeGraphics.fillCircleShape(holeShape);
  obiektyNaPlanszy.push(graphics);
  obiektyNaPlanszy.push(holeGraphics);
}

/////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////rysowanie pionka
function rysowanie_w_odpowiednim_punkcie_z_tabl0(scene, tabl) {
  const x = tabl[1] * 80 + offsetX + tileSize / 2;
  const y = (tabl[0] + 1) * 80 + offsetY - tileSize / 2;

  // Pełne kółko (zewnętrzna część)
  const shape = new Phaser.Geom.Circle(x, y, 30); // promień 30
  const graphics = scene.add.graphics();
  graphics.fillStyle(kolory.green, 1);
  graphics.fillCircleShape(shape);

  // Wewnętrzne kółko (dziurka)
  const holeShape = new Phaser.Geom.Circle(x, y, 15); // mniejszy promień
  const holeGraphics = scene.add.graphics();
  holeGraphics.fillStyle(kolory.white, 1); // biały kolor
  holeGraphics.fillCircleShape(holeShape);
  obiektyNaPlanszy.push(graphics);
  obiektyNaPlanszy.push(holeGraphics);
}

/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////do rysowania prostokatow w odpowiednim punkcie (miejsc do ruchu)///////////////////////////
function rysowanie_w_odpowiednim_punkcie_z_tabl3(scene, tabl, kolor) {
  const x = tabl[1] * 80 + offsetX + tileSize / 2;
  const y = (tabl[0] + 1) * 80 + offsetY - tileSize / 2;

  let shape = new Phaser.Geom.Circle(x, y, 30);

  const graphics = scene.add.graphics(); // Tutaj scene.add oznacza, że dodajemy grafikę do sceny
  graphics.lineStyle(4, kolor, 1);

  graphics.strokeRect(x - 40, y - 40, tileSize, tileSize);
  ramka_moves.push(graphics);
}
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
function rysowanie_w_odpowiednim_punkcie_z_tabl4(scene, tabl, kolor) {
  const x = tabl[1] * 80 + offsetX + tileSize / 2;
  const y = (tabl[0] + 1) * 80 + offsetY - tileSize / 2;

  let shape = new Phaser.Geom.Circle(x, y, 30);

  const graphics = scene.add.graphics(); // Tutaj scene.add oznacza, że dodajemy grafikę do sceny
  graphics.lineStyle(4, kolor, 1);

  graphics.strokeRect(x - 40, y - 40, tileSize, tileSize);
  ramka_moves.push(graphics);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
/////Rysuje obiekty typu pionki
function rysowanie_w_odpowiednim_punkcie_g(scene, row, col, kolor) {
  const x = col * 80 + offsetX + tileSize / 2;
  const y = (row + 1) * 80 + offsetY - tileSize / 2;
  const shape = new Phaser.Geom.Circle(x, y, 30);
  if (!kolor) {
    kolor = kolory.white;
  }

  const graphics = scene.add.graphics(); // Tutaj scene.add oznacza, że dodajemy grafikę do sceny
  graphics.fillStyle(kolor, 1);
  graphics.fillCircleShape(shape);
  obiektyNaPlanszy.push(graphics);
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
//////rysuje możliwe ruchy dla pionka
function rysuj_posible_moves() {
  for (let i = 0; i < board_move_posibility.length; i++) {
    for (let j = 0; j < board_move_posibility[i].length; j++) {
      if (board_move_posibility[i][j] === 1) {
        let tab_lok = [i, j];
        rysowanie_w_odpowiednim_punkcie_z_tabl3(scene, tab_lok, kolory.red);
      }
    }
  }
}
/////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

function move_to_place_pionek(
  scene,
  pusty1,
  from_row,
  from_col,
  to_row,
  to_col,
  pusty2
) {
  let x_from = from_col * 80 + offsetX + tileSize / 2;
  let y_from = (from_row + 1) * 80 + offsetY - tileSize / 2;
  let x_to = to_col * 80 + offsetX + tileSize / 2;
  let y_to = (to_row + 1) * 80 + offsetY - tileSize / 2;

  let kolor_pionka = kolory.green;

  let speed_w_msek = 200;
  let ilosc_kafli_po_skosie = Math.abs(from_row - to_row);

  if (board[from_row][from_col] === 1) {
    kolor_pionka = kolorPionka01;
  }
  if (board[from_row][from_col] === 2) {
    kolor_pionka = kolorPionka02;
  }
  let czy_damka = board_czy_damka[memo[0]][memo[1]];

  czy_blokowac_pola_wyb = 1;
  przenies_z_tabell(memo[0], memo[1]);
  usunWszystkieObiekty();
  Od_nowa();

  const container = scene.add.container();

  var element = scene.add.graphics();
  const shape = new Phaser.Geom.Circle(x_from, y_from, 30);
  element.fillStyle(kolor_pionka, 1);
  element.fillCircleShape(shape);

  const holeShape = new Phaser.Geom.Circle(x_from, y_from, 15);
  const holeGraphics = scene.add.graphics();
  //dla damki ponizej dwie linie
  if (czy_damka === 1) {
    holeGraphics.fillStyle(kolory.white, 1);
    holeGraphics.fillCircleShape(holeShape);
  }

  // Dodanie obiektów do kontenera

  //////////
  ile_skokow++;

  container.add([element, holeGraphics]);

  // Tweens
  scene.tweens.add({
    targets: container,
    x: x_to - x_from,
    y: y_to - y_from,
    duration: ilosc_kafli_po_skosie * speed_w_msek,
    ease: "Linear",
    yoyo: false,
    repeat: 0,
    //
    onComplete: function () {
      container.destroy();

      usun_pionki_na_trasie(memo[0], memo[1], memo[2], memo[3]);
      przenies_do_tabell(memo[2], memo[3]);

      usunWszystkieObiekty();

      Od_nowa();
      czy_blokowac_pola_wyb = 0;
      ////////////////////////////

      if (ma_jeden_ruch === 0) {
        //blokuje gdy nie ma na początku nic do zbicia
        when_move_end(memo[2], memo[3]);
      } else {
        zmiana_gracza();
      }
    },
  });

  return element; // Zwróć utworzony obiekt
}
/////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function when_move_end(wiersz, kolumna) {
  czy_jest_bicie_kolejne(wiersz, kolumna); //tu musi być warónek bo jeżeli się kończy biciem i nie ma na początku więc to nie powinno być uwzględnione

  if (
    odblokuj_NW_2skok === 1 ||
    odblokuj_NE_2skok === 1 ||
    odblokuj_SW_2skok === 1 ||
    odblokuj_SE_2skok === 1
  ) {
    blokada_po_jednym_kliku = 1;

    memo = [];
    memo[0] = wiersz;
    memo[1] = kolumna;
    usunObiektZTabeli(ramka_moves);
    show_posible_moves_nowy(wiersz, kolumna);
    //kontynuacja ruchu pionka po wieloskoku
  } else {
    blokada_po_jednym_kliku = 0;

    memo = [];
    memo[0] = wiersz;
    memo[1] = kolumna;
    usunObiektZTabeli(ramka_moves);
    show_posible_moves_nowy(wiersz, kolumna);
    //Koniec ruchu pionka po wieloskoku

    zmiana_gracza();
  }
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function usun_pionki_na_trasie(from_row, from_col, to_row, to_col) {
  let ilosc_kafli_po_skosie = Math.abs(from_row - to_row);
  let poz_start_wiersze = from_row;
  let poz_start_kolumny = from_col;
  let czy_dodac_wiersz = 0;
  let czy_dodac_col = 0;
  let pomocnicza = 0;

  if (from_row < to_row) {
    czy_dodac_wiersz = 1;
  } else {
    czy_dodac_wiersz = 0;
  }

  if (from_col < to_col) {
    czy_dodac_col = 1;
  } else {
    czy_dodac_col = 0;
  }
  let tabb = []; //tablica która tymczasowo zeruje wartości na trasie pionka

  //SE
  pomocnicza = 0;
  if (czy_dodac_wiersz === 1 && czy_dodac_col === 1) {
    pomocnicza = from_col + 1;
    for (let a = from_row; a < to_row; a++) {
      board[a + 1][pomocnicza] = 0;
      tabb.push(board[a + 1][pomocnicza]);
      pomocnicza++;
    }
  }

  //SW
  pomocnicza = 0;
  if (czy_dodac_wiersz === 1 && czy_dodac_col === 0) {
    pomocnicza = from_col - 1;
    for (let a = from_row; a < to_row; a++) {
      board[a + 1][pomocnicza] = 0;

      tabb.push(board[a + 1][pomocnicza]);
      pomocnicza--;
    }
  }

  //NE
  pomocnicza = 0;
  if (czy_dodac_wiersz === 0 && czy_dodac_col === 1) {
    pomocnicza = from_col + 1;
    for (let a = from_row; a > to_row; a--) {
      board[a - 1][pomocnicza] = 0;
      tabb.push(board[a - 1][pomocnicza]);
      pomocnicza++;
    }
  }

  //NW
  pomocnicza = 0;
  if (czy_dodac_wiersz === 0 && czy_dodac_col === 0) {
    pomocnicza = from_col - 1;
    for (let a = from_row; a > to_row; a--) {
      board[a - 1][pomocnicza] = 0;
      tabb.push(board[a - 1][pomocnicza]);
      pomocnicza--;
    }
  }
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

function usunObiektZPlanszy(index) {
  if (index >= 0 && index < obiektyNaPlanszy.length) {
    obiektyNaPlanszy[index].destroy(); // Usunięcie obiektu
    obiektyNaPlanszy.splice(index, 1); // Usunięcie obiektu z tablicy
  } else {
    console.error("Nieprawidłowy indeks obiektu.");
  }
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
////usuwanie z każdej tabeli
function usunObiektZTabeli(tablica) {
  tablica.forEach((obiekt) => {
    obiekt.destroy();
  });
  // Po zniszczeniu obiektów, możesz opróżnić tablicę
  tablica.length = 0;
}
/////////////////////////////////////////////////////////////////////////
/////po kliku sprawdza pionki i jaki był by możliwy ruch w tym miejscu

function na_Click(wiersz, kolumna) {
  // zeruj_do_pierwszego();

  czy_jest_bicie_kolejne(wiersz, kolumna);

  if (
    odblokuj_NE_2skok === 0 &&
    odblokuj_NW_2skok === 0 &&
    odblokuj_SE_2skok === 0 &&
    odblokuj_SW_2skok === 0 &&
    memo.length === 2
  ) {
    ma_jeden_ruch = 1;
    zeruj_do_pierwszego();
  } else {
    if (ile_skokow === 0) {
      ma_jeden_ruch = 0;
    } else {
      ile_skokow = 0;
    }
  }

  usunObiektZTabeli(ramka_moves);
  show_posible_moves_nowy(wiersz, kolumna);
}

///////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////
//////////////tworzy plansze od nowa
function Od_nowa() {
  for (let a = 0; a < board.length; a++) {
    for (let b = 0; b < board[a].length; b++) {
      if (board[a][b] === 1) {
        if (board_czy_damka[a][b] === 0) {
          rysowanie_w_odpowiednim_punkcie_g(scene, a, b, kolorPionka01);
        } else {
          rysowanie_damki(scene, a, b, board[a][b]);
        }
      }
      if (board[a][b] === 2) {
        if (board_czy_damka[a][b] === 0) {
          rysowanie_w_odpowiednim_punkcie_g(scene, a, b, kolorPionka02);
        } else {
          rysowanie_damki(scene, a, b, board[a][b]);
        }
      }
    }
  }
}

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

function performOperationsOnArray_pionek(move_tab, gracz_nr, kierunek) {
  let foward_move_check = [];

  if (gracz_nr == 1) {
    if (move_tab.length > 0) {
      for (let a = 0; a < move_tab.length; a++) {
        if (a === 1 && move_tab[a - 1] === 2 && move_tab[a] === 0) {
          foward_move_check[a] = 1;
        } else {
          foward_move_check[a] = 0;
        }
        if (a === 0) {
          if (move_tab[a] === 0 && kierunek === 1) {
            foward_move_check[a] = 1;
          } else {
            foward_move_check[a] = 0;
          }
        }
      }
    }
  }
  if (gracz_nr == 2) {
    if (move_tab.length > 0) {
      for (let a = 0; a < move_tab.length; a++) {
        if (a === 1 && move_tab[a - 1] === 1 && move_tab[a] === 0) {
          foward_move_check[a] = 1;
        } else {
          foward_move_check[a] = 0;
        }
        if (a === 0) {
          if (move_tab[a] === 0 && kierunek === 1) {
            foward_move_check[a] = 1;
          } else {
            foward_move_check[a] = 0;
          }
        }
      }
    }
  }

  return foward_move_check;
}

function performOperationsOnArray_damka(move_tab, gracz_nr) {
  let foward_move_check = [];
  let ile_pionkow = 0;
  let pionek_do_zbicia = 1;

  if (gracz_nr === 1) {
    pionek_do_zbicia = 2;
  } else {
    pionek_do_zbicia = 1;
  }

  if (move_tab.length > 0) {
    for (let a = 0; a < move_tab.length; a++) {
      foward_move_check[a] = 0;
    }
  }

  for (let b = 0; b < move_tab.length; b++) {
    if (move_tab[b] === gracz_nr) {
      break;
    }
    if (b === 0) {
      if (move_tab[b] === 0) {
        foward_move_check[b] = 1;
      }
    }

    if (b > 0) {
      if (
        move_tab[b - 1] === pionek_do_zbicia &&
        move_tab[b] === pionek_do_zbicia
      ) {
        break;
      }
      if (move_tab[b - 1] === pionek_do_zbicia && move_tab[b] === 0) {
        if (ile_pionkow === 0) {
          foward_move_check[b] = 1;
        } else {
          foward_move_check[b] = 0;
        }

        ile_pionkow++;
      }
      if (move_tab[b] === 0) {
        if (ile_pionkow <= 1) {
          foward_move_check[b] = 1;
        } else {
          foward_move_check[b] = 0;
        }
      }
    }
  }

  return foward_move_check;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function performOperationsOnArray_pionek_czy_jest_bicie(
  move_tab,
  gracz_nr,
  kierunek
) {
  let czy_jest_bicie = 0;
  let pionek_do_zbicia = 0;
  if (gracz_nr === 1) {
    pionek_do_zbicia = 2;
  } else pionek_do_zbicia = 1;

  if (move_tab.length > 0) {
    for (let a = 0; a < move_tab.length; a++) {
      if (
        a === 1 &&
        move_tab[a - 1] === pionek_do_zbicia &&
        move_tab[a] === 0
      ) {
        czy_jest_bicie = 1;
      }
    }
  }

  return czy_jest_bicie;
}

//////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////
function performOperationsOnArray_damka_czy_bicie(move_tab, gracz_nr) {
  let ile_pionkow = 0;
  let pionek_do_zbicia = 1;
  let czy_jest_bicie = 0;

  if (gracz_nr === 1) {
    pionek_do_zbicia = 2;
  } else {
    pionek_do_zbicia = 1;
  }

  for (let b = 0; b < move_tab.length; b++) {
    if (move_tab[b] === gracz_nr) {
      break;
    }

    if (b > 0) {
      if (
        move_tab[b - 1] === pionek_do_zbicia &&
        move_tab[b] === pionek_do_zbicia
      ) {
        break;
      }
      if (move_tab[b - 1] === pionek_do_zbicia && move_tab[b] === 0) {
        if (ile_pionkow === 0) {
          czy_jest_bicie = 1;
        }

        ile_pionkow++;
      }
    }
  }

  return czy_jest_bicie;
}

/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

function zmiana_w_tablicy_posible_moves(
  pozycja_x,
  minus_x,
  pozycja_y,
  minus_y,
  tablica_do_przypisania
) {
  board_move_posibility;
  if (minus_x === 0 && minus_y === 1) {
    for (let a = 0; a < tablica_do_przypisania.length; a++) {
      board_move_posibility[pozycja_x - a - 1][pozycja_y + a + 1] =
        tablica_do_przypisania[a];
    }
  }

  if (minus_x === 1 && minus_y === 0) {
    for (let a = 0; a < tablica_do_przypisania.length; a++) {
      board_move_posibility[pozycja_x + a + 1][pozycja_y - a - 1] =
        tablica_do_przypisania[a];
    }
  }

  if (minus_x === 1 && minus_y === 1) {
    for (let a = 0; a < tablica_do_przypisania.length; a++) {
      board_move_posibility[pozycja_x + a + 1][pozycja_y + a + 1] =
        tablica_do_przypisania[a];
    }
  }

  if (minus_x === 0 && minus_y === 0) {
    for (let a = 0; a < tablica_do_przypisania.length; a++) {
      board_move_posibility[pozycja_x - a - 1][pozycja_y - a - 1] =
        tablica_do_przypisania[a];
    }
  }
}

/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

function przenies_z_tabell(from_wiersz, from_kolumna) {
  mem_move_czy_damka = board_czy_damka[from_wiersz][from_kolumna];
  board_czy_damka[from_wiersz][from_kolumna] = 0;

  mem_board_new_move = board[from_wiersz][from_kolumna];
  board[from_wiersz][from_kolumna] = 0;
}
/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////
function przenies_do_tabell(to_wiersz, to_kolumna) {
  if (mem_board_new_move === 1) {
    if (to_wiersz >= board.length - 1) {
      board_czy_damka[to_wiersz][to_kolumna] = 1;
    } else {
      board_czy_damka[to_wiersz][to_kolumna] = mem_move_czy_damka;
    }
  }

  if (mem_board_new_move === 2) {
    if (to_wiersz === 0) {
      board_czy_damka[to_wiersz][to_kolumna] = 1;
    } else {
      board_czy_damka[to_wiersz][to_kolumna] = mem_move_czy_damka;
    }
  }

  board[to_wiersz][to_kolumna] = mem_board_new_move;
}

//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////
function jeszcze_raz() {
  usunWszystkieObiekty();
  for (let a = 0; a < board.length; a++) {
    for (let b = 0; b < board[0].length; b++) {
      board[a][b] = board_new[a][b];
      board_czy_damka[a][b] = board_czy_damka_new[a][b];
    }
  }

  Od_nowa();
}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
function posibility_moves_on_direction() {}
/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
///////////////tą funkcje trzeba skrócić lub rozszerzyć o dodatkowe informacje jest ona na bazie posibilty moves i działa na tą chwilę tylko dla damki pokazując w którym kierunku występuje bicie
function czy_jest_bicie_kolejne(wiersz, kolumna) {
  let tab1 = [];
  let tab2 = [];
  let indexXtab1 = 0;
  let indexXtab2 = 0;
  let indexPoczWierszTab1 = 0;
  let indexPoczKolumnaTab1 = 0;

  let indexPoczWierszTab2 = 0;
  let indexPoczKolumnaTab2 = 0;

  let nrwTab1 = 0;
  let nrwTab2 = 0;

  let b = kolumna;

  let ilosc_kafli_lg = 0;
  let ilosc_kafli_ld = 0;

  let ile_iteracji = 0;
  if (wiersz + kolumna <= 7) {
    ilosc_kafli_lg = wiersz + kolumna + 1;
  } else {
    ilosc_kafli_lg = 7 - (wiersz + kolumna - 7) + 1;
  }

  if (wiersz - kolumna > 0) {
    ilosc_kafli_ld = 8 - (wiersz - kolumna);
  } else {
    ilosc_kafli_ld = 8 - (kolumna - wiersz);
  }
  let pomocnicza01 = ilosc_kafli_lg - 1;
  let pomocnicza02 = 0;
  let pomocnicza03 = 0;

  if (wiersz + kolumna > 7) {
    pomocnicza02 = wiersz + kolumna - 7;
    pomocnicza01 = 7;
    pomocnicza03 = 8 - ilosc_kafli_lg;
  }
  ile_iteracji = 0;

  indexPoczWierszTab1 = pomocnicza01;
  indexPoczKolumnaTab1 = pomocnicza02;

  for (let a = pomocnicza01; a >= pomocnicza03; a--) {
    if (a != wiersz) {
      tab1.push(board[a][pomocnicza02]);
    } else {
      tab1.push("X");
      indexXtab1 = ile_iteracji;
      nrwTab1 = ile_iteracji;
    }
    pomocnicza02++;
    ile_iteracji++;
  }

  let pom_01 = 0;
  let pom_02 = 0;
  pom_01 = wiersz - kolumna; //pierwsza w dół prawo (do połowy)
  if (pom_01 < 0) {
    indexPoczWierszTab2 = 0;
    indexPoczKolumnaTab2 = kolumna - wiersz;
  } else {
    indexPoczWierszTab2 = pom_01;
    indexPoczKolumnaTab2 = pom_02;
  }

  ile_iteracji = 0;
  if (wiersz - kolumna >= 0) {
    pom_01 = wiersz - kolumna;
    for (let a = pom_01; a < pom_01 + ilosc_kafli_ld; a++) {
      if (a != wiersz) {
        tab2.push(board[a][pom_02]);
      } else {
        tab2.push("X");
        indexXtab2 = ile_iteracji;
        nrwTab2 = ile_iteracji;
      }
      ile_iteracji++;

      pom_02++;
    }
  } else {
    pom_02 = kolumna - wiersz;
    for (let b = 0; b < ilosc_kafli_ld; b++) {
      if (b != wiersz) {
        tab2.push(board[b][pom_02]);
      } else {
        tab2.push("X");
        indexXtab2 = ile_iteracji;
        nrwTab2 = ile_iteracji;
      }
      ile_iteracji++;

      pom_02++;
    }
  }

  /////////////////////////kierunki cztery badanie pol//////////////////////////////////
  let przypadki = [];

  let tablNW = [];
  let tablNE = [];

  let tablNW_posibility_move = 0;
  let tablNE_posibility_move = 0;

  let tablSW = [];
  let tablSE = [];

  let tablSW_posibility_move = 0;
  let tablSE_posibility_move = 0;

  if (nrwTab2 > 0) {
    for (let a = nrwTab2 - 1; a >= 0; a--) {
      tablNW.push(tab2[a]);
    }
    for (let a = nrwTab2 + 1; a < tab2.length; a++) {
      tablSE.push(tab2[a]);
    }
  } else {
    for (let a = nrwTab2 + 1; a < tab2.length; a++) {
      tablSE.push(tab2[a]);
    }
  }

  if (nrwTab1 > 0) {
    for (let a = nrwTab1 - 1; a >= 0; a--) {
      tablSW.push(tab1[a]);
    }
    for (let a = nrwTab1 + 1; a < tab1.length; a++) {
      tablNE.push(tab1[a]);
    }
  } else {
    for (let a = nrwTab1 + 1; a < tab1.length; a++) {
      tablNE.push(tab1[a]);
    }
  }

  ///////////pionek///////////////

  zmienWartosciNaJednaLiczbe(board_move_posibility, 0);

  let gracz_nr = board[wiersz][kolumna];

  if (board_czy_damka[wiersz][kolumna] === 1) {
    tablNE_posibility_move = performOperationsOnArray_damka_czy_bicie(
      tablNE,
      gracz_nr
    );

    tablNW_posibility_move = performOperationsOnArray_damka_czy_bicie(
      tablNW,
      gracz_nr
    );

    tablSE_posibility_move = performOperationsOnArray_damka_czy_bicie(
      tablSE,
      gracz_nr
    );

    tablSW_posibility_move = performOperationsOnArray_damka_czy_bicie(
      tablSW,
      gracz_nr
    );
  } else {
    tablNE_posibility_move = performOperationsOnArray_pionek_czy_jest_bicie(
      tablNE,
      gracz_nr,
      0
    );
    tablNW_posibility_move = performOperationsOnArray_pionek_czy_jest_bicie(
      tablNW,
      gracz_nr,
      0
    );
    tablSE_posibility_move = performOperationsOnArray_pionek_czy_jest_bicie(
      tablSE,
      gracz_nr,
      1
    );
    tablSW_posibility_move = performOperationsOnArray_pionek_czy_jest_bicie(
      tablSW,
      gracz_nr,
      1
    );
  }

  odblokuj_NW_2skok = tablNW_posibility_move;
  odblokuj_NE_2skok = tablNE_posibility_move;
  odblokuj_SE_2skok = tablSE_posibility_move;
  odblokuj_SW_2skok = tablSW_posibility_move;
}

function poprawka_do_drugiego_bicia_damki(tab) {
  let nowa_tab = [];
  let czy_bylo_0 = 0;
  for (let a = 0; a < tab.length; a++) {
    if (tab[a] === 1 && czy_bylo_0 === 0) {
      nowa_tab.push(0);
    } else {
      if (czy_bylo_0 === 0) {
        nowa_tab.push(0);
      } else {
        nowa_tab.push(tab[a]);
      }
      czy_bylo_0 = 1;
    }
  }
  return nowa_tab;
}

////////////////////////////////////////////////
////////////////////////////////////////////////

function pokaz_pionki_zbijajace(nr_gracza) {
  // console.log(board_pionki_zbijaki);
  jest_bicie = 0;
  zmienWartosciNaJednaLiczbe(board_pionki_zbijaki, 0);
  usunObiektZTabeli(obiektyNaPlanszy_ramki);
  usunObiektZTabeli(ramka_moves);

  for (let a = 0; a < board.length; a++) {
    for (let b = 0; b < board[0].length; b++) {
      if (board[a][b] === nr_gracza) {
        czy_jest_bicie_kolejne(a, b);

        if (
          odblokuj_NE_2skok === 1 ||
          odblokuj_NW_2skok === 1 ||
          odblokuj_SE_2skok === 1 ||
          odblokuj_SW_2skok === 1
        ) {
          board_pionki_zbijaki[a][b] = 1;
          let tabl_lok = [a, b];
          jest_bicie = 1;

          rysowanie_w_odpowiednim_punkcie_z_tabl3(
            scene,
            tabl_lok,
            kolory.purple
          );
        }
      }
    }
  }

  if (jest_bicie === 0) {
    sprawdzaj_dla_kazdego(wybor_gracza);
    rysuj_pionki_do_wybrania();
  }
}
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function pokaz_pionki_do_ruchu(nr_gracza) {
  // console.log(board_pionki_zbijaki);
  jest_bicie = 0;
  zmienWartosciNaJednaLiczbe(board_pionki_zbijaki, 0);
  usunObiektZTabeli(obiektyNaPlanszy_ramki);
  usunObiektZTabeli(ramka_moves);

  for (let a = 0; a < board.length; a++) {
    for (let b = 0; b < board[0].length; b++) {
      if (board[a][b] === nr_gracza) {
        czy_jest_bicie_kolejne(a, b);

        if (
          odblokuj_NE_2skok === 1 ||
          odblokuj_NW_2skok === 1 ||
          odblokuj_SE_2skok === 1 ||
          odblokuj_SW_2skok === 1
        ) {
          board_pionki_zbijaki[a][b] = 1;
          let tabl_lok = [a, b];
          jest_bicie = 1;

          rysowanie_w_odpowiednim_punkcie_z_tabl3(
            scene,
            tabl_lok,
            kolory.purple
          );
        }
      }
    }
  }
}
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
function zmiana_gracza() {
  zmiana_now = true;
  timeElapsed = czas_kolejki;
  updateTime();
}

///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////

function Po_zmianie_gracza(wybor_gracza) {
  pokaz_pionki_zbijajace(wybor_gracza);
}

//////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////
function show_posible_moves_kierunek_wolny(wiersz, kolumna, nr_gracza) {
  let sprawdz_czy_moze_NE = 0;
  let sprawdz_czy_moze_NW = 0;
  let sprawdz_czy_moze_SE = 0;
  let sprawdz_czy_moze_SW = 0;
  let czy_na_tym_polu_ma_ruch = 0;
  if (
    board_czy_damka[wiersz][kolumna] === 1 &&
    board[wiersz][kolumna] === nr_gracza
  ) {
    if (wiersz > 0 && kolumna > 0) {
      if (board[wiersz - 1][kolumna - 1] === 0) {
        sprawdz_czy_moze_NW = 1;
        czy_na_tym_polu_ma_ruch = 1;
      }
    }
    if (wiersz < 6 && kolumna < 7) {
      if (board[wiersz + 1][kolumna + 1] === 0) {
        sprawdz_czy_moze_SE = 1;
        czy_na_tym_polu_ma_ruch = 1;
      }
    }

    if (wiersz < 6 && kolumna > 0) {
      if (board[wiersz + 1][kolumna - 1] === 0) {
        sprawdz_czy_moze_SW = 1;
        czy_na_tym_polu_ma_ruch = 1;
      }
    }
    if (wiersz > 0 && kolumna < 7) {
      if (board[wiersz - 1][kolumna + 1] === 0) {
        sprawdz_czy_moze_NE = 1;
        czy_na_tym_polu_ma_ruch = 1;
      }
    }
  } else {
    if (
      board_czy_damka[wiersz][kolumna] === 0 &&
      board[wiersz][kolumna] === nr_gracza
    ) {
      if (nr_gracza === 1) {
        if (wiersz < 6 && kolumna > 0) {
          if (board[wiersz + 1][kolumna - 1] === 0) {
            sprawdz_czy_moze_SW = 1;
            czy_na_tym_polu_ma_ruch = 1;
          }
        }

        if (wiersz < 6 && kolumna < 7) {
          if (board[wiersz + 1][kolumna + 1] === 0) {
            sprawdz_czy_moze_SE = 1;
            czy_na_tym_polu_ma_ruch = 1;
          }
        }
      }

      if (nr_gracza === 2) {
        if (wiersz > 0 && kolumna > 0) {
          if (board[wiersz - 1][kolumna - 1] === 0) {
            sprawdz_czy_moze_NW = 1;
            czy_na_tym_polu_ma_ruch = 1;
          }
        }

        if (wiersz > 0 && kolumna < 7) {
          if (board[wiersz - 1][kolumna + 1] === 0) {
            sprawdz_czy_moze_NE = 1;
            czy_na_tym_polu_ma_ruch = 1;
          }
        }
      }
    }
  }

  // console.log("Czy ma: " + czy_na_tym_polu_ma_ruch);
  return czy_na_tym_polu_ma_ruch;
}
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function sprawdzaj_dla_kazdego(nr_gracza) {
  zmienWartosciNaJednaLiczbe(board_pionki_posible_moves, 0);
  for (let a = 0; a < board.length; a++) {
    for (let b = 0; b < board[a].length; b++) {
      if (board[a][b] === nr_gracza) {
        if (show_posible_moves_kierunek_wolny(a, b, nr_gracza) === 1) {
          board_pionki_posible_moves[a][b] = 1;
        }
      }
    }
  }
}
/////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////
function rysuj_pionki_do_wybrania() {
  let czy_ma_ruch = 0;
  for (let i = 0; i < board_move_posibility.length; i++) {
    for (let j = 0; j < board_move_posibility[i].length; j++) {
      if (board_pionki_posible_moves[i][j] === 1) {
        let tab_lok = [i, j];
        czy_ma_ruch++;
        rysowanie_w_odpowiednim_punkcie_z_tabl3(scene, tab_lok, kolory.purple);
      }
    }
  }
  if (czy_ma_ruch === 0) {
    try {
      console.log("Przegrana gracza: " + wybor_gracza);
    } catch {
      console.log("blad, przy gracz_nr");
    }
  }
}

//////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////

function sprawdz_czy_ma_nr(szukany_nr, tab) {
  let nr_do_pokazania = 0;
  for (let a = 0; a < tab.length; a++) {
    if (tab[a] === szukany_nr) {
      nr_do_pokazania = szukany_nr;

      //break;
    }
  }
  return nr_do_pokazania;
}

/////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////
function sprawdz_czy_jest_w_tabeli(liczba_szukana) {
  let znalazl = 0;
  for (let a = 0; a < board.length; a++) {
    for (let b = 0; b < board[a].length; b++) {
      if (board[a][b] === liczba_szukana) {
        znalazl = 1;
      }
    }
  }
  if (znalazl === 0) {
    console.log("Przegrana gracza: " + liczba_szukana);
  }
  //return znalazl;
}
