let notes = [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 466.16];

let sine1, sine2, sine3, time1, time2, time3, index1, index2, index3, lowFreq, en1, env2, env3, filter1, filter2, filter3, noise, noisefilter, reverb, fuzz;

let video, poseNet, pose;

let nx1, ny1, nx0, ny0;

let factor = 0;

let c, c0, img, img2;

let x1, y1, xshift, yshift;

function setup() {
  
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
  
createCanvas(480, 480);
  c = createCapture({
    audio: false,
    video: {
      frameRate: 12
    }
  });
  frameRate(12);
  c0 = createImage(240, 180);
  img = createImage(240, 180);
  img2 = createImage(240, 180);
  c.size(240, 180);
  //img = c;
  c0 = c;
  c.hide();
  c0.hide();
  poseNet = ml5.poseNet(c, modelLoaded);
  poseNet.on('pose', gotPoses);
}

function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
  }
}

function modelLoaded() {
  console.log('ready');
}

function draw() {
  if (pose) {
    let mult = 8/3;
    nx1 = pose.nose.x * mult;
    ny1 = pose.nose.y * mult;
    xshift = abs(nx0 - nx1);
    yshift = abs(nx0 - nx1);
    x1 = 480 - pose.nose.x * mult;
    y1 = pose.nose.y * mult;
    nx0 = pose.nose.x * mult;
    ny0 = pose.nose.y * mult;
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
  
  c.loadPixels();
  c0.loadPixels();
  img.loadPixels();
  img2.loadPixels();
  for (var y = 0; y < img.height; y++) {
      for (var x = 0; x < img.width; x++) {
        var index = (x + y * img.width)*4;
        let change = ((abs(c.pixels[index+0] - c0.pixels[index+0])>75) || (abs(c.pixels[index+1] - c0.pixels[index+1])>75) || (abs(c.pixels[index+2] - c0.pixels[index+2])>75));
        if (change) {
          img.pixels[index+0] = c.pixels[index+0];
          img.pixels[index+1] = c.pixels[index+1];
          img.pixels[index+2] = c.pixels[index+2];
          img.pixels[index+3] = 255;
        } else {
          img.pixels[index+0] = c0.pixels[index+0];
          img.pixels[index+1] = c0.pixels[index+1];
          img.pixels[index+2] = c0.pixels[index+2];
          img.pixels[index+3] = 255;  
        }
        img2.pixels[index+0] = img.pixels[index+0] * 1.3 - 50;
        img2.pixels[index+1] = img.pixels[index+1] * 1.3 - 50;
        img2.pixels[index+2] = img.pixels[index+2] * 1.3 - 50;
        img2.pixels[index+3] = 255;
      }
    }
  img.updatePixels();
  img2.updatePixels();
  push();
  translate(width,0);
  scale(-1, 1);
  image(img2, 0, 0, 640, 480);
  pop();
  c0 = img;
  
  if(xshift > 0) {
    factor = factor * 0.9;
    factor += (xshift + yshift) * 0.5;

    if ((xshift + yshift) * 0.5 < 15) {
      fill(255);
    } else {
      fill(255, 0, 0);
    }
  }
  noStroke();

  rect(x1, y1, 20, 2);
  rect(x1 + 9, y1 - 9, 2, 20);
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