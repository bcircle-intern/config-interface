import React, { CSSProperties } from "react"
import ReactDOM from "react-dom"
import styled from "styled-components"
import { Footer } from "./components/Footer"
import { Header } from "./components/Header"
import { Body } from "./components/Body"
import { Login } from "./components/Login"
import "semantic-ui-css/semantic.min.css"
import "./css/Body.css"
import AppStorage from "./share/AppStorage"

import JsonWorker from "monaco-editor/esm/vs/language/json/json.worker"

type State = {
    loggedIn: boolean
    styleR: string
    styleL: string
    styleBody: string
}

const ContainerDiv = styled.div`
    display: block;
    flex-direction: column;
`

export class App extends React.Component<{}, State> {
    constructor(props) {
        super(props);
        this.state = {
            loggedIn: false,
            styleR: "rightTo",
            styleL: "leftTo",
            styleBody: "none",
        }
    }
    public onLogin = (status) => {
        this.setState({
            loggedIn: status, styleBody: "none"
        })
        console.log(this.state.styleBody)
    }
    public onLogout = () => {
        this.setState({ styleBody: "bodyOut" })
        setTimeout(() => {
            this.setState({ loggedIn: false })
            AppStorage.Logout()
        }, 850)
    }
    public onLogoutPlease = () => {
        this.setState({ loggedIn: false })
        AppStorage.Logout()
    }

    public componentDidMount() {
        this.setState({ loggedIn: AppStorage.getAccessToken() !== null })
    }

    public render() {
        let { loggedIn, styleL, styleR, styleBody } = this.state
        return (
            this.state.loggedIn ?
                <ContainerDiv>
                    <Header onLogout={this.onLogout} loggedIn={loggedIn} />
                    <div className={styleBody}>
                        <Body onLogoutPlease={this.onLogoutPlease} status={loggedIn} styleR={styleR} styleL={styleL} style={{ padding: "20px", alignSelf: "center", minWidth: "1000px", flex: 1 }} />
                    </div>
                    <Footer style={{ justifyContent: "center", display: "flex" }} />
                </ContainerDiv>
                :
                <ContainerDiv>
                    <Header onLogout={this.onLogout} loggedIn={loggedIn} />
                    <Login loggedIn={loggedIn} onLogin={this.onLogin} />
                    <Footer style={{ justifyContent: "center", display: "flex" }} />
                </ContainerDiv>
        )
    }
}

let root = document.getElementById("root")
ReactDOM.render(<App />, root)