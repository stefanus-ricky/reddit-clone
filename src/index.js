import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { createRoot } from 'react-dom/client';

//import Post from './component/Post';


const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(<App tab="home" />);

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
    
//   </React.StrictMode>,
//   document.getElementById('root')
// );


