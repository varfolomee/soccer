import React from 'react';
import {Link} from 'react-router-dom';
import {getDateString} from '../utils';
import style from './MatchList.module.css';

const STATUS_TRANSLATOR = {
    'SCHEDULED': 'Запланирован',
    'POSTPONED': 'Перенесен',
    'CANCELED': 'Отменен',
    'SUSPENDED': 'Остановлен',
    'IN_PLAY': 'Идет игра',
    'PAUSED': 'Перерыв',
    'AWARDED': 'Идет награждение',
    'FINISHED': 'Игра окончена'
}

const STAGE_TRANSLATOR = {
    'PRELIMINARY_ROUND': 'Предварительный раунд',
    'REGULAR_SEASON': 'Регулярный',
    'QUALIFICATION_ROUND_1': '1 раунд квалификаци',
    'QUALIFICATION_ROUND_2': '2 раунд квалификаци',
    'QUALIFICATION_ROUND_3': '3 раунд квалификаци',
    '1ST_QUALIFYING_ROUND': '1 раунд квалификаци',
    '2ND_QUALIFYING_ROUND': '2 раунд квалификации',
    '3RD_QUALIFYING_ROUND': '3 раунд квалификации',
    'PLAY_OFF_ROUND': 'Плей офф',
    'GROUP_STAGE': 'Групповой этап',
    'ROUND_OF_16': '1/8 финала',
    'LAST_16': '1/8 финала',
    'QUARTER_FINALS': 'Четвертьфинал',
    'SEMI_FINALS': 'Полуфинал',
    'FINAL': 'Финал'
}

function getScoreText(match) {
    let score = match.score;
    let winner = score.winner;
    if (!winner) return '-/-';

    let {fullTime, halfTime} = score;

    let awayTeamScore = fullTime.away + halfTime.away;
    let homeTeamScore = fullTime.home + halfTime.home;

    return `${awayTeamScore}/${homeTeamScore}`;
}

function MatchList({matches, totalCount}) {
    return (
        <div>
            <table className={style.match_table}>
                <tbody>
                <tr key="header_captions" className={style.row}>
                    <th>
                        Дата проведения
                    </th>
                    <th>
                        Статус
                    </th>
                    <th>
                        Этап
                    </th>
                    <th>
                        Гости
                    </th>
                    <th>
                        Хозяева
                    </th>
                    <th>
                        Исход матча
                    </th>
                </tr>
                {matches.map(
                    match =>
                        <tr key={match.id} className={style.row}>
                            <td>
                                {getDateString(match.utcDate)}
                            </td>
                            <td>
                                {STATUS_TRANSLATOR[match.status]}
                            </td>
                            <td>
                                {STAGE_TRANSLATOR[match.stage] || match.stage}
                            </td>
                            <td>
                                {match.awayTeam.id ?
                                    <Link to={`/team_calendar/?team=${match.awayTeam.id}`}>
                                        {match.awayTeam.name}
                                    </Link>
                                    :
                                    '-'
                                }
                            </td>
                            <td>
                                {match.homeTeam.id ?
                                    <Link to={`/team_calendar/?team=${match.homeTeam.id}`}>
                                        {match.homeTeam.name}
                                    </Link>
                                    :
                                    '-'
                                }
                            </td>
                            <td>
                                {getScoreText(match)}
                            </td>
                        </tr>
                )}
                </tbody>
            </table>
            {totalCount > 0 ? <h6 className={style.match_counter}>Всего матчей: {totalCount}</h6> : ''}
        </div>
    )
}

export default MatchList;