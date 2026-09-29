/**
 * Real Device-Based Qibla & Great-Circle Bearing Utilities
 * 
 * Kaaba Coordinates in Makkah, Saudi Arabia:
 * Latitude: 21.422487
 * Longitude: 39.826206
 */

export const KAABA_COORDINATES = {
  latitude: 21.422487,
  longitude: 39.826206
} as const;

/**
 * Converts degrees to radians
 */
export function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/**
 * Converts radians to degrees
 */
export function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

/**
 * Normalizes an angle in degrees to [0, 360)
 */
export function normalizeAngle(deg: number): number {
  const normalized = deg % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

/**
 * Calculates the initial great-circle bearing from user coordinates to the Kaaba
 * relative to True North.
 * 
 * Formula:
 * Δλ = Kaaba longitude - user longitude
 * bearing = atan2(
 *   sin(Δλ) * cos(Kaaba lat),
 *   cos(user lat) * sin(Kaaba lat) - sin(user lat) * cos(Kaaba lat) * cos(Δλ)
 * )
 */
export function calculateQiblaBearing(userLat: number, userLng: number): number {
  const phi1 = toRadians(userLat);
  const phi2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaLambda = toRadians(KAABA_COORDINATES.longitude - userLng);

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);

  const bearingRad = Math.atan2(y, x);
  const bearingDeg = normalizeAngle(toDegrees(bearingRad));

  return Math.round(bearingDeg * 10) / 10;
}

/**
 * Calculates great-circle distance between user coordinates and the Kaaba in kilometers
 * using the Haversine formula.
 */
export function calculateDistanceToKaaba(userLat: number, userLng: number): number {
  const R = 6371; // Earth's mean radius in km
  const phi1 = toRadians(userLat);
  const phi2 = toRadians(KAABA_COORDINATES.latitude);
  const deltaPhi = toRadians(KAABA_COORDINATES.latitude - userLat);
  const deltaLambda = toRadians(KAABA_COORDINATES.longitude - userLng);

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Calculates the visual rotation angle for the Qibla needle:
 * visualAngle = (qiblaBearing - deviceHeading) normalized to 0°-360°
 */
export function calculateVisualQiblaAngle(qiblaBearing: number, deviceHeading: number): number {
  return normalizeAngle(qiblaBearing - deviceHeading);
}

/**
 * Checks if the device is currently facing the Qibla within a given tolerance (default ±5°)
 */
export function isQiblaAligned(qiblaBearing: number, deviceHeading: number, tolerance = 5): boolean {
  const diff = Math.abs(normalizeAngle(deviceHeading) - normalizeAngle(qiblaBearing));
  const shortestAngle = Math.min(diff, 360 - diff);
  return shortestAngle <= tolerance;
}

/**
 * Extracts normalized compass heading from a DeviceOrientationEvent
 * across iOS Safari (webkitCompassHeading) and Android Chrome/WebViews.
 */
export function getCompassHeadingFromEvent(event: DeviceOrientationEvent): {
  heading: number;
  isAbsolute: boolean;
} | null {
  // 1. iOS Safari native webkitCompassHeading (calibrated, clockwise from North)
  const iosHeading = (event as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
  if (typeof iosHeading === 'number' && !isNaN(iosHeading) && iosHeading >= 0) {
    return {
      heading: normalizeAngle(iosHeading),
      isAbsolute: true
    };
  }

  // 2. Android Chrome / Standard W3C Device Orientation
  if (typeof event.alpha === 'number' && !isNaN(event.alpha)) {
    const alpha = event.alpha;
    const beta = event.beta ?? 0;
    const gamma = event.gamma ?? 0;

    // If device is held roughly flat (< 25 deg tilt)
    if (Math.abs(beta) < 25 && Math.abs(gamma) < 25) {
      return {
        heading: normalizeAngle(360 - alpha),
        isAbsolute: Boolean(event.absolute)
      };
    }

    // 3D tilt-compensated rotation
    const rad = Math.PI / 180;
    const _x = beta * rad;
    const _y = gamma * rad;
    const _z = alpha * rad;

    const cX = Math.cos(_x);
    const cY = Math.cos(_y);
    const cZ = Math.cos(_z);
    const sX = Math.sin(_x);
    const sY = Math.sin(_y);
    const sZ = Math.sin(_z);

    const Vx = -cZ * sY - sZ * sX * cY;
    const Vy = -sZ * sY + cZ * sX * cY;

    let heading = Math.atan2(Vx, Vy) * (180 / Math.PI);
    if (heading < 0) heading += 360;

    return {
      heading: normalizeAngle(isNaN(heading) ? 360 - alpha : heading),
      isAbsolute: Boolean(event.absolute)
    };
  }

  return null;
}
