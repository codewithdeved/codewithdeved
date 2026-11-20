"use client";

import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Globally cached authentic Vibeans PBR materials
const suitMaterial = new THREE.MeshStandardMaterial({ color: "#0B132B", roughness: 0.88, metalness: 0.12 });
const blackShirtMaterial = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.9, metalness: 0.0 });
const bowMaterial = new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.4, metalness: 0.1 });
const skinMaterial = new THREE.MeshStandardMaterial({ color: "#f1c27d", roughness: 0.58, metalness: 0.08 });
const darkSkinMaterial = new THREE.MeshStandardMaterial({ color: "#d29953", roughness: 0.7, metalness: 0.1 });
const hairMaterial = new THREE.MeshStandardMaterial({ color: "#1c140d", roughness: 0.9, metalness: 0.1 });
const shoeMaterial = new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.22, metalness: 0.6 });
const metalMaterial = new THREE.MeshStandardMaterial({ color: "#a0aab5", metalness: 0.92, roughness: 0.18 });
const tieMaterial = new THREE.MeshStandardMaterial({ color: "#ff7e00", roughness: 0.5, metalness: 0.2 });
const cyanAccentMaterial = new THREE.MeshStandardMaterial({
  color: "#00d2ff",
  roughness: 0.3,
  metalness: 0.5,
  emissive: "#00d2ff",
  emissiveIntensity: 0.8,
});
const irisMaterial = new THREE.MeshStandardMaterial({ color: "#3a2820", roughness: 0.22, metalness: 0.08 });
const irisInnerMaterial = new THREE.MeshStandardMaterial({ color: "#5c4033", roughness: 0.25, metalness: 0.05 });
const catchlightMaterial = new THREE.MeshBasicMaterial({ color: "#ffffff" });
const eyelidSkinMaterial = new THREE.MeshStandardMaterial({ color: "#f1c27d", roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide });
const lashMaterial = new THREE.MeshStandardMaterial({ color: "#1c140d", roughness: 0.85, metalness: 0.0, side: THREE.DoubleSide });
const mouthMaterial = new THREE.MeshStandardMaterial({ color: "#3c1018", roughness: 0.88, metalness: 0.0, side: THREE.DoubleSide });
const lipMaterial = new THREE.MeshStandardMaterial({ color: "#a86852", roughness: 0.54, metalness: 0.04, side: THREE.DoubleSide });
const lowerLipMaterial = new THREE.MeshStandardMaterial({ color: "#b6765e", roughness: 0.50, metalness: 0.04, side: THREE.DoubleSide });
const lipSeamMaterial = new THREE.MeshStandardMaterial({ color: "#542422", roughness: 0.75, metalness: 0.0, side: THREE.DoubleSide });
const tongueMaterial = new THREE.MeshStandardMaterial({ color: "#cb5f6b", roughness: 0.65, metalness: 0.02, side: THREE.DoubleSide });
const teethMaterial = new THREE.MeshStandardMaterial({ color: "#f8f6f0", roughness: 0.24, metalness: 0.02, emissive: "#24201c", emissiveIntensity: 0.42, side: THREE.DoubleSide });
const nostrilMaterial = new THREE.MeshStandardMaterial({ color: "#3a2012", roughness: 0.9, metalness: 0.0 });

const MOUTH_SEGS = 24;
const INNER_SEGS = 16;
const LID_SEGS = 16;

function createStripGeo(segments: number) {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array((segments + 1) * 2 * 3);
  const indices: number[] = [];
  for (let i = 0; i < segments; i++) {
    const tl = i * 2;
    const bl = i * 2 + 1;
    const tr = (i + 1) * 2;
    const br = (i + 1) * 2 + 1;
    indices.push(tl, bl, tr);
    indices.push(tr, bl, br);
  }
  geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geo.setIndex(indices);
  return geo;
}

const SPEECH_VISEMES = [
  { dur: 0.16, open: 0.58, width: 1.12, smile: 0.80, tongue: 0.45 },
  { dur: 0.14, open: 0.36, width: 1.20, smile: 0.90, tongue: 0.60 },
  { dur: 0.11, open: 0.24, width: 1.04, smile: 0.72, tongue: 0.72 },
  { dur: 0.18, open: 0.74, width: 1.02, smile: 0.62, tongue: 0.35 },
  { dur: 0.10, open: 0.03, width: 0.96, smile: 0.78, tongue: 0.00 },
  { dur: 0.15, open: 0.46, width: 0.64, smile: 0.25, tongue: 0.20 },
  { dur: 0.16, open: 0.62, width: 1.08, smile: 0.70, tongue: 0.48 },
  { dur: 0.10, open: 0.02, width: 0.94, smile: 0.68, tongue: 0.00 },
  { dur: 0.17, open: 0.68, width: 0.74, smile: 0.32, tongue: 0.22 },
  { dur: 0.12, open: 0.44, width: 0.60, smile: 0.20, tongue: 0.18 },
  { dur: 0.09, open: 0.02, width: 0.98, smile: 0.74, tongue: 0.00 },
  { dur: 0.17, open: 0.80, width: 1.02, smile: 0.60, tongue: 0.35 },
  { dur: 0.10, open: 0.02, width: 0.95, smile: 0.68, tongue: 0.00 },
  { dur: 0.18, open: 0.70, width: 0.72, smile: 0.28, tongue: 0.22 },
  { dur: 0.13, open: 0.26, width: 1.06, smile: 0.72, tongue: 0.65 },
  { dur: 0.16, open: 0.76, width: 1.08, smile: 0.75, tongue: 0.42 },
  { dur: 0.34, open: 0.05, width: 1.12, smile: 0.96, tongue: 0.05 },
  { dur: 0.16, open: 0.78, width: 1.05, smile: 0.68, tongue: 0.38 },
  { dur: 0.14, open: 0.44, width: 0.62, smile: 0.24, tongue: 0.20 },
  { dur: 0.16, open: 0.40, width: 1.22, smile: 0.92, tongue: 0.58 },
  { dur: 0.11, open: 0.25, width: 1.05, smile: 0.76, tongue: 0.68 },
  { dur: 0.15, open: 0.38, width: 1.24, smile: 0.94, tongue: 0.55 },
  { dur: 0.17, open: 0.68, width: 0.76, smile: 0.34, tongue: 0.24 },
  { dur: 0.32, open: 0.06, width: 1.14, smile: 0.98, tongue: 0.05 },
];
const TOTAL_SPEECH_DUR = SPEECH_VISEMES.reduce((acc, v) => acc + v.dur, 0);

interface RobotAvatarProps {
  scale?: number;
  waveSpeed?: number;
}

export default function RobotAvatar({ scale = 1.0, waveSpeed = 1.0 }: RobotAvatarProps) {
  const robotGroup = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const leftShoulder = useRef<THREE.Group>(null);
  const rightShoulder = useRef<THREE.Group>(null);
  const leftElbow = useRef<THREE.Group>(null);
  const rightElbow = useRef<THREE.Group>(null);
  const leftHand = useRef<THREE.Group>(null);
  const rightHand = useRef<THREE.Group>(null);
  const leftThumb = useRef<THREE.Group>(null);
  const rightThumb = useRef<THREE.Group>(null);
  const leftFingers = useRef<(THREE.Group | null)[]>([null, null, null, null]);
  const rightFingers = useRef<(THREE.Group | null)[]>([null, null, null, null]);
  const leftHip = useRef<THREE.Group>(null);
  const rightHip = useRef<THREE.Group>(null);

  // Facial Expressive Refs
  const leftEye = useRef<THREE.Group>(null);
  const rightEye = useRef<THREE.Group>(null);
  const leftPupil = useRef<THREE.Group>(null);
  const rightPupil = useRef<THREE.Group>(null);
  const leftEyebrow = useRef<THREE.Group>(null);
  const rightEyebrow = useRef<THREE.Group>(null);
  const mouth = useRef<THREE.Group>(null);
  const cavityRef = useRef<THREE.Mesh>(null);
  const teethRef = useRef<THREE.Mesh>(null);
  const tongueRef = useRef<THREE.Mesh>(null);
  const lipSeamRef = useRef<THREE.Mesh>(null);
  const cornerLRef = useRef<THREE.Mesh>(null);
  const cornerRRef = useRef<THREE.Mesh>(null);
  const chinShadowRef = useRef<THREE.Mesh>(null);

  const saccadeTimer = useRef(0);
  const nextSaccadeInterval = useRef(1.8);
  const targetPupil = useRef({ x: 0, y: 0 });
  const currentPupil = useRef({ x: 0, y: 0 });
  const blinkState = useRef({ timer: 0, nextInterval: 2.6, active: false, elapsed: 0, doubleBlink: false });
  const mouthState = useRef({ open: 0.08, width: 1.05, smile: 0.88, tongue: 0.2 });

  // Watertight sculpted 3D human mouth, eyelids & warm arched eyebrows procedural geometries
  const mouthGeos = useMemo(() => ({
    cavity: createStripGeo(MOUTH_SEGS),
    teeth: createStripGeo(INNER_SEGS),
    tongue: createStripGeo(INNER_SEGS),
    seam: createStripGeo(MOUTH_SEGS),
    upperLip: createStripGeo(MOUTH_SEGS),
    lowerLip: createStripGeo(MOUTH_SEGS),
  }), []);

  const eyeLidGeos = useMemo(() => ({
    leftUpper: createStripGeo(LID_SEGS),
    leftLash: createStripGeo(LID_SEGS),
    leftLower: createStripGeo(LID_SEGS),
    rightUpper: createStripGeo(LID_SEGS),
    rightLash: createStripGeo(LID_SEGS),
    rightLower: createStripGeo(LID_SEGS),
  }), []);

  const browGeos = useMemo(() => {
    const build = (s: number) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-s * 0.088, -0.004, 0),
        new THREE.Vector3(-s * 0.030,  0.010, 0.003),
        new THREE.Vector3( s * 0.032,  0.014, 0.003),
        new THREE.Vector3( s * 0.088, -0.005, 0),
      ]);
      return new THREE.TubeGeometry(curve, 18, 0.0145, 10, false);
    };
    return { left: build(-1), right: build(1) };
  }, []);

  // Pre-allocated scratch math objects for zero-GC 60fps quaternion arm solver
  const mathScratch = useMemo(() => ({
    qBaseHandUp: new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI, 0, 0, "XYZ")),
    qShoulder: new THREE.Quaternion(),
    qWorldAdj: new THREE.Quaternion(),
    qForearmWorld: new THREE.Quaternion(),
    qElbow: new THREE.Quaternion(),
    eShoulder: new THREE.Euler(0, 0, 0, "XYZ"),
    eWorldAdj: new THREE.Euler(0, 0, 0, "YXZ"),
  }), []);

  // Seamless 7x5 Organic Anatomical Sculpted Cartoon Nose Geometry
  const noseGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry();
    const vertices = new Float32Array([
      -0.016,  0.075, 0.551,   -0.008,  0.075, 0.553,    0.000,  0.075, 0.555,    0.008,  0.075, 0.553,    0.016,  0.075, 0.551,
      -0.022,  0.045, 0.551,   -0.011,  0.045, 0.561,    0.000,  0.045, 0.566,    0.011,  0.045, 0.561,    0.022,  0.045, 0.551,
      -0.028,  0.015, 0.551,   -0.014,  0.015, 0.568,    0.000,  0.015, 0.575,    0.014,  0.015, 0.568,    0.028,  0.015, 0.551,
      -0.034, -0.010, 0.551,   -0.017, -0.010, 0.575,    0.000, -0.010, 0.582,    0.017, -0.010, 0.575,    0.034, -0.010, 0.551,
      -0.038, -0.028, 0.551,   -0.020, -0.028, 0.574,    0.000, -0.026, 0.585,    0.020, -0.028, 0.574,    0.038, -0.028, 0.551,
      -0.030, -0.044, 0.551,   -0.015, -0.044, 0.562,    0.000, -0.042, 0.570,    0.015, -0.044, 0.562,    0.030, -0.044, 0.551,
      -0.022, -0.055, 0.551,   -0.010, -0.055, 0.551,    0.000, -0.055, 0.551,    0.010, -0.055, 0.551,    0.022, -0.055, 0.551,
    ]);
    const indices: number[] = [];
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        const tl = r * 5 + c;
        const tr = r * 5 + (c + 1);
        const bl = (r + 1) * 5 + c;
        const br = (r + 1) * 5 + (c + 1);
        indices.push(tl, bl, tr);
        indices.push(tr, bl, br);
      }
    }
    geom.setAttribute("position", new THREE.BufferAttribute(vertices, 3));
    geom.setIndex(indices);
    geom.computeVertexNormals();
    return geom;
  }, []);

  const fingerRestConfig = [
    { curl: 0.11, splay: 0.032 },
    { curl: 0.14, splay: 0.008 },
    { curl: 0.17, splay: -0.016 },
    { curl: 0.22, splay: -0.042 },
  ];

  // Live Upright Natural Human Waving & Speaking Kinematics Loop (100% Grounded Stationary Body)
  useFrame((state, deltaRaw) => {
    const delta = Math.min(deltaRaw, 0.1);
    const t = state.clock.getElapsedTime() * waveSpeed;
    const currentWaveSpeed = 4.3;

    // 1. Rock-Solid Grounded Standing Posture (ZERO body rocking, swaying, or floating while waving!)
    if (robotGroup.current) {
      robotGroup.current.position.set(0, -0.15, 0);
      robotGroup.current.rotation.set(0, 0, 0);
    }

    // 2. Authentic Human Saccadic Gaze Tracking
    saccadeTimer.current += delta;
    if (saccadeTimer.current >= nextSaccadeInterval.current) {
      saccadeTimer.current = 0;
      if (Math.random() < 0.68) {
        targetPupil.current.x = (Math.random() - 0.5) * 0.008;
        targetPupil.current.y = (Math.random() - 0.5) * 0.006;
        nextSaccadeInterval.current = 1.4 + Math.random() * 1.8;
      } else {
        targetPupil.current.x = (Math.random() - 0.5) * 0.048;
        targetPupil.current.y = (Math.random() - 0.35) * 0.024;
        nextSaccadeInterval.current = 0.45 + Math.random() * 0.50;
      }
    }
    const gazeAlpha = Math.min(1, delta * 14.0);
    currentPupil.current.x = THREE.MathUtils.lerp(currentPupil.current.x, targetPupil.current.x, gazeAlpha);
    currentPupil.current.y = THREE.MathUtils.lerp(currentPupil.current.y, targetPupil.current.y, gazeAlpha);

    const microTremorX = Math.sin(t * 28.0) * 0.0005;
    const microTremorY = Math.cos(t * 23.0) * 0.0003;

    if (leftPupil.current && rightPupil.current) {
      leftPupil.current.position.x = currentPupil.current.x + microTremorX;
      leftPupil.current.position.y = currentPupil.current.y + microTremorY;
      rightPupil.current.position.x = currentPupil.current.x + microTremorX;
      rightPupil.current.position.y = currentPupil.current.y + microTremorY;
    }

    // 3. True Asymmetrical Human Top-Down Eyelid Blinking (110ms close + 50ms natural closed hold + 170ms gentle reopen, 22% double-blink)
    const bs = blinkState.current;
    bs.timer += delta;
    let blinkAmt = 0;
    const BLINK_CLOSE = 0.11;
    const BLINK_HOLD = 0.05;
    const BLINK_OPEN = 0.17;
    if (!bs.active && bs.timer >= bs.nextInterval) {
      bs.active = true;
      bs.elapsed = 0;
      bs.timer = 0;
      bs.nextInterval = 2.2 + Math.random() * 1.4;
      bs.doubleBlink = Math.random() < 0.22;
    }
    if (bs.active) {
      bs.elapsed += delta;
      if (bs.elapsed < BLINK_CLOSE) {
        const p = bs.elapsed / BLINK_CLOSE;
        blinkAmt = p * p * (3 - 2 * p);
      } else if (bs.elapsed < BLINK_CLOSE + BLINK_HOLD) {
        blinkAmt = 1.0;
      } else if (bs.elapsed < BLINK_CLOSE + BLINK_HOLD + BLINK_OPEN) {
        const p = (bs.elapsed - BLINK_CLOSE - BLINK_HOLD) / BLINK_OPEN;
        blinkAmt = 1 - (p * p * (3 - 2 * p));
      } else if (bs.doubleBlink) {
        bs.doubleBlink = false;
        bs.elapsed = 0;
        blinkAmt = 0;
      } else {
        bs.active = false;
        blinkAmt = 0;
      }
    }

    // 4. Conversational Human Speech Viseme Animation
    let speechTime = t % TOTAL_SPEECH_DUR;
    let targetViseme = SPEECH_VISEMES[0];
    for (let i = 0; i < SPEECH_VISEMES.length; i++) {
      if (speechTime < SPEECH_VISEMES[i].dur) {
        targetViseme = SPEECH_VISEMES[i];
        break;
      }
      speechTime -= SPEECH_VISEMES[i].dur;
    }

    const lipAlpha = Math.min(1, delta * 17.5);
    mouthState.current.open   = THREE.MathUtils.lerp(mouthState.current.open,   targetViseme.open,   lipAlpha);
    mouthState.current.width  = THREE.MathUtils.lerp(mouthState.current.width,  targetViseme.width,  lipAlpha);
    mouthState.current.smile  = THREE.MathUtils.lerp(mouthState.current.smile,  targetViseme.smile,  lipAlpha);
    mouthState.current.tongue = THREE.MathUtils.lerp(mouthState.current.tongue, targetViseme.tongue, lipAlpha);

    const { open: openAmt, width: widthFactor, smile: smileAmt, tongue: tongueLift } = mouthState.current;
    const halfW = 0.132 * widthFactor;
    const cornerY = 0.024 * smileAmt - 0.006 * (1 - smileAmt);
    const upperCenterY = 0.004 + openAmt * 0.018;
    const lowerCenterY = -0.004 - openAmt * 0.068;

    const evalTop = (s: number) => {
      const arch = 1 - s * s;
      const cupid = -0.0038 * Math.exp(-s * s * 22) * (0.45 + 0.55 * openAmt);
      return cornerY * (1 - arch) + upperCenterY * arch + cupid;
    };
    const evalBot = (s: number) => {
      const lowerArch = Math.pow(Math.max(0, 1 - s * s), 0.76);
      return cornerY * (1 - lowerArch) + lowerCenterY * lowerArch;
    };

    const cavPos = mouthGeos.cavity.attributes.position.array as Float32Array;
    const upPos = mouthGeos.upperLip.attributes.position.array as Float32Array;
    const loPos = mouthGeos.lowerLip.attributes.position.array as Float32Array;
    const seamPos = mouthGeos.seam.attributes.position.array as Float32Array;

    for (let i = 0; i <= MOUTH_SEGS; i++) {
      const s = (i / MOUTH_SEGS) * 2 - 1;
      const x = s * halfW;
      const yT = evalTop(s);
      const yB = evalBot(s);
      const env = Math.max(0, 1 - s * s);
      const idx = i * 6;

      cavPos[idx]     = x; cavPos[idx + 1] = yT; cavPos[idx + 2] = 0.0012;
      cavPos[idx + 3] = x; cavPos[idx + 4] = yB; cavPos[idx + 5] = 0.0012;

      const cupidPeaks = Math.exp(-Math.pow((Math.abs(s) - 0.24) / 0.18, 2));
      const upperThick = (0.0145 * Math.pow(env, 0.62) + 0.0045 * cupidPeaks) * (0.92 + 0.14 * (1 - widthFactor));
      const zLipOuter = 0.002 + 0.003 * env;
      const zLipCrown = 0.0065 + 0.0075 * env;
      upPos[idx]     = x; upPos[idx + 1] = yT + upperThick; upPos[idx + 2] = zLipOuter;
      upPos[idx + 3] = x; upPos[idx + 4] = yT - 0.001;      upPos[idx + 5] = zLipCrown;

      const lowerThick = 0.0205 * Math.pow(env, 0.54) * (0.94 + 0.16 * (1 - widthFactor));
      loPos[idx]     = x; loPos[idx + 1] = yB + 0.001;      loPos[idx + 2] = zLipCrown + 0.001;
      loPos[idx + 3] = x; loPos[idx + 4] = yB - lowerThick; loPos[idx + 5] = zLipOuter;

      const seamHalf = (0.0038 + 0.002 * (1 - openAmt)) * Math.pow(env, 0.35);
      const yMid = (yT + yB) * 0.5;
      seamPos[idx]     = x; seamPos[idx + 1] = yMid + seamHalf; seamPos[idx + 2] = 0.0072 + 0.007 * env;
      seamPos[idx + 3] = x; seamPos[idx + 4] = yMid - seamHalf; seamPos[idx + 5] = 0.0072 + 0.007 * env;
    }

    mouthGeos.cavity.attributes.position.needsUpdate = true;
    mouthGeos.upperLip.attributes.position.needsUpdate = true;
    mouthGeos.lowerLip.attributes.position.needsUpdate = true;
    mouthGeos.seam.attributes.position.needsUpdate = true;
    mouthGeos.cavity.computeVertexNormals();
    mouthGeos.upperLip.computeVertexNormals();
    mouthGeos.lowerLip.computeVertexNormals();

    if (cavityRef.current) cavityRef.current.visible = openAmt > 0.06;
    if (lipSeamRef.current) lipSeamRef.current.visible = openAmt < 0.24;

    const teethPos = mouthGeos.teeth.attributes.position.array as Float32Array;
    const maxTeethH = 0.020 * Math.min(1, openAmt * 1.45);
    for (let i = 0; i <= INNER_SEGS; i++) {
      const tU = (i / INNER_SEGS) * 2 - 1;
      const s = tU * 0.72;
      const x = s * halfW;
      const yT = evalTop(s);
      const yB = evalBot(s);
      const yTeethBot = Math.max(yB + 0.004, yT - maxTeethH * Math.pow(Math.max(0, 1 - tU * tU), 0.32));
      const idx = i * 6;
      teethPos[idx]     = x; teethPos[idx + 1] = yT - 0.0005; teethPos[idx + 2] = 0.0036;
      teethPos[idx + 3] = x; teethPos[idx + 4] = yTeethBot;   teethPos[idx + 5] = 0.0036;
    }
    mouthGeos.teeth.attributes.position.needsUpdate = true;
    mouthGeos.teeth.computeVertexNormals();
    if (teethRef.current) teethRef.current.visible = openAmt > 0.16;

    const tonguePos = mouthGeos.tongue.attributes.position.array as Float32Array;
    const maxTongueH = (0.022 + 0.014 * tongueLift) * Math.min(1, Math.max(0, (openAmt - 0.18) * 1.6));
    for (let i = 0; i <= INNER_SEGS; i++) {
      const tU = (i / INNER_SEGS) * 2 - 1;
      const s = tU * 0.58;
      const x = s * halfW;
      const yT = evalTop(s);
      const yB = evalBot(s);
      const yTongueTop = Math.min(yT - 0.007, yB + maxTongueH * Math.pow(Math.max(0, 1 - tU * tU), 0.65));
      const idx = i * 6;
      tonguePos[idx]     = x; tonguePos[idx + 1] = yTongueTop;  tonguePos[idx + 2] = 0.0028;
      tonguePos[idx + 3] = x; tonguePos[idx + 4] = yB + 0.0005; tonguePos[idx + 5] = 0.0028;
    }
    mouthGeos.tongue.attributes.position.needsUpdate = true;
    mouthGeos.tongue.computeVertexNormals();
    if (tongueRef.current) tongueRef.current.visible = openAmt > 0.25;

    if (cornerLRef.current) {
      cornerLRef.current.position.set(-halfW - 0.002, cornerY + 0.001, 0.004);
      cornerLRef.current.rotation.z = 0.28 * smileAmt;
    }
    if (cornerRRef.current) {
      cornerRRef.current.position.set(halfW + 0.002, cornerY + 0.001, 0.004);
      cornerRRef.current.rotation.z = -0.28 * smileAmt;
    }
    if (chinShadowRef.current) {
      chinShadowRef.current.position.set(0, lowerCenterY - 0.032, 0.001);
      chinShadowRef.current.scale.x = 1.15 * widthFactor;
    }
    if (mouth.current) {
      mouth.current.position.y = -0.22 - openAmt * 0.008;
    }

    // Update sculpted top-down eyelids with soft Duchenne smile cheek-lift coupling
    const updateLidSet = (upperGeo: THREE.BufferGeometry, lashGeo: THREE.BufferGeometry, lowerGeo: THREE.BufferGeometry) => {
      const halfW = 0.168;
      const uArr = upperGeo.attributes.position.array as Float32Array;
      const lArr = lashGeo.attributes.position.array as Float32Array;
      const bArr = lowerGeo.attributes.position.array as Float32Array;
      const rimCenterY = THREE.MathUtils.lerp(0.056 - smileAmt * 0.006, -0.074, blinkAmt);
      const rimArch = THREE.MathUtils.lerp(0.022, -0.012, blinkAmt);
      const lowerCenterY = THREE.MathUtils.lerp(-0.074 + smileAmt * 0.014, -0.064, blinkAmt);
      for (let i = 0; i <= LID_SEGS; i++) {
        const s = (i / LID_SEGS) * 2 - 1;
        const x = s * halfW;
        const env = Math.max(0, 1 - s * s);
        const idx = i * 6;
        const yUpperRim = rimCenterY + rimArch * (env - 0.5) - 0.042 * (1 - env) * (1 - blinkAmt * 0.8);
        const zLid = 0.040 + 0.003 * env;
        uArr[idx]     = x; uArr[idx + 1] = 0.088;     uArr[idx + 2] = 0.039;
        uArr[idx + 3] = x; uArr[idx + 4] = yUpperRim; uArr[idx + 5] = zLid;
        const lashThick = 0.0085 * Math.pow(env, 0.35) + 0.0025;
        lArr[idx]     = x; lArr[idx + 1] = yUpperRim + lashThick * 0.45; lArr[idx + 2] = zLid + 0.0018;
        lArr[idx + 3] = x; lArr[idx + 4] = yUpperRim - lashThick * 0.55; lArr[idx + 5] = zLid + 0.0018;
        bArr[idx]     = x; bArr[idx + 1] = lowerCenterY - 0.012 * (1 - env); bArr[idx + 2] = 0.0395 + 0.002 * env;
        bArr[idx + 3] = x; bArr[idx + 4] = -0.088;                           bArr[idx + 5] = 0.0385;
      }
      upperGeo.attributes.position.needsUpdate = true;
      lashGeo.attributes.position.needsUpdate = true;
      lowerGeo.attributes.position.needsUpdate = true;
      upperGeo.computeVertexNormals();
      lowerGeo.computeVertexNormals();
    };
    updateLidSet(eyeLidGeos.leftUpper, eyeLidGeos.leftLash, eyeLidGeos.leftLower);
    updateLidSet(eyeLidGeos.rightUpper, eyeLidGeos.rightLash, eyeLidGeos.rightLower);

    // Subtle, natural human head micro-nods & gaze-coupled conversational turns (torso remains rock-steady!)
    const isSpeakingNow = openAmt > 0.14;
    const speakHeadBob = isSpeakingNow ? (openAmt * 0.018 + Math.sin(t * 7.2) * 0.008) : 0;
    if (head.current) {
      head.current.rotation.x = -0.015 + Math.cos(t * 1.6) * 0.010 + speakHeadBob - currentPupil.current.y * 0.5;
      head.current.rotation.y = Math.sin(t * 1.1) * 0.032 + currentPupil.current.x * 0.85;
      head.current.rotation.z = Math.sin(t * 1.5) * 0.018;
    }

    // Warm, expressive arched human eyebrows (friendly conversational lift + subtle human asymmetry + blink dip)
    const browEmphasis = isSpeakingNow ? (0.005 + openAmt * 0.016) : 0.004;
    const browAsym = Math.sin(t * 1.7) * 0.0035;
    const blinkDip = blinkAmt * 0.009;
    if (leftEyebrow.current && rightEyebrow.current) {
      leftEyebrow.current.position.y = 0.275 + browEmphasis + browAsym - blinkDip;
      rightEyebrow.current.position.y = 0.275 + browEmphasis - browAsym * 0.6 - blinkDip;
      leftEyebrow.current.rotation.z = 0.03 + browEmphasis * 0.55;
      rightEyebrow.current.rotation.z = -0.03 - browEmphasis * 0.55;
    }

    // 5. Simultaneous & Continuous Two-Handed Poised Human Open-Palm Wave (Grounded Body, Strictly Forward, Zero Rest!)
    const applyArmWave = (
      isRight: boolean,
      wt: number,
      shoulder: THREE.Group | null,
      elbow: THREE.Group | null,
      hand: THREE.Group | null,
      fingers: (THREE.Group | null)[],
      thumb: THREE.Group | null
    ) => {
      if (!shoulder || !elbow) return;
      const s = isRight ? 1 : -1;
      const wave = Math.sin(wt) * 0.21 - Math.sin(wt * 3.0) * 0.018;
      const pronation = Math.sin(wt) * 0.11;
      const lift = Math.cos(wt * 2.0) * 0.020;
      const wristLagZ = Math.sin(wt - 0.36) * 0.20;
      const wristNodX = -0.03 + Math.cos(wt - 0.32) * 0.045;

      mathScratch.eShoulder.set(-0.36 + lift * 0.6, -s * 0.16, s * (0.50 + wave * 0.10));
      shoulder.rotation.copy(mathScratch.eShoulder);
      mathScratch.qShoulder.setFromEuler(mathScratch.eShoulder);

      mathScratch.eWorldAdj.set(0.20 + lift * 0.4, -s * (0.12 - pronation), -s * (0.10 + wave));
      mathScratch.qWorldAdj.setFromEuler(mathScratch.eWorldAdj);
      mathScratch.qForearmWorld.multiplyQuaternions(mathScratch.qWorldAdj, mathScratch.qBaseHandUp);

      mathScratch.qElbow.copy(mathScratch.qShoulder).invert().multiply(mathScratch.qForearmWorld);
      elbow.quaternion.copy(mathScratch.qElbow);

      if (hand) {
        hand.rotation.set(wristNodX, 0, s * wristLagZ);
      }
      for (let i = 0; i < fingers.length; i++) {
        const f = fingers[i];
        if (!f) continue;
        const phase = wt - 0.48 - i * 0.12;
        const cfg = fingerRestConfig[i];
        f.rotation.x = cfg.curl + Math.sin(phase) * 0.055;
        f.rotation.z = -s * cfg.splay + s * Math.cos(phase) * 0.018;
      }
      if (thumb) {
        thumb.rotation.x = 0.16 + Math.sin(wt - 0.40) * 0.035;
      }
    };

    const wavePhaseOffset = 0.42;
    applyArmWave(true, t * currentWaveSpeed, rightShoulder.current, rightElbow.current, rightHand.current, rightFingers.current, rightThumb.current);
    applyArmWave(false, t * currentWaveSpeed + wavePhaseOffset, leftShoulder.current, leftElbow.current, leftHand.current, leftFingers.current, leftThumb.current);
  });

  return (
    <group ref={robotGroup} scale={[scale, scale, scale]} position={[0, -0.15, 0]}>
      {/* ─── HEAD & EXPRESSIVE FACE ─── */}
      <group ref={head} position={[0, 1.6, 0]}>
        {/* Head Block */}
        <mesh material={skinMaterial} castShadow>
          <boxGeometry args={[1.2, 1.0, 1.1]} />
        </mesh>

        {/* Warm Sculpted Arched Human Eyebrows */}
        <group ref={leftEyebrow} position={[-0.205, 0.275, 0.556]}>
          <mesh geometry={browGeos.left} material={hairMaterial} scale={[1, 0.9, 0.55]} castShadow />
          <mesh material={hairMaterial} position={[0.088, -0.004, 0]} scale={[1, 0.9, 0.55]}>
            <sphereGeometry args={[0.0135, 10, 10]} />
          </mesh>
          <mesh material={hairMaterial} position={[-0.088, -0.005, 0]} scale={[1, 0.9, 0.55]}>
            <sphereGeometry args={[0.0115, 10, 10]} />
          </mesh>
        </group>
        <group ref={rightEyebrow} position={[0.205, 0.275, 0.556]}>
          <mesh geometry={browGeos.right} material={hairMaterial} scale={[1, 0.9, 0.55]} castShadow />
          <mesh material={hairMaterial} position={[-0.088, -0.004, 0]} scale={[1, 0.9, 0.55]}>
            <sphereGeometry args={[0.0135, 10, 10]} />
          </mesh>
          <mesh material={hairMaterial} position={[0.088, -0.005, 0]} scale={[1, 0.9, 0.55]}>
            <sphereGeometry args={[0.0115, 10, 10]} />
          </mesh>
        </group>

        {/* Left Soulful Human Eye with Catchlights & Top-Down Sculpted Eyelids */}
        <group position={[-0.205, 0.148, 0.55]}>
          <group ref={leftEye}>
            <mesh material={bowMaterial} scale={[1.58, 0.82, 0.2]} castShadow>
              <sphereGeometry args={[0.1, 32, 32]} />
            </mesh>
            <group ref={leftPupil}>
              <mesh material={irisMaterial} position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.2, 1]}>
                <cylinderGeometry args={[0.048, 0.048, 0.1, 24]} />
              </mesh>
              <mesh material={irisInnerMaterial} position={[0, 0, 0.021]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.2, 1]}>
                <cylinderGeometry args={[0.036, 0.036, 0.1, 24]} />
              </mesh>
              <mesh material={shoeMaterial} position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.2, 1]}>
                <cylinderGeometry args={[0.022, 0.022, 0.1, 24]} />
              </mesh>
              <mesh material={catchlightMaterial} position={[0.015, 0.014, 0.037]} scale={[1, 1, 0.3]}>
                <sphereGeometry args={[0.0095, 12, 12]} />
              </mesh>
              <mesh material={catchlightMaterial} position={[-0.013, -0.012, 0.037]} scale={[1, 1, 0.3]}>
                <sphereGeometry args={[0.0048, 10, 10]} />
              </mesh>
            </group>
            <mesh geometry={eyeLidGeos.leftUpper} material={eyelidSkinMaterial} />
            <mesh geometry={eyeLidGeos.leftLash} material={lashMaterial} />
            <mesh geometry={eyeLidGeos.leftLower} material={eyelidSkinMaterial} />
          </group>
        </group>

        {/* Right Soulful Human Eye with Catchlights & Top-Down Sculpted Eyelids */}
        <group position={[0.205, 0.148, 0.55]}>
          <group ref={rightEye}>
            <mesh material={bowMaterial} scale={[1.58, 0.82, 0.2]} castShadow>
              <sphereGeometry args={[0.1, 32, 32]} />
            </mesh>
            <group ref={rightPupil}>
              <mesh material={irisMaterial} position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.2, 1]}>
                <cylinderGeometry args={[0.048, 0.048, 0.1, 24]} />
              </mesh>
              <mesh material={irisInnerMaterial} position={[0, 0, 0.021]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.2, 1]}>
                <cylinderGeometry args={[0.036, 0.036, 0.1, 24]} />
              </mesh>
              <mesh material={shoeMaterial} position={[0, 0, 0.026]} rotation={[Math.PI / 2, 0, 0]} scale={[1, 0.2, 1]}>
                <cylinderGeometry args={[0.022, 0.022, 0.1, 24]} />
              </mesh>
              <mesh material={catchlightMaterial} position={[0.015, 0.014, 0.037]} scale={[1, 1, 0.3]}>
                <sphereGeometry args={[0.0095, 12, 12]} />
              </mesh>
              <mesh material={catchlightMaterial} position={[-0.013, -0.012, 0.037]} scale={[1, 1, 0.3]}>
                <sphereGeometry args={[0.0048, 10, 10]} />
              </mesh>
            </group>
            <mesh geometry={eyeLidGeos.rightUpper} material={eyelidSkinMaterial} />
            <mesh geometry={eyeLidGeos.rightLash} material={lashMaterial} />
            <mesh geometry={eyeLidGeos.rightLower} material={eyelidSkinMaterial} />
          </group>
        </group>

        {/* Sculpted Organic Nose */}
        <mesh geometry={noseGeometry} material={skinMaterial} castShadow />
        <mesh material={nostrilMaterial} position={[-0.015, -0.042, 0.564]} rotation={[0.3, 0.2, 0.35]} scale={[0.9, 0.45, 0.35]}>
          <sphereGeometry args={[0.007, 16, 16]} />
        </mesh>
        <mesh material={nostrilMaterial} position={[0.015, -0.042, 0.564]} rotation={[0.3, -0.2, -0.35]} scale={[0.9, 0.45, 0.35]}>
          <sphereGeometry args={[0.007, 16, 16]} />
        </mesh>

        {/* Anatomically Sculpted Watertight 3D Human Speaking Mouth */}
        <group ref={mouth} position={[0, -0.22, 0.553]}>
          <mesh ref={cavityRef} geometry={mouthGeos.cavity} material={mouthMaterial} />
          <mesh ref={teethRef} geometry={mouthGeos.teeth} material={teethMaterial} />
          <mesh ref={tongueRef} geometry={mouthGeos.tongue} material={tongueMaterial} />
          <mesh ref={lipSeamRef} geometry={mouthGeos.seam} material={lipSeamMaterial} />
          <mesh geometry={mouthGeos.upperLip} material={lipMaterial} />
          <mesh geometry={mouthGeos.lowerLip} material={lowerLipMaterial} />
          <mesh ref={cornerLRef} material={lipSeamMaterial} scale={[0.65, 1.35, 0.35]}>
            <sphereGeometry args={[0.0085, 12, 12]} />
          </mesh>
          <mesh ref={cornerRRef} material={lipSeamMaterial} scale={[0.65, 1.35, 0.35]}>
            <sphereGeometry args={[0.0085, 12, 12]} />
          </mesh>
          <mesh ref={chinShadowRef} material={darkSkinMaterial} scale={[1.25, 0.14, 0.12]}>
            <sphereGeometry args={[0.052, 16, 12]} />
          </mesh>
        </group>

        {/* Ears */}
        <mesh material={skinMaterial} position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2]} />
        </mesh>
        <mesh material={skinMaterial} position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.12, 0.12, 0.2]} />
        </mesh>

        {/* High-Tech DJ Studio Headphones */}
        <group>
          <mesh material={shoeMaterial} position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
          </mesh>
          <mesh material={cyanAccentMaterial} position={[-0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.16, 32]} />
          </mesh>
          <mesh material={shoeMaterial} position={[0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.3, 0.3, 0.15, 32]} />
          </mesh>
          <mesh material={cyanAccentMaterial} position={[0.82, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.15, 0.15, 0.16, 32]} />
          </mesh>
          <mesh material={shoeMaterial} position={[-0.8, 0.45, 0]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.16]} />
          </mesh>
          <mesh material={shoeMaterial} position={[0.8, 0.45, 0]} castShadow>
            <boxGeometry args={[0.08, 0.9, 0.16]} />
          </mesh>
          <mesh material={shoeMaterial} position={[0, 0.9, 0]} castShadow>
            <boxGeometry args={[1.68, 0.08, 0.16]} />
          </mesh>
          <mesh material={tieMaterial} position={[0, 0.85, 0]} castShadow>
            <boxGeometry args={[1.5, 0.04, 0.18]} />
          </mesh>
        </group>

        {/* Layered Hair */}
        <group position={[0, 0.5, 0]}>
          <mesh material={hairMaterial} position={[0, 0.1, 0]} castShadow>
            <boxGeometry args={[1.3, 0.25, 1.25]} />
          </mesh>
          <mesh material={hairMaterial} position={[0, -0.6, -0.6]} rotation={[0.05, 0, 0]} castShadow>
            <boxGeometry args={[1.3, 1.4, 0.2]} />
          </mesh>
          <mesh material={hairMaterial} position={[-0.6, -0.5, -0.1]} rotation={[0, 0, -0.05]} castShadow>
            <boxGeometry args={[0.2, 1.2, 0.8]} />
          </mesh>
          <mesh material={hairMaterial} position={[0.6, -0.5, -0.1]} rotation={[0, 0, 0.05]} castShadow>
            <boxGeometry args={[0.2, 1.2, 0.8]} />
          </mesh>
        </group>
      </group>

      {/* ─── NECK ─── */}
      <mesh material={darkSkinMaterial} position={[0, 1.0, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4]} />
      </mesh>

      {/* ─── TAILORED SUIT TORSO ─── */}
      <group position={[0, 0.2, 0]}>
        <mesh material={suitMaterial} castShadow>
          <boxGeometry args={[1.5, 1.4, 0.9]} />
        </mesh>
        <mesh material={blackShirtMaterial} position={[0, 0.4, 0.46]} castShadow>
          <boxGeometry args={[0.5, 0.7, 0.02]} />
        </mesh>
        <mesh material={bowMaterial} position={[0, 0.6, 0.48]} castShadow>
          <boxGeometry args={[0.08, 0.08, 0.02]} />
        </mesh>
        <mesh material={bowMaterial} position={[-0.1, 0.6, 0.47]} rotation={[0, 0, Math.PI / 4]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.02]} />
        </mesh>
        <mesh material={bowMaterial} position={[0.1, 0.6, 0.47]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[0.15, 0.15, 0.02]} />
        </mesh>
        <mesh material={suitMaterial} position={[0, -0.2, 0.49]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.02]} />
        </mesh>
        <mesh material={suitMaterial} position={[-0.2, 0.4, 0.5]} rotation={[0, 0, 0.4]} castShadow>
          <boxGeometry args={[0.25, 0.7, 0.02]} />
        </mesh>
        <mesh material={suitMaterial} position={[0.2, 0.4, 0.5]} rotation={[0, 0, -0.4]} castShadow>
          <boxGeometry args={[0.25, 0.7, 0.02]} />
        </mesh>

        {/* 3 Glowing Cyan Buttons */}
        {[0.05, -0.13, -0.31].map((y, i) => (
          <mesh key={i} material={cyanAccentMaterial} position={[0, y, 0.51]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035, 0.035, 0.02, 16]} />
          </mesh>
        ))}

        <mesh material={cyanAccentMaterial} position={[0.3, 0.4, 0.51]} castShadow>
          <boxGeometry args={[0.12, 0.04, 0.02]} />
        </mesh>
      </group>

      {/* Waist & Belt */}
      <mesh material={suitMaterial} position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.3, 32]} />
      </mesh>
      <mesh material={shoeMaterial} position={[0, -0.6, 0]}>
        <cylinderGeometry args={[0.52, 0.52, 0.1, 32]} />
      </mesh>
      <mesh material={metalMaterial} position={[0, -0.6, 0.5]}>
        <boxGeometry args={[0.2, 0.15, 0.05]} />
      </mesh>
      <mesh material={suitMaterial} position={[0, -0.9, 0]}>
        <boxGeometry args={[1.2, 0.4, 0.8]} />
      </mesh>

      {/* ─── LEFT ARM (Smartwatch) ─── */}
      <group ref={leftShoulder} position={[-0.9, 0.7, 0]}>
        <mesh material={suitMaterial}>
          <sphereGeometry args={[0.25, 32, 32]} />
        </mesh>
        <mesh material={suitMaterial} position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.8]} />
        </mesh>
        <group ref={leftElbow} position={[0, -0.8, 0]}>
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.18, 32, 32]} />
          </mesh>
          <mesh material={suitMaterial} position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.22, 0.8, 0.22]} />
          </mesh>

          {/* Hand + Smartwatch */}
          <group ref={leftHand} position={[0, -0.85, 0]}>
            <mesh material={shoeMaterial} position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.1, 24]} />
            </mesh>
            <mesh material={metalMaterial} position={[0, 0.05, 0.13]}>
              <boxGeometry args={[0.16, 0.18, 0.04]} />
            </mesh>
            <mesh material={cyanAccentMaterial} position={[0, 0.05, 0.155]}>
              <boxGeometry args={[0.12, 0.14, 0.02]} />
            </mesh>

            <mesh position={[0, -0.15, 0]} material={skinMaterial} castShadow>
              <boxGeometry args={[0.3, 0.25, 0.15]} />
            </mesh>
            <group ref={leftThumb} position={[0.145, -0.175, -0.012]} rotation={[0.16, -0.14, 0.30]}>
              <mesh position={[0, -0.115, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.06, 0.25, 0.08]} />
              </mesh>
            </group>
            <group ref={(el) => { leftFingers.current[0] = el; }} position={[0.072, -0.255, 0]} rotation={[0.11, 0, 0.032]}>
              <mesh position={[0, -0.16, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.052, 0.32, 0.08]} />
              </mesh>
            </group>
            <group ref={(el) => { leftFingers.current[1] = el; }} position={[0.014, -0.255, 0]} rotation={[0.14, 0, 0.008]}>
              <mesh position={[0, -0.175, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.052, 0.35, 0.08]} />
              </mesh>
            </group>
            <group ref={(el) => { leftFingers.current[2] = el; }} position={[-0.046, -0.255, 0]} rotation={[0.17, 0, -0.016]}>
              <mesh position={[0, -0.16, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.050, 0.32, 0.08]} />
              </mesh>
            </group>
            <group ref={(el) => { leftFingers.current[3] = el; }} position={[-0.104, -0.25, 0]} rotation={[0.22, 0, -0.042]}>
              <mesh position={[0, -0.125, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.044, 0.25, 0.08]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ─── RIGHT ARM (Raised Organic Live Waving Arm) ─── */}
      <group ref={rightShoulder} position={[0.9, 0.7, 0]}>
        <mesh material={suitMaterial}>
          <sphereGeometry args={[0.25, 32, 32]} />
        </mesh>
        <mesh material={suitMaterial} position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.18, 0.8]} />
        </mesh>
        <group ref={rightElbow} position={[0, -0.8, 0]}>
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.18, 32, 32]} />
          </mesh>
          <mesh material={suitMaterial} position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.22, 0.8, 0.22]} />
          </mesh>

          {/* Hand + Silver Bracelet with Orange Gem + Smart Ring */}
          <group ref={rightHand} position={[0, -0.85, 0]}>
            <mesh material={metalMaterial} position={[0, 0.09, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
            </mesh>
            <mesh material={shoeMaterial} position={[0, 0.05, 0]}>
              <cylinderGeometry args={[0.125, 0.125, 0.04, 24]} />
            </mesh>
            <mesh material={metalMaterial} position={[0, 0.01, 0]}>
              <cylinderGeometry args={[0.13, 0.13, 0.02, 24]} />
            </mesh>
            <mesh material={tieMaterial} position={[0, 0.05, 0.12]} rotation={[0, 0, Math.PI / 4]}>
              <boxGeometry args={[0.04, 0.04, 0.02]} />
            </mesh>

            <mesh position={[0, -0.15, 0]} material={skinMaterial} castShadow>
              <boxGeometry args={[0.3, 0.25, 0.15]} />
            </mesh>
            <group ref={rightThumb} position={[-0.145, -0.175, -0.012]} rotation={[0.16, 0.14, -0.30]}>
              <mesh position={[0, -0.115, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.06, 0.25, 0.08]} />
              </mesh>
            </group>

            {/* Index Finger + Smart Ring */}
            <group ref={(el) => { rightFingers.current[0] = el; }} position={[-0.072, -0.255, 0]} rotation={[0.11, 0, -0.032]}>
              <mesh position={[0, -0.16, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.052, 0.32, 0.08]} />
              </mesh>
              <mesh material={shoeMaterial} position={[0, -0.08, 0]}>
                <boxGeometry args={[0.058, 0.06, 0.086]} />
              </mesh>
              <mesh material={cyanAccentMaterial} position={[0, -0.08, 0.043]}>
                <boxGeometry args={[0.062, 0.015, 0.01]} />
              </mesh>
            </group>

            <group ref={(el) => { rightFingers.current[1] = el; }} position={[-0.014, -0.255, 0]} rotation={[0.14, 0, -0.008]}>
              <mesh position={[0, -0.175, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.052, 0.35, 0.08]} />
              </mesh>
            </group>
            <group ref={(el) => { rightFingers.current[2] = el; }} position={[0.046, -0.255, 0]} rotation={[0.17, 0, 0.016]}>
              <mesh position={[0, -0.16, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.050, 0.32, 0.08]} />
              </mesh>
            </group>
            <group ref={(el) => { rightFingers.current[3] = el; }} position={[0.104, -0.25, 0]} rotation={[0.22, 0, 0.042]}>
              <mesh position={[0, -0.125, 0]} material={skinMaterial} castShadow>
                <boxGeometry args={[0.044, 0.25, 0.08]} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ─── LEGS & OXFORD SHOES ─── */}
      <group ref={leftHip} position={[-0.4, -1.1, 0]}>
        <mesh material={suitMaterial}>
          <sphereGeometry args={[0.2, 32, 32]} />
        </mesh>
        <mesh material={suitMaterial} position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.18, 1.0]} />
        </mesh>
        <group position={[0, -1.0, 0]}>
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.18, 32, 32]} />
          </mesh>
          <mesh material={suitMaterial} position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.35, 1.0, 0.4]} />
          </mesh>
          <group position={[0, -1.05, 0]}>
            <mesh material={darkSkinMaterial} castShadow>
              <sphereGeometry args={[0.16, 32, 32]} />
            </mesh>
            <mesh position={[0, -0.15, 0.1]} material={shoeMaterial} castShadow>
              <boxGeometry args={[0.35, 0.25, 0.45]} />
            </mesh>
            <mesh position={[0, -0.15, 0.4]} material={shoeMaterial} castShadow>
              <boxGeometry args={[0.3, 0.15, 0.2]} />
            </mesh>
          </group>
        </group>
      </group>

      <group ref={rightHip} position={[0.4, -1.1, 0]}>
        <mesh material={suitMaterial}>
          <sphereGeometry args={[0.2, 32, 32]} />
        </mesh>
        <mesh material={suitMaterial} position={[0, -0.5, 0]} castShadow>
          <cylinderGeometry args={[0.2, 0.18, 1.0]} />
        </mesh>
        <group position={[0, -1.0, 0]}>
          <mesh material={suitMaterial}>
            <sphereGeometry args={[0.18, 32, 32]} />
          </mesh>
          <mesh material={suitMaterial} position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[0.35, 1.0, 0.4]} />
          </mesh>
          <group position={[0, -1.05, 0]}>
            <mesh material={darkSkinMaterial} castShadow>
              <sphereGeometry args={[0.16, 32, 32]} />
            </mesh>
            <mesh position={[0, -0.15, 0.1]} material={shoeMaterial} castShadow>
              <boxGeometry args={[0.35, 0.25, 0.45]} />
            </mesh>
            <mesh position={[0, -0.15, 0.4]} material={shoeMaterial} castShadow>
              <boxGeometry args={[0.3, 0.15, 0.2]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
