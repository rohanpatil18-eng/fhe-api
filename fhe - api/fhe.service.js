import SEAL from "node-seal";

let seal, context, encoder, encryptor, decryptor, evaluator, relinKeys;
let scale;

async function initSEAL() {
  try {
    seal = await SEAL();
    
    // CKKS scheme parameters - MINIMAL FOR DEMO (smallest ciphertext)
    const schemeType = seal.SchemeType.ckks;
    const polyModulusDegree = 2048; // Minimal size for smallest ciphertext
    const bitSizes = [30, 20]; // Minimal coefficients
    const bitSize = 20; // Small scale
    
    const parms = seal.EncryptionParameters(schemeType);
    parms.setPolyModulusDegree(polyModulusDegree);
    parms.setCoeffModulus(
      seal.CoeffModulus.Create(polyModulusDegree, Int32Array.from(bitSizes))
    );
    
    context = seal.Context(parms, true, seal.SecurityLevel.tc128);
    
    if (!context.parametersSet()) {
      throw new Error("SEAL context parameters not set correctly");
    }
    
    // Initialize encoder with context
    encoder = seal.CKKSEncoder(context);
    
    // Set scale
    scale = Math.pow(2, bitSize);
    
    // Generate keys
    const keyGenerator = seal.KeyGenerator(context);
    const publicKey = keyGenerator.createPublicKey();
    const secretKey = keyGenerator.secretKey();
    
    // Generate relinearization keys (needed for multiplication)
    relinKeys = keyGenerator.createRelinKeys();
    
    // Initialize encryptor, decryptor, and evaluator
    encryptor = seal.Encryptor(context, publicKey);
    decryptor = seal.Decryptor(context, secretKey);
    evaluator = seal.Evaluator(context);
    
    console.log("✅ FHE Ready (SEAL initialized successfully)");
    console.log(`📦 Poly Modulus Degree: ${polyModulusDegree} (minimal size)`);
  } catch (error) {
    console.error("❌ SEAL initialization failed:", error.message);
    throw error;
  }
}

// Initialize SEAL immediately
const ready = initSEAL();

// Encrypt a number
export const encrypt = async (value) => {
  await ready;
  
  const plainText = seal.PlainText();
  encoder.encode(Float64Array.from([value]), scale, plainText);
  
  const cipherText = seal.CipherText();
  encryptor.encrypt(plainText, cipherText);
  
  const serialized = cipherText.save();
  
  // Clean up
  plainText.delete();
  cipherText.delete();
  
  return serialized;
};

// Decrypt a number and return as integer
export const decrypt = async (cipherTextString) => {
  await ready;
  
  const cipherText = seal.CipherText();
  cipherText.load(context, cipherTextString);
  
  const plainText = seal.PlainText();
  decryptor.decrypt(cipherText, plainText);
  
  const decoded = encoder.decode(plainText);
  const result = Math.round(decoded[0]); // Round to nearest integer
  
  // Clean up
  cipherText.delete();
  plainText.delete();
  
  return result;
};

// Add two encrypted numbers
export const add = async (aEnc, bEnc) => {
  await ready;
  
  const cipherA = seal.CipherText();
  const cipherB = seal.CipherText();
  cipherA.load(context, aEnc);
  cipherB.load(context, bEnc);
  
  const resultCipher = seal.CipherText();
  evaluator.add(cipherA, cipherB, resultCipher);
  
  const serialized = resultCipher.save();
  
  // Clean up
  cipherA.delete();
  cipherB.delete();
  resultCipher.delete();
  
  return serialized;
};

// Multiply two encrypted numbers
export const multiply = async (aEnc, bEnc) => {
  await ready;
  
  const cipherA = seal.CipherText();
  const cipherB = seal.CipherText();
  cipherA.load(context, aEnc);
  cipherB.load(context, bEnc);
  
  const resultCipher = seal.CipherText();
  evaluator.multiply(cipherA, cipherB, resultCipher);
  
  // Relinearize to reduce ciphertext size
  evaluator.relinearize(resultCipher, relinKeys, resultCipher);
  
  // Rescale to manage noise
  evaluator.rescaleToNext(resultCipher, resultCipher);
  
  const serialized = resultCipher.save();
  
  // Clean up
  cipherA.delete();
  cipherB.delete();
  resultCipher.delete();
  
  return serialized;
};

// Utility: Get ciphertext size info
export const getCiphertextSize = async (cipherTextString) => {
  await ready;
  
  return {
    bytes: cipherTextString.length,
    kb: (cipherTextString.length / 1024).toFixed(2)
  };
};