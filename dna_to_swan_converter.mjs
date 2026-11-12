// dna_to_swan_converter.mjs — FASTA/FASTQ DNA Genomic Sequence to SWAN Bivector Rotor Converter
// Pure Node.js ES Module — Zero Dependencies

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

// 2-bit Nucleotide Topological Mapping
const NUCLEOTIDE_MAP = {
  'A': 0b00, // Purine / Weak (2 H-bonds)
  'a': 0b00,
  'C': 0b01, // Pyrimidine / Strong (3 H-bonds)
  'c': 0b01,
  'G': 0b10, // Purine / Strong (3 H-bonds)
  'g': 0b10,
  'T': 0b11, // Pyrimidine / Weak (2 H-bonds)
  't': 0b11,
  'U': 0b11, // RNA Uracil equivalent
  'u': 0b11
};

export function parseFastaOrFastq(content) {
  const lines = content.split(/\r?\n/);
  let sequence = '';
  let header = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    if (line.startsWith('>') || line.startsWith('@')) {
      if (!header) header = line.substring(1);
      if (line.startsWith('@')) {
        sequence += lines[i + 1] ? lines[i + 1].trim() : '';
        i += 3; // Skip sequence, '+', quality
      }
    } else if (!line.startsWith('+')) {
      sequence += line;
    }
  }
  return { header, sequence };
}

export function encodeDnaToSwan(sequence) {
  const cleanSeq = sequence.replace(/[^ACGTUacgtu]/g, '');
  const rotors = [];
  
  // Triplet codons (6 bits) + Reading Frame (2 bits) + Bivector Generator (8 bits) = 16-bit Uint16
  for (let i = 0; i <= cleanSeq.length - 3; i += 3) {
    const b0 = NUCLEOTIDE_MAP[cleanSeq[i]] ?? 0;
    const b1 = NUCLEOTIDE_MAP[cleanSeq[i + 1]] ?? 0;
    const b2 = NUCLEOTIDE_MAP[cleanSeq[i + 2]] ?? 0;

    const codonIndex = (b0 << 4) | (b1 << 2) | b2; // 6-bit index (0..63)
    const frame = Math.floor(i / 3) % 4;             // 2-bit frame phase
    const bivectorPair = (codonIndex * 3 + frame) & 0xFF; // 8-bit generator

    // Uint16 rotor encoding: 6-bit codon | 2-bit frame | 8-bit bivector
    const packedRotor = (codonIndex << 10) | (frame << 8) | bivectorPair;
    rotors.push(packedRotor);
  }

  const headerBuf = Buffer.from("SWAN_GENOMIC_V1\n");
  const dataBuf = Buffer.from(new Uint16Array(rotors).buffer);
  return Buffer.concat([headerBuf, dataBuf]);
}

// CLI Handler
const inputPath = process.argv[2];
if (inputPath) {
  const absPath = resolve(inputPath);
  if (!existsSync(absPath)) {
    console.error(`File not found: ${absPath}`);
    process.exit(1);
  }
  const content = readFileSync(absPath, 'utf8');
  const { header, sequence } = parseFastaOrFastq(content);
  const swanBuffer = encodeDnaToSwan(sequence);
  const outputPath = absPath.replace(/\.(fasta|fa|fastq|fq|txt)$/i, '') + '_genomic.swan';
  writeFileSync(outputPath, swanBuffer);
  console.log(`--- SWAN DNA Genomic Rotor Converter ---`);
  console.log(`[Header]   ${header || 'Raw DNA Stream'}`);
  console.log(`[Sequence] ${sequence.length} nucleotides encoded into ${swanBuffer.length - 16} bytes (${rotorsLength(swanBuffer)} rotors)`);
  console.log(`[Output]   ${outputPath}`);
}

function rotorsLength(buf) {
  return (buf.length - 16) / 2;
}
