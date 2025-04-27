# Plainmark Language Specification

Plainmark is a programming language embedded in Markdown that runs across multiple platforms.

## Basic Syntax

Plainmark code is written in Markdown code blocks with the `plainmark` language identifier:

```plainmark
// This is Plainmark code
print("Hello World");
```

## Core Language Features

### Variables and Data Types
```plainmark
let name = "John";  // String
let age = 30;       // Number
let isActive = true; // Boolean
let items = [1, 2, 3]; // Array
let person = {name: "John", age: 30}; // Object
```

### Control Flow
```plainmark
if (condition) {
  // code block
} else {
  // else code
}

for (let i = 0; i < 10; i++) {
  // loop code
}

while (condition) {
  // loop code
}
```

### Functions
```plainmark
function greet(name) {
  return "Hello, " + name;
}

// Arrow functions
const multiply = (a, b) => a * b;
```

### Modules and Imports
```plainmark
import { functionName } from "./otherFile.md";
export function publicFunction() { /* ... */ }
```

## Platform-Specific Features

### Browser-Specific
```plainmark
// DOM manipulation
document.querySelector("#myElement").innerHTML = "New content";

// Event handling
document.addEventListener("click", (e) => {
  console.log("Clicked at", e.clientX, e.clientY);
});
```

### Terminal/Python-Specific
```plainmark
// File system operations
fs.writeFile("output.txt", "Content", (err) => {
  if (err) print("Error writing file");
});

// Process handling
exec("ls -la", (output) => print(output));
```

### Mobile-Specific
```plainmark
// Device sensors
sensors.accelerometer.start((data) => {
  print(`X: ${data.x}, Y: ${data.y}, Z: ${data.z}`);
});

// Camera access
camera.takePicture((imagePath) => {
  print("Image saved at: " + imagePath);
});
```

## Special Markdown Integration

Plainmark provides special directives for interactive documentation:

### Interactive Examples
```plainmark
::: example
let result = 5 + 10;
print(result);
:::
```

### Data Visualization
```plainmark
::: chart
type: "bar",
data: [1, 5, 3, 7, 4]
:::
```

### UI Components
```plainmark
::: component Button
props: {
  text: "Click me",
  onClick: () => alert("Clicked!")
}
:::
```

## Standard Library

Plainmark includes a comprehensive standard library accessible across all platforms:

- `String` - String manipulation functions
- `Math` - Mathematical operations
- `Array` - Array methods
- `Object` - Object manipulation
- `Network` - HTTP requests
- `Storage` - Data persistence
- `Console` - Logging and debugging