import React from 'react';
import MainComponent from "./components/MainComponent/MainComponent";
import './App.css';

function App() {
    return (
        <div className="App">
            <div className="content">
                <h1>Cloud Log Viewer</h1>
                <hr />
                <MainComponent />
                <hr />
            </div>
            <footer className="footer">
                <p style={{fontSize:"12px"}}>Alex Bol 2020</p>
            </footer>
        </div>
    );
}

export default App;
