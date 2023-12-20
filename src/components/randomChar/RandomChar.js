import { useEffect, useState } from 'react';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';
import MarvelService from '../../services/marvelService';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';

const RandomChar = () => {
  const [char, setChar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  //Вызываем конструктор API чтобы можно было совершать сетевые запросы обращаясь к экземпляру класса MarvelService
  const marvelService = new MarvelService();

  useEffect(() => {
    updateChar();
  }, []);

  //Изначально при загруке отображается спиннер, но как только в стейт сетятся новые данные loading становится false и вместо спиннера уже отображается контент
  const onCharLoaded = char => {
    setChar(char);
    setLoading(false);
  };

  //Функция которая по клику на кнопку получения рандомного персонажа изменяет loading на true и тем самым заставляет рендериться спиннер
  const onCharLoading = () => {
    setLoading(true);
  };

  //Функция, при срабатывании которой, рендерится компонент ошибки
  const onError = () => {
    setError(true);
    setLoading(false);
  };

  //Функция обновления рандомного персонажа
  const updateChar = () => {
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    //Получаем рандомного персонажа по случайному id, передаем объект этого персонажа в then, там срабатывает onCharLoaded, которая сетит этого персонажа в стейт и убирает spinner. В случае ошибки срабатывает onError()
    marvelService.getCharacter(id).then(onCharLoaded).catch(onError);
  };

  const errorMessage = error ? <ErrorMessage /> : null;
  const spinner = loading ? <Spinner /> : null;
  const content = !(error || loading) ? <View char={char} /> : null;

  return (
    <div className="randomchar">
      {errorMessage}
      {spinner}
      {content}
      <div className="randomchar__static">
        <p className="randomchar__title">Do you want to get to know him better?</p>
        <p className="randomchar__title">Or choose another one</p>
        <button className="button button__main">
          <div
            onClick={() => {
              onCharLoading();
              updateChar();
            }}
            className="inner"
          >
            try it
          </div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

//Разделяем логику, чтобы главный компонент RandomChar отвечал только за логику, что конкретно будет отображаться - ошибка, спиннер или View. View отвечает за отображение конкретного char;
const View = ({ char }) => {
  const { name, description, thumbnail, homepage, wiki } = char;
  const noImage = thumbnail.includes('not_available');
  return (
    <div className="randomchar__block">
      <img
        src={thumbnail}
        style={{ objectFit: `${noImage ? 'fill' : 'cover'}` }}
        alt="Random character"
        className="randomchar__img"
      />
      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{description ? `${description.slice(0, 160)}...` : 'No description'}</p>
        <div className="randomchar__btns">
          <a href={homepage} className="button button__main">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
