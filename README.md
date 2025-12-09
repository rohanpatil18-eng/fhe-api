📌 FHE API — Fully Homomorphic Encryption Demo (CKKS + Node.js)

This project is a minimal Fully Homomorphic Encryption (FHE) API built using:

Node.js (Express)

Microsoft SEAL via node-seal

CKKS scheme for encrypted floating-point computation

It demonstrates end-to-end encryption flow:

Initialize CKKS encryption scheme

Encrypt data on the client

Send encrypted data to the server

Perform server-side computation on ciphertexts

Return encrypted results

Decrypt back on the client

This project is ideal for learning, demos, and educational purposes.

🚀 Features

🔐 CKKS Encryption (supports decimals)

🔒 Encrypt & Decrypt API

➕ Server-side computation on ciphertext

🧮 Homomorphic operations (add, multiply, scale)

🧱 Minimal poly modulus for smallest ciphertext size (demo-optimized)

📡 Simple REST API with JSON input/output

📂 Project Structure
fhe-api/
│── server.js
│── package.json
│── package-lock.json
│── .gitignore
└── README.md

🛠️ Technologies Used
Technology	Purpose
Node.js	Server runtime
Express.js	API framework
node-seal	FHE library (Microsoft SEAL wrapper)
CKKS scheme	Floating-point homomorphic encryption
ES Modules	Modern JS import/export
📦 Installation
git clone https://github.com/rohanpatil18-eng/fhe-api.git
cd fhe-api
npm install

▶️ Start the Server
node server.js


Server will run at:

http://localhost:3000

🔧 API Endpoints
1️⃣ Initialize SEAL

Initializes CKKS parameters, keys, and scale.

GET /init


Response:

{
  "message": "SEAL initialized"
}

2️⃣ Encrypt a Number
POST /encrypt


Body:

{ "value": 25.5 }


Response:

{
  "ciphertext": "BASE64_STRING"
}

3️⃣ Compute Sum (Homomorphic Addition)
POST /compute/add


Body:

{
  "c1": "BASE64_STRING",
  "c2": "BASE64_STRING"
}


Response:

{
  "ciphertext": "ENCRYPTED_SUM"
}

4️⃣ Decrypt Result
POST /decrypt


Body:

{
  "cipher": "BASE64_STRING"
}


Response:

{
  "value": 50.123
}

🧠 How FHE Works Here (Simple Explanation)

CKKS encodes numbers as vectors

Values are encrypted using user's public key

Server cannot decrypt, but can still compute

Encrypted results are returned

Client decrypts using secret key

This ensures complete privacy — the server never sees raw data.

⚠️ Important Notes

CKKS supports approximate results → expect small decimal errors

Poly modulus degree set to 2048 → minimal size (demo only, not production)

Not recommended for real security applications

Only works for floating point data, not strings/integers directly

📜 Scripts
npm start   → node server.js

🧑‍💻 Author

Rohan Patil

GitHub: https://github.com/rohanpatil18-eng0
