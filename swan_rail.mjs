/**
 * swan_rail.mjs - SWAN 35b Geodesic Rail & Gate 111 Harmonic Phase Engine
 *
 * Implements Clifford Cl3 bivector rotor transformations (bun & burger),
 * r ≡ 1 isometry, Gate 111 (0b111) pseudoscalar phase mapping, and 
 * 3 alternating piano key pair semitone oscillations for 35b token trajectories.
 *
 * Architecture: Grand Pubas (@DLabz)
 */

export const GATE_111 = 0b111; // Omnidirectional White Infinity (I = e1 e2 e3)
export const GATE_000 = 0b000; // Central Sink (Singularity)

// 3 Alternating Piano Key Pairs (Vector <-> Bivector Duals)
export const PIANO_KEY_PAIRS = [
  { name: 'Red/Cyan',   vector: 0b100, bivector: 0b011, freqRatio: 1.0000 },  // Pair 1 (e1 <-> i)
  { name: 'Green/Mag',  vector: 0b010, bivector: 0b101, freqRatio: 1.1225 },  // Pair 2 (e2 <-> j)
  { name: 'Blue/Yel',   vector: 0b001, bivector: 0b110, freqRatio: 1.2599 }   // Pair 3 (e3 <-> k)
];

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
  constructor(baseFreqHz = 440.0) {
    this.r = 1.0; // Isometry horizon r ≡ 1
    this.baseFreq = baseFreqHz;
    this.statePhase = GATE_111; // Start at Gate 111
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
   * Traverses a full 35b token sequence along S3/S4
   */
  traverseSequence(tokens) {
    return tokens.map((t, idx) => this.step(t, idx % 28));
  }
}

// Verification runner if executed directly
if (process.argv[1] && process.argv[1].endsWith('swan_rail.mjs')) {
  console.log("--- SWAN 35b Rail & Gate 111 Verification ---");
  const rail = new Swan35bRail(440.0);
  const testTokens = [0b10000000000, 0b01000000000, 0b00000000001, 0b11111111111];
  const trajectory = rail.traverseSequence(testTokens);
  console.log("Trajectory Output:", JSON.stringify(trajectory, null, 2));
}
