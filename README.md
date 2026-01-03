# Classical Cipher Toolkit

A web application for encrypting and decrypting text using classical cryptographic ciphers. Built with Next.js, React, and TypeScript, this toolkit provides an intuitive interface for experimenting with various historical encryption methods.

## Features

- **Caesar Cipher**: Simple substitution cipher with shift-based encryption
- **Affine Cipher**: Linear transformation cipher using modular arithmetic
- **Playfair Cipher**: Digraph substitution cipher using a 5×5 key square
- **Hill Cipher**: Matrix-based polygraphic substitution cipher
- **Hill Known Plaintext Attack**: Key recovery tool for Hill cipher cryptanalysis

## Prerequisites

This application requires **Node.js** (version 18 or higher) and **npm** (Node Package Manager). npm is included with Node.js.

### Installing Node.js

#### Windows

1. Visit [nodejs.org](http://nodejs.org/en/download)
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer (`.msi` file)
4. Follow the installation wizard (accept defaults)
5. Verify installation by opening **Command Prompt** or **PowerShell** and running:
   ```bash
   node --version
   npm --version
   ```

#### macOS

**Option 1: Official Installer**

1. Visit [nodejs.org](https://nodejs.org/)
2. Download the **LTS** version for macOS
3. Open the `.pkg` file and follow the installation wizard
4. Verify installation by opening **Terminal** and running:
   ```bash
   node --version
   npm --version
   ```

**Option 2: Using Homebrew** (if you have Homebrew installed)

```bash
brew install node
```

#### Linux

**Ubuntu/Debian:**

```bash
# Update package index
sudo apt update

# Install Node.js and npm
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

**Fedora/RHEL/CentOS:**

```bash
# Install Node.js and npm
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

**Arch Linux:**

```bash
# Install Node.js and npm
sudo pacman -S nodejs npm

# Verify installation
node --version
npm --version
```

**Note:** If your Linux distribution's package manager provides an outdated version, you can use [NodeSource](https://github.com/nodesource/distributions) to install the latest LTS version.

## Installation

1. **Clone or download this repository**

   ```bash
   git clone <repository-url>
   cd cryptography-project
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

   This will install all required packages listed in `package.json`.

## Running the Application

### Development Mode

Start the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

Open your web browser and navigate to this URL. The page will automatically reload when you make changes to the code.

### Production Build

To create an optimized production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Cipher Descriptions

### Caesar Cipher

A simple substitution cipher where each letter in the plaintext is shifted a certain number of places down the alphabet. This cipher preserves case and leaves non-alphabetic characters unchanged.

**Key:** A single integer representing the shift value

### Affine Cipher

A type of monoalphabetic substitution cipher that combines two mathematical operations: multiplication and addition. Each letter is encrypted using the formula `E(x) = (a*x + b) mod 26`, where `a` must be coprime with 26 (i.e., gcd(a, 26) = 1).

**Key:** Two integers `a` and `b`, where `a` must be coprime with 26 (valid values: 1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25)

### Playfair Cipher

A digraph substitution cipher that encrypts pairs of letters (digraphs) instead of single letters. It uses a 5×5 key square constructed from a keyword, with 'J' merged into 'I'. The cipher applies three rules based on the positions of letter pairs in the square: same row (shift right), same column (shift down), or rectangle (swap corners).

**Key:** A keyword used to construct the 5×5 key square

### Hill Cipher

A polygraphic substitution cipher based on linear algebra. It encrypts blocks of letters (digraphs for a 2×2 matrix) using matrix multiplication modulo 26. The key is a 2×2 invertible matrix (determinant must be coprime with 26).

**Key:** A 2×2 matrix (can be entered as 4 numbers or 4 letters) with an invertible determinant modulo 26

### Hill Known Plaintext Attack (KPA)

A cryptanalysis tool that recovers the Hill cipher key when you have both a known plaintext and its corresponding ciphertext. The tool requires at least 4 letters (2 digraphs) of aligned plaintext and ciphertext.

**Input:** Known plaintext and corresponding ciphertext (must be aligned and have equal, even length after removing non-letters)

## Technology Stack

- **Next.js 16.1.1**: React framework for production
- **React 19.2.3**: UI library
- **TypeScript 5**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn**: UI component library

## License

This project is open source and available for educational purposes.
