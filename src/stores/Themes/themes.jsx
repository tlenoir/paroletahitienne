import React, { useState, } from 'react'

const ThemesContext = React.createContext({
    themes: {
        button_submit: "",
        button_link: "",
        button_close: "",
        bg: "",
        color: ""
    },
    updateThemes: () => { },
    updateTitle: (name) => { }
})

function Themes({ children }) {
    const [themes, updateThemes] = useState({
        button_submit: "primary",
        button_link: "link",
        button_close: "secondary",
        bg: "light",
        color: "red"
    })

    const updateTitle = (name) => {
            document.title = capitalize(name)
    }

    const capitalize = (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    return (
        <ThemesContext.Provider value={{ themes, updateThemes, updateTitle }} >
            {children}
        </ThemesContext.Provider>
    )
}

export { ThemesContext, Themes }