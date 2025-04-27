/**
 * Główny skrypt aplikacji Plainmark
 * Inicjalizuje interpreter i obsługuje interakcje z interfejsem użytkownika
 */

// Wczytaj domyślną zawartość edytora z pliku Markdown
fetch('default-example.md')
    .then(response => response.text())
    .then(content => {
        document.getElementById('editor').value = content;
    })
    .catch(error => {
        console.error('Błąd wczytywania przykładu:', error);
        // Wczytaj przykładowy kod wbudowany
        document.getElementById('editor').value = getDefaultExample();
    });

// Inicjalizacja interpretera
const interpreter = new PlainmarkInterpreter();
const editor = document.getElementById("editor");
const output = document.getElementById("output");
const runBtn = document.getElementById("runBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const shareBtn = document.getElementById("shareBtn");
const clearBtn = document.getElementById("clearBtn");
const autorunBtn = document.getElementById("autorunBtn");
const tabs = document.querySelectorAll(".tab");

/**
 * Wykonuje kod Markdown i aktualizuje podgląd w czasie rzeczywistym
 */
function executeAndRefresh() {
    // Wykonaj kod i pokaż wynik
    output.innerHTML = interpreter.execute(editor.value);

    // Po wykonaniu kodu, oznacz wykonane bloki w podglądzie
    if (document.querySelector('.tab.active').dataset.tab === 'preview') {
        setTimeout(() => {
            refreshPreview();
        }, 100);
    }
}

/**
 * Odświeża podgląd Markdown z oznaczeniem wykonanych bloków kodu
 */
function refreshPreview() {
    if (document.querySelector('.tab.active').dataset.tab === 'preview') {
        output.innerHTML = interpreter.renderMarkdown(editor.value);
    }
}

// Event listeners dla zakładek
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        if (tab.dataset.tab === "editor") {
            editor.style.display = "block";
            output.style.display = "block";
            // Resetujemy wygląd outputu
            output.innerHTML = "// Wynik wykonania pojawi się tutaj...";
        } else if (tab.dataset.tab === "preview") {
            editor.style.display = "none";
            output.style.display = "block";
            // Renderujemy markdown w outputie
            refreshPreview();
        }
    });
});

// Event listeners dla przycisków
runBtn.addEventListener("click", executeAndRefresh);

saveBtn.addEventListener("click", () => {
    try {
        localStorage.setItem("plainmarkCode", editor.value);
        alert("Kod został zapisany w pamięci przeglądarki");
    } catch (e) {
        alert("Błąd podczas zapisywania: " + e.message);
    }
});

loadBtn.addEventListener("click", () => {
    const savedCode = localStorage.getItem("plainmarkCode");
    if (savedCode) {
        editor.value = savedCode;
        alert("Kod został wczytany z pamięci przeglądarki");
    } else {
        alert("Brak zapisanego kodu");
    }
});

shareBtn.addEventListener("click", () => {
    // Utwórz element textarea do skopiowania kodu
    const copyArea = document.createElement("textarea");
    copyArea.value = editor.value;
    document.body.appendChild(copyArea);
    copyArea.select();
    document.execCommand("copy");
    document.body.removeChild(copyArea);
    alert("Kod został skopiowany do schowka");
});

clearBtn.addEventListener("click", () => {
    output.innerHTML = "// Wynik wykonania pojawi się tutaj...";
});

// Obsługa klawisza F5
document.addEventListener("keydown", (e) => {
    if (e.key === "F5") {
        e.preventDefault();
        runBtn.click();
    }
});

// Obsługa przykładów
document.getElementById("example1").addEventListener("click", loadBasicExample);
document.getElementById("example2").addEventListener("click", loadDomExample);
document.getElementById("example3").addEventListener("click", loadFileExample);
document.getElementById("example4").addEventListener("click", loadVisualizationExample);

// Dodaj przycisk do menu przykładów
const examplesDropdown = document.querySelector('.dropdown-content');
const multiLangExample = document.createElement('a');
multiLangExample.href = '#';
multiLangExample.id = 'example5';
multiLangExample.textContent = 'Mieszane języki';
examplesDropdown.appendChild(multiLangExample);

// Dodaj obsługę nowego przykładu
document.getElementById("example5").addEventListener("click", loadMultiLangExample);

// Zmienna przechowująca stan auto-wykonania
let autorunEnabled = false;

// Event listener dla przycisku auto-uruchamiania
autorunBtn.addEventListener("click", () => {
    autorunEnabled = !autorunEnabled;
    autorunBtn.textContent = autorunEnabled ? "Auto-wykonanie: Wł" : "Auto-wykonanie";
    autorunBtn.style.backgroundColor = autorunEnabled ? "#f44336" : "#4CAF50";

    if (autorunEnabled) {
        // Wykonaj kod od razu po włączeniu
        executeAndRefresh();
    }
});

// Event listener do aktualizacji w czasie rzeczywistym
editor.addEventListener("input", () => {
    if (autorunEnabled) {
        // Delay, aby nie wykonywać kodu przy każdym naciśnięciu klawisza
        clearTimeout(editor.timeout);
        editor.timeout = setTimeout(() => {
            executeAndRefresh();
        }, 1000); // Opóźnienie 1 sekundy
    }
});

/**
 * Ładuje podstawowy przykład Plainmark
 */
function loadBasicExample(e) {
    e.preventDefault();
    fetch('examples/basic.md')
        .then(response => response.text())
        .then(content => {
            editor.value = content;
        })
        .catch(error => {
            console.error('Błąd wczytywania przykładu:', error);
            editor.value = getBasicExample();
        });
}

/**
 * Ładuje przykład manipulacji DOM
 */
function loadDomExample(e) {
    e.preventDefault();
    fetch('examples/dom.md')
        .then(response => response.text())
        .then(content => {
            editor.value = content;
        })
        .catch(error => {
            console.error('Błąd wczytywania przykładu:', error);
            editor.value = getDomExample();
        });
}

/**
 * Ładuje przykład operacji na plikach
 */
function loadFileExample(e) {
    e.preventDefault();
    fetch('examples/files.md')
        .then(response => response.text())
        .then(content => {
            editor.value = content;
        })
        .catch(error => {
            console.error('Błąd wczytywania przykładu:', error);
            editor.value = getFileExample();
        });
}

/**
 * Ładuje przykład wizualizacji danych
 */
function loadVisualizationExample(e) {
    e.preventDefault();
    fetch('examples/visualization.md')
        .then(response => response.text())
        .then(content => {
            editor.value = content;
        })
        .catch(error => {
            console.error('Błąd wczytywania przykładu:', error);
            editor.value = getVisualizationExample();
        });
}

/**
 * Ładuje przykład mieszanych języków
 */
function loadMultiLangExample(e) {
    e.preventDefault();
    fetch('examples/multi-lang.md')
        .then(response => response.text())
        .then(content => {
            editor.value = content;
        })
        .catch(error => {
            console.error('Błąd wczytywania przykładu:', error);
            editor.value = getMultiLangExample();
        });
}

/**
 * Zawartość domyślnego przykładu
 */
function getDefaultExample() {
    return `# Mój program Plainmark

To jest prosty program napisany w Plainmark.

\`\`\`plainmark
// Definicja funkcji
function calculateSum(a, b) {
  return a + b;
}

// Definicja zmiennych
let x = 10;
let y = 20;

// Wywołanie funkcji i wypisanie wyniku
let result = calculateSum(x, y);
print("Suma " + x + " i " + y + " wynosi: " + result);

// Utworzenie prostego elementu UI
document.body.innerHTML += "<div style='margin-top: 20px; padding: 10px; background-color: #e0e0e0;'>Wygenerowane przez Plainmark!</div>";
\`\`\`

Spróbuj zmodyfikować powyższy kod i kliknij "Uruchom"!`;
}

/**
 * Zawartość przykładu podstawowego
 */
function getBasicExample() {
    return `# Podstawowy przykład Plainmark

\`\`\`plainmark
// Zmienne
let name = "Świat";
let number = 42;

// Wypisanie
print("Witaj, " + name + "!");
print("Odpowiedź to: " + number);

// Tablica (array)
let fruits = ["Jabłko", "Banan", "Pomarańcza"];
print("Pierwszy owoc: " + fruits[0]);

// Obiekt
let person = {
  name: "Jan",
  age: 30,
  city: "Warszawa"
};
print("Osoba: " + JSON.stringify(person));

// Pętla
print("Liczenie do 5:");
for (let i = 1; i <= 5; i++) {
  print("Liczba: " + i);
}
\`\`\``;
}

/**
 * Zawartość przykładu manipulacji DOM
 */
function getDomExample() {
    return `# Przykład manipulacji DOM

\`\`\`plainmark
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
\`\`\``;
}

/**
 * Zawartość przykładu operacji na plikach
 */
function getFileExample() {
    return `# Przykład obsługi plików (symulacja)

\`\`\`plainmark
// Symulacja operacji na plikach
// Uwaga: W przeglądarce to tylko symulacja - faktyczne pliki nie są tworzone

// Zapis do pliku
fs.writeFile("testfile.txt", "To jest zawartość testowego pliku.", function(err) {
  if (err) {
    print("Błąd podczas zapisu pliku: " + err.message);
  } else {
    print("Plik został zapisany pomyślnie!");
    
    // Odczyt z pliku
    fs.readFile("testfile.txt", function(err, data) {
      if (err) {
        print("Błąd podczas odczytu pliku: " + err.message);
      } else {
        print("Zawartość pliku: " + data);
      }
    });
    
    // Próba odczytu nieistniejącego pliku
    fs.readFile("nieistniejacy.txt", function(err, data) {
      if (err) {
        print("Oczekiwany błąd: " + err.message);
      } else {
        print("To nie powinno się wydarzyć!");
      }
    });
  }
});

print("Operacje na plikach zostały zainicjowane (asynchronicznie).");
\`\`\``;
}

/**
 * Zawartość przykładu wizualizacji danych
 */
function getVisualizationExample() {
    return `# Przykład wizualizacji danych

\`\`\`plainmark
// Dane do wizualizacji
let data = [
  { name: "Styczeń", value: 65 },
  { name: "Luty", value: 59 },
  { name: "Marzec", value: 80 },
  { name: "Kwiecień", value: 81 },
  { name: "Maj", value: 56 },
  { name: "Czerwiec", value: 55 }
];

// Utworzenie kontenera wykresu
let chartContainer = document.createElement("div");
chartContainer.style.width = "100%";
chartContainer.style.height = "300px";
chartContainer.style.marginTop = "20px";
chartContainer.style.position = "relative";

// Obliczenie maksymalnej wartości dla skalowania
let maxValue = Math.max(...data.map(item => item.value));
let barWidth = 100 / data.length;

// Utworzenie wykresu słupkowego
data.forEach((item, index) => {
  let barHeight = (item.value / maxValue) * 100;
  
  // Kontener słupka
  let bar = document.createElement("div");
  bar.style.position = "absolute";
  bar.style.bottom = "0";
  bar.style.left = (index * barWidth) + "%";
  bar.style.width = (barWidth - 2) + "%";
  bar.style.height = barHeight + "%";
  bar.style.backgroundColor = "rgba(66, 133, 244, 0.7)";
  bar.style.borderRadius = "4px 4px 0 0";
  bar.style.transition = "height 0.5s ease-in-out";
  
  // Etykieta z wartością
  let valueLabel = document.createElement("div");
  valueLabel.textContent = item.value;
  valueLabel.style.position = "absolute";
  valueLabel.style.top = "-25px";
  valueLabel.style.width = "100%";
  valueLabel.style.textAlign = "center";
  valueLabel.style.color = "#333";
  valueLabel.style.fontSize = "12px";
  
  // Etykieta z nazwą
  let nameLabel = document.createElement("div");
  nameLabel.textContent = item.name;
  nameLabel.style.position = "absolute";
  nameLabel.style.bottom = "-25px";
  nameLabel.style.width = "100%";
  nameLabel.style.textAlign = "center";
  nameLabel.style.color = "#333";
  nameLabel.style.fontSize = "12px";
  
  bar.appendChild(valueLabel);
  bar.appendChild(nameLabel);
  chartContainer.appendChild(bar);
  
  // Dodanie interakcji
  bar.addEventListener("mouseover", function() {
    this.style.backgroundColor = "rgba(66, 133, 244, 1)";
    valueLabel.style.fontWeight = "bold";
  });
  
  bar.addEventListener("mouseout", function() {
    this.style.backgroundColor = "rgba(66, 133, 244, 0.7)";
    valueLabel.style.fontWeight = "normal";
  });
});

// Dodanie osi Y
let yAxis = document.createElement("div");
yAxis.style.position = "absolute";
yAxis.style.left = "-30px";
yAxis.style.top = "0";
yAxis.style.bottom = "0";
yAxis.style.width = "30px";
yAxis.style.borderRight = "1px solid #ccc";

// Dodanie podziałek na osi Y
for (let i = 0; i <= 5; i++) {
  let tick = document.createElement("div");
  tick.textContent = Math.round(maxValue * (1 - i / 5));
  tick.style.position = "absolute";
  tick.style.right = "5px";
  tick.style.top = ((i / 5) * 100) + "%";
  tick.style.fontSize = "10px";
  tick.style.color = "#666";
  tick.style.transform = "translateY(-50%)";
  
  yAxis.appendChild(tick);
}

// Dodanie osi X
let xAxis = document.createElement("div");
xAxis.style.position = "absolute";
xAxis.style.left = "0";
xAxis.style.right = "0";
xAxis.style.bottom = "-30px";
xAxis.style.height = "30px";
xAxis.style.borderTop = "1px solid #ccc";

// Dodanie tytułu wykresu
let chartTitle = document.createElement("div");
chartTitle.textContent = "Miesięczne dane";
chartTitle.style.textAlign = "center";
chartTitle.style.fontSize = "16px";
chartTitle.style.fontWeight = "bold";
chartTitle.style.marginBottom = "20px";

// Dodanie legendy
let legend = document.createElement("div");
legend.style.display = "flex";
legend.style.justifyContent = "center";
legend.style.alignItems = "center";
legend.style.marginTop = "40px";

let legendItem = document.createElement("div");
legendItem.style.display = "flex";
legendItem.style.alignItems = "center";
legendItem.style.marginRight = "20px";

let legendColor = document.createElement("div");
legendColor.style.width = "20px";
legendColor.style.height = "20px";
legendColor.style.backgroundColor = "rgba(66, 133, 244, 0.7)";
legendColor.style.marginRight = "5px";

let legendText = document.createElement("div");
legendText.textContent = "Wartość miesięczna";

legendItem.appendChild(legendColor);
legendItem.appendChild(legendText);
legend.appendChild(legendItem);

// Utworzenie kontenera głównego
let mainContainer = document.createElement("div");
mainContainer.style.position = "relative";
mainContainer.style.padding = "40px 40px 60px 40px";
mainContainer.style.border = "1px solid #ccc";
mainContainer.style.borderRadius = "4px";
mainContainer.style.backgroundColor = "white";

mainContainer.appendChild(chartTitle);
mainContainer.appendChild(chartContainer);
mainContainer.appendChild(legend);
chartContainer.appendChild(yAxis);
chartContainer.appendChild(xAxis);

document.body.appendChild(mainContainer);

print("Utworzono interaktywny wykres słupkowy z danymi miesięcznymi.");
\`\`\``;
}

/**
 * Zawartość przykładu mieszanych języków
 */
function getMultiLangExample() {
    return `# Przykład mieszanych języków z Plainmark

Ten przykład demonstruje, jak można używać Plainmark w połączeniu z innymi językami programowania. Bloki kodu z podwójnym określeniem języka (np. \`\`\`js plainmark) są interpretowane przez Plainmark, ale zachowują też informację o oryginalnym języku.

## JavaScript + Plainmark

\`\`\`js plainmark
// To jest blok kodu JavaScript z Plainmark
let message = "Hello from JavaScript!";
console.log(message);

// Tworzymy element DOM
let jsBlock = document.createElement("div");
jsBlock.style.backgroundColor = "#f0db4f"; // Kolor JavaScript
jsBlock.style.padding = "10px";
jsBlock.style.borderRadius = "5px";
jsBlock.style.marginTop = "10px";
jsBlock.style.color = "#323330";
jsBlock.textContent = message;

document.body.appendChild(jsBlock);
\`\`\`

## Python + Plainmark

\`\`\`python plainmark
# To jest blok kodu Python z Plainmark
message = "Hello from Python!"
print(message)

# W przeglądarce nadal wykonuje się jako JavaScript
# ale zachowujemy składnię Pythona dla czytelności
def calculate_factorial(n):
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

factorial_5 = calculate_factorial(5)
print(f"Silnia z 5 wynosi: {factorial_5}")

# Tworzymy element DOM dla wyniku Pythona
python_block = document.createElement("div")
python_block.style.backgroundColor = "#306998"
python_block.style.padding = "10px"
python_block.style.borderRadius = "5px"
python_block.style.marginTop = "10px"
python_block.style.color = "white"
python_block.textContent = "Python: " + message + ", 5! = " + factorial_5

document.body.appendChild(python_block)
\`\`\`

## HTML + Plainmark

\`\`\`html plainmark
<!-- To jest blok kodu HTML z Plainmark -->
<div id="html-container" style="margin-top: 10px; border: 1px solid #e34c26; border-radius: 5px; padding: 10px;">
  <h3 style="color: #e34c26;">Element HTML</h3>
  <p>Ten element został utworzony bezpośrednio w HTML.</p>
</div>

<script>
  // Kod JavaScript osadzony w HTML, również jest wykonany
  const element = document.getElementById('html-container');
  element.addEventListener('click', function() {
    print("Kliknięto element HTML!");
    this.style.backgroundColor = "#ffe6e0";
  });
</script>
\`\`\`

## CSS + Plainmark

\`\`\`css plainmark
/* To jest blok kodu CSS z Plainmark */
.plainmark-styled {
  background-color: #264de4;
  color: white;
  padding: 15px;
  border-radius: 5px;
  margin-top: 10px;
  font-family: sans-serif;
  text-align: center;
}

/* Możemy również wykonać kod JavaScript */
let cssElement = document.createElement("div");
cssElement.className = "plainmark-styled";
cssElement.textContent = "Ten element został ostylowany przez CSS + Plainmark";
document.body.appendChild(cssElement);
\`\`\``;
}