import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import './index.css'
import App from './App.tsx'

import { css as notoSans } from './assets/fonts/NotoSansJP-Variable.ttf?subsets'
import { css as jetbrains } from './assets/fonts/JetBrainsMono-Variable.ttf?subsets'

document.documentElement.style.setProperty('--font-sans', notoSans.family ?? null);
document.documentElement.style.setProperty('--font-mono', jetbrains.family ?? null);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Toaster 
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
        },
      }}
    />
  </StrictMode>,
)
