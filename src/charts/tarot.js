// ── TAROT CARD DECK & SPREAD ────────────────────────
const TAROT_DECK = [
  { id: 0, name: 'The Fool', arcana: 'Major', meaning: 'New beginnings, innocence, spontaneity', reversed: 'Recklessness, negligence' },
  { id: 1, name: 'The Magician', arcana: 'Major', meaning: 'Resourcefulness, skill, manifesting', reversed: 'Manipulation, poor planning' },
  { id: 2, name: 'The High Priestess', arcana: 'Major', meaning: 'Intuition, mysteries, inner knowledge', reversed: 'Silence, secrets, hidden agenda' },
  { id: 3, name: 'The Empress', arcana: 'Major', meaning: 'Creativity, fertility, abundance', reversed: 'Blocked creativity, dependence' },
  { id: 4, name: 'The Emperor', arcana: 'Major', meaning: 'Authority, leadership, structure', reversed: 'Weakness, tyranny, immaturity' },
  { id: 5, name: 'The Hierophant', arcana: 'Major', meaning: 'Tradition, spirituality, guidance', reversed: 'Dogma, breaking rules, unconventional' },
  { id: 6, name: 'The Lovers', arcana: 'Major', meaning: 'Connection, relationships, choices', reversed: 'Disharmony, imbalance, indecision' },
  { id: 7, name: 'The Chariot', arcana: 'Major', meaning: 'Control, willpower, determination', reversed: 'Aggression, lack of control' },
  // Add more cards as needed...
]

export function renderTarotSpread(chart) {
  // Shuffle deck and draw 3 cards
  const deck = [...TAROT_DECK].sort(() => Math.random() - 0.5)
  const spread = deck.slice(0, 3)

  let html = `
    <div class="tarot-container">
      <div class="chart-title">3-Card Tarot Spread</div>
      
      <div class="tarot-spread">
  `

  const positions = ['Past', 'Present', 'Future']
  spread.forEach((card, i) => {
    const isReversed = Math.random() > 0.5
    html += `
      <div class="tarot-card" data-card-id="${card.id}">
        <div class="tarot-card-front ${isReversed ? 'reversed' : ''}">
          <div class="tarot-card-label">${positions[i]}</div>
          <div class="tarot-card-name">${card.name}</div>
          <div class="tarot-card-arcana">${card.arcana} Arcana</div>
          <div class="tarot-card-meaning" style="margin-top: 8px; font-size: 10px;">
            ${isReversed ? `<em>${card.reversed}</em>` : `<em>${card.meaning}</em>`}
          </div>
        </div>
      </div>
    `
  })

  html += `</div>`

  // AI Interpretation button
  html += `
    <button class="tarot-interpret-btn" onclick="generateTarotReading('${JSON.stringify(spread).replace(/'/g, "&apos;")}')">
      🔮 Get AI Interpretation
    </button>
  `

  html += `</div>`

  return html
}

export function getTarotCard(cardId) {
  return TAROT_DECK.find(c => c.id === cardId)
}
