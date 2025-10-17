// src/App.jsx
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import StarfieldBackground from './StarfieldBackground';
import { translations, t } from './locales/index.js';
import './App.css';

// API 配置
const API_BASE_URL = 'https://xdcheck.okart.fun';

// 测试API连通性
const testAPIConnection = async () => {
  try {
    console.log('Testing API connection...');
    const response = await fetch(`${API_BASE_URL}/api/test`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      timeout: 5000
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('API test successful:', data);
      return { success: true, data };
    } else {
      console.error('API test failed:', response.status, response.statusText);
      return { success: false, error: `HTTP ${response.status}: ${response.statusText}` };
    }
  } catch (error) {
    console.error('API connection test failed:', error);
    return { success: false, error: error.message };
  }
};

// 白名单验证API调用（增强版）
const checkWhitelistStatus = async (address, retryCount = 0) => {
  console.log(`Checking whitelist status for address: ${address} (attempt ${retryCount + 1})`);
  
  // 首先测试API连通性
  if (retryCount === 0) {
    const apiTest = await testAPIConnection();
    if (!apiTest.success) {
      return { 
        isWhitelisted: false, 
        success: false,
        error: `API服务不可用: ${apiTest.error}`,
        errorType: 'API_UNAVAILABLE'
      };
    }
  }
  
  try {
    const requestBody = { address: address };
    console.log('Sending request:', requestBody);
    
    const response = await fetch(`${API_BASE_URL}/api/signature/is-white-address-xdcheck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(requestBody),
      timeout: 10000 // 10秒超时
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      // 特殊错误处理
      if (response.status === 405) {
        errorMessage = 'API方法不支持 (405)，可能是接口路径错误';
      } else if (response.status === 404) {
        errorMessage = 'API接口不存在 (404)';
      } else if (response.status === 500) {
        errorMessage = '服务器内部错误 (500)';
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API response data:', data);
    
    return { 
      isWhitelisted: data.isWhitelisted || false, 
      success: true,
      error: null,
      rawData: data
    };
  } catch (error) {
    console.error('Error checking whitelist status:', error);
    
    let errorType = 'UNKNOWN';
    let errorMessage = error.message;
    
    // 错误类型分类
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      errorType = 'NETWORK_ERROR';
      errorMessage = '网络连接失败，请检查网络连接';
    } else if (error.message.includes('CORS')) {
      errorType = 'CORS_ERROR';
      errorMessage = '跨域请求被阻止';
    } else if (error.message.includes('timeout')) {
      errorType = 'TIMEOUT_ERROR';
      errorMessage = '请求超时，请稍后重试';
    }
    
    // 重试机制：最多重试2次
    if (retryCount < 2 && errorType !== 'API_UNAVAILABLE') {
      console.log(`Retrying... (${retryCount + 1}/2)`);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 等待1秒后重试
      return checkWhitelistStatus(address, retryCount + 1);
    }
    
    return { 
      isWhitelisted: false, 
      success: false,
      error: errorMessage,
      errorType: errorType
    };
  }
};

// 备用验证方案（测试模式）
const testModeVerification = (address) => {
  // 基于真实数据库的测试白名单地址
  const testWhitelist = [
    '0x49afe40999fe9551be999ae4205e4dddded493a7', // 来自数据库 whitelist_usage 表
    '0x55a48983f5c070d4ad6ae259399071b25e698fc8', // 来自数据库 whitelist_usage 表
    '0xe8affb540377301efc5622435ff35d49996c3e1a', // 来自数据库 whitelist_usage 表
    '0x8da7584bf0d0977f1f7a57905cfbd0c1cc95571b'  // 用户新增地址
  ];
  
  const isWhitelisted = testWhitelist.some(addr => 
    addr.toLowerCase() === address.toLowerCase()
  );
  
  return {
    isWhitelisted,
    success: true,
    error: null,
    testMode: true
  };
};

function App() {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const [apiStatus, setApiStatus] = useState(null);
  const [language, setLanguage] = useState('zh'); // 默认中文

  // 检测钱包安装状态
  const detectWallet = () => {
    if (typeof window.ethereum !== 'undefined') {
      return 'metamask';
    }
    return null;
  };

  // 语言切换函数
  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh');
  };

  // Function to handle wallet connection
  const connectWallet = async () => {
    const walletType = detectWallet();
    
    if (!walletType) {
      setMessage(t('installMetaMask', {}, language));
      return;
    }

    try {
      setIsLoading(true);
      setMessage(t('connecting', {}, language));
      
      // 请求账户访问权限
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const connectedAddress = await signer.getAddress();
      
      // 检查网络
      const network = await provider.getNetwork();
      console.log('Connected to network:', network.name, 'Chain ID:', network.chainId);
      
      setAccount(connectedAddress);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      setIsLoading(false);
      
      if (error.code === 4001) {
        setMessage(t('userRejected', {}, language));
      } else if (error.code === -32002) {
        setMessage(t('pendingRequest', {}, language));
      } else {
        setMessage(t('connectionFailed', {}, language));
      }
    }
  };

  // Function to handle disconnection
  const disconnectWallet = () => {
    setAccount(null);
    setMessage('');
    setApiStatus(null);
  };

  // 格式化地址显示
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // 手动重试验证
  const retryVerification = async () => {
    if (!account) return;
    
    setIsLoading(true);
    setMessage(t('retryVerifying', {}, language));
    
    const result = await checkWhitelistStatus(account);
    setApiStatus(result);
    
    if (result.success) {
       if (result.testMode) {
         setMessage(result.isWhitelisted ? 
           t('testModeSuccess', { address: formatAddress(account) }, language) :
           t('testModeFailed', { address: formatAddress(account) }, language)
         );
       } else if (result.isWhitelisted) {
        setMessage(t('verificationSuccess', { address: formatAddress(account) }, language));
      } else {
        setMessage(t('verificationFailed', { address: formatAddress(account) }, language));
      }
    } else {
      let errorMsg = t('verificationError', { error: result.error }, language);
      if (result.errorType === 'API_UNAVAILABLE') {
        errorMsg += t('suggestions', {}, language);
      }
      setMessage(errorMsg);
    }
    setIsLoading(false);
  };

  // 启用测试模式
  const enableTestMode = () => {
    if (!account) return;
    
    const result = testModeVerification(account);
    setApiStatus(result);
    
    if (result.isWhitelisted) {
       setMessage(t('testModeSuccess', { address: formatAddress(account) }, language));
     } else {
       setMessage(t('testModeFailed', { address: formatAddress(account) }, language));
     }
  };

  // useEffect Hook: This runs automatically when the `account` state changes.
  useEffect(() => {
    if (account) {
      // Wallet has just been connected, so check whitelist status.
      setIsLoading(true);
      setMessage(t('verifying', {}, language));
      
      const verifyAddress = async () => {
        const result = await checkWhitelistStatus(account);
        setApiStatus(result);
        
        if (result.success) {
          if (result.isWhitelisted) {
            setMessage(t('verificationSuccess', { address: formatAddress(account) }, language));
          } else {
            setMessage(t('verificationFailed', { address: formatAddress(account) }, language));
          }
        } else {
          let errorMsg = t('verificationError', { error: result.error }, language);
          if (result.errorType === 'API_UNAVAILABLE') {
            errorMsg += t('tryOptions', {}, language);
          }
          setMessage(errorMsg);
        }
        setIsLoading(false);
      };

      verifyAddress();
    }
  }, [account, language]);

  return (
    <div className="app-container">
      <StarfieldBackground />
      
      {/* 顶部导航栏 */}
      <nav className="top-nav">
        <a 
          href="https://x.com/xdiamond_okart" 
          target="_blank" 
          rel="noopener noreferrer"
          className="twitter-link"
          title="Follow us on X (Twitter)"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>
        
        <button className="language-toggle" onClick={toggleLanguage}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <span>{language === 'zh' ? 'EN' : '中文'}</span>
        </button>
      </nav>
      
      <div className="content-wrapper">
        <header className="header">
          <div className="header-content">
            <h1>{t('title', {}, language)}</h1>
            <p>{t('subtitle', {}, language)}</p>
          </div>
        </header>

        <main className="main-content">
          {!account ? (
            <button className="connect-button" onClick={connectWallet}>
              {t('connectWallet', {}, language)}
            </button>
          ) : (
            <div className="wallet-info">
              <p className="connected-address">{t('connected', {}, language)}: {formatAddress(account)}</p>
              <button className="connect-button" onClick={disconnectWallet}>
                {t('disconnect', {}, language)}
              </button>
            </div>
          )}

          <div className="status-message">
            {/* Show a loading indicator while verifying */}
            {isLoading && <div className="spinner"></div>}
            {/* Show the final message once loading is complete */}
            {!isLoading && message && <p style={{whiteSpace: 'pre-line'}}>{message}</p>}
          </div>

          {/* 错误处理和调试工具 */}
          {account && apiStatus && !apiStatus.success && (
            <div className="error-actions">
              <button className="retry-button" onClick={retryVerification}>
                {t('retryVerification', {}, language)}
              </button>
              <button className="test-mode-button" onClick={enableTestMode}>
                {t('testMode', {}, language)}
              </button>
              <button 
                className="debug-button" 
                onClick={() => setDebugMode(!debugMode)}
              >
                {debugMode ? t('hideDebugInfo', {}, language) : t('showDebugInfo', {}, language)}
              </button>
            </div>
          )}

          {/* 调试信息 */}
          {debugMode && apiStatus && (
            <div className="debug-info">
              <h4>{t('debugInfo', {}, language)}</h4>
              <pre>{JSON.stringify(apiStatus, null, 2)}</pre>
              <p><strong>{t('apiAddress', {}, language)}:</strong> {API_BASE_URL}/api/signature/is-white-address-xdcheck</p>
              <p><strong>{t('walletAddress', {}, language)}:</strong> {account}</p>
            </div>
          )}

          {/* 白名单信息说明 */}
           {account && (
             <div className="whitelist-info">
               <h4>{t('aboutWhitelist', {}, language)}</h4>
               <p>{t('whitelistDescription', {}, language)}</p>
               <ul>
                 {t('whitelistReasons', {}, language).map((reason, index) => (
                   <li key={index}>{reason}</li>
                 ))}
               </ul>
               <p>{t('contactProject', {}, language)}</p>
               
               <h4>{t('testModeWhitelist', {}, language)}</h4>
               <p>{t('testModeDescription', {}, language)}</p>
               <ul>
                 {t('testAddresses', {}, language).map((address, index) => (
                   <li key={index}>{address}</li>
                 ))}
               </ul>
             </div>
           )}
        </main>
      </div>
    </div>
  );
}

export default App;