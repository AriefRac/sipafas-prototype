// Penggabung className kecil: menerima string, falsy, atau objek { kelas: kondisi }.
export function cn(...args) {
  const out = []
  for (const a of args) {
    if (!a) continue
    if (typeof a === 'string') out.push(a)
    else if (typeof a === 'object') for (const [k, v] of Object.entries(a)) if (v) out.push(k)
  }
  return out.join(' ')
}
