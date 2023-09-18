import React from 'react';
import style from './ErrorDisplay.module.css';

function ErrorDisplay({text}) {
    return (
        <div className={style.container}>
            <div className={style.error_content}>
                {text}
            </div>
        </div>
    );
}

export default ErrorDisplay;