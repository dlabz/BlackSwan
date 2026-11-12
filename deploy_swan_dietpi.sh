#!/usr/bin/env bash
# ==============================================================================
# SWAN 35b Clifford Phase Engine — DietPi / OrangePi Zero3 (4GB ARM64) Deployment
# Architecture: Grand Pubas (@DLabz) | Sub Specie Aeternitatis
# ==============================================================================

set -euo pipefail

echo -e "\033[1;36m[SWAN 35b] Initializing zero-FLOP Clifford Phase Engine Deployment...\033[0m"

# 1. Mount dynamic tmpfs RAM-Disk on LPDDR4 memory (/dev/shm bus)
SWAN_MNT="/mnt/swan_codebooks"
echo -e "\033[1;33m[1/4] Setting up zero-copy LPDDR4 tmpfs bus at ${SWAN_MNT}...\033[0m"
mkdir -p "${SWAN_MNT}"
if ! grep -qs "${SWAN_MNT}" /etc/fstab; then
    echo "tmpfs ${SWAN_MNT} tmpfs defaults,noatime,mode=0777,size=2G 0 0" >> /etc/fstab
fi
mount -a || true

# 2. Deploy Standalone Inline enc64 Phase Engine (swan_rail_v2.mjs)
SWAN_DIR="/opt/swan"
mkdir -p "${SWAN_DIR}"
echo -e "\033[1;33m[2/4] Deploying standalone enc64 Clifford rotor engine to ${SWAN_DIR}/swan_rail_v2.mjs...\033[0m"

cat << 'EOF' > "${SWAN_DIR}/swan_rail_v2.mjs"
/**
 * swan_rail_v2.mjs — SWAN 35b Standalone enc64 Phase Engine
 * Architecture: Grand Pubas (@DLabz)
 */
export const GATE_111 = 0b111;
export const GATE_000 = 0b000;

export const PIANO_KEY_PAIRS = [
  { name: 'Red/Cyan',   vector: 0b100, bivector: 0b011, freqRatio: 1.0000 },
  { name: 'Green/Mag',  vector: 0b010, bivector: 0b101, freqRatio: 1.1225 },
  { name: 'Blue/Yel',   vector: 0b001, bivector: 0b110, freqRatio: 1.2599 }
];

const SWAN_ENC64 = "U1dBTl9ST1RPUl9WMQAAAC8pq262TNMU+UDfA1RnUZpenW2FyodtI45OwVkOYIc0hjASbh5Pj0QCZ2MDAwAnEdE/Tg9CBqYUl4o/YFqmDkU+Hbs0vx9qRZoIugoOAQ8LTg9qRTVZQgZ/mzqI/4U6iE4P1HB/mx5xhSk3HtojtgwRe6IbbYXaBG6YiimlmYWhakU6nO56+xyWaLoKtlQ6iIsvrjs7oLYMTg+TTIophaHiSc4/akV2kTsOzoxacQZEphSiggJnwli3g74dXZTmCbqb7VQOI4YwAIA6iOacTlwqbA4BDi6FKS6HqiKDYOozQl4hoJcXF033NWs+zj+HfWpFwljbhkIjBkSSmwhz/4SqkW2UhSmSm4YwIjIqSLVyy3+5HTQSC6fFjSQHaz26Crk/tKQ6iORiDmBiHjqITlwGRCmde4aedjZzYhsiMpKbdpFqRcWNRFLeh+acDkVOXCpskpu9kr5tOohdXk4PBkQaYYYw2TACZxphLocCdDdae4biZ4UpXV5OD22FK0x7hqqRPh2zESWLvxq6Cm2FlgpOD+2XdpG6Cl2U5gnCWOs+BkRambqbel7LkgsN8SUGRE4PbYXmCT4dwliFoYopV45rbdKPwYzFjWpF6z4GRIZ7u4qFKZKbQgYuh5Yl3jg+HRKWNnNqRasshTjCWE4PDRGWCsICKmzLf8JYUoOSm8t/lgo2L6pW83PmCcd4zj/aIwZEGmHSY8JNR3EDACcRuCu/H2pFwljrfa6O2nKTTA5ghaF/BCU0QgZtEN6HakXuepYKwgKvN76B3ocCdN44hnvFjb9nQga7NJYKYh73NUIjhaECdIop3oc0Y60ilxf7H+Keiy9OD7MRI1i3mU4PCw1AmMWNGTj+VCpsIk+LXG2F5gkHokUb/lQqbIFB0mMSlk4+5glOD1eMP2Dsf+oHphQ6A1lKV4y6m1NYTg/mCUIjXCI6iAZEGmGGMBBZAmfOjJQbsoyGMLZWWmxRmtVZMiHiZ12U5gkaYU4PByjmCVwihaHCWFKDhaGxLN1qhjDFjcFgTg9dXoWhlmgqbDqInlbNLOJnTg+wRGpFtkzCWNFekpuwBbullgo+HZYKEpZOD+YJiimLLws1f5DPUYWh5gmigm2FYaN2kaYUM4wuEKgVooIPUus+Tg+GMJYKkpuWCl4OiinkQBKWNnNCI7ullgoOYAZEFygiMjZzohsiMrqbGmG2TE4PxY06iDlCpZfKhwJnhaHzOcqHBkRapg5FS2HiECIyk5TFjWhvI1ZLIb5tDmBqRQZElgpOD04PxY1/oleMEgvKh7opk5RCIy6HQiOKKeYJ4mdCBipIOoiFoaZOkjaWJZphhjAqbJKbDmCDYN6HlgraI0Ij6jNqReJJiimXFxdN9zXqM84/4kkSlsKFg2DFjWtZKmzehy6HDgG3mU4P6jNCXkQ4sxEMR3c5akUOYD6ZuinCWJYKTg8yISOcxY1thTdaUwl9ZN6H5gkqbMKFg2Auh1psBygDY6ZOPplfP4svKmwRZW8P8YJqRZQbsozaQuozr3s4XaB7UV3mnMWNqi7RP+YJJ5FabE4+5glOD+JnuCF/kDKCliWaYTKCNi+qkTcw3WpqRYcp2kLCWE4P5glCI+actkyWJeYJlgoCZ96H5glODxF7ohvFjSFUbYWuOzKf9g4+HcJYTg+2Vqou5gnqM6IbliXqMzIhhjDFjS6HgzOGMANjLz3mCSps6jOiG5Yl8YIRZXaRwlhqRZQbsozaQgMAZ0jqM6lA5glOD22FliXdEqUBQgbqByIyhSklfsWNQgZiHpphlgqfgg==";

const rawBytes = Uint8Array.from(atob(SWAN_ENC64), c => c.charCodeAt(0));
export const ROTOR_CODEBOOK = new Uint16Array(
  rawBytes.buffer, 
  rawBytes.byteOffset, 
  rawBytes.byteLength / 2
);

export function bunRotor(v_bit, b_bit) { return (v_bit ^ b_bit) & 0b111; }
export function burgerRotor(v_bit, b_bit) { return (~(v_bit ^ b_bit)) & 0b111; }

export class Swan35bRail {
  constructor(baseFreqHz = 440.0) {
    this.r = 1.0;
    this.baseFreq = baseFreqHz;
    this.statePhase = GATE_111;
  }
  step(tokenUint16, layerIndex = 13) {
    const inputPhase = ((tokenUint16 >> 10) & 1) << 2 | ((tokenUint16 >> 5) & 1) << 1 | (tokenUint16 & 1);
    const activeRotor = (layerIndex >= 12 && layerIndex <= 14) 
      ? burgerRotor(this.statePhase, inputPhase) 
      : bunRotor(this.statePhase, inputPhase);
    this.statePhase = activeRotor;
    const keyPair = PIANO_KEY_PAIRS[activeRotor % 3];
    const isBivector = (activeRotor & 0b100) === 0;
    return {
      phase: this.statePhase,
      phaseBinary: `0b${this.statePhase.toString(2).padStart(3, '0')}`,
      keyPair: keyPair.name,
      isBivector,
      frequencyHz: Number((this.baseFreq * keyPair.freqRatio * (isBivector ? 1.5 : 1.0)).toFixed(2)),
      radius: this.r
    };
  }
  runLoop() {
    console.log(`[SWAN Daemon] Geodesic Rail Loop Active. Hydrated ${ROTOR_CODEBOOK.length} rotors.`);
    let stepCount = 0;
    setInterval(() => {
      const token = ROTOR_CODEBOOK[stepCount % ROTOR_CODEBOOK.length];
      const res = this.step(token, stepCount % 28);
      console.log(`[Step ${stepCount.toString().padStart(5, '0')}] Phase: ${res.phaseBinary} | Key: ${res.keyPair.padEnd(9)} | Freq: ${res.frequencyHz} Hz | r: ${res.radius}`);
      stepCount++;
    }, 100);
  }
}

if (process.argv[1] && process.argv[1].endsWith('swan_rail_v2.mjs')) {
  const engine = new Swan35bRail(440.0);
  engine.runLoop();
}
EOF

# 3. Create Real-Time Systemd Daemon (/etc/systemd/system/swan-rail.service)
echo -e "\033[1;33m[3/4] Installing high-priority systemd daemon (swan-rail.service)...\033[0m"

cat << EOF > /etc/systemd/system/swan-rail.service
[Unit]
Description=SWAN 35b Clifford Phase Engine Real-Time Daemon
After=network.target local-fs.target
Wants=local-fs.target

[Service]
Type=simple
ExecStart=/usr/bin/node ${SWAN_DIR}/swan_rail_v2.mjs
Restart=always
RestartSec=1s
User=root
CPUSchedulingPolicy=rr
CPUSchedulingPriority=99
Nice=-20
MemoryMax=100M

[Install]
WantedBy=multi-user.target
EOF

# 4. Enable and launch
echo -e "\033[1;33m[4/4] Activating service on DietPi boot...\033[0m"
systemctl daemon-reload || true
systemctl enable swan-rail.service || true

echo -e "\033[1;32m[SUCCESS] SWAN 35b Clifford Engine successfully installed on DietPi!\033[0m"
echo -e "\033[1;36mStatus Check: systemctl status swan-rail\033[0m"
echo -e "\033[1;36mLive Logs:    journalctl -u swan-rail -f\033[0m"
