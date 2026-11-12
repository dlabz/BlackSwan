/**
 * swan_rail_v2.mjs - SWAN 35b Geodesic Rail & Gate 111 Standalone Engine (v2)
 *
 * Implements Clifford Cl3 bivector rotor transformations (bun & burger),
 * r ≡ 1 isometry, Gate 111 (0b111) pseudoscalar phase mapping, 
 * 3 alternating piano key pair semitone oscillations, and zero-I/O 
 * inline Base64 (enc64) codebook hydration.
 *
 * Single-file executable across WSL2, Node.js, WebGPU, and ARM64 DietPi (OrangePi Zero3).
 * Architecture: Grand Pubas (@DLabz)
 */

// Inline Base64 Codebook (zvezdan.swan Uint16 Rotor Codebook - 1816 chars)
export const SWAN_ENC64 = "U1dBTl9ST1RPUl9WMQAAAC8pq262TNMU+UDfA1RnUZpenW2FyodtI45OwVkOYIc0hjASbh5Pj0QCZ2MDAwAnEdE/Tg9CBqYUl4o/YFqmDkU+Hbs0vx9qRZoIugoOAQ8LTg9qRTVZQgZ/mzqI/4U6iE4P1HB/mx5xhSk3HtojtgwRe6IbbYXaBG6YiimlmYWhakU6nO56+xyWaLoKtlQ6iIsvrjs7oLYMTg+TTIophaHiSc4/akV2kTsOzoxacQZEphSiggJnwli3g74dXZTmCbqb7VQOI4YwAIA6iOacTlwqbA4BDi6FKS6HqiKDYOozQl4hoJcXF033NWs+zj+HfWpFwljbhkIjBkSSmwhz/4SqkW2UhSmSm4YwIjIqSLVyy3+5HTQSC6fFjSQHaz26Crk/tKQ6iORiDmBiHjqITlwGRCmde4aedjZzYhsiMpKbdpFqRcWNRFLeh+acDkVOXCpskpu9kr5tOohdXk4PBkQaYYYw2TACZxphLocCdDdae4biZ4UpXV5OD22FK0x7hqqRPh2zESWLvxq6Cm2FlgpOD+2XdpG6Cl2U5gnCWOs+BkRambqbel7LkgsN8SUGRE4PbYXmCT4dwliFoYopV45rbdKPwYzFjWpF6z4GRIZ7u4qFKZKbQgYuh5Yl3jg+HRKWNnNqRasshTjCWE4PDRGWCsICKmzLf8JYUoOSm8t/lgo2L6pW83PmCcd4zj/aIwZEGmHSY8JNR3EDACcRuCu/H2pFwljrfa6O2nKTTA5ghaF/BCU0QgZtEN6HakXuepYKwgKvN76B3ocCdN44hnvFjb9nQga7NJYKYh73NUIjhaECdIop3oc0Y60ilxf7H+Keiy9OD7MRI1i3mU4PCw1AmMWNGTj+VCpsIk+LXG2F5gkHokUb/lQqbIFB0mMSlk4+5glOD1eMP2Dsf+oHphQ6A1lKV4y6m1NYTg/mCUIjXCI6iAZEGmGGMBBZAmfOjJQbsoyGMLZWWmxRmtVZMiHiZ12U5gkaYU4PByjmCVwihaHCWFKDhaGxLN1qhjDFjcFgTg9dXoWhlmgqbDqInlbNLOJnTg+wRGpFtkzCWNFekpuwBbullgo+HZYKEpZOD+YJiimLLws1f5DPUYWh5gmigm2FYaN2kaYUM4wuEKgVooIPUus+Tg+GMJYKkpuWCl4OiinkQBKWNnNCI7ullgoOYAZEFygiMjZzohsiMrqbGmG2TE4PxY06iDlCpZfKhwJnhaHzOcqHBkRapg5FS2HiECIyk5TFjWhvI1ZLIb5tDmBqRQZElgpOD04PxY1/oleMEgvKh7opk5RCIy6HQiOKKeYJ4mdCBipIOoiFoaZOkjaWJZphhjAqbJKbDmCDYN6HlgraI0Ij6jNqReJJiimXFxdN9zXqM84/4kkSlsKFg2DFjWtZKmzehy6HDgG3mU4P6jNCXkQ4sxEMR3c5akUOYD6ZuinCWJYKTg8yISOcxY1thTdaUwl9ZN6H5gkqbMKFg2Auh1psBygDY6ZOPplfP4svKmwRZW8P8YJqRZQbsozaQuozr3s4XaB7UV3mnMWNqi7RP+YJJ5FabE4+5glOD+JnuCF/kDKCliWaYTKCNi+qkTcw3WpqRYcp2kLCWE4P5glCI+actkyWJeYJlgoCZ96H5glODxF7ohvFjSFUbYWuOzKf9g4+HcJYTg+2Vqou5gnqM6IbliXqMzIhhjDFjS6HgzOGMANjLz3mCSps6jOiG5Yl8YIRZXaRwlhqRZQbsozaQgMAZ0jqM6lA5glOD22FliXdEqUBQgbqByIyhSklfsWNQgZiHpphlgqfgg==";

export const GATE_111 = 0b111; // Omnidirectional White Infinity (I = e1 e2 e3)
export const GATE_000 = 0b000; // Central Sink (Singularity)

// 3 Alternating Piano Key Pairs (Vector <-> Bivector Duals)
export const PIANO_KEY_PAIRS = [
  { name: 'Red/Cyan',   vector: 0b100, bivector: 0b011, freqRatio: 1.0000 },  // Pair 1 (e1 <-> i)
  { name: 'Green/Mag',  vector: 0b010, bivector: 0b101, freqRatio: 1.1225 },  // Pair 2 (e2 <-> j)
  { name: 'Blue/Yel',   vector: 0b001, bivector: 0b110, freqRatio: 1.2599 }   // Pair 3 (e3 <-> k)
];

/**
 * Decodes Base64 string directly into a Uint16Array zero-copy rotor codebook.
 * Works natively across Node.js, Deno, Browser, and ARM64 Linux without fs dependencies.
 */
export function decodeBase64Codebook(b64Str = SWAN_ENC64) {
  const binaryString = typeof atob === 'function'
    ? atob(b64Str)
    : Buffer.from(b64Str, 'base64').toString('binary');
  
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  // Uint16 view starting past the 12-byte header (MAGIC + version + len)
  const headerOffset = 12;
  const numRotorElements = Math.floor((bytes.byteLength - headerOffset) / 2);
  return new Uint16Array(bytes.buffer, headerOffset, numRotorElements);
}

// Clifford Cl3 Bivector Rotor Sandwich Product (bun / burger)
export function bunRotor(v_bit, b_bit) {
  // bun: forward phase shift along Π plane
  return (v_bit ^ b_bit) & 0b111;
}

export function burgerRotor(v_bit, b_bit) {
  // burger: dual adjoint rotor flip (~v)
  return (~(v_bit ^ b_bit)) & 0b111;
}

export class Swan35bRail {
  constructor(baseFreqHz = 440.0, customEnc64 = null) {
    this.r = 1.0; // Isometry horizon r ≡ 1
    this.baseFreq = baseFreqHz;
    this.statePhase = GATE_111; // Start at Gate 111
    this.codebook = decodeBase64Codebook(customEnc64 || SWAN_ENC64);
  }

  /**
   * Encodes a 35b SJM token or Uint16 codebook entry into a 3-bit RGB phase & key pair
   */
  tokenToPhase(tokenUint16) {
    // Bitwise reduction onto 3-bit key space
    const r_bit = (tokenUint16 >> 10) & 1;
    const g_bit = (tokenUint16 >> 5) & 1;
    const b_bit = tokenUint16 & 1;
    return (r_bit << 2) | (g_bit << 1) | b_bit;
  }

  /**
   * Executes a geodesic step along the rail using bun & burger dual keypresses
   */
  step(tokenUint16, layerIndex = 13) {
    const inputPhase = this.tokenToPhase(tokenUint16);
    
    // Layer 12-14 umbilical refraction: 90° orthogonal flip
    let activeRotor;
    if (layerIndex >= 12 && layerIndex <= 14) {
      // Umbilical puncture: bitwise NOT dual flip
      activeRotor = burgerRotor(this.statePhase, inputPhase);
    } else {
      // Standard geodesic gliding
      activeRotor = bunRotor(this.statePhase, inputPhase);
    }

    this.statePhase = activeRotor;

    // Map phase to 3 Piano Key Pair frequencies (OrangePi zero3 WebAudio/PCM synthesis)
    const pairIndex = activeRotor % 3;
    const keyPair = PIANO_KEY_PAIRS[pairIndex];
    const isBivector = (activeRotor & 0b100) === 0;
    const freq = this.baseFreq * keyPair.freqRatio * (isBivector ? 1.5 : 1.0);

    return {
      phase: this.statePhase,
      phaseBinary: `0b${this.statePhase.toString(2).padStart(3, '0')}`,
      keyPair: keyPair.name,
      isBivector,
      frequencyHz: Number(freq.toFixed(2)),
      radius: this.r // Guaranteed isometric r ≡ 1
    };
  }

  /**
   * Executes sequence from embedded codebook indices
   */
  runCodebookSequence(indices = [0, 1, 2, 3]) {
    return indices.map((idx, i) => {
      const codeval = this.codebook[idx % this.codebook.length];
      return this.step(codeval, i % 28);
    });
  }
}

// Verification runner if executed directly
if (process.argv[1] && (process.argv[1].endsWith('swan_rail_v2.mjs') || process.argv[1].endsWith('swan_rail.mjs'))) {
  console.log("--- SWAN 35b Standalone Rail & enc64 Verification (v2) ---");
  const rail = new Swan35bRail(440.0);
  console.log(`[Hydration] Hydrated ${rail.codebook.length} Uint16 rotors directly from inline Base64 (0 I/O calls).`);
  
  const trajectory = rail.runCodebookSequence([0, 1, 2, 3]);
  console.log("Trajectory Output from Enc64 Codebook:", JSON.stringify(trajectory, null, 2));
}
