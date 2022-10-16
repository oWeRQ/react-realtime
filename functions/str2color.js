import crc16 from './crc16';

export default function str2color(colors = 18, saturation = 50, lightness = 50) {
  return str => {
    const hue = Math.floor(crc16(str) / 0xFFFF * colors) * 360 / colors;
    return 'hsl(' + hue + ',' + saturation + '%,' + lightness + '%)';
  };
};