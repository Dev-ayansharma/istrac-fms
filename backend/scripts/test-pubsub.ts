
import { pubsub } from '../src/lib/pubsub.js'

pubsub.subscribe('cms', (message) => {
  console.log('Received on cms channel:', message)
})

setTimeout(() => {
  pubsub.publish('cms', { blockKey: 'hero_title', action: 'updated' })
}, 1000)