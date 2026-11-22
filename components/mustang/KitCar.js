"use client";

import CarStage from "@/components/mustang/CarStage";

// The kit's head: the ad's 3D car (CarStage in its bare `spot` mode, with no clock, so it
// stays draggable and turns with the arrow keys), gliding and turning into place as on the
// landing. The ad's no-WebGL still is the poster until the model is ready, and stays if it
// can't load.
const SPOT = { spin: 0, yaw0: -0.62, intro: true, turnIn: true, zoom: 0.56, lift: 0.04 };

export default function KitCar() {
  return (
    <div className="kit-head-car">
      <CarStage spot={SPOT} className="kit-car">
        <img className="kit-car-poster" src="/pitch/mustang/car-fallback.webp" width="1680" height="693" alt="" fetchPriority="high" />
      </CarStage>
      <p className="kit-car-hint" aria-hidden="true">Drag to turn · 360°</p>
    </div>
  );
}
