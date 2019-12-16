import Accueil from '../components/Accueil/index'
import Apropos from '../components/Apropos/index'

export default [
    {
        path: "/",
        component: Accueil,
        exact: true,
    },
    {
        path: "/about",
        component: Apropos,
        exact: true,
    },
];
