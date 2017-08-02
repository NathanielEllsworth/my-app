import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
//import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

if (module.hot){
    module.hot.accept()
}

//registerServiceWorker();
