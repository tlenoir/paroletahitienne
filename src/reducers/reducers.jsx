export const initialState = { orderBy: 'titre' }

export function reducer(state, action) {
    switch (action.type) {
        case 'artiste':
            return { orderBy: 'artistes' }
        case 'groupe':
            return { orderBy: 'groupes' }
        case 'date':
            return { orderBy: 'date_ajout' }
        case 'titre':
            return { orderBy: 'titre' }
        default:
            return state
    }
}