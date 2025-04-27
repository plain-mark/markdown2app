# Przykład manipulacji DOM

Ten przykład pokazuje, jak Plainmark może manipulować zawartością strony poprzez tworzenie i modyfikowanie elementów DOM.

```js plainmark
// Tworzenie elementów DOM
let container = document.createElement("div");
container.style.padding = "15px";
container.style.backgroundColor = "#f0f0f0";
container.style.borderRadius = "5px";
container.style.marginTop = "20px";

let heading = document.createElement("h3");
heading.textContent = "Interaktywny element utworzony przez Plainmark";
heading.style.color = "#4285f4";

let button = document.createElement("button");
button.textContent = "Kliknij mnie!";
button.style.padding = "8px 16px";
button.style.backgroundColor = "#4CAF50";
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "4px";
button.style.cursor = "pointer";
button.style.marginTop = "10px";

let counter = 0;
let counterDisplay = document.createElement("div");
counterDisplay.textContent = "Licznik kliknięć: " + counter;
counterDisplay.style.marginTop = "10px";

// Dodanie obsługi zdarzenia
button.addEventListener("click", function() {
  counter++;
  counterDisplay.textContent = "Licznik kliknięć: " + counter;
  print("Przycisk został kliknięty! Licznik: " + counter);
});

// Utworzenie struktury i dodanie do dokumentu
container.appendChild(heading);
container.appendChild(button);
container.appendChild(counterDisplay);
document.body.appendChild(container);

print("Element DOM został utworzony. Kliknij przycisk, aby zwiększyć licznik.");
```

## Wyjaśnienie kodu

1. **Tworzenie elementów** - używamy `document.createElement()` do tworzenia nowych elementów HTML
2. **Stylizacja** - ustawiamy style CSS dla każdego elementu
3. **Obsługa zdarzeń** - dodajemy listener zdarzenia do przycisku, aby reagować na kliknięcia
4. **Struktura DOM** - budujemy hierarchię elementów za pomocą `appendChild()`

Po uruchomieniu kodu zobaczysz interaktywny przycisk, który zlicza kliknięcia.