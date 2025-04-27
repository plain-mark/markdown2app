/**
 * Główny skrypt aplikacji Plainmark
 * Inicjalizuje interpreter i obsługuje interakcje z interfejsem użytkownika
 */

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
 * Funkcja ładująca przykłady z pliku JSON
 */
function loadExamplesFromJson() {
    fetch('../examples/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Nie udało się załadować indeksu przykładów');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.examples && Array.isArray(data.examples)) {
                addExamplesToMenu(data.examples);
                console.log(`Załadowano ${data.examples.length} przykładów z indeksu JSON.`);
            } else {
                throw new Error('Nieprawidłowy format danych JSON');
            }
        })
        .catch(error => {
            console.error('Błąd podczas ładowania indeksu przykładów:', error);
            // Fallback do znanych przykładów
            loadKnownExamples();
        });
}

/**
 * Funkcja ładująca wszystkie pliki Markdown z katalogu examples
 * Uwaga: Ta funkcja wymaga serwera, który może listować pliki katalogu
 */
function loadAllMarkdownFiles() {
    // Ścieżka do katalogu examples
    const examplesPath = '../examples/';

    // Najpierw spróbujmy załadować listę plików za pomocą fetch
    fetch(examplesPath)
        .then(response => response.text())
        .then(html => {
            // Parsuj HTML, aby znaleźć linki do plików .md
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const links = doc.querySelectorAll('a');

            // Filtruj tylko pliki .md
            const markdownFiles = Array.from(links)
                .map(link => link.getAttribute('href'))
                .filter(href => href && href.endsWith('.md'));

            if (markdownFiles.length > 0) {
                // Dodaj każdy plik jako element menu
                const examples = markdownFiles.map(file => ({
                    file: file,
                    title: file.replace('.md', '').replace(/-/g, ' ')
                }));
                addExamplesToMenu(examples);
                console.log(`Znaleziono ${markdownFiles.length} plików Markdown.`);
            } else {
                console.warn('Nie znaleziono plików Markdown w katalogu examples.');
                // Próba alternatywnego podejścia - załaduj z JSON
                loadExamplesFromJson();
            }
        })
        .catch(error => {
            console.error('Błąd podczas ładowania plików:', error);
            // Jeśli nie udało się załadować listy plików, spróbuj załadować z JSON
            loadExamplesFromJson();
        });
}

/**
 * Dodaje przykłady do menu
 * @param {Array} examples - Lista obiektów przykładów
 */
function addExamplesToMenu(examples) {
    const dropdown = document.querySelector('.dropdown-content');

    // Wyczyść istniejące elementy menu
    dropdown.innerHTML = '';

    // Dodaj każdy przykład jako element menu
    examples.forEach((example, index) => {
        const menuItem = document.createElement('a');
        menuItem.href = '#';
        menuItem.id = `example-${index + 1}`;

        // Utwórz ładną nazwę dla pliku
        let displayTitle = example.title || example.file.replace('.md', '').replace(/-/g, ' ');
        displayTitle = displayTitle.charAt(0).toUpperCase() + displayTitle.slice(1);
        menuItem.textContent = displayTitle;

        // Dodaj tytuł z opisem
        if (example.description) {
            menuItem.title = example.description;
        }

        // Dodaj obsługę kliknięcia
        menuItem.addEventListener('click', (e) => {
            e.preventDefault();
            loadMarkdownFile(example.file);
        });

        dropdown.appendChild(menuItem);
    });
}

/**
 * Ładuje określony plik Markdown
 * @param {string} fileName - Nazwa pliku do załadowania
 */
function loadMarkdownFile(fileName) {
    fetch(`../examples/${fileName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Nie udało się pobrać pliku ${fileName}`);
            }
            return response.text();
        })
        .then(content => {
            editor.value = content;
            // Opcjonalnie, jeśli chcesz od razu wykonać kod:
            if (autorunEnabled) {
                executeAndRefresh();
            }
        })
        .catch(error => {
            console.error(`Błąd wczytywania ${fileName}:`, error);
            // Fallback do wbudowanej funkcji
            const fallbackFn = getFallbackFunction(fileName);
            if (fallbackFn) {
                editor.value = fallbackFn();
            } else {
                alert(`Nie udało się załadować pliku ${fileName}`);
            }
        });
}

/**
 * Zwraca odpowiednią funkcję fallback dla nazwy pliku
 * @param {string} fileName - Nazwa pliku
 * @returns {Function|null} - Funkcja fallback lub null jeśli nie znaleziono
 */
function getFallbackFunction(fileName) {
    const fallbacks = {
        'default-example.md': getDefaultExample,
        'basic.md': getBasicExample,
        'dom.md': getDomExample,
        'files.md': getFileExample,
        'visualization.md': getVisualizationExample,
        'multi-lang.md': getMultiLangExample
    };

    return fallbacks[fileName] || null;
}

/**
 * Ładuje znane przykłady, jeśli nie udało się automatycznie wykryć plików
 */
function loadKnownExamples() {
    const knownExamples = [
        { file: 'default-example.md', title: 'Przykład domyślny' },
        { file: 'basic.md', title: 'Podstawowe elementy' },
        { file: 'dom.md', title: 'Manipulacja DOM' },
        { file: 'files.md', title: 'Operacje na plikach' },
        { file: 'visualization.md', title: 'Wizualizacja danych' },
        { file: 'multi-lang.md', title: 'Mieszane języki' }
    ];

    addExamplesToMenu(knownExamples);
    console.log('Załadowano predefiniowane przykłady.');
}

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

// Wywołaj funkcję ładowania przykładów podczas startu aplikacji
window.addEventListener('DOMContentLoaded', () => {
    // Próbujemy załadować wszystkie pliki Markdown z katalogu
    loadAllMarkdownFiles();

    // Ładuj domyślny przykład
    loadMarkdownFile('default-example.md');
});