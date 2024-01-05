import './comicsList.scss';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import useMarvelService from '../../services/marvelService';
import Spinner from '../spinner/Spinner';

const ComicsList = () => {
  const [comics, setComics] = useState([]);
  const [offset, setOffset] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const { error, getAllComics } = useMarvelService();

  useEffect(() => {
    updateComicsList(offset);
    setFirstRender(false);
  }, []);

  const updateComicsList = offset => {
    getAllComics(offset).then(onComicsListLoaded);
  };

  const onComicsListLoaded = newComics => {
    console.log(newComics);
    setComics(comics => [...comics, ...newComics]);
    setOffset(offset => offset + 8);
  };

  if (firstRender) {
    return <Spinner />;
  }

  return (
    <div className="comics__list">
      <ul className="comics__grid">
        {comics.map((comic, i) => (
          <li className="comics__item" key={i}>
            <Link to={`/comics/${comic.id}`}>
              <img src={comic.thumbnail} alt="ultimate war" className="comics__item-img" />
              <div className="comics__item-name">{comic.title}</div>
              <div className="comics__item-price">{comic.price} $</div>
            </Link>
          </li>
        ))}
      </ul>
      <button onClick={() => updateComicsList(offset)} className="button button__main button__long">
        <div className="inner">load more</div>
      </button>
    </div>
  );
};

export default ComicsList;
