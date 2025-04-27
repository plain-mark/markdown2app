// MainActivity.kt
package com.example.plainmark

import android.os.Bundle
import android.webkit.WebView
import android.webkit.WebViewClient
import android.webkit.JavascriptInterface
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.FileProvider
import android.content.Intent
import android.net.Uri
import android.os.Environment
import android.provider.MediaStore
import android.util.Log
import java.io.File
import java.io.FileOutputStream
import java.io.IOException
import java.text.SimpleDateFormat
import java.util.*

class MainActivity : AppCompatActivity() {
    private lateinit var webView: WebView
    private lateinit var editText: EditText
    private lateinit var runButton: Button
    private lateinit var saveButton: Button
    private lateinit var shareButton: Button
    private lateinit var loadButton: Button

    private val TAG = "PlainmarkApp"
    private lateinit var currentPhotoPath: String

    companion object {
        private const val REQUEST_CODE_OPEN_FILE = 1
        private const val REQUEST_IMAGE_CAPTURE = 2

        // Default content shown when app starts
        private const val DEFAULT_CONTENT = """# My Plainmark Mobile App

This is a sample Plainmark program for Android.

```plainmark
// Access mobile device features
print("Welcome to Plainmark on Android!");

// Example of using device sensors
let acceleration = JSON.parse(readSensor("accelerometer"));
print("Acceleration: X=" + acceleration.x +
      ", Y=" + acceleration.y +
      ", Z=" + acceleration.z);

// Store data on the device
localStorage.setItem("lastRun", new Date().toString());
print("Last run: " + localStorage.getItem("lastRun"));

// Create a button that uses the camera
let button = document.createElement("button");
button.textContent = "Take Picture";
button.style.padding = "10px";
button.style.backgroundColor = "#4285f4";
button.style.color = "white";
button.style.border = "none";
button.style.borderRadius = "4px";
button.style.width = "100%";
button.style.marginTop = "10px";

button.addEventListener("click", function() {
  takePicture();
});

document.body.appendChild(button);
```

Edit this code and press Run to execute it!
"""
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        // Initialize UI components
        webView = findViewById(R.id.webView)
        editText = findViewById(R.id.editText)
        runButton = findViewById(R.id.runButton)
        saveButton = findViewById(R.id.saveButton)
        shareButton = findViewById(R.id.shareButton)
        loadButton = findViewById(R.id.loadButton)

        // Set up WebView
        webView.settings.javaScriptEnabled = true
        webView.addJavascriptInterface(PlainmarkInterface(), "Android")

        // Initialize with default content
        editText.setText(DEFAULT_CONTENT)

        // Set up button listeners
        runButton.setOnClickListener {
            executeCode()
        }

        saveButton.setOnClickListener {
            saveToFile()
        }

        shareButton.setOnClickListener {
            shareCode()
        }

        loadButton.setOnClickListener {
            openFileChooser()
        }

        // Load Plainmark interpreter
        loadInterpreter()
    }

    private fun loadInterpreter() {
        // Load the HTML/JS interpreter in the WebView
        val interpreterHtml = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body {
                        font-family: system-ui, -apple-system, sans-serif;
                        padding: 10px;
                        margin: 0;
                        background-color: #f8f9fa;
                    }
                    #output {
                        border: 1px solid #ddd;
                        border-radius: 4px;
                        padding: 10px;
                        background-color: white;
                        min-height: 100px;
                        white-space: pre-wrap;
                        font-family: monospace;
                    }
                    .error {
                        color: red;
                    }
                    .success {
                        color: green;
                    }
                </style>
            </head>
            <body>
                <div id="output">Plainmark output will appear here...</div>

                <script>
                    // Plainmark Interpreter
                    class PlainmarkInterpreter {
                        constructor() {
                            this.variables = {};
                            this.output = "";
                        }

                        extractCode(markdownText) {
                            const codeBlockRegex = /```plainmark\s*([\s\S]*?)\s*```/g;
                            let match;
                            let code = "";

                            while ((match = codeBlockRegex.exec(markdownText)) !== null) {
                                code += match[1] + "\n";
                            }

                            return code;
                        }

                        print(message) {
                            this.output += message + "\n";
                            return message;
                        }

                        execute(markdownText) {
                            this.output = "";
                            const code = this.extractCode(markdownText);

                            if (!code) {
                                return "No Plainmark code blocks found.";
                            }

                            // Create execution context
                            const context = {
                                print: (msg) => this.print(msg),
                                alert: (msg) => window.Android.showToast(msg),
                                takePicture: () => window.Android.takePicture(),
                                getLocation: () => window.Android.getLocation(),
                                readSensor: (type) => window.Android.readSensor(type),
                                localStorage: {
                                    getItem: (key) => window.Android.getStorageItem(key),
                                    setItem: (key, value) => window.Android.setStorageItem(key, value)
                                },
                                document: document
                            };

                            try {
                                // Process the code
                                let processedCode = code
                                    .replace(/let\s+(\w+)\s*=\s*/g, "window.$1 = ")
                                    .replace(/function\s+(\w+)\s*\(/g, "window.$1 = function(");

                                // Execute the code
                                const executeFunction = new Function(...Object.keys(context), processedCode);
                                executeFunction(...Object.values(context));

                                return this.output || "Code executed successfully (no output)";
                            } catch (error) {
                                return "Error: " + error.message;
                            }
                        }
                    }

                    // Initialize interpreter
                    const interpreter = new PlainmarkInterpreter();
                    const outputEl = document.getElementById('output');

                    // Execute function called from Android
                    window.executeCode = function(code) {
                        try {
                            const result = interpreter.execute(code);
                            outputEl.innerHTML = result;
                            return result;
                        } catch (error) {
                            outputEl.innerHTML = '<span class="error">Error: ' + error.message + '</span>';
                            return "Error: " + error.message;
                        }
                    };
                </script>
            </body>
            </html>
        """.trimIndent()

        webView.loadDataWithBaseURL(null, interpreterHtml, "text/html", "UTF-8", null)
    }

    private fun executeCode() {
        val code = editText.text.toString()
        webView.evaluateJavascript("executeCode(`${code.replace("`", "\\`")}`)") { result ->
            Log.d(TAG, "Execution result: $result")
        }
    }

    private fun saveToFile() {
        try {
            val fileName = "plainmark_${SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())}.md"
            val file = File(getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS), fileName)

            FileOutputStream(file).use {
                it.write(editText.text.toString().toByteArray())
            }

            Toast.makeText(this, "Saved to $fileName", Toast.LENGTH_SHORT).show()
        } catch (e: IOException) {
            Toast.makeText(this, "Error saving file: ${e.message}", Toast.LENGTH_SHORT).show()
        }
    }

    private fun shareCode() {
        val shareIntent = Intent().apply {
            action = Intent.ACTION_SEND
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, editText.text.toString())
        }
        startActivity(Intent.createChooser(shareIntent, "Share Plainmark Code"))
    }

    private fun openFileChooser() {
        val intent = Intent(Intent.ACTION_OPEN_DOCUMENT).apply {
            addCategory(Intent.CATEGORY_OPENABLE)
            type = "text/*"
        }
        startActivityForResult(intent, REQUEST_CODE_OPEN_FILE)
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)

        if (requestCode == REQUEST_CODE_OPEN_FILE && resultCode == RESULT_OK) {
            data?.data?.let { uri ->
                try {
                    contentResolver.openInputStream(uri)?.use { inputStream ->
                        val content = inputStream.bufferedReader().use { it.readText() }
                        editText.setText(content)
                    }
                } catch (e: IOException) {
                    Toast.makeText(this, "Error reading file: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        } else if (requestCode == REQUEST_IMAGE_CAPTURE && resultCode == RESULT_OK) {
            // Handle camera result
            Toast.makeText(this, "Image captured: $currentPhotoPath", Toast.LENGTH_SHORT).show()
            webView.evaluateJavascript("window.imageCaptured('$currentPhotoPath');", null)
        }
    }

    @Throws(IOException::class)
    private fun createImageFile(): File {
        val timeStamp = SimpleDateFormat("yyyyMMdd_HHmmss", Locale.getDefault()).format(Date())
        val storageDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
        return File.createTempFile(
            "JPEG_${timeStamp}_",
            ".jpg",
            storageDir
        ).apply {
            currentPhotoPath = absolutePath
        }
    }

    inner class PlainmarkInterface {
        @JavascriptInterface
        fun showToast(message: String) {
            runOnUiThread {
                Toast.makeText(this@MainActivity, message, Toast.LENGTH_SHORT).show()
            }
        }

        @JavascriptInterface
        fun takePicture() {
            Intent(MediaStore.ACTION_IMAGE_CAPTURE).also { takePictureIntent ->
                takePictureIntent.resolveActivity(packageManager)?.also {
                    val photoFile: File? = try {
                        createImageFile()
                    } catch (ex: IOException) {
                        null
                    }

                    photoFile?.also {
                        val photoURI: Uri = FileProvider.getUriForFile(
                            this@MainActivity,
                            "com.example.plainmark.fileprovider",
                            it
                        )
                        takePictureIntent.putExtra(MediaStore.EXTRA_OUTPUT, photoURI)
                        startActivityForResult(takePictureIntent, REQUEST_IMAGE_CAPTURE)
                    }
                }
            }
        }

        @JavascriptInterface
        fun getLocation(): String {
            // In a real app, implement proper location retrieval with permissions
            return "{\"latitude\": 0.0, \"longitude\": 0.0, \"accuracy\": 0.0}"
        }

        @JavascriptInterface
        fun readSensor(type: String): String {
            // Simplified sensor reading simulation
            return when(type) {
                "accelerometer" -> "{\"x\": 0.0, \"y\": 0.0, \"z\": 9.8}"
                "gyroscope" -> "{\"x\": 0.0, \"y\": 0.0, \"z\": 0.0}"
                "light" -> "{\"value\": 100.0}"
                else -> "{\"error\": \"Unknown sensor type\"}"
            }
        }

        @JavascriptInterface
        fun getStorageItem(key: String): String {
            val sharedPref = getSharedPreferences("PlainmarkStorage", MODE_PRIVATE)
            return sharedPref.getString(key, "") ?: ""
        }

        @JavascriptInterface
        fun setStorageItem(key: String, value: String) {
            val sharedPref = getSharedPreferences("PlainmarkStorage", MODE_PRIVATE)
            with(sharedPref.edit()) {
                putString(key, value)
                apply()
            }
        }