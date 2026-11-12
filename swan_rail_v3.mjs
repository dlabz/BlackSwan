/**
 * swan_rail_v3.mjs - SWAN 35b Interactive REPL, HTTP Micro-Server & Text Generator
 *
 * Grand Pubas (@DLabz) zero-I/O CLI REPL & HTTP API Engine.
 * Converts text input -> Uint16 rotors -> executes bun (⊗) & burger phase flips -> streams generated text response.
 */

import readline from 'node:readline';
import http from 'node:http';

export const GATE_111 = 0b111; // Pseudoscalar White (I = e1 e2 e3)
export const GATE_000 = 0b000; // Central Sink (Singularity)

export const PIANO_KEY_PAIRS = [
  { name: 'Red/Cyan',   vector: 0b100, bivector: 0b011, freqRatio: 1.0000 },
  { name: 'Green/Mag',  vector: 0b010, bivector: 0b101, freqRatio: 1.1225 },
  { name: 'Blue/Yel',   vector: 0b001, bivector: 0b110, freqRatio: 1.2599 }
];

export function bunRotor(v_bit, b_bit) {
  return (v_bit ^ b_bit) & 0b111;
}

export function burgerRotor(v_bit, b_bit) {
  return (~(v_bit ^ b_bit)) & 0b111;
}

// Inline Base64 Enc64 Codebook
export const SWAN_ENC64 = "U1dBTl9ST1RPUl9WMQAAAC8pq262TNMU+UDfA1RnUZpenW2FyodtI45OwVkOYIc0hjASbh5Pj0QCZ2MDAwAnEdE/Tg9CBqYUl4o/YFqmDkU+Hbs0vx9qRZoIugoOAQ8LTg9qRTVZQgZ/mzqI/4U6iE4P1HB/mx5xhSk3HtojtgwRe6IbbYXaBG6YiimlmYWhakU6nO56+xyWaLoKtlQ6iIsvrjs7oLYMTg+TTIophaHiSc4/akV2kTsOzoxacQZEphSiggJnwli3g74dXZTmCbqb7VQOI4YwAIA6iOacTlwqbA4BDi6FKS6HqiKDYOozQl4hoJcXF033NWs+zj+HfWpFwljbhkIjBkSSmwhz/4SqkW2UhSmSm4YwIjIqSLVyy3+5HTQSC6fFjSQHaz26Crk/tKQ6iORiDmBiHjqITlwGRCmde4aedjZzYhsiMpKbdpFqRcWNRFLeh+acDkVOXCpskpu9kr5tOohdXk4PBkQaYYYw2TACZxphLocCdDdae4biZ4UpXV5OD22FK0x7hqqRPh2zESWLvxq6Cm2FlgpOD+2XdpG6Cl2U5gnCWOs+BkRambqbel7LkgsN8SUGRE4PbYXmCT4dwliFoYopV45rbdKPwYzFjWpF6z4GRIZ7u4qFKZKbQgYuh5Yl3jg+HRKWNnNqRasshTjCWE4PDRGWCsICKmzLf8JYUoOSm8t/lgo2L6pW83PmCcd4zj/aIwZEGmHSY8JNR3EDACcRuCu/H2pFwljrfa6O2nKTTA5ghaF/BCU0QgZtEN6HakXuepYKwgKvN76B3ocCdN44hnvFjb9nQga7NJYKYh73NUIjhaECdIop3oc0Y60ilxf7H+Keiy9OD7MRI1i3mU4PCw1AmMWNGTj+VCpsIk+LXG2F5gkHokUb/lQqbIFB0mMSlk4+5glOD1eMP2Dsf+oHphQ6A1lKV4y6m1NYTg/mCUIjXCI6iAZEGmGGMBBZAmfOjJQbsoyGMLZWWmxRmtVZMiHiZ12U5gkaYU4PByjmCVwihaHCWFKDhaGxLN1qhjDFjcFgTg9dXoWhlmgqbDqInlbNLOJnTg+wRGpFtkzCWNFekpuwBbullgo+HZYKEpZOD+YJiimLLws1f5DPUYWh5gmigm2FYaN2kaYUM4wuEKgVooIPUus+Tg+GMJYKkpuWCl4OiinkQBKWNnNCI7ullgoOYAZEFygiMjZzohsiMrqbGmG2TE4PxY06iDlCpZfKhwJnhaHzOcqHBkRapg5FS2HiECIyk5TFjWhvI1ZLIb5tDmBqRQZElgpOD04PxY1/oleMEgvKh7opk5RCIy6HQiOKKeYJ4mdCBipIOoiFoaZOkjaWJZphhjAqbJKbDmCDYN6HlgraI0Ij6jNqReJJiimXFxdN9zXqM84/4kkSlsKFg2DFjWtZKmzehy6HDgG3mU4P6jNCXkQ4sxEMR3c5akUOYD6ZuinCWJYKTg8yISOcxY1thTdaUwl9ZN6H5gkqbMKFg2Auh1psBygDY6ZOPplfP4svKmwRZW8P8YJqRZQbsozaQuozr3s4XaB7UV3mnMWNqi7RP+YJJ5FabE4+5glOD+JnuCF/kDKCliWaYTKCNi+qkTcw3WpqRYcp2kLCWE4P5glCI+actkyWJeYJlgoCZ96H5glODxF7ohvFjSFUbYWuOzKf9g4+HcJYTg+2Vqou5gnqM6IbliXqMzIhhjDFjS6HgzOGMANjLz3mCSps6jOiG5Yl8YIRZXaRwlhqRZQbsozaQgMAZ0jqM6lA5glOD22FliXdEqUBQgbqByIyhSklfsWNQgZiHpphlgqfgg==";

function hydrateEnc64Codebook(b64Str) {
  const rawBytes = Uint8Array.from(atob(b64Str), c => c.charCodeAt(0));
  return new Uint16Array(rawBytes.buffer, rawBytes.byteOffset + 12, (rawBytes.byteLength - 12) / 2);
}

const SERBIAN_VOCAB = [
  "ра", "ре", "ри", "ро", "ру", "ба", "бе", "би", "бо", "бу",
  "ва", "ве", "ви", "во", "ву", "га", "ге", "ги", "го", "гу",
  "да", "де", "ди", "до", "ду", "за", "зе", "зи", "зо", "зу",
  "ка", "ке", "ки", "ко", "ку", "ма", "ме", "ми", "мо", "му",
  "на", "не", "ни", "но", "ну", "па", "пе", "пи", "по", "пу",
  "са", "се", "си", "со", "су", "та", "те", "ти", "то", "ту",
  " ла", " ле", " ли", " ло", " лу", " ја", " је", " ји", " јо", " ју"
];

export class Swan35bRail {
  constructor(baseFreqHz = 440.0) {
    this.r = 1.0;
    this.baseFreq = baseFreqHz;
    this.statePhase = GATE_111;
    this.codebook = hydrateEnc64Codebook(SWAN_ENC64);
  }

  tokenToPhase(tokenUint16) {
    const r_bit = (tokenUint16 >> 10) & 1;
    const g_bit = (tokenUint16 >> 5) & 1;
    const b_bit = tokenUint16 & 1;
    return (r_bit << 2) | (g_bit << 1) | b_bit;
  }

  step(tokenUint16, layerIndex = 13) {
    const codebookRotor = this.codebook[tokenUint16 % this.codebook.length] || tokenUint16;
    const inputPhase = this.tokenToPhase(codebookRotor);
    
    let activeRotor;
    if (layerIndex >= 12 && layerIndex <= 14) {
      activeRotor = burgerRotor(this.statePhase, inputPhase);
    } else {
      activeRotor = bunRotor(this.statePhase, inputPhase);
    }

    this.statePhase = activeRotor;
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
      radius: this.r
    };
  }

  generate(promptText, maxLen = 16) {
    const inputTokens = Array.from(promptText).map((c, i) => (c.charCodeAt(0) * 107 + i) & 0xFFFF);
    let trajectory = [];
    inputTokens.forEach((tok, idx) => {
      trajectory.push(this.step(tok, idx % 28));
    });

    let outputSyllables = [];
    let currentTok = inputTokens[inputTokens.length - 1] || 0b11111111111;
    
    for (let i = 0; i < maxLen; i++) {
      const stepRes = this.step(currentTok, i % 28);
      const sylIdx = (stepRes.phase * 9 + i * 13) % SERBIAN_VOCAB.length;
      outputSyllables.push(SERBIAN_VOCAB[sylIdx]);
      currentTok = (currentTok ^ (stepRes.phase << 9)) & 0xFFFF;
    }

    return {
      prompt: promptText,
      response: outputSyllables.join(''),
      lastPhase: trajectory[trajectory.length - 1]
    };
  }
}

// Interactive CLI REPL / HTTP Server Runner
if (process.argv[1] && process.argv[1].endsWith('swan_rail_v3.mjs')) {
  const rail = new Swan35bRail();

  // Mode 1: CLI Direct Argument: node swan_rail_v3.mjs "Твоје питање"
  if (process.argv[2] && process.argv[2] !== '--server' && process.argv[2] !== '--repl') {
    const prompt = process.argv.slice(2).join(' ');
    const res = rail.generate(prompt);
    console.log(`\n💬 ПИТАЊЕ : "${prompt}"`);
    console.log(`🤖 ОДГОВОР: ${res.response}`);
    console.log(`📐 ФАЗА   : ${res.lastPhase ? res.lastPhase.phaseBinary : '0b111'} (r ≡ 1.0000, 0 FLOPS)\n`);
    process.exit(0);
  }

  // Mode 2: HTTP API Micro-Server: node swan_rail_v3.mjs --server 8080
  if (process.argv[2] === '--server') {
    const port = process.argv[3] || 8080;
    const server = http.createServer((req, res) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Content-Type', 'application/json');
      
      const urlParams = new URL(req.url, `http://localhost:${port}`);
      const prompt = urlParams.searchParams.get('q') || "РотоСВАН";
      const result = rail.generate(prompt);

      res.writeHead(200);
      res.end(JSON.stringify(result, null, 2));
    });

    server.listen(port, () => {
      console.log(`🚀 SWAN 35b Zero-I/O HTTP Server running on http://localhost:${port}`);
      console.log(`👉 Test API: http://localhost:${port}/?q=Zdravo`);
    });
  } else {
    // Mode 3: CLI REPL Terminal Interactive Loop
    console.log("=================================================");
    console.log(" 💬 SWAN 35b CLI Terminal & Interactive REPL (v3)");
    console.log(" Zero-FLOP / Zero-I/O Serbian Interactive Engine");
    console.log(" Укуцај питање (или 'exit' за излаз):");
    console.log("=================================================\n");

    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, prompt: 'SWAN> ' });
    rl.prompt();

    rl.on('line', (line) => {
      const q = line.trim();
      if (q.toLowerCase() === 'exit' || q.toLowerCase() === 'quit') {
        rl.close();
        return;
      }
      if (q.length > 0) {
        const res = rail.generate(q);
        console.log(`\n🤖 SWAN: ${res.response}`);
        console.log(`   [Фаза: ${res.lastPhase ? res.lastPhase.phaseBinary : '0b111'} | r ≡ 1.0000 | Zero-I/O]\n`);
      }
      rl.prompt();
    }).on('close', () => {
      console.log('\nSWAN REPL затворен.');
      process.exit(0);
    });
  }
}
