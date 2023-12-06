import './charList.scss';
import { Component } from 'react';
import PropTypes from 'prop-types';

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
    const storageCharacters = JSON.parse(localStorage.getItem('characters'));
    const storageOffset = Number(localStorage.getItem('offset'));
    if (storageCharacters) {
      this.setState({
        characters: storageCharacters,
        offset: storageOffset,
        loading: false,
      });
    } else {
      this.updateCharList(this.state.offset);
    }
    window.addEventListener('scroll', this.addCharsByScroll);
  }

  componentDidUpdate() {}

  componentWillUnmount() {
    window.removeEventListener('scroll', this.addCharsByScroll);
  }

  updateCharList = async offset => {
    this.setState({ newItemLoading: true });
    try {
      const newCharacters = await this.marvelService.getAllCharcters(offset);
      //Проверяем, если больше нечего загружать, то скрываем кнопку load more
      let ended = false;
      if (newCharacters.length < 9) {
        ended = true;
      }
      const newData = [...this.state.characters, ...newCharacters];

      localStorage.setItem('offset', JSON.stringify(this.state.offset + 9));
      localStorage.setItem('characters', JSON.stringify(newData));
      this.setState(({ offset }) => ({
        characters: newData,
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

  addCharsByScroll = e => {
    if (this.state.newItemLoading) {
      return;
    }

    if (e.target.documentElement.scrollHeight - (e.target.documentElement.scrollTop + window.innerHeight) < 100) {
      this.updateCharList(this.state.offset);
    }
  };

  itemRefs = [];

  setInputRef = ref => {
    this.itemRefs = [...this.itemRefs, ref];
  };

  focusOnItem = i => {
    this.itemRefs.forEach(elem => {
      elem.classList.remove('char__item_selected');
    });
    this.itemRefs[i].classList.add('char__item_selected');
    this.itemRefs[i].focus();
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
          {characters.map((item, i) => (
            <li
              ref={this.setInputRef}
              tabIndex={0}
              key={item.id}
              onClick={() => {
                onCurrentCharacter(item.id);
                this.focusOnItem(i);
              }}
              onKeyDown={e => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onCurrentCharacter(item.id);
                  this.focusOnItem(i);
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

CharList.propTypes = {
  onCurrentCharacter: PropTypes.func.isRequired,
};

export default CharList;
