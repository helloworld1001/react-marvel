import { useEffect, useState } from 'react';

import useMarvelService from '../../services/marvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import Skeleton from '../skeleton/Skeleton';

import './charInfo.scss';

const CharInfo = ({ charId }) => {
  const [char, setChar] = useState(null);

  const { loading, error, getCharacter, clearError } = useMarvelService();

  useEffect(() => {
    updateChar();
  }, [charId]);

  const updateChar = () => {
    clearError();
    //Если из пропсов не пришел id персонажа, то выходим из функции, иначе делаем запрос на сервер
    if (!charId) {
      return;
    }

    getCharacter(charId).then(onCharLoaded);
  };

  const onCharLoaded = char => {
    setChar(char);
  };

  const skeleton = char || loading || error ? null : <Skeleton />;
  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(error || loading || !char) ? <View char={char} /> : null;

  return (
    <div className="char__info">
      {skeleton}
      {errorMessage}
      {spinner}
      {content}
    </div>
  );
};

const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = char;

  const formatComics = comics.slice(0, 10);
  const noImage = thumbnail.includes('not_available');

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt="charImg" style={{ objectFit: `${noImage ? 'fill' : 'cover'}` }} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">Homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>
      {formatComics.length ? (
        <ul className="char__comics-list">
          {formatComics.map((item, index) => (
            <li key={index} className="char__comics-item">
              {item.name}
            </li>
          ))}
        </ul>
      ) : (
        <div>no data available</div>
      )}
    </>
  );
};

export default CharInfo;
