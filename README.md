# Tempus Bellum

Zegar faz do gier bitewnych (Warhammer 40k i podobne) dla telefonu lub tabletu leżącego przy stole.
Aplikacja webowa (PWA): cała logika siedzi w `index.html`, nic nie trzeba instalować, działa offline.

## Uruchomienie

- **Najprościej:** otwórz `index.html` w przeglądarce. Wszystko działa, brakuje tylko trybu offline i ikonki na ekranie głównym.
- **Jako PWA:** serwuj katalog przez HTTP(S), np. `python3 -m http.server 8080`, albo kontener nginx na Unraidzie.
  Potem w przeglądarce wybierz „Dodaj do ekranu głównego”. Service worker i Wake Lock wymagają HTTPS (albo `localhost`).

## Jak to działa

Aplikacja zapisuje **zdarzenia, nie czasy**. Każde kliknięcie trafia do logu ze znacznikiem czasu:

| zdarzenie | znaczenie |
|---|---|
| `phase {p, r, f}` | gracz `p` zaczyna fazę `f` w rundzie `r` |
| `pause` / `resume` | czas między nimi się nie liczy |
| `adjust {k, d}` | ręczna korekta komórki `k = "p\|r\|f"` o `d` ms |
| `end` | koniec gry |

Czasy są wyliczane z różnic dopiero przy wyświetlaniu, więc:
- **Cofnij** usuwa ostatnie zdarzenie (czas wraca do poprzedniej fazy, nic nie ginie),
- **Pauza** to para zdarzeń,
- surowy log można wyeksportować (JSON) i liczyć z niego dowolne statystyki później.

Stan jest zapisywany w `localStorage` po każdym kliknięciu, więc przypadkowe odświeżenie strony nie kasuje gry.
Ostatnie 50 gier zostaje w historii na ekranie startowym.

## Obsługa przy stole

- Wielki przycisk **Następna faza** (blokada 0,6 s przed podwójnym trafieniem łokciem). Podpis pod nim mówi, co będzie dalej.
- Kolor przycisku = kolor gracza, którego jest tura.
- **Pauza**: kłótnia o zasady, kawa, zgubiona kość. W pauzie wielki przycisk zmienia się w „Wznów”.
- **Tabela**: podgląd gracz × runda × faza w trakcie gry. Dotknięcie komórki pozwala ręcznie poprawić czas (gdy ktoś zapomniał kliknąć).
- Ekran nie gaśnie (Wake Lock API, o ile przeglądarka wspiera).
- Klawiatura: `Spacja`/`Enter` = następna faza, `P` = pauza, `Z`/`Backspace` = cofnij.

Na razie liczony jest czas gracza, którego jest tura (także w fazie walki i przy reakcjach przeciwnika).

## Plan

1. ✅ MVP: wybór graczy, timer faz, cofnij, pauza, tabelka na koniec gry, korekta czasu, eksport CSV/JSON.
2. Statystyki między grami (średnie per faza, per gracz, trend).
3. Tryb „zegara szachowego”: przełączanie, kto aktualnie myśli (walka, Overwatch, Heroic Intervention).
