import React, {Component} from 'react';
import './App.css';

class App extends Component {
    render() {
        const helloWorld = 'Welcome to the Road to learn React test';
        return (
            <div className="App">
                <h2>{helloWorld}</h2>
            </div>

        );
    }
}

export default App;