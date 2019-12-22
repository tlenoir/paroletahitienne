import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ThemesContext = React.createContext({
    themes: {
        button_submit: "",
        button_link: "",
        button_close: "",
        bg: "",
        color: ""
    },
    updateThemes: () => { }
})

function Themes({ children }) {
    const [themes, updateThemes] = useState({
        button_submit: "primary",
        button_link: "link",
        button_close: "secondary",
        bg: "light",
        color: "red"
    })

    const location = useLocation()

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    useEffect(() => {
        const name_location = location.pathname.slice(1)
        if (name_location.length > 0)
            document.title = capitalize(name_location)
        else
            document.title = 'Parole Héritage'
    }, [location])


    return (
        <ThemesContext.Provider value={{ themes, updateThemes }} >
            {children}
        </ThemesContext.Provider>
    )
}

export { ThemesContext, Themes }