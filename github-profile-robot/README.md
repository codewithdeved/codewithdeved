# Vibeans Executive 3D Robot — GitHub Profile README Edition

This standalone package contains the exact authentic 3D procedural executive robot from the **Vibeans Solutions** company website, re-engineered specifically for **GitHub Profile READMEs**.

---

## What Makes This Robot Special

1. **Stands Completely Straight (Zero Leaning):** 
   - Unlike the website robot which leaned to the side to peek around hero text, this edition stands completely upright with balanced weight distribution, level shoulders, and firmly planted feet.
2. **Warm, Joyful 3D Smile:**
   - Permanent 3D curved tube smile with smooth spherical endcaps, smiling corner dimples, and a soft lower-lip shadow contour.
3. **Continuous 3D Elliptical Welcoming Wave:**
   - The robot's right arm (viewer's left) waves in a smooth 3D elliptical harmonic arc (combining lateral wave with subtle depth flexion). The wrist is angled naturally so the open palm squarely greets your visitors.
4. **Signature Vibeans Luxury Styling & Details:**
   - **Tuxedo:** Midnight Navy (`#0B132B`) tailored suit jacket with open V-neck lapels, black undershirt panel, crisp white bowtie, and 3 glowing cyan LED buttons.
   - **Jewelry & Gadgets:** Digital smartwatch with glowing cyan screen on the draped left wrist; layered silver/black bracelet with 45° orange gem on the waving right wrist; and a glowing cyan smart ring on the waving index finger.
   - **Headphones & Hair:** High-tech DJ headphones with glowing cyan cores and Vibeans signature orange headband cushion (`#ff7e00`), plus 3-layered espresso brown hair (`#1c140d`).
   - **Studio Lighting:** 4-point keynote lighting with a 24K golden-orange rim light (`#FFA700`) and cool blue key light.

---

## Quick Start: How to View the Live 3D Robot

1. Open the file directly in any modern web browser:
   - Double-click [`github-profile-robot/index.html`](file:///c:/Users/Dell%205530/Desktop/Tayyab%20Ali/Vibeans%20Solutions/vibeans-solutions-website/github-profile-robot/index.html) or right-click and choose **Open with Chrome / Edge / Firefox**.
2. **Interactive Controls Included:**
   - **Orbit & Zoom:** Click and drag with your mouse to rotate 360° or scroll to zoom in on the facial smile, fingers, or smartwatch.
   - **Themes:** Switch between **GitHub Dark** (`#0d1117`), **GitHub Dim** (`#010409`), **GitHub Light** (`#ffffff`), or **Transparent**.
   - **Camera Presets:** Toggle between **Full Body**, **Portrait (Upper Body)**, and **Face Zoom**.
   - **Wave Speed Slider:** Adjust the greeting wave cadence from slow and gentle to energetic.
   - **Export Animation Button:** Click **"● Export Animation Loop"** to automatically record a seamless 4-second 60 FPS animation loop (`.webm`) directly from the canvas!

---

## How to Embed Into Your GitHub Profile README

### Option A: As an Animated High-Res Looping Badge (Recommended for GitHub)
After exporting the `.webm` (or converting to `.gif` / `.webp` via any free tool like Ezgif):
1. Place the animated file inside your profile repository (e.g. `assets/vibeans-robot-waving.gif`).
2. Add this centered card to your profile `README.md`:

```markdown
<div align="center">
  <img src="./assets/vibeans-robot-waving.gif" width="320" alt="Tayyab Ali AI Robot Greeting" />
  <p><em>👋 Welcome to my GitHub! I'm Tayyab Ali, Founder of Vibeans Solutions.</em></p>
</div>
```

### Option B: As a React Three Fiber Component in Web Apps
If you want to use the live 3D robot inside any React, Next.js, or Three.js web project, simply import `RobotAvatar.tsx`:

```tsx
import { Canvas } from "@react-three/fiber";
import RobotAvatar from "./RobotAvatar";

export default function HeroGreeting() {
  return (
    <Canvas camera={{ position: [0, 0.1, 7.2], fov: 40 }}>
      <ambientLight intensity={0.72} />
      <directionalLight position={[10, 10, 5]} intensity={2.6} color="#e0f2fe" />
      <directionalLight position={[-10, -5, -5]} intensity={1.8} color="#FFA700" />
      <pointLight position={[0, 0, 5]} intensity={1.3} color="#0088FF" />
      
      <RobotAvatar scale={1.0} waveSpeed={1.0} />
    </Canvas>
  );
}
```

---

## File Manifest
- `index.html` — Complete standalone 3D interactive viewer with OrbitControls, theme toggles, and 60fps WebM screen recorder.
- `RobotAvatar.tsx` — Clean, dependency-free React Three Fiber component.
- `README.md` — Technical reference and GitHub embedding instructions.
