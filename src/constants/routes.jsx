import Accueil from '../components/Accueil/index'
import Apropos from '../components/Apropos/index'
import Liste from '../components/Liste/index'
import Parole from '../components/Parole/index'
import SignUp from '../components/Session/signUp'

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

export const routesParams = [
    {
        path: "/liste=:id",
        component: Parole,
        exact: true,
    }, 
    {
        path: "/signup",
        component: SignUp,
        exact: true,
    },
]