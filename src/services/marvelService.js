class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=502f067c165a2fece5b435a02b066416';

  //Функция-преобразователь. Принимает объект с персонажем и трансформитрует в другой с только необходимыми данными
  _transformCharacter = char => {
    return {
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
    };
  };

  //Универсальная функция которая осуществляет fetch-запрос
  getResource = async url => {
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  //Функция получения группы персонажей
  getAllCharcters = async () => {
    const res = await this.getResource(`${this._apiBase}characters?limit=9&offset=210&${this._apiKey}`);
    return res.data.results.map(this._transformCharacter);
  };

  //Функция получения одного персонажа
  getCharacter = async id => {
    const res = await this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
    return this._transformCharacter(res.data.results[0]);
  };
}

export default MarvelService;
