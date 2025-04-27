
# Podstawowy przykład Plainmark

W tym przykładzie pokazujemy podstawowe elementy języka Plainmark, takie jak zmienne, tablice, obiekty i pętle.

```js plainmark
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
```

## Wyjaśnienie kodu

1. **Zmienne** - definiowane za pomocą słowa kluczowego `let`
2. **Tablice** - kolekcje wartości w nawiasach kwadratowych
3. **Obiekty** - kolekcje par klucz-wartość w nawiasach klamrowych
4. **Pętle** - konstrukcja `for` do powtarzania operacji

Możesz modyfikować kod i eksperymentować z różnymi typami danych i operacjami.