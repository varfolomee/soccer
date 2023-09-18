import React from 'react';
import ErrorDisplay from '../ErrorDisplay/ErrorDisplay';

function NoMatch({location}) {
    return <ErrorDisplay text={`Адрес ${location.pathname} не найден`}/>
}

export default NoMatch;