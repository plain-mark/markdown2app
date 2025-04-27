# Przykład mieszanych języków z Plainmark

Ten przykład demonstruje, jak można używać Plainmark w połączeniu z innymi językami programowania. Bloki kodu z podwójnym określeniem języka (np. ```js plainmark) są interpretowane przez Plainmark, ale zachowują też informację o oryginalnym języku.

## JavaScript + Plainmark

```js plainmark
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
```

## Python + Plainmark

```python plainmark
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
print("Silnia z 5 wynosi: " + String(factorial_5))

# Tworzymy element DOM dla wyniku Pythona
python_block = document.createElement("div")
python_block.style.backgroundColor = "#306998"
python_block.style.padding = "10px"
python_block.style.borderRadius = "5px"
python_block.style.marginTop = "10px"
python_block.style.color = "white"
python_block.textContent = "Python: " + message + ", 5! = " + String(factorial_5)

document.body.appendChild(python_block)
```

## HTML + Plainmark

```html plainmark
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
```

## CSS + Plainmark

```css plainmark
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
```

## Zastosowania mieszanych bloków kodu

Możliwość używania wielu języków z Plainmark jest przydatna w następujących przypadkach:

1. **Edukacja** - pokazywanie różnic między językami
2. **Dokumentacja** - utrzymanie kolorowania składni zgodnego z językiem
3. **Migracja kodu** - łatwiejsze przenoszenie kodu między językami
4. **Składnia zgodna z IDE** - lepsze wsparcie dla edytorów kodu