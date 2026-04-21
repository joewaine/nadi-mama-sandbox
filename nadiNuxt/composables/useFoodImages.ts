const FALLBACK =
  'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=400&q=80&auto=format&fit=crop'

// Order matters: earlier entries win. Drinks before spices so "Sumac Paloma" hits cocktail, not sumac.
const keywordMap: Array<{ keys: string[]; image: string }> = [
  {
    keys: [
      'cocktail', 'wine', 'arak', 'aperitif', 'spritz',
      'negroni', 'paloma', 'martini',
    ],
    image:
      'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['tea', 'coffee', 'espresso', 'latte'],
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['hummus'],
    image:
      'https://images.unsplash.com/photo-1590005024862-6b67679a29fb?w=400&q=80&auto=format&fit=crop',
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
    keys: [
      'fish', 'seafood', 'octopus', 'shrimp', 'calamari',
      'branzino', 'tagine',
    ],
    image:
      'https://images.unsplash.com/photo-1559847844-5315695dadae?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: [
      'kebab', 'shawarma', 'kefta', 'kafta', 'kofta', 'grilled',
      'lamb', 'chicken', 'beef', 'tawook', 'wrap', 'bowl',
    ],
    image:
      'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: [
      'pita', 'bread', 'manakish', 'manoushe', 'manousheh',
      'lahm', 'ajeen', 'flatbread', 'saj',
    ],
    image:
      'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['baklava', 'knafeh', 'kunefe', 'dessert', 'sweet'],
    image:
      'https://images.unsplash.com/photo-1578020190125-f4f7c18bc9cb?w=400&q=80&auto=format&fit=crop',
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
    keys: ['rice', 'pilaf', 'mujadara', 'freekeh', 'fries'],
    image:
      'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ["za'atar", 'zaatar', 'sumac', 'spice', 'retail'],
    image:
      'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&q=80&auto=format&fit=crop',
  },
  {
    keys: ['olive', 'pickle', 'mezze', 'padron', 'pepper'],
    image:
      'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&q=80&auto=format&fit=crop',
  },
]

export function useFoodImages() {
  function imageFor(name: string, _id?: string): string {
    const normalized = (name || '').toLowerCase()
    const match = keywordMap.find(entry =>
      entry.keys.some(k => normalized.includes(k)),
    )
    return match ? match.image : FALLBACK
  }

  return { imageFor }
}
