import React, {useState, useEffect} from 'react';
import style from './Preloader.module.css';

function Preloader() {
    let [dotCount, setDotCount] = useState(3);

    // Немного оживляем прелоадер добавляя изменение количества точек после слова "Загрузка"
    useEffect(() => {
        let counter = dotCount;
        let timer = setInterval(() => {
            counter++;
            setDotCount(counter % 5 + 1);
        }, 500);
        return () => clearInterval(timer);
    }, [dotCount]);

    return (
        <div className={style.container}>
            Загрузка{new Array(dotCount + 1).join('.')}
        </div>
    );
}

export default Preloader;