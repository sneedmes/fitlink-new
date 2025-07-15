import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import {AuthProvider} from "./context/auth-context";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <section className='app'><App/></section>
        </AuthProvider>
    </StrictMode>,
)
