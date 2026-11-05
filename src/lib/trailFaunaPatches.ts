/**
 * Retalhos de folhagem: recortes da PRÓPRIA arte (public/trilha/patches/pN.png) que ficam NA FRENTE dos
 * bichos. Quando um animal passa atrás de um retalho, some entre as folhas, como se fizesse parte da mata.
 * Coordenadas em unidades do mundo (1000 x 2201). Gerado a partir da arte (não editar à mão).
 */
export interface FoliagePatch {
  /** retângulo da imagem do retalho */
  x: number;
  y: number;
  w: number;
  h: number;
  /** linha de "pés" do retalho: quem estiver acima (atrás) dela fica escondido */
  base: number;
  /** elipse de folhagem densa */
  cx: number;
  cy: number;
  rx: number;
  ry: number;
}

export const FOLIAGE_PATCHES: FoliagePatch[] = [
 {
  "x": 0.0,
  "y": 886.6,
  "w": 203.5,
  "h": 151.2,
  "base": 997.4,
  "cx": 101.7,
  "cy": 962.2,
  "rx": 90.1,
  "ry": 64.0
 },
 {
  "x": 501.5,
  "y": 564.0,
  "w": 174.4,
  "h": 122.1,
  "base": 652.2,
  "cx": 588.7,
  "cy": 625.0,
  "rx": 75.6,
  "ry": 49.4
 },
 {
  "x": 548.0,
  "y": 625.0,
  "w": 197.7,
  "h": 139.5,
  "base": 726.7,
  "cx": 646.8,
  "cy": 694.8,
  "rx": 87.2,
  "ry": 58.1
 },
 {
  "x": 0.0,
  "y": 1231.1,
  "w": 164.2,
  "h": 168.6,
  "base": 1355.4,
  "cx": 79.9,
  "cy": 1315.4,
  "rx": 72.7,
  "ry": 72.7
 },
 {
  "x": 331.4,
  "y": 1456.4,
  "w": 209.3,
  "h": 139.5,
  "base": 1558.1,
  "cx": 436.0,
  "cy": 1526.2,
  "rx": 93.0,
  "ry": 58.1
 },
 {
  "x": 828.5,
  "y": 1412.8,
  "w": 171.5,
  "h": 197.7,
  "base": 1559.6,
  "cx": 918.6,
  "cy": 1511.6,
  "rx": 78.5,
  "ry": 87.2
 },
 {
  "x": 0.0,
  "y": 1873.5,
  "w": 189.0,
  "h": 162.8,
  "base": 1993.3,
  "cx": 87.2,
  "cy": 1954.9,
  "rx": 90.1,
  "ry": 69.8
 },
 {
  "x": 202.0,
  "y": 2011.6,
  "w": 220.9,
  "h": 162.8,
  "base": 2131.4,
  "cx": 312.5,
  "cy": 2093.0,
  "rx": 98.8,
  "ry": 69.8
 },
 {
  "x": 766.0,
  "y": 2048.0,
  "w": 183.1,
  "h": 133.7,
  "base": 2145.2,
  "cx": 857.6,
  "cy": 2114.8,
  "rx": 79.9,
  "ry": 55.2
 },
 {
  "x": 739.8,
  "y": 1622.1,
  "w": 191.9,
  "h": 127.9,
  "base": 1714.8,
  "cx": 835.8,
  "cy": 1686.0,
  "rx": 84.3,
  "ry": 52.3
 },
 {
  "x": 149.7,
  "y": 1648.3,
  "w": 180.2,
  "h": 133.7,
  "base": 1745.5,
  "cx": 239.8,
  "cy": 1715.1,
  "rx": 78.5,
  "ry": 55.2
 },
 {
  "x": 808.1,
  "y": 799.4,
  "w": 162.8,
  "h": 151.2,
  "base": 910.2,
  "cx": 889.5,
  "cy": 875.0,
  "rx": 69.8,
  "ry": 64.0
 },
 {
  "x": 24.7,
  "y": 236.9,
  "w": 226.7,
  "h": 151.2,
  "base": 347.7,
  "cx": 138.1,
  "cy": 312.5,
  "rx": 101.7,
  "ry": 64.0
 },
 {
  "x": 715.1,
  "y": 274.7,
  "w": 197.7,
  "h": 133.7,
  "base": 371.9,
  "cx": 814.0,
  "cy": 341.6,
  "rx": 87.2,
  "ry": 55.2
 },
 {
  "x": 0.0,
  "y": 1648.3,
  "w": 136.6,
  "h": 162.8,
  "base": 1768.0,
  "cx": 58.1,
  "cy": 1729.7,
  "rx": 66.9,
  "ry": 69.8
 }
];
