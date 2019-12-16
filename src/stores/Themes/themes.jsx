import React, { useState } from 'react'

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
    return (
        <ThemesContext.Provider value={{ themes, updateThemes }} >
            {children}
        </ThemesContext.Provider>
    )
}

export { ThemesContext, Themes }