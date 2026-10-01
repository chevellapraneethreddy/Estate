/**
 * Generates a valid Gaussian Splat file in ASCII PLY format.
 * Includes positions, scales, quaternions, opacity, and diffuse color spherical harmonics.
 */
export function generateHouseSplat(_propertyName: string): string {
  const points: Array<{ x: number; y: number; z: number; r: number; g: number; b: number }> = [];

  // 1. Generate Floor (Greenish point grid at z = 0.0)
  for (let x = -2.5; x <= 2.5; x += 0.25) {
    for (let y = -2.5; y <= 2.5; y += 0.25) {
      points.push({ x, y, z: 0.0, r: 40, g: 167, b: 69 });
    }
  }

  // 2. Generate Walls (Along the perimeter)
  // Wall at x = -2.5 (Left wall, indigo)
  for (let y = -2.5; y <= 2.5; y += 0.25) {
    for (let z = 0.0; z <= 1.8; z += 0.25) {
      points.push({ x: -2.5, y, z, r: 99, g: 102, b: 241 });
    }
  }
  // Wall at x = 2.5 (Right wall, indigo)
  for (let y = -2.5; y <= 2.5; y += 0.25) {
    for (let z = 0.0; z <= 1.8; z += 0.25) {
      points.push({ x: 2.5, y, z, r: 99, g: 102, b: 241 });
    }
  }
  // Wall at y = -2.5 (Front wall, orange/red)
  for (let x = -2.5; x <= 2.5; x += 0.25) {
    for (let z = 0.0; z <= 1.8; z += 0.25) {
      // Add a door cutout at x = 0
      if (Math.abs(x) < 0.5 && z < 1.2) continue;
      points.push({ x, y: -2.5, z, r: 249, g: 115, b: 22 });
    }
  }
  // Wall at y = 2.5 (Back wall, orange/red)
  for (let x = -2.5; x <= 2.5; x += 0.25) {
    for (let z = 0.0; z <= 1.8; z += 0.25) {
      // Add windows cutouts at x = -1.25 and x = 1.25
      if ((Math.abs(x - 1.25) < 0.4 || Math.abs(x + 1.25) < 0.4) && z > 0.6 && z < 1.4) continue;
      points.push({ x, y: 2.5, z, r: 249, g: 115, b: 22 });
    }
  }

  // 3. Generate Roof (Gold/Yellow points peaking at x = 0)
  for (let y = -2.6; y <= 2.6; y += 0.25) {
    for (let x = -2.6; x <= 2.6; x += 0.25) {
      const zHeight = 1.8 + (2.5 - Math.abs(x)) * 0.4;
      points.push({ x, y, z: zHeight, r: 234, g: 179, b: 8 });
    }
  }

  // 4. Build standard Gaussian Splat PLY Header
  const header = `ply
format ascii 1.0
element vertex ${points.length}
property float x
property float y
property float z
property float scale_0
property float scale_1
property float scale_2
property float rot_0
property float rot_1
property float rot_2
property float rot_3
property float opacity
property float f_dc_0
property float f_dc_1
property float f_dc_2
end_header
`;

  // Standard splat properties
  const scale = -3.2; // log scale of splat size
  const rot_w = 1.0;
  const rot_x = 0.0;
  const rot_y = 0.0;
  const rot_z = 0.0;
  const opacity = 4.5; // logit scale of opacity

  let body = '';
  for (const p of points) {
    // Convert RGB colors to Spherical Harmonics color coefficients (scale by formula: f_dc = (val / 255 - 0.5) / 0.28209)
    const f_dc_0 = (p.r / 255.0 - 0.5) / 0.28209;
    const f_dc_1 = (p.g / 255.0 - 0.5) / 0.28209;
    const f_dc_2 = (p.b / 255.0 - 0.5) / 0.28209;
    body += `${p.x.toFixed(4)} ${p.y.toFixed(4)} ${p.z.toFixed(4)} ${scale} ${scale} ${scale} ${rot_w} ${rot_x} ${rot_y} ${rot_z} ${opacity} ${f_dc_0.toFixed(4)} ${f_dc_1.toFixed(4)} ${f_dc_2.toFixed(4)}\n`;
  }

  return header + body;
}
