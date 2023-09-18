const PROTOCOL = 'http';
// const HOST = 'api.football-data.org';
const HOST = 'localhost:8010/proxy';
const API_VERSION = 'v4';

const PLAN = 'TIER_ONE';
const AREAS = '2077';

const BASE = `${PROTOCOL}://${HOST}/${API_VERSION}`;

// При формировании адреса для запроса лиг учитываем, что будем работать только с европейскими лигами с использованием бесплатного api
export function getCompetitionsUrl() {
    return `${BASE}/competitions/?areas=${AREAS}&plan=${PLAN}`;
}

export function getTeamsUrl(competitionId, season) {
    let url = `${BASE}/competitions/${competitionId}/teams`;
    if (season) url += `/?season=${season}`;
    return url;
}

export function getCompetitionCalendarUrl(competitionId, season, dateFrom, dateTo) {
    let url = `${BASE}/competitions/${competitionId}/matches`;
    if (season) {
        let params = new URLSearchParams();
        params.append('season', season);
        url += `/?${params.toString()}`;
    }
    return url;
}

export function getTeamCalendarUrl(teamId) {
    return `${BASE}/teams/${teamId}/matches`;
}

export function getCompetitionUrl(competitionId) {
    return `${BASE}/competitions/${competitionId}`;
}

export function getTeamUrl(teamId) {
    return `${BASE}/teams/${teamId}`;
}
