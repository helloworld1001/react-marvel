import './charList.scss';
import { Component } from 'react';
import MarvelService from '../../services/marvelService';

class CharList extends Component {
  marvelService = new MarvelService();

  state = {
    characters: [],
  };

  componentDidMount() {
    this.updateCharList();
  }

  updateCharList = async () => {
    const newCharacters = await this.marvelService.getAllCharcters();
    console.log(newCharacters);
    this.setState({ characters: newCharacters });
    console.log(this.state);
  };

  render() {
    const { characters } = this.state;

    return (
      <div className="char__list">
        <ul className="char__grid">
          {characters.map((item, index) => (
            <li key={index} className="char__item">
              <img
                src={item.thumbnail}
                alt="charImg"
                style={{ objectFit: `${item.thumbnail.includes('not_available') ? 'fill' : 'cover'}` }}
              />
              <div className="char__name">{item.name}</div>
            </li>
          ))}
        </ul>
        <button className="button button__main button__long">
          <div className="inner">load more</div>
        </button>
      </div>
    );
  }
}

export default CharList;
