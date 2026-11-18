const dateFmt = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
const timeFmt = new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit' })

export const formatDate = (iso) => dateFmt.format(new Date(iso))
export const formatDateTime = (iso) => `${dateFmt.format(new Date(iso))}, ${timeFmt.format(new Date(iso))}`
export const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
