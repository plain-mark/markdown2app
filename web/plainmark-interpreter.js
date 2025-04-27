/**
 * Plainmark Interpreter
 * Klasa odpowiedzialna za parsowanie i wykonywanie kodu Plainmark
 */
class PlainmarkInterpreter {
    constructor() {
        this.variables = {};
        this.functions = {};
        this.output = "";
        this.errorCount = 0;
    }

    /**
     * Ekstrahuje bloki kodu Plainmark z tekstu Markdown
     * @param {string} markdownText - Tekst w formacie Markdown
     * @returns {Array} - Tablica obiektów z blokami kodu i ich językami
     */
    extractCode(markdownText) {
        if (!markdownText || typeof markdownText !== 'string') {
            return [];
        }

        const result = [];

        // Znajdź tradycyjne bloki ```plainmark
        const plainmarkBlockRegex = /```plainmark\s*([\s\S]*?)\s*```/g;
        let match;

        while ((match = plainmarkBlockRegex.exec(markdownText)) !== null) {
            result.push({
                code: match[1],
                language: 'plainmark',
                originalMatch: match[0]
            });
        }

        // Znajdź bloki z podwójnym określeniem języka ```język plainmark
        const multiLangBlockRegex = /```(\w+)\s+plainmark\s*([\s\S]*?)\s*```/g;

        while ((match = multiLangBlockRegex.exec(markdownText)) !== null) {
            result.push({
                code: match[2],
                language: match[1],
                originalMatch: match[0],
                multiLang: true
            });
        }

        return result;
    }

    /**
     * Funkcja wypisująca komunikat do bufora wyjściowego
     * @param {any} message - Wiadomość do wypisania
     * @returns {any} - Przekazana wiadomość
     */
    print(message) {
        this.output += message + "\n";
        return message;
    }

    /**
     * Funkcja do obsługi błędów
     * @param {string} message - Komunikat błędu
     * @returns {null}
     */
    error(message) {
        this.errorCount++;
        this.output += `<span class="error">Błąd: ${message}</span>\n`;
        return null;
    }


    /**
     * Wykonuje kod Plainmark
     * @param {string} markdownText - Tekst w formacie Markdown z blokami kodu Plainmark
     * @returns {string} - Wyjście z wykonania kodu
     */
    execute(markdownText) {
        this.output = "";
        this.errorCount = 0;

        if (!markdownText || typeof markdownText !== 'string') {
            return "Brak poprawnego tekstu markdown.";
        }

        const codeBlocks = this.extractCode(markdownText);

        if (codeBlocks.length === 0) {
            return "Nie znaleziono bloków kodu Plainmark w tekście markdown.";
        }

        // Sandbox - bezpieczne środowisko wykonywania
        const sandbox = {
            print: (msg) => this.print(msg),
            error: (msg) => this.error(msg),
            alert: (msg) => window.alert(msg),
            confirm: (msg) => window.confirm(msg),
            prompt: (msg, def) => window.prompt(msg, def),
            document: document,
            console: {
                log: (msg) => this.print(msg),
                error: (msg) => this.error(msg),
                warn: (msg) => this.print("Ostrzeżenie: " + msg)
            },
            localStorage: localStorage,
            sessionStorage: sessionStorage,
            setTimeout: setTimeout,
            clearTimeout: clearTimeout,
            setInterval: setInterval,
            clearInterval: clearInterval,
            Math: Math,
            JSON: JSON,
            String: String,
            Number: Number,
            Boolean: Boolean,
            Array: Array,
            Object: Object,
            RegExp: RegExp,
            Date: Date,
            Error: Error,
            fetch: fetch,
            // Fikcyjne API - w rzeczywistości nie działają w przeglądarce
            fs: {
                readFile: (path, options, callback) => {
                    if (typeof options === 'function') {
                        callback = options;
                        options = {};
                    }
                    this.print(`Symulacja odczytu pliku: ${path}`);
                    setTimeout(() => {
                        if (path === 'testfile.txt') {
                            callback(null, "To jest zawartość testowego pliku.");
                        } else {
                            callback(new Error("Plik nie istnieje"), null);
                        }
                    }, 100);
                },
                writeFile: (path, data, options, callback) => {
                    if (typeof options === 'function') {
                        callback = options;
                        options = {};
                    }
                    this.print(`Symulacja zapisu do pliku: ${path}`);
                    setTimeout(() => {
                        callback(null);
                    }, 100);
                }
            }
        };

        try {
            // Wykonaj każdy blok kodu
            for (const block of codeBlocks) {
                if (!block.code || typeof block.code !== 'string') {
                    this.error("Pusty lub nieprawidłowy blok kodu");
                    continue;
                }

                this.print(`--- Wykonanie bloku kodu ${block.multiLang ? block.language + '+plainmark' : 'plainmark'} ---`);

                // Konwersja komentarzy Pythona na komentarze JavaScript
                let processedCode = block.code;

                // Jeśli to blok Pythona, zamień komentarze # na //
                if (block.language === 'python') {
                    // Zamiana komentarzy linii rozpoczynających się od #
                    processedCode = processedCode.replace(/^(\s*)#\s*(.*)/gm, '$1// $2');

                    // Zamiana komentarzy w środku linii (bardziej skomplikowane, może wymagać dalszych ulepszeń)
                    processedCode = processedCode.replace(/([^"'])#\s*(.*)/g, '$1// $2');

                    this.print("// Kod po konwersji komentarzy:");
                    this.print("// " + processedCode.replace(/\n/g, '\n// '));
                }

                // Przetworzenie kodu
                processedCode = processedCode
                    .replace(/let\s+(\w+)\s*=\s*/g, "sandbox.$1 = ")
                    .replace(/const\s+(\w+)\s*=\s*/g, "sandbox.$1 = ")
                    .replace(/function\s+(\w+)\s*\(/g, "sandbox.$1 = function(");

                // Wykonanie kodu
                const executeFunction = new Function("sandbox", `
                    with (sandbox) {
                        try {
                            ${processedCode}
                        } catch (e) {
                            error("Runtime error: " + e.message);
                        }
                    }
                `);

                executeFunction(sandbox);

                // Zapisz zmienne do interpreter.variables dla debugowania
                for (const key in sandbox) {
                    if (typeof sandbox[key] !== 'function' &&
                        key !== 'document' &&
                        key !== 'console' &&
                        !['Math', 'JSON', 'String', 'Number', 'Boolean', 'Array', 'Object'].includes(key)) {
                        this.variables[key] = sandbox[key];
                    }
                }
            }

            if (this.errorCount > 0) {
                return this.output;
            }

            return this.output || "Kod został wykonany pomyślnie (brak wyjścia).";
        } catch (error) {
            return `<span class="error">Błąd kompilacji: ${error.message}</span>`;
        }
    }


    /**
     * Renderuje tekst Markdown do HTML
     * @param {string} markdownText - Tekst w formacie Markdown
     * @returns {string} - HTML wynikowy
     */
    renderMarkdown(markdownText) {
        if (!markdownText || typeof markdownText !== 'string') {
            return "Brak tekstu do renderowania.";
        }

        // Prosta konwersja Markdown do HTML
        let html = markdownText
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\n/gim, '<br>');

        // Obsługa zwykłych bloków kodu plainmark
        html = html.replace(/```plainmark\s*([\s\S]*?)\s*```/g, (match, p1) => {
            return '<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;"><code>' +
                    p1.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                    '</code></pre>';
        });

        // Obsługa bloków kodu z podwójnym określeniem języka
        html = html.replace(/```(\w+)\s+plainmark\s*([\s\S]*?)\s*```/g, (match, lang, code) => {
            return `<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px; border-left: 4px solid #4285f4;">
                    <div style="margin-bottom: 5px; color: #666; font-size: 12px;">Język: ${lang} + plainmark</div>
                    <code>${code.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</code>
                    </pre>`;
        });

        return html;
    }
}