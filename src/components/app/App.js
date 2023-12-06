import { Component } from 'react';

import AppHeader from '../appHeader/AppHeader';
import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';

import decoration from '../../resources/img/vision.png';

class App extends Component {
  state = {
    currentCharacter: 1011000,
  };

  onCurrentCharacter = id => {
    this.setState({
      currentCharacter: id,
    });
  };

  render() {
    const { currentCharacter } = this.state;

    return (
      <div className="app">
        <AppHeader />
        <main>
          <ErrorBoundary>
            <RandomChar />
          </ErrorBoundary>
          <div className="char__content">
            <ErrorBoundary>
              <CharList onCurrentCharacter={this.onCurrentCharacter} />
            </ErrorBoundary>
            <ErrorBoundary>
              <CharInfo charId={currentCharacter} />
            </ErrorBoundary>
          </div>
          <img className="bg-decoration" src={decoration} alt="vision" />
        </main>
      </div>
    );
  }
}

export default App;
