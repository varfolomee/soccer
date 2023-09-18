import React from 'react';
import {BrowserRouter, Route } from 'react-router-dom';
import {Link} from 'react-router-dom';
import Competitions from './Competitions/Competitions';
import Teams from './Teams/Teams';
import CompetitionCalendar from './CompetitionCalendar/CompetitionCalendar';
import TeamCalendar from './TeamCalendar/TeamCalendar';
import NoMatch from './NoMatch/NoMatch';
import style from './App.module.css';
import { Switch } from 'react-router-dom/cjs/react-router-dom.min';

function App() {
    return (
        <div className={style.container}>
            <BrowserRouter>
                <h1 className={style.site_title}>
                    <Link to="/competitions">Футбольная статистика</Link>
                </h1>
                    <Switch>
                        <Route path="/teams" component={Teams}/>
                        <Route path="/competition_calendar" component={CompetitionCalendar}/>
                        <Route path="/team_calendar" component={TeamCalendar}/>
                        <Route path="/" component={Competitions}/>
                        <Route path="*" component={NoMatch}/>
                    </Switch>
            </BrowserRouter>
        </div>
    );
}

export default App;