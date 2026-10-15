import {
  Plane,
  Camera,
  Map,
  Backpack,
  Compass,
  Luggage,
  TentTree,
} from 'lucide-react'

export default function TravelPattern() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0"
    >
      {/* Top Left */}
      <Plane className="absolute top-6 left-8 w-10 h-10 text-tosca/15 -rotate-12" />
      <Compass className="absolute top-20 left-1/4 w-8 h-8 text-tosca/12 rotate-45 hidden md:block" />
      
      {/* Top Right */}
      <Camera className="absolute top-8 right-12 w-9 h-9 text-tosca/15 rotate-12" />
      <Map className="absolute top-24 right-1/4 w-10 h-10 text-tosca/12 -rotate-6 hidden sm:block" />

      {/* Middle */}
      <Luggage className="absolute top-1/2 left-6 w-11 h-11 text-tosca/12 rotate-6 hidden md:block" />
      <Backpack className="absolute top-1/2 right-8 w-10 h-10 text-tosca/15 -rotate-12" />
      
      {/* Bottom Left & Right */}
      <TentTree className="absolute bottom-10 left-16 w-12 h-12 text-tosca/15 rotate-12 hidden sm:block" />
      <Plane className="absolute bottom-8 right-20 w-10 h-10 text-tosca/12 rotate-45 hidden md:block" />
      <Compass className="absolute bottom-16 right-1/3 w-8 h-8 text-tosca/15 -rotate-15" />
    </div>
  )
}
