import React from 'react';
import style from './ShowCountControl.module.css';
import {DEFAULT_SHOW_STEP} from '../settings';

function ShowCountControl({totalCount, currentCount, changeCountHandler}) {
    return (
        <div className={style.show_more_block}>
            <button onClick={changeCountHandler} className={style.show_more_button}>
                Показать
                еще {(totalCount - currentCount) > DEFAULT_SHOW_STEP ? DEFAULT_SHOW_STEP : (totalCount - currentCount)}
            </button>
        </div>
    );
}

export default ShowCountControl;