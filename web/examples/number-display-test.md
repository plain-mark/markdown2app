# Test wyświetlania liczb

Ten przykład testuje różne sposoby wyświetlania liczb w Plainmark.

## Test 1: Prosta liczba

```plainmark
// Przypisanie liczby
let num = 42;
print(num);
```

## Test 2: Konkatenacja z prefixem

```plainmark
// Prosty łańcuch + liczba
let num = 42;
print("Liczba: " + num);
```

## Test 3: Liczba jako wynik funkcji

```plainmark
// Funkcja zwracająca liczbę
function getNumber() {
  return 42;
}

let num = getNumber();
print(num);
```

## Test 4: Alternatywne sposoby wyświetlania liczby

```plainmark
// Różne sposoby wyświetlania
let num = 42;

// 1. Z przecinkiem
print("Z przecinkiem:", num);

// 2. Z szablonami literałów
print(`Z szablonem: ${num}`);

// 3. Z jawną konwersją na string
print("Jawna konwersja: " + num.toString());

// 4. Z konwersją przez funkcję
print("Przez funkcję: " + (num+""));
```