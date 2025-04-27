# Przykładowy program Plainmark

Ten program został specjalnie dostosowany, aby działać z interpreterem Pythona.

```plainmark
# Definicja zmiennych
name = "Python User"
age = 30

# Wypisanie powitania
print(f"Witaj, {name}!")
print(f"Masz {age} lat.")

# Definicja funkcji
def calculate_area(radius):
    return 3.14159 * radius * radius

# Użycie funkcji
radius = 5
area = calculate_area(radius)
print(f"Powierzchnia koła o promieniu {radius} wynosi {area:.2f}")

# Pobranie danych od użytkownika
user_input = input("Podaj swój ulubiony kolor: ")
print(f"Twój ulubiony kolor to: {user_input}")

# Uruchomienie komendy systemowej (ograniczone do bezpiecznych poleceń)
print("Pliki w bieżącym katalogu:")
directory_contents = exec("ls -la")
print(directory_contents)
```

## Instrukcje uruchomienia

Aby uruchomić ten program, wykonaj komendę:

```
python plainmark.py example.md
```

## Dodatkowe przykłady

Poniżej znajduje się bardziej zaawansowany przykład pokazujący instrukcje warunkowe:

```plainmar
# Instrukcje warunkowe w Plainmark (wersja Python)
temperature = 22

if temperature > 25:
    print("Jest ciepło na zewnątrz!")
elif temperature > 15:
    print("Jest przyjemny dzień.")
else:
    print("Jest zimno.")

# Prosta pętla (implementacja Pythonowa)
print("Liczenie do 5:")
for i in range(5):
    print(f"Liczba: {i+1}")

# Użycie listy (tablicy)
fruits = ["Jabłko", "Banan", "Pomarańcza"]
print("Pierwszy owoc:", fruits[0])
print("Wszystkie owoce:")
for fruit in fruits:
    print(f"- {fruit}")

# Obsługa wyjątków
try:
    result = 10 / 0
    print("Ten kod nie zostanie wykonany")
except Exception as e:
    print(f"Złapano błąd: {e}")
```

## Obsługa plików

```plainmar
# Obsługa plików
filename = "testfile.txt"

# Zapisanie do pliku
with open(filename, "w") as f:
    f.write("To jest testowy plik utworzony przez Plainmark.\n")
    f.write("Możliwa jest prosta obsługa plików.\n")

print(f"Zapisano dane do pliku {filename}")

# Odczytanie z pliku
print(f"Odczytanie zawartości pliku {filename}:")
with open(filename, "r") as f:
    content = f.read()
    print(content)
```