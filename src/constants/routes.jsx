import Accueil from '../components/Accueil/index'
import Apropos from '../components/Apropos/index'
import Liste from '../components/Liste/index'
import Parole from '../components/Parole/index'
import SignUp from '../components/Session/signUp'
import SignIn from '../components/Session/signIn'
import Profile from '../components/Profile/index'
import AdvanceParole from '../components/Parole/AvanceParole/avance'
import Recherche from '../components/Recherche/index'
import Edition from '../components/Edition/index'

import No404 from '../components/No404/index'

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
]

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
    {
        path: "/signin",
        component: SignIn,
        exact: true,
    },
    {
        path: "/profile",
        component: Profile,
        exact: true,
    },
    {
        path: "/advance",
        component: AdvanceParole,
        exact: true,
    },
    {
        path: "/search=:queries",
        component: Recherche,
        exact: true,
    },
    {
        path: "/edit=:id",
        component: Edition,
        exact: true,
    },
    {
        path: "*",
        component: No404,
    },
]