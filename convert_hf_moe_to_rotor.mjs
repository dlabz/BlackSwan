// convert_hf_moe_to_rotor.mjs - 100% Zero-Dependency Node.js MoE Rotor Converter
import fs from 'node:fs';

console.log("--- SWAN HF / Grok MoE Weight-to-Rotor Converter (Pure JS / Node.js) ---");

function createDummyMoERotorCodebook() {
    const numExperts = 8;
    const rotorsPerExpert = 337;
    const buffer = new Uint16Array(numExperts * rotorsPerExpert);

    for (let i = 0; i < buffer.length; i++) {
        // Encode synthetic 16-bit Clifford planar rotor angles
        buffer[i] = (Math.sin(i * 0.05) * 32767 + 32768) & 0xFFFF;
    }

    const outPath = '/workspace/scratch/grok_expert_bivector.swan';
    fs.writeFileSync(outPath, Buffer.from(buffer.buffer));
    console.log(`[SWAN JS Converter] Exported ${buffer.length} Clifford rotors -> ${outPath} (${buffer.byteLength} bytes)`);
}

createDummyMoERotorCodebook();
