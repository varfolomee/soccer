import React, {useState, useEffect, useRef} from 'react';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import MatchList from '../MatchList/MatchList';
import ShowCountControl from '../ShowCountControl/ShowCountControl';
import DateSelector from '../DateSelector/DateSelector';
import {withRouter} from 'react-router-dom';
import {loadTeamCalendar, loadTeam, matchesSearchFilter, matchesDateFilter} from '../utils';
import {DEFAULT_SHOW_COUNT, DEFAULT_SHOW_STEP} from '../settings';
import style from './TeamCalendar.module.css';
import commonStyle from '../common.module.css';
import logoCap from '../images/logo_cap.png';
import find from '../images/find.svg';

const PLAYER_POSITION_TRANSLATOR = {
    'Midfielder': 'Полузащитник',
    'Attacker': 'Атакующий',
    'Goalkeeper': 'Голкипер',
    'Defender': 'Защитник',
}

function TeamCalendar({location, history}) {
    let [team, setTeam] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
    let [error, setError] = useState(null);
    let [showSquad, setShowSquad] = useState(false);
    let searchInput = useRef(null);
    let dateFromInput = useRef(null);
    let dateToInput = useRef(null);

    let params = new URLSearchParams(location.search);
    let teamId = params.get('team');
    let search = params.get('search');
    let dateFrom = params.get('dateFrom');
    let dateTo = params.get('dateTo');

    useEffect(() => {
        // Сбрасываем ошибки при обновлении данных в адресной строке
        setError(null);

        if (!teamId) {
            setError('Некорректный URL');
            return;
        }

        (async function () {
            try {
                let {matches} = await loadTeamCalendar(teamId);

                // Применяем фильтры
                if (search) matches = matchesSearchFilter(matches, search);
                if (dateFrom || dateTo) matches = matchesDateFilter(matches, dateFrom, dateTo)

                let team = await loadTeam(teamId);
                setMatches(matches);
                setTeam(team);
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [dateFrom, dateTo, location, search, teamId]);

    let showMoreHandler = () => {
        setCountForShow(countForShow + DEFAULT_SHOW_STEP);
    }

    let showSquadHandler = () => {
        setShowSquad(!showSquad);
    }

    // Обработчик клика по кнопке поиска
    let findHandler = () => {
        let params = new URLSearchParams();
        params.append('team', teamId);

        let searchValue = searchInput.current.value.trim();
        if (searchValue) params.append('search', searchValue);

        // Обрабатываем выбор дат
        let dateFromValue = dateFromInput.current.value;
        let dateToValue = dateToInput.current.value;
        if (dateFromValue) params.append('dateFrom', dateFromValue);
        if (dateToValue) params.append('dateTo', dateToValue);

        history.push(`/team_calendar/?${params.toString()}`);
    }

    // Обработчик нажатия на Enter в поле ввода
    let enterHandler = event => {
        if (event.keyCode === 13) findHandler();
    }

    let content = <Preloader/>;
    if (team && matches) {
        let matchesForShow = matches.filter((match, index) => index < countForShow);
        content = (
            <div className={style.teams_calendar_container}>
                <h1 className={commonStyle.competition_title}>{team.name}</h1>
                <div className={style.team_info}>
                    {team.crestUrl ?
                        <img
                            className={style.emblem} src={team.crestUrl}
                            alt="no logo"
                            onError={e => e.target.src = logoCap}
                        />
                        :
                        ''
                    }
                    <ul className={style.summary_info}>
                        {team.shortname ? <li><span>{team.shortname}</span></li> : ''}
                        {team.address ? <li><span>{team.address}</span></li> : ''}
                        {team.website ? <li><a href={team.website}>сайт команды</a></li> : ''}
                        {team.email ? <li><a href={`mailto:${team.email}`}>{team.email}</a></li> : ''}
                        {team.founded ? <li>{team.founded}</li> : ''}
                        {team.venue ? <li>{team.venue}</li> : ''}
                    </ul>
                    {team.squad.length > 0 ?
                        <div className={style.squad_block}>
                            <span className={style.show_squad_button} onClick={showSquadHandler}>
                                {showSquad ? "Скрыть состав" : "Показать состав"}
                            </span>
                            {showSquad ?
                                <div className={style.squad_table_container}>
                                    <table className={style.squad_table}>
                                        <tbody>
                                        {team.squad.map(
                                            player =>
                                                <tr key={player.id}>
                                                    <td>
                                                        {player.name}
                                                    </td>
                                                    <td>
                                                        {player.position ?
                                                            PLAYER_POSITION_TRANSLATOR[player.position] || player.position
                                                            :
                                                            ''
                                                        }
                                                    </td>
                                                </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                                :
                                ''
                            }
                        </div>
                        :
                        ''
                    }
                </div>
                <div className={commonStyle.filters}>
                    <DateSelector
                        dateToRef={dateToInput}
                        dateFromRef={dateFromInput}
                        dateToDefault={dateTo}
                        dateFromDefault={dateFrom}
                        dateChangeHandler={findHandler}
                    />
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
                <MatchList matches={matchesForShow} totalCount={matches.length}/>
                {matches.length > countForShow ?
                    <ShowCountControl
                        currentCount={countForShow}
                        totalCount={matches.length}
                        changeCountHandler={showMoreHandler}
                    />
                    :
                    ''
                }
            </div>
        )
    }
    if (error) {
        content = <ErrorDisplay text={error}/>;
    }

    return <div>{content}</div>;
}

export default withRouter(TeamCalendar);