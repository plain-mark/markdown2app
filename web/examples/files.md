
# Przykład obsługi plików (symulacja)

Ten przykład pokazuje, jak Plainmark może symulować operacje na plikach. W środowisku przeglądarki faktyczne operacje na plikach nie są możliwe, ale Plainmark oferuje symulowane API dla celów demonstracyjnych.

```js plainmark
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
```

## Wyjaśnienie kodu

1. **API plików** - Plainmark w przeglądarce symuluje operacje na plikach poprzez API `fs`
2. **Asynchroniczność** - operacje na plikach są asynchroniczne, używają callbacków
3. **Obsługa błędów** - sprawdzamy parametr `err` w callbackach, aby obsłużyć potencjalne błędy

Uwaga: W rzeczywistym środowisku terminalowym (Python), te operacje faktycznie utworzyłyby i czytały pliki na dysku.