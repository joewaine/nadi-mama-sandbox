const gallery = [
  'https://images.unsplash.com/photo-1577906030551-f74baaa32230?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1464500422302-6188776dcbf3?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1574484284002-952d92456975?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542345812-d98b5cd6cf98?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1567529692333-de9fd6772897?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543353071-10c8ba85a904?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=400&q=80&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=400&q=80&auto=format&fit=crop',
]

// Keyword-based image bias so like-named items get semantically closer photography.
const keywordMap: Array<{ keys: string[]; image: string }> = [
  {
    keys: ['hummus'],
    image:
      'https://images.unsplash.com/photo-1577906030551-f74baaa32230?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['falafel'],
    image:
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['salad', 'fattoush', 'tabouleh', 'tabbouleh'],
    image:
      'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['kebab', 'shawarma', 'kefta', 'kofta', 'grilled', 'lamb', 'chicken', 'beef'],
    image:
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['pita', 'bread', 'manakish', 'manoushe'],
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['baklava', 'dessert', 'sweet', 'knafeh', 'kunefe'],
    image:
      'https://images.unsplash.com/photo-1583350568230-1f1eecb07d7a?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['baba', 'ganoush', 'dip', 'muhammara', 'labneh'],
    image:
      'https://images.unsplash.com/photo-1615937722923-67f6deaf2cc9?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['soup', 'lentil', 'shorba'],
    image:
      'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['rice', 'pilaf', 'mujadara'],
    image:
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['cocktail', 'wine', 'arak', 'aperitif', 'spritz'],
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['tea', 'coffee', 'espresso', 'latte'],
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['spice', 'zaatar', "za'atar", 'sumac', 'retail'],
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['olive', 'pickle', 'mezze'],
    image:
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['fish', 'seafood', 'octopus', 'shrimp', 'calamari'],
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80&auto=format&fit=crop',
  },
]

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function useFoodImages() {
  function imageFor(name: string, id?: string): string {
    const normalized = (name || '').toLowerCase()
    const match = keywordMap.find(entry =>
      entry.keys.some(k => normalized.includes(k)),
    )
    if (match) return match.image
    const seed = id || name || ''
    return gallery[hashString(seed) % gallery.length]
  }

  return { imageFor }
}
