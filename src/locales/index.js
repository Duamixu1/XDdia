// src/locales/index.js
export const translations = {
  en: {
    // Header
    title: "XDiamond",
    subtitle: "First Algorithm Generative NFT On XLayer",
    
    // Wallet Connection
    connectWallet: "Connect Wallet",
    disconnect: "Disconnect",
    connected: "Connected",
    
    // Status Messages
    connecting: "Connecting wallet...",
    verifying: "Verifying your address...",
    retryVerifying: "Re-verifying your address...",
    
    // Success Messages
    verificationSuccess: "✅ Verification successful! Address {address} is on the whitelist.",
    testModeSuccess: "🧪 Test mode: Address {address} is in the real data-based test whitelist.\n\n💡 Test whitelist is based on addresses used in the database.",
    
    // Error Messages
    verificationFailed: "❌ Verification failed, address {address} is not on the whitelist.",
    verificationError: "⚠️ Error during verification: {error}",
    testModeFailed: "🧪 Test mode: Address {address} is not in the test whitelist.\n\n💡 Test whitelist is based on addresses used in the database.",
    
    // Wallet Errors
    userRejected: "User rejected the connection request.",
    pendingRequest: "There is a pending connection request in MetaMask, please check your wallet.",
    connectionFailed: "Failed to connect wallet, please try again.",
    installMetaMask: "Please install MetaMask wallet first. Click https://metamask.io to download and install.",
    
    // API Errors
    apiUnavailable: "API service unavailable",
    networkError: "Network connection failed, please check your network connection",
    corsError: "Cross-origin request blocked",
    timeoutError: "Request timeout, please try again later",
    
    // Suggestions
    suggestions: "\n\n💡 Suggestions:\n1. Check network connection\n2. Try again later\n3. Contact technical support",
    tryOptions: "\n\n💡 You can try:\n1. Click the \"Retry Verification\" button\n2. Use \"Test Mode\" for local verification",
    
    // Buttons
    retryVerification: "🔄 Retry Verification",
    testMode: "🧪 Test Mode",
    showDebugInfo: "🔧 Show Debug Info",
    hideDebugInfo: "🔧 Hide Debug Info",
    
    // Debug Info
    debugInfo: "🔧 Debug Information",
    apiAddress: "API Address",
    walletAddress: "Wallet Address",
    
    // Whitelist Info
    aboutWhitelist: "📋 About Whitelist",
    whitelistDescription: "Your whitelist information is stored in the project backend database. If verification fails, possible reasons:",
    whitelistReasons: [
      "Your address is not on the whitelist",
      "API service is temporarily unavailable",
      "Network connection issues"
    ],
    contactProject: "To be added to the whitelist, please contact the project team.",
    
    // Test Mode Whitelist
    testModeWhitelist: "🧪 Test Mode Whitelist Addresses",
    testModeDescription: "Current test mode includes the following real database-based addresses:",
    testAddresses: [
      "0x49af...493a7 (Database used)",
      "0x55a4...698fc8 (Database used)",
      "0xe8af...c3e1a (Database used)",
      "0x8da7...95571b (New address)"
    ],
    
    // Language
    language: "Language",
    switchLanguage: "Switch Language"
  },
  
  zh: {
    // Header
    title: "XDiamond",
    subtitle: "XLayer上首个算法生成NFT",
    
    // Wallet Connection
    connectWallet: "连接钱包",
    disconnect: "断开连接",
    connected: "已连接",
    
    // Status Messages
    connecting: "正在连接钱包...",
    verifying: "正在验证您的地址...",
    retryVerifying: "正在重新验证您的地址...",
    
    // Success Messages
    verificationSuccess: "✅ 验证成功！地址 {address} 在白名单中。",
    testModeSuccess: "🧪 测试模式：地址 {address} 在基于真实数据的测试白名单中。\n\n💡 测试白名单基于数据库中已使用的地址。",
    
    // Error Messages
    verificationFailed: "❌ 验证失败，地址 {address} 不在白名单中。",
    verificationError: "⚠️ 验证过程中出现错误：{error}",
    testModeFailed: "🧪 测试模式：地址 {address} 不在测试白名单中。\n\n💡 测试白名单基于数据库中已使用的地址。",
    
    // Wallet Errors
    userRejected: "用户拒绝了连接请求。",
    pendingRequest: "MetaMask 中已有待处理的连接请求，请检查钱包。",
    connectionFailed: "连接钱包失败，请重试。",
    installMetaMask: "请先安装 MetaMask 钱包。点击 https://metamask.io 下载安装。",
    
    // API Errors
    apiUnavailable: "API服务不可用",
    networkError: "网络连接失败，请检查网络连接",
    corsError: "跨域请求被阻止",
    timeoutError: "请求超时，请稍后重试",
    
    // Suggestions
    suggestions: "\n\n💡 建议：\n1. 检查网络连接\n2. 稍后重试\n3. 联系技术支持",
    tryOptions: "\n\n💡 可以尝试：\n1. 点击重试验证按钮\n2. 使用测试模式进行本地验证",
    
    // Buttons
    retryVerification: "🔄 重试验证",
    testMode: "🧪 测试模式",
    showDebugInfo: "🔧 显示调试信息",
    hideDebugInfo: "🔧 隐藏调试信息",
    
    // Debug Info
    debugInfo: "🔧 调试信息",
    apiAddress: "API地址",
    walletAddress: "钱包地址",
    
    // Whitelist Info
    aboutWhitelist: "📋 关于白名单",
    whitelistDescription: "您的白名单信息存储在项目后端数据库中。如果验证失败，可能的原因：",
    whitelistReasons: [
      "您的地址不在白名单中",
      "API服务暂时不可用",
      "网络连接问题"
    ],
    contactProject: "如需添加到白名单，请联系项目方。",
    
    // Test Mode Whitelist
    testModeWhitelist: "🧪 测试模式白名单地址",
    testModeDescription: "当前测试模式包含以下基于真实数据库的地址：",
    testAddresses: [
      "0x49af...493a7 (数据库已使用)",
      "0x55a4...698fc8 (数据库已使用)",
      "0xe8af...c3e1a (数据库已使用)",
      "0x8da7...95571b (新增地址)"
    ],
    
    // Language
    language: "语言",
    switchLanguage: "切换语言"
  }
};

// Helper function to get translated text with parameter substitution
export const t = (key, params = {}, language = 'zh') => {
  const keys = key.split('.');
  let value = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value === 'string') {
    // Replace parameters in the string
    return value.replace(/\{(\w+)\}/g, (match, param) => {
      return params[param] || match;
    });
  }
  
  return value || key;
};

export default translations;