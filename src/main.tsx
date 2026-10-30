import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {PermitApp} from './components/permit/app';
import './styles.css';
createRoot(document.getElementById('root')!).render(<StrictMode><PermitApp/></StrictMode>);
