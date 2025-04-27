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
     * @returns {string} - Połączone bloki kodu Plainmark
     */
    extractCode(markdownText) {
        const codeBlockRegex = /```plainmark\s*([\s\S]*?)\s*```/g;
        let match;
        let code = "";

        while ((match = codeBlockRegex.exec(markdownText)) !== null) {
            code += match[1] + "\n";
        }

        return code;
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
        const code = this.extractCode(markdownText);

        if (!code) {
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
            // Przetworzenie kodu
            let processedCode = code
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
        // Prosta konwersja Markdown do HTML
        let html = markdownText
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/\n/gim, '<br>');

        // Obsługa bloków kodu
        html = html.replace(/```plainmark\s*([\s\S]*?)\s*```/g, (match, p1) => {
            return '<pre style="background-color: #f5f5f5; padding: 10px; border-radius: 4px;"><code>' +
                   p1.replace(/</g, '&lt;').replace(/>/g, '&gt;') +
                   '</code></pre>';
        });

        return html;
    }
}