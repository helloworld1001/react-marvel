import './charList.scss';
import { Component } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/marvelService';

class CharList extends Component {
  marvelService = new MarvelService();

  state = {
    characters: [],
    loading: true,
    error: false,
    newItemLoading: false,
    offset: 210,
    charEnded: false,
  };

  componentDidMount() {
    this.updateCharList(this.state.offset);
  }

  updateCharList = async offset => {
    this.setState({ newItemLoading: true });
    try {
      const newCharacters = await this.marvelService.getAllCharcters(offset);
      let ended = false;
      //Проверяем, если больше нечего загружать, то скрываем кнопку load more
      if (newCharacters.length < 9) {
        ended = true;
      }
      this.setState(({ characters, offset }) => ({
        characters: [...characters, ...newCharacters],
        loading: false,
        newItemLoading: false,
        offset: offset + 9,
        charEnded: ended,
      }));
    } catch (error) {
      this.setState({
        error: true,
        loading: false,
        newItemLoading: false,
      });
    }
  };

  render() {
    const { characters, error, offset, loading, newItemLoading, charEnded } = this.state;
    const { onCurrentCharacter } = this.props;

    if (loading) {
      return <Spinner />;
    }

    if (error) {
      return <ErrorMessage />;
    }

    return (
      <div className="char__list">
        <ul className="char__grid">
          {characters.map(item => (
            <li key={item.id} onClick={() => onCurrentCharacter(item.id)} className="char__item">
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
          disabled={newItemLoading}
          style={{ display: charEnded ? 'none' : 'block' }}
          onClick={() => this.updateCharList(offset)}
        >
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
