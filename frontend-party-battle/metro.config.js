const { getDefaultConfig } = require('expo/metro-config')
const { withNativeWind } = require('nativewind/metro')

const config = getDefaultConfig(__dirname)
// Add wasm asset support
config.resolver.assetExts.push('wasm')

// Add COEP and COOP headers to support SharedArrayBuffer
config.server.enhanceMiddleware = (middleware) => {
  return (req, res, next) => {
    res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless')
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin')
    middleware(req, res, next)
  }
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'zustand' || moduleName.startsWith('zustand/')) {
    // Resolve to its CommonJS entry (fallback to main/index.js)
    return {
      type: 'sourceFile',
      // require.resolve will pick up the CJS entry (index.js) since "exports" is bypassed
      filePath: require.resolve(moduleName),
    }
  }

  return context.resolveRequest(context, moduleName, platform)
}

config.resolver.assetExts.push('riv')

module.exports = withNativeWind(config, { input: './global.css' })
