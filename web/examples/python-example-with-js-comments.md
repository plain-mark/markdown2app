# Przykład Python + Plainmark z komentarzami JavaScript

## Przykład Python z komentarzami JS

```python plainmark
// To jest blok kodu Python z Plainmark, ale z komentarzami JS
message = "Hello from Python!"
print(message)

// W przeglądarce nadal wykonuje się jako JavaScript
// ale zachowujemy składnię Pythona dla czytelności
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

result = factorial(5)
print("Wynik silni:", result)

// Tworzymy element DOM dla wyniku
python_element = document.createElement("div")
python_element.style.backgroundColor = "#306998"
python_element.style.padding = "10px"
python_element.style.color = "white"
python_element.textContent = "Python: " + message
document.body.appendChild(python_element)
```