import RandomChar from '../randomChar/RandomChar';
import CharList from '../charList/CharList';
import CharSearchForm from '../charSearchForm/CharSearchForm';
import CharInfo from '../charInfo/CharInfo';
import ErrorBoundary from '../errorBoundary/ErrorBoundary';
import decoration from '../../resources/img/vision.png';
import { useState } from 'react';

const MainPage = () => {
  const [currentCharacter, setCurrentCharacter] = useState(1011000);

  const onCurrentCharacter = id => {
    setCurrentCharacter(id);
  };

  return (
    <>
      <ErrorBoundary>
        <RandomChar />
      </ErrorBoundary>
      <div className="char__content">
        <ErrorBoundary>
          <CharList onCurrentCharacter={onCurrentCharacter} />
        </ErrorBoundary>
        <ErrorBoundary>
          <div>
            <CharInfo charId={currentCharacter} />
            <CharSearchForm />
          </div>
        </ErrorBoundary>
      </div>
      <img className="bg-decoration" src={decoration} alt="vision" />
    </>
  );
};

export default MainPage;
