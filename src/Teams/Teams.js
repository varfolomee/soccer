import React, {useState, useEffect, useRef} from 'react';
import {Link} from 'react-router-dom';
import {loadCompetition, loadTeams} from '../utils';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import SeasonSelector from '../SeasonSelector/SeasonSelector';
import logoCap from '../images/logo_cap.png';
import style from './Teams.module.css';
import commonStyle from '../common.module.css';
import find from '../images/find.svg';
import {CURRENT_SEASON} from '../settings';

function Teams({history, location}) {
    let [competition, setCompetition] = useState(null);
    let [teams, setTeams] = useState(null);
    let [error, setError] = useState(null);
    let searchInput = useRef(null);
    let seasonInput = useRef(null);

    let params = new URLSearchParams(location.search);
    let competitionId = params.get('competition');
    let search = params.get('search');
    let season = params.get('season');

    useEffect(() => {
        // Сбрасываем ошибки при обновлении данных в адресной строке
        setError(null);

        if (!competitionId) {
            setError('Некорректный URL');
            return;
        }

        (async function () {
            try {
                let {teams} = await loadTeams(competitionId, season);

                // При необходимости фильтруем элементы по текущим параметрам поиска
                if (search) teams = teams.filter(team => team.name.toLowerCase().includes(search.toLowerCase()));

                let competition = await loadCompetition(competitionId);
                setTeams(teams);
                setCompetition(competition);
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [location, competitionId, search, season]);

    // Обработчик клика по кнопке поиска
    let findHandler = () => {
        let params = new URLSearchParams();
        params.append('competition', competitionId);

        // Обрабатываем строку поиска
        let searchValue = searchInput.current.value.trim();
        if (searchValue) params.append('search', searchValue);

        // Обрабатываем выбор сезона
        let seasonValue = seasonInput.current.value.trim();
        if (seasonValue !== CURRENT_SEASON) params.append('season', seasonValue);

        history.push(`/teams/?${params.toString()}`);
    }

    // Обработчик нажатия на Enter в поле ввода
    let enterHandler = event => {
        if (event.keyCode === 13) findHandler();
    }

    let content = <Preloader/>

    // При формировании карточек команд учитываем, что для некоторых команд api не возвращает доступное лого.
    // Но даже если лого есть в api, оно может быть недоступно для загрузки.
    // В этом случае на его место вставляем заглушку.

    if (teams && competition) {
        content = (
            <div className={style.teams_container}>
                <h1 className={commonStyle.competition_title}>{competition.name}</h1>
                {teams.length ? <h6 className={style.teams_counter}>Всего команд: {teams.length}</h6> : ''}
                <div className={commonStyle.filters}>
                    <SeasonSelector ref={seasonInput} defaultValue={season} seasonChangeHandler={findHandler}/>
                    <input
                        type="text"
                        className={commonStyle.text_input}
                        ref={searchInput}
                        defaultValue={search ? search : ''}
                        onKeyUp={enterHandler}
                        placeholder="Название команды"
                    />
                    <img src={find} className={commonStyle.find_button} alt="Найти" onClick={findHandler}/>
                </div>
                <ul>
                    {teams.map(
                        team =>
                            <li key={team.id} className={style.card}>
                                <div className={style.emblem_block}>
                                    {team.crestUrl ?
                                        <img
                                            className={style.emblem} src={team.crestUrl}
                                            alt=""
                                            onError={e => e.target.src = logoCap}
                                        />
                                        :
                                        ''
                                    }
                                </div>
                                <div className={style.link_block}>
                                    <Link to={`/team_calendar/?team=${team.id}`}>
                                        {team.name}
                                    </Link>
                                    <span className={style.country_title}>{team.area.name} ({team.venue})</span>
                                    {team.website ? <a href={team.website}>сайт команды</a> : ''}
                                </div>

                            </li>
                    )}
                </ul>
            </div>
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default Teams;