import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetitions} from '../utils';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import style from './Competitions.module.css';
import commonStyle from '../common.module.css';
import find from '../images/find.svg';

function Competitions({history, location}) {
    let [competitions, setCompetitions] = useState(null);
    let [error, setError] = useState(null);
    let searchInput = useRef(null);

    let params = new URLSearchParams(location.search);
    let search = params.get('search');

    // При монтировании компонента сразу же загружаем список лиг
    useEffect(() => {
        // Сбрасываем ошибки при обновлении данных в адресной строке
        setError(null);

        (async function () {
            try {
                let {competitions} = await loadCompetitions();

                // Если в URL задана строка поиска, то фильтруем список лиг
                if (search) {
                    competitions = competitions.filter(competition => competition.name.toLowerCase().includes(search.toLowerCase()));
                }

                setCompetitions(competitions);
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [location, search]);

    // Обработчик клика по кнопке поиска
    let findHandler = () => {
        let searchValue = searchInput.current.value.trim();
        if (searchValue) {
            let params = new URLSearchParams();
            params.append('search', searchValue);
            history.push(`/competitions/?${params.toString()}`);
            return;
        }
        history.push('/competitions');
    }

    // Обработчик нажатия на Enter в поле ввода
    let enterHandler = event => {
        if (event.keyCode === 13) findHandler();
    }

    let content = <Preloader/>;
    if (competitions) {
        content = (
            <div className={style.competition_container}>
                <div className={style.filters}>
                    <input
                        type="text"
                        className={commonStyle.text_input}
                        ref={searchInput}
                        defaultValue={search ? search : ''}
                        onKeyUp={enterHandler}
                        placeholder="Название лиги"
                    />
                    <img src={find} className={commonStyle.find_button} alt="Найти" onClick={findHandler}/>
                </div>
                <div className={style.card_container}>
                    {competitions.map(
                        competition =>
                            <div key={competition.id} className={style.card}>
                                <Link to={`/competition_calendar/?competition=${competition.id}`}>
                                    <img
                                        src={competition.emblemUrl || competition.area.flag}
                                        className={style.emblem}
                                        alt={`Эмблема ${competition.name}`}
                                    />
                                </Link>
                                <h1 className={style.competition_title}>
                                    <Link to={`/competition_calendar/?competition=${competition.id}`}>
                                        {competition.name}
                                    </Link>
                                </h1>
                                <h3 className={style.country_title}>{competition.area.name}</h3>
                                <div className={style.link_block}>
                                    <Link to={`/teams/?competition=${competition.id}`} replace>Команды</Link>
                                    <Link to={`/competition_calendar/?competition=${competition.id}`} replace>Матчи</Link>
                                </div>
                            </div>
                    )}
                </div>
            </div>
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default Competitions;