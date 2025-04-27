# Debugowanie funkcji silni

Ten przykład skupia się tylko na funkcji silni i lokalizacji błędu.

## Test 1: Podstawowa definicja funkcji

```python plainmark
# Podstawowy kod
def calculate_factorial(n):
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

# Tylko definicja funkcji, bez wywołania
print("Funkcja zdefiniowana")
```

## Test 2: Wywołanie funkcji i przypisanie do zmiennej

```python plainmark
# Definicja i wywołanie
def calculate_factorial(n):
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

# Wywołanie funkcji
result = calculate_factorial(5)
print("Wynik obliczony")
```

## Test 3: Wypisanie wyniku bez konkatenacji

```python plainmark
# Definicja i wywołanie z wypisaniem wyniku
def calculate_factorial(n):
    if n <= 1:
        return 1
    return n * calculate_factorial(n - 1)

result = calculate_factorial(5)
print("Wynik:", result)
```