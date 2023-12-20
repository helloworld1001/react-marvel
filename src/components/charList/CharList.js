import './charList.scss';
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/marvelService';

const CharList = ({ onCurrentCharacter }) => {
  const [firstRender, setFirtstRender] = useState(true);
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [newItemsLoading, setNewItemsLoading] = useState(true);
  const [offset, setOffset] = useState(210);
  const [charEnded, setCharEnded] = useState(false);

  const marvelService = new MarvelService();

  // 1) Я создал два разных эффекта. Один навешивает обработчик события, другой делает запросы и зависит от параметра newItemsLoading

  // 2) Обработчик события я вынес ниже и единственное, что он делает, это то, что при долистывании до конца страницы переключает состояние newItemsLoading в true

  // 3) раз состояние изменилось, то сработает второй useEffect. Тут сначала мы проверяем, что это состояние правдивое. Сделано это для того, чтобы не заходить в бесконечный цикл.

  // 4) Запускается запрос на сервер, который в блоке finally меняет состояние на false, а значит из-за условия не будет образовываться бесконечный цикл.

  // 5) Данные подгрузились, отобразились. И теперь, только когда долистаем до конца, то будет повторный цикл действий.

  useEffect(() => {
    const storageCharacters = JSON.parse(localStorage.getItem('characters'));
    const storageOffset = Number(localStorage.getItem('offset'));

    if (storageCharacters) {
      setCharacters(storageCharacters);
      setOffset(storageOffset);
      setLoading(false);
    } else {
      updateCharList(offset);
    }

    setNewItemsLoading(false);
    window.addEventListener('scroll', addCharsByScroll);

    return () => {
      window.removeEventListener('scroll', addCharsByScroll);
    };
  }, []);

  useEffect(() => {
    if (newItemsLoading && !charEnded && !firstRender) {
      updateCharList(offset);
    }
    setFirtstRender(false);
  }, [newItemsLoading]);

  const updateCharList = async offset => {
    try {
      const newCharacters = await marvelService.getAllCharcters(offset);
      //Проверяем, если больше нечего загружать, то скрываем кнопку load more
      let ended = false;
      if (newCharacters.length < 9) {
        ended = true;
      }

      localStorage.setItem('offset', JSON.stringify(offset + 9));
      localStorage.setItem('characters', JSON.stringify([...characters, ...newCharacters]));

      setCharacters(characters => [...characters, ...newCharacters]);
      setLoading(false);
      setOffset(offset => offset + 9);
      setCharEnded(ended);
    } catch (error) {
      setError(true);
      setLoading(false);
    } finally {
      setNewItemsLoading(false);
    }
  };

  const addCharsByScroll = e => {
    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
      setNewItemsLoading(true);
    }
  };

  const itemRefs = useRef([]);

  const focusOnItem = i => {
    itemRefs.current.forEach(elem => {
      elem.classList.remove('char__item_selected');
    });
    itemRefs.current[i].classList.add('char__item_selected');
    itemRefs.current[i].focus();
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage />;
  }

  return (
    <div className="char__list">
      <ul className="char__grid">
        {characters.map((item, i) => (
          <li
            ref={el => (itemRefs.current[i] = el)}
            tabIndex={0}
            key={item.id}
            onClick={() => {
              onCurrentCharacter(item.id);
              focusOnItem(i);
            }}
            onKeyDown={e => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                onCurrentCharacter(item.id);
                focusOnItem(i);
              }
            }}
            className="char__item"
          >
            <img
              src={item.thumbnail}
              alt="charImg"
              style={{ objectFit: `${item.thumbnail.includes('not_available') ? 'fill' : 'cover'}` }}
            />
            <div className="char__name">{item.name}</div>
          </li>
        ))}
      </ul>
      <button
        className="button button__main button__long"
        disabled={newItemsLoading}
        style={{ display: charEnded ? 'none' : 'block' }}
        onClick={() => updateCharList(offset)}
      >
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

CharList.propTypes = {
  onCurrentCharacter: PropTypes.func.isRequired,
};

export default CharList;
