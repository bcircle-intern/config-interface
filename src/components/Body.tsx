import React, { CSSProperties } from "react"
import styled from "styled-components"
import { getApiUrl } from "../share/Configuration";
import { SearchApi, Node } from "../share/searchApi";
import { ProjectList } from "./ProjectList"
import { FileList } from "./FileList"
import { FileContent } from "./FileContent"
import { Segment } from "../../node_modules/semantic-ui-react";
import "../css/Body.css"

type Props = {
    styleR: string
    styleL: string
    style: CSSProperties
}

type State = {
    // selectedFile: string
    projectName: string
    projectPath: string
    projectContent: string
    dropdownOption: any[]
    pathProject: string[]
    fileName: string[]
    treeJson: string
    nodes: Node[]
    selectedNode: Node
    extention: string
}

const BodyDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  width:100%;
  height: 90%;
`

const LeftDiv = styled.div`
  display: absolute;
  flex-direction: column;
  flex-grow: 1;
  padding: 5px;
  left: 0;
  top: 0;
  height: calc(80% - 50px);
  min-width: 350px;
  min-height: 10%;
  resize:vertical;
  max-width: 20%;
`

const RightDiv = styled.div`
  max-width:400px;
  display: absolute;
  flex-direction: column;
  flex-grow: 1;
  padding: 5px;
  right: 0;
  top: 0;
  width: 60%;
  min-width: 65%;
  min-height: 20%;
  resize:vertical;
  height: calc(100% - 30px);
`

export class Body extends React.Component<Props, State> {

    private searchApi = new SearchApi(getApiUrl());

    constructor(props) {
        super(props);
        this.state = {
            // selectedFile: "",
            projectName: "",
            projectPath: "",
            projectContent: "",
            dropdownOption: [],
            pathProject: [],
            fileName: [],
            treeJson: "",
            nodes: [],
            selectedNode: {
                name: "",
                id: 0,
                isRoot: true,
                parent: 0,
                isFile: false,
                pathFile: "",
                modifieDate: "",
                fileType: ""
            },
            extention: ""
        }
    }

    public componentDidMount() {
        this.searchApi.getProjectNames().then(res => {
            let options = []
            let name = []
            res.data.map(x => {
                // เอาdata push เข้าไปใน option
                options.push({ value: x, text: x, icon: "folder" })
                name.push(x)
            });
            this.setState({ dropdownOption: options })
            // ได้ค่าโปรเจคทั้งหมดมาเก็บในoption
            this.defaultValue()
        })
        let exten = this.state.selectedNode.fileType
        let pattern = ""
        if (exten === ".json") {
            pattern = "json"
        } else if (exten === ".xml" || exten === ".config") {
            pattern = "xml"
        } else if (exten === ".properties") {
            pattern = "ini"
        } else {
            pattern = "json"
        }
        this.setState({
            extention: pattern
        })
    }

    private defaultValue() {
        this.searchApi.getProjectNames().then(res => {
            let name = res.data.map(x => x)
            this.setState({ projectName: name[0] })
            this.initProjectSettings(name[0])
        })
    }

    private getRoot = (): Node => {
        if (this.state.nodes.length) {
            return this.state.nodes.filter(x => x.isRoot)[0];
        } else {
            return {
                name: "Loading ...",
                isRoot: true,
                isFile: false,
                id: 0,
                parent: 0,
                pathFile: "",
                modifieDate: "",
                fileType: ""
            }
        }
    }

    public isSelected = (node) => this.state.selectedNode === node;

    public initProjectSettings(name: string) {
        this.searchApi.getProjectSettings(name).then(response => {

            let pathProjects = [];
            console.log("getprojectsettings")
            console.log(response.data)
            pathProjects = response.data.files.map(x => x);
            this.searchApi.getPath(name).then(res => {
                this.searchApi.getNode(res.data.path).then(rs => {
                    this.setState({ nodes: rs.data })
                })
            })
            this.setState({ pathProject: pathProjects })
            console.log("Path Project" + pathProjects)
            this.setState({ projectPath: pathProjects[0] })
            console.log("ProjectPath" + pathProjects[0])
            this.initSettingContent(pathProjects[0])
            let filename2 = this.state.nodes.map(x => x.name)
            this.setState({ fileName: filename2 })
            console.log("filename" + this.state.fileName)
        })
    }

    public initSettingContent(value: string) {
        this.searchApi.getSettingContent(value).then(response => {
            this.setState({ projectContent: response.data.content, projectPath: response.data.path })
        })
    }

    private initSaveSettingContent = (path: string, content: string) => {
        if (!this.state.projectName) {
            alert("Plese select project")
        }
        if (!this.state.projectPath || !this.state.projectContent) {
            alert("Plese select path")
        }
        this.searchApi.saveSettingContent(path, content).then(res => {
            if (res.data.success) {
                alert("SAVE!")
                console.log("SAVE!");
            } else {
                alert("ERROR : " + Error)
            }
        })
    }

    private onProjectChange = (project) => {
        this.setState({
            projectName: project,
            projectContent: "",
            projectPath: "",
            fileName: [],
            pathProject: [],
            nodes: []
        })
        this.initProjectSettings(project)
    }

    private onSelect = (node) => {
        let pathFile = node.pathFile
        let exten = node.fileType
        let pattern = ""
        if (exten === ".json") {
            pattern = "json"
        } else if (exten === ".xml" || exten === ".config") {
            pattern = "xml"
        } else if (exten === ".properties") {
            pattern = "ini"
        } else {
            pattern = "json"
        }
        this.setState({
            selectedNode: node,
            projectPath: pathFile,
            extention: pattern
        })
        this.initSettingContent(pathFile)
    }

    private onContentChange = (content) => {
        this.setState({
            projectContent: content
        });
        this.initProjectSettings(this.state.projectName)
        this.initSaveSettingContent(this.state.projectPath, content)

    }

    public render() {
        let { projectName, projectPath, dropdownOption, fileName
            , pathProject, projectContent, extention } = this.state
        return (
            <BodyDiv style={this.props.style}>
                <LeftDiv className={this.props.styleL}>
                    <Segment>
                        <ProjectList projectName={projectName} dropdownOption={dropdownOption} onChange={this.onProjectChange} />
                        <div className="box">
                            <FileList isSelected={this.isSelected} onSelect={this.onSelect} nodes={this.state.nodes} folder={this.getRoot()}
                                projectPath={projectPath} fileName={fileName} pathProject={pathProject} />
                        </div>
                    </Segment>
                </LeftDiv>
                <RightDiv className={this.props.styleR}>
                    <FileContent extention={this.state.extention} ProjectContent={projectContent} onChange={this.onContentChange} />
                </RightDiv>
            </BodyDiv>
        );
    }
}