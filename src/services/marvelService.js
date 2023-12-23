import { useHttp } from '../hooks/http.hook';

const useMarvelService = () => {
  const { loading, request, error, clearError } = useHttp();

  const _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  const _apiKey = 'apikey=502f067c165a2fece5b435a02b066416';

  //Функция получения группы персонажей
  const getAllCharacters = async offset => {
    const res = await request(`${_apiBase}characters?limit=9&offset=${offset}&${_apiKey}`);
    return res.data.results.map(_transformCharacter);
  };

  //Функция получения одного персонажа
  const getCharacter = async id => {
    const res = await request(`${_apiBase}characters/${id}?${_apiKey}`);
    return _transformCharacter(res.data.results[0]);
  };

  //Функция-преобразователь. Принимает объект с персонажем и трансформитрует в другой с только необходимыми данными
  const _transformCharacter = char => {
    return {
      name: char.name,
      description: char.description,
      thumbnail: char.thumbnail.path + '.' + char.thumbnail.extension,
      homepage: char.urls[0].url,
      wiki: char.urls[1].url,
      id: char.id,
      comics: char.comics.items,
    };
  };

  return { loading, error, getAllCharacters, getCharacter, clearError };
};

export default useMarvelService;
