import React from 'react';
import {EARLIE_SEASON, CURRENT_SEASON} from '../settings';
import commonStyle from '../common.module.css';

// Создаем список сезонов для селектора
function createSeasonsList() {
    let seasons = [
        {
            value: CURRENT_SEASON,
            name: 'Текущий сезон'
        }
    ];
    let currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= EARLIE_SEASON; year--) {
        seasons.push({
            value: `${year}`,
            name: `${year}`
        });
    }
    return seasons;
}

const SeasonSelector = React.forwardRef((props, ref) => {
    let {seasonChangeHandler, defaultValue} = props;
    let seasons = createSeasonsList();
    return (
        <select
            className={commonStyle.selector}
            ref={ref}
            onChange={seasonChangeHandler}
            defaultValue={defaultValue || CURRENT_SEASON}
        >
            {seasons.map(
                season =>
                    <option key={season.value} value={season.value}>
                        {season.name}
                    </option>
            )}
        </select>
    )
});

export default SeasonSelector;