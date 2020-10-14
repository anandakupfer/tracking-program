let notes = [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 466.16];

let sine1, sine2, sine3, time1, time2, time3, index1, index2, index3, lowFreq, en1, env2, env3, filter1, filter2, filter3, noise, noisefilter, reverb, fuzz;

let video, poseNet, pose;

let nx1, ny1, nx0, ny0;

let factor = 0;

function setup() {
  createCanvas(640, 480);
  background(0);
  
  sine1 = new p5.SawOsc();
  sine2 = new p5.SawOsc();
  sine3 = new p5.SqrOsc();
  
  noise = new p5.Noise();
  
  time1 = millis();
  time2 = millis();
  time3 = millis();
  
  env1 = new p5.Envelope(1.5, 0.3, 4, 0);
  env2 = new p5.Envelope(1.5, 0.3, 3, 0);
  env3 = new p5.Envelope(0.1, 0.3, 5, 0);
  
  filter1 = new p5.LowPass();
  filter2 = new p5.LowPass();
  filter3 = new p5.LowPass();
  
  noisefilter = new p5.LowPass();
  
  reverb = new p5.Reverb();
  
  fuzz = new p5.Distortion(0.1);
  
  sine1.start();
  sine1.freq(261.63);
  env1.play(sine1);
  
  sine2.start();
  sine2.freq(261.63);
  env2.play(sine2);
  
  sine3.start();
  sine3.freq(261.63 * 2);
  env3.play(sine3);
  
  
  noise.start();
  noise.amp(0.1);
  noisefilter.freq(600);
  noise.disconnect();
  noise.connect(noisefilter);
  
  sine1.disconnect();
  sine2.disconnect();
  sine3.disconnect();
  
  sine1.connect(filter1);
  sine2.connect(filter2);
  sine3.connect(filter3);
  
  reverb.process(filter1, 3, 2);
  reverb.process(filter2, 3, 2);
  reverb.process(filter3, 3, 2);
  reverb.drywet(1);
  
  fuzz.process(reverb);
  
  playing = true;
  
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log('ready');
}

function draw() {
  if (pose) {
    
    nx1 = pose.nose.x
    ny1 = pose.nose.y
    // rect(640 - pose.rightWrist.x, pose.rightWrist.y, 20, 2);
    // rect((640 - pose.rightWrist.x) + 9, pose.rightWrist.y - 9, 2, 20);
    // rect(640 - pose.leftWrist.x, pose.leftWrist.y, 20, 2);
    // rect((640 - pose.leftWrist.x) + 9, pose.leftWrist.y - 9, 2, 20); 
    let xshift = abs(nx0 - nx1);
    let yshift = abs(nx0 - nx1);
    if(xshift > 0) {
      factor = factor * 0.9;
      factor += (xshift + yshift) * 0.5;
  
      background(0);
    
      if ((xshift + yshift) * 0.5 < 15) {
        fill(255);
      } else {
        fill(255, 0, 0);
      }
      noStroke();
    
      rect(640 - pose.nose.x, pose.nose.y, 20, 2);
      rect((640 - pose.nose.x) + 9, pose.nose.y - 9, 2, 20);
    }
    nx0 = pose.nose.x;
    ny0 = pose.nose.y;
  }  
  
    if (millis() > time1 + 6000)
  {
    triggernote1();
    time1 = millis();
  }
  
    if (millis() > time2 + 5000)
  {
    triggernote2();
    time2 = millis();
  }
  
    if (millis() > time3 + 7000)
  {
    triggernote3();
    time3 = millis();
  }
  
  lowFreq = factor + sin(millis() / 25) * 10;
  
  filter1.freq(lowFreq * 2.5);
  filter2.freq(lowFreq * 2.5);
  filter3.freq(lowFreq * 1.1);
}

function triggernote1() {
  sine1.stop();
  index1 = int(random(notes.length));
  let freq1;
  if (index1 == index2 || index1 == index3) {
    freq1 = notes[index1] * 2;
  } else {
    freq1 = notes[index1];
  }
  sine1.freq(freq1);
  sine1.start();
  env1.play(sine1);
}

function triggernote2() {
  sine2.stop();
  index2 = int(random(notes.length));
  let freq2;
  if (index2 == index1 || index2 == index3) {
    freq2 = notes[index2] * 2;
  } else {
    freq2 = notes[index2];
  }
  sine2.freq(freq2);
  sine2.start();
  env2.play(sine2);
}

function triggernote3() {
  sine3.stop();
  index3 = int(random(notes.length));
  let freq3;
  if (index3 == index2 || index3 == index1) {
    freq3 = notes[index3] * 2;
  } else {
    freq3 = notes[index3];
  }
  sine3.freq(freq3);
  sine3.start();
  env3.play(sine3);
}
