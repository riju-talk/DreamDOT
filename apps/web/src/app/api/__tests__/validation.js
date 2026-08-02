/**
 * Validation Script for Chat API Endpoints (P4.3)
 * Checks that all required endpoints exist and have proper structure
 */

const fs = require('fs')
const path = require('path')

const endpoints = [
  'apps/web/src/app/api/conversations/route.js',
  'apps/web/src/app/api/conversations/[id]/messages/route.js',
  'apps/web/src/app/api/servers/route.js',
  'apps/web/src/app/api/servers/[id]/channels/route.js'
]

const requiredElements = {
  'apps/web/src/app/api/conversations/route.js': {
    exports: ['GET', 'POST'],
    keywords: ['validatePagination', 'getServerSession', 'Unauthorized', 'Conversation', 'Message']
  },
  'apps/web/src/app/api/conversations/[id]/messages/route.js': {
    exports: ['GET', 'POST'],
    keywords: ['validatePagination', 'getServerSession', 'participants', 'conversationId', '4000']
  },
  'apps/web/src/app/api/servers/route.js': {
    exports: ['GET', 'POST'],
    keywords: ['getServerSession', 'Unauthorized', 'servers']
  },
  'apps/web/src/app/api/servers/[id]/channels/route.js': {
    exports: ['GET'],
    keywords: ['getServerSession', 'TEXT ONLY', 'channels', 'text']
  }
}

console.log('🔍 Validating Chat API Endpoints (P4.3)...\n')

let allPassed = true

endpoints.forEach((endpoint) => {
  const requirements = requiredElements[endpoint]
  
  try {
    if (!fs.existsSync(endpoint)) {
      console.log(`❌ FAIL: ${endpoint} - File not found`)
      allPassed = false
      return
    }
    
    const content = fs.readFileSync(endpoint, 'utf8')
    
    // Check for exports
    let exportsFound = true
    requirements.exports.forEach(exp => {
      if (!content.includes(`export async function ${exp}(`)) {
        console.log(`❌ FAIL: ${endpoint} - Missing export ${exp}`)
        exportsFound = false
        allPassed = false
      }
    })
    
    // Check for keywords
    let keywordsFound = true
    requirements.keywords.forEach(keyword => {
      if (!content.includes(keyword)) {
        console.log(`❌ FAIL: ${endpoint} - Missing keyword "${keyword}"`)
        keywordsFound = false
        allPassed = false
      }
    })
    
    if (exportsFound && keywordsFound) {
      console.log(`✅ PASS: ${endpoint}`)
    }
  } catch (error) {
    console.log(`❌ FAIL: ${endpoint} - ${error.message}`)
    allPassed = false
  }
})

console.log('\n✅ Validation Complete')
if (allPassed) {
  console.log('All endpoints validated successfully!')
  process.exit(0)
} else {
  console.log('Some endpoints failed validation!')
  process.exit(1)
}
