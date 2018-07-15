import React from "react"
import { List } from "semantic-ui-react"
import { Node } from "../share/searchApi";
import { File } from "./File"
import styled from "styled-components"

type Props = {
    projectPath: string
    fileName: string[]
    pathProject: string[]
    onSelect: (Node) => void;
    isSelected: (Node) => boolean;
    folder: Node
    nodes: Node[]
}

const header = styled.div`
  cursor: pointer;
`

export class FileList extends React.Component<Props> {
    constructor(props) {
        super(props)
    }

    private getFiles = (node: Node) => {
        return this.props.nodes.filter(x => x.parent === node.id && x.isFile)
    }

    private getFolders = (node: Node) => {
        return this.props.nodes.filter(x => x.parent === node.id && !x.isFile)
    }

    public render() {
        let { folder, nodes } = this.props;
        const ListMain = ({ }) => (
            <List.Item>
                <List.Icon name="folder" size="large" verticalAlign="middle" />
                <List.Content>
                    <List.Header>
                        {this.props.folder.name}

                    </List.Header>
                    <List.Description>Folder</List.Description>
                </List.Content>
                <List.List>
                {this.getFolders(folder).map(x => <FileList projectPath={this.props.projectPath} fileName={this.props.fileName} pathProject={this.props.pathProject} isSelected={this.props.isSelected} onSelect={this.props.onSelect} folder={x} nodes={nodes} />)}
                {this.getFiles(folder).map(x => <File projectPath={this.props.projectPath} fileName={this.props.fileName} pathProject={this.props.pathProject} isSelected={this.props.isSelected} onSelect={this.props.onSelect} file={x} />)}
                </List.List>
            </List.Item>                  )
        // _______________สร้างlist_____________|
        return (
            <List divided selection relaxed >
                <ListMain />
            </List>
            )
    }
}