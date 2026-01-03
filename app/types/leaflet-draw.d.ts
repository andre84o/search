/* eslint-disable @typescript-eslint/no-explicit-any */
import * as L from 'leaflet';

declare module 'leaflet' {
  namespace Control {
    class Draw extends Control {
      constructor(options?: any);
    }
  }
}

declare module 'leaflet-draw' {
  // This module augments leaflet
}
