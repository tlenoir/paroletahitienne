import Accueil from '../components/Accueil/index'
import Apropos from '../components/Apropos/index'
import Liste from '../components/Liste/index'

export default [
    {
        path: "/",
        component: Accueil,
        exact: true,
        name: 'Accueil'
    },
    {
        path: "/apropos",
        component: Apropos,
        exact: true,
        name: 'À propos'
    },
    {
        path: "/liste",
        component: Liste,
        exact: true,
        name: 'Liste'
    },
];
