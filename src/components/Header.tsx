import React, { CSSProperties } from "react"
import { Menu } from "semantic-ui-react";
import AppStorage from "../share/AppStorage"

type Props = {
    loggedIn: boolean
    // tslint:disable-next-line:variable-name
    onLogout: (string) => void
}
type State = {
    render: boolean
}
export class Header extends React.Component<Props, State> {
    public onLogout = () => {
        this.props.onLogout(false)
        AppStorage.setAccessToken(null)
    }
    constructor(props) {
        super(props);

        this.state = {
            render: false
        };
    }
    public render() {
        return (
            this.props.loggedIn ?
                <div>
                    <Menu inverted icon="labeled">
                        <Menu.Item header name="Config Editor" />
                        <Menu.Item position="right" name="logout" disabled={false} onClick={this.onLogout}>
                        </Menu.Item>
                    </Menu>
                </div>
                :
                <div>
                    <Menu inverted icon="labeled">
                        <Menu.Item header name="Config Editor" />
                    </Menu>
                </div>
        )
    }
}