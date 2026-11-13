const fs = require('fs');
const rate=22050, seconds=32, count=rate*seconds;
const samples=new Float64Array(count);
const chords=[[48,52,55,59],[45,48,52,55],[41,48,53,57],[43,50,55,59]];
function tone(midi,start,length,amplitude){
 const f=440*Math.pow(2,(midi-69)/12);
 for(let j=0;j<length*rate && start*rate+j<count;j++){
  const t=j/rate, fade=Math.min(1,t/.025)*Math.min(1,(length-t)/.4);
  const envelope=Math.exp(-t*1.15)*fade;
  samples[Math.floor(start*rate)+j]+=amplitude*envelope*(Math.sin(2*Math.PI*f*t)+.22*Math.sin(2*Math.PI*f*2*t)+.06*Math.sin(2*Math.PI*f*3*t));
 }
}
for(let bar=0;bar<8;bar++){
 const chord=chords[bar%4];
 for(let beat=0;beat<8;beat++) tone(chord[[0,2,1,3,2,1,3,2][beat]]+12,bar*4+beat*.5,2.3,.20);
 tone(chord[0]-12,bar*4,3.8,.16);
}
let peak=0;for(const x of samples)peak=Math.max(peak,Math.abs(x));
const wav=Buffer.alloc(44+count*2);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(count*2,40);
for(let i=0;i<count;i++){const fade=Math.min(1,i/rate*.8,(count-i)/rate*.8);wav.writeInt16LE(Math.round(samples[i]/peak*.8*fade*32767),44+i*2)}
fs.mkdirSync('dist/assets',{recursive:true});fs.writeFileSync('dist/assets/quiet-afternoon.wav',wav);
if(wav.readUInt32LE(40)!==count*2||peak===0)throw Error('Invalid audio');
console.log(`Verified WAV: ${seconds}s, ${rate}Hz, peak ${peak.toFixed(2)}, ${wav.length} bytes`);
