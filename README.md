
# Alpine CountUp Plugin

A lightweight **Alpine.js directive plugin** that animates numbers counting up when they come into view, using `IntersectionObserver`.  
It supports customizable start and end values, duration, easing, prefixes, suffixes, decimals, and tolerance for early triggering.

## Features
- Counts from `0` to a target number or from a custom `start` to `end`
- Starts only when the element enters the viewport
- Supports **easing** for smooth animations
- Prefix and suffix support (for currency, percentages, etc.)
- Decimals for fractional values
- Tolerance for early start before the element fully appears

---

## Installation

```bash
npm install @designbycode/apline-countup
````

Include Alpine.js and the CountUp plugin:

```javascript
import Alpine from 'alpinejs'
import AlpineCountUp from '@designbycode/alpine-countup.js'

Alpine.plugin(AlpineCountUp)
Alpine.start()
```

Or via a `<script>` tag (with ES modules):

```html
<script type="module">
    import Alpine from 'https://unpkg.com/alpinejs@1.x.x/dist/module.esm.js'
    import AlpineCountUp from '@designbycode/alpine-countup.js'

    Alpine.plugin(AlpineCountUp)
    Alpine.start()
</script>
```

---

## Usage

### Basic Example

```html
<div x-data>
    <span x-countup="{ end: 1000 }"></span>
</div>
```

Starts counting from `0` to `1000` when in view.

---

### Start and End Values

```html
<div x-data>
    <span x-countup="{ start: 500, end: 1500, duration: 3000 }"></span>
</div>
```

Counts from **500** to **1500** over **3 seconds**.

---

### With Prefix and Suffix

```html
<div x-data>
    <span x-countup="{ end: 200, prefix: '$' }"></span>
    <br>
    <span x-countup="{ end: 99, suffix: '%' }"></span>
</div>
```

* `$200`
* `99%`

---

### With Decimals

```html
<div x-data>
    <span x-countup="{ end: 3.14159, decimals: 3 }"></span>
</div>
```

Displays: `3.142`

---

### With Tolerance

```html
<div x-data>
    <span x-countup="{ end: 1000, tolerance: 100 }"></span>
</div>
```

Starts counting **100px before** the element fully enters the viewport.

---

### Combined Example

```html
<div x-data>
    <span x-countup="{ 
        start: 50, 
        end: 500, 
        duration: 2500, 
        prefix: '$', 
        suffix: ' USD', 
        decimals: 2, 
        tolerance: 150 
    }"></span>
</div>
```

Counts from `$50.00` to `$500.00 USD` over **2.5 seconds**, starting **150px early**.

---

## Options

| Option      | Type   | Default | Description                                        |
| ----------- | ------ | ------- | -------------------------------------------------- |
| `start`     | number | `0`     | Starting value of the counter                      |
| `end`       | number | `0`     | Target value of the counter                        |
| `duration`  | number | `2000`  | Duration in milliseconds                           |
| `decimals`  | number | `0`     | Number of decimal places                           |
| `prefix`    | string | `""`    | Text to display before the number                  |
| `suffix`    | string | `""`    | Text to display after the number                   |
| `tolerance` | number | `0`     | Pixel offset to trigger early (positive = earlier) |

---

## How it Works

* Uses `IntersectionObserver` to detect when the element comes into view
* Supports `rootMargin` to allow tolerance-based early triggering
* Animates with `requestAnimationFrame` for smooth transitions
* Use an ease-out cubic function to slow down at the end

---

## License

MIT License
