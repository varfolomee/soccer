import React from 'react';
import style from './DateSelector.module.css';
import commonStyle from '../common.module.css';

function DateSelector({dateFromRef, dateToRef, dateFromDefault, dateToDefault, dateChangeHandler}) {
    return (
        <div className={style.date_container}>
            <span>
                От:
            </span>
            <input
                type="date"
                className={commonStyle.selector}
                ref={dateFromRef}
                onChange={dateChangeHandler}
                defaultValue={dateFromDefault ? dateFromDefault : ''}
            />
            <span>
                До:
            </span>
            <input
                type="date"
                className={commonStyle.selector}
                ref={dateToRef}
                onChange={dateChangeHandler}
                defaultValue={dateToDefault ? dateToDefault : ''}
            />
        </div>
    );
}

export default DateSelector;