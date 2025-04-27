# Minimalny przykład silni w Python + Plainmark

## Przykład

```python plainmark
# Funkcja silni
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

# Wywołanie funkcji
result = factorial(5)

# Różne sposoby wyświetlania wyniku
# Sposób 1: Bez konkatenacji
print("Wynik silni:", result)

# Sposób 2: Z tekstem i przecinkiem
print("Silnia z 5 wynosi:", result)

# Sposób 3: Czysty wynik
print(result)
```