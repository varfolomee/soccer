import React, {useState, useEffect, useRef} from 'react';
import Preloader from '../Preloader/Preloader';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';
import MatchList from '../MatchList/MatchList';
import ShowCountControl from '../ShowCountControl/ShowCountControl';
import SeasonSelector from '../SeasonSelector/SeasonSelector';
import DateSelector from '../DateSelector/DateSelector';
import {loadCompetition, loadCompetitionCalendar, matchesSearchFilter, matchesDateFilter} from '../utils';
import {DEFAULT_SHOW_COUNT, DEFAULT_SHOW_STEP, CURRENT_SEASON} from '../settings';
import commonStyle from '../common.module.css';
import style from './CompetitionCalendar.module.css'
import find from '../images/find.svg';

function CompetitionCalendar({history, location}) {
    let [competition, setCompetition] = useState(null);
    let [matches, setMatches] = useState(null);
    let [countForShow, setCountForShow] = useState(DEFAULT_SHOW_COUNT);
    let [error, setError] = useState(null);
    let searchInput = useRef(null);
    let seasonInput = useRef(null);
    let dateFromInput = useRef(null);
    let dateToInput = useRef(null);

    let params = new URLSearchParams(location.search);
    let competitionId = params.get('competition');
    let search = params.get('search');
    let season = params.get('season');
    let dateFrom = params.get('dateFrom');
    let dateTo = params.get('dateTo');

    useEffect(() => {
        // Сбрасываем ошибки при обновлении данных в адресной строке
        setError(null);

        if (!competitionId) {
            setError('Некорректный URL');
            return;
        }

        (async function () {
            try {
                let {matches} = await loadCompetitionCalendar(competitionId, season);

                // Если нужно - фильтруем список матчей
                if (search) matches = matchesSearchFilter(matches, search);
                if (dateFrom || dateTo) matches = matchesDateFilter(matches, dateFrom, dateTo);

                let competition = await loadCompetition(competitionId);
                setMatches(matches);
                setCompetition(competition);
            } catch (err) {
                setError(err.message);
            }
        })();
    }, [competitionId, dateFrom, dateTo, location, search, season])

    let showMoreHandler = () => {
        setCountForShow(countForShow + DEFAULT_SHOW_STEP);
    }

    // Обработчик событий, иницирующих начало поиска
    let findHandler = () => {
        let params = new URLSearchParams();
        params.append('competition', competitionId);

        // Обрабатываем строку поиска
        let searchValue = searchInput.current.value.trim();
        if (searchValue) params.append('search', searchValue);

        // Обрабатываем выбор сезона
        let seasonValue = seasonInput.current.value;
        if (seasonValue !== CURRENT_SEASON) params.append('season', seasonValue);

        // Обрабатываем выбор дат
        let dateFromValue = dateFromInput.current.value;
        let dateToValue = dateToInput.current.value;
        if (dateFromValue) params.append('dateFrom', dateFromValue);
        if (dateToValue) params.append('dateTo', dateToValue);

        history.push(`/competition_calendar/?${params.toString()}`);
    }

    // Обработчик нажатия на Enter в поле ввода
    let enterHandler = event => {
        if (event.keyCode === 13) findHandler();
    }

    let content = <Preloader/>;
    if (matches && competition) {
        let matchesForShow = matches.filter((match, index) => index < countForShow);
        content = (
            <div className={style.matches_container}>
                <h1 className={commonStyle.competition_title}>{competition.name}</h1>
                <div className={commonStyle.filters}>
                    <DateSelector
                        dateFromRef={dateFromInput}
                        dateToRef={dateToInput}
                        dateFromDefault={dateFrom}
                        dateToDefault={dateTo}
                        dateChangeHandler={findHandler}
                    />
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
        );
    }
    if (error) {
        content = <ErrorDisplay text={error}/>
    }

    return <div>{content}</div>;
}

export default CompetitionCalendar;