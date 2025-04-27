
# Przykład wizualizacji danych

Ten przykład pokazuje, jak Plainmark może być używany do tworzenia prostych wizualizacji danych bezpośrednio w przeglądarce. Utworzymy interaktywny wykres słupkowy z danymi miesięcznymi.

```js plainmark
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
```

## Wyjaśnienie kodu

1. **Dane** - definiujemy tablicę obiektów z danymi miesięcznymi
2. **Tworzenie wykresu** - budujemy wykres słupkowy za pomocą elementów DOM i CSS
3. **Interaktywność** - dodajemy zdarzenia `mouseover` i `mouseout` dla lepszego doświadczenia użytkownika
4. **Osie i etykiety** - dodajemy osie X i Y oraz etykiety dla lepszej czytelności

Ten przykład pokazuje, jak można tworzyć proste, ale efektywne wizualizacje danych bez użycia zewnętrznych bibliotek.